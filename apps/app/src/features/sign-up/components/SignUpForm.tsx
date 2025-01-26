'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSignUp } from '@clerk/nextjs'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@internal/design-system/components/ui/button'
import Link from 'next/link'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@internal/design-system/components/ui/form'
import { Input } from '@internal/design-system/components/ui/input'
import { EmailSent } from './EmailSent'
import { generateSignInToken } from '@/lib/sign-in-token'

const FormSchema = z.object({
  identifier: z.string().email(),
})

type FormValues = z.infer<typeof FormSchema>

export const SignUpForm = () => {
  const [status, setStatus] = useState<'sign-up' | 'email-sent'>('sign-up')

  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const { isLoaded, setActive, signUp } = useSignUp()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect_url')

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      identifier: '',
    },
  })

  const onSignIn = async (values: FormValues) => {
    if (!isLoaded) {
      return
    }

    const { startEmailLinkFlow } = signUp.createEmailLinkFlow()

    startTransition(async () => {
      try {
        await signUp.create({
          emailAddress: values.identifier,
        })

        // Start the sign-up flow, by collecting the user's email address.
        setStatus('email-sent')

        const result = await startEmailLinkFlow({
          redirectUrl: `${window.location.origin}/auth/verification`,
        })

        if (result.status === 'complete' && result.createdSessionId) {
          await setActive({ session: result.createdSessionId })

          const token = await generateSignInToken(result.createdSessionId)

          if (redirectUrl) {
            router.push(`${redirectUrl}?token=${token}`)

            return
          }

          router.push('/dashboard')
        }
      } catch {
        // Handle errors
      }
    })
  }

  return (
    <>
      {status === 'sign-up' ? (
        <div className="flex flex-col gap-6">
          <h1 className="text-center">Create your account</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSignIn)}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Enter your email address"
                            autoComplete="email"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  {/* CAPTCHA Widget */}
                  <div id="clerk-captcha"></div>
                  <Button loading={isPending} type="submit" className="w-full">
                    Continue with email
                  </Button>
                </div>
                <div className="text-center text-sm">
                  By Signing up, you agree to our{' '}
                  <Link href="#" className="underline underline-offset-4">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" className="underline underline-offset-4">
                    Data Processing Agreement
                  </Link>
                  .
                </div>
                <div className="text-center text-sm">
                  Already have an account?{' '}
                  <Link
                    href="/auth/sign-in"
                    className="underline underline-offset-4"
                  >
                    Log in
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </div>
      ) : null}
      {status === 'email-sent' ? <EmailSent /> : null}
    </>
  )
}

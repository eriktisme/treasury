'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSignIn } from '@clerk/nextjs'
import { generateSignInToken } from '../actions'
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

const FormSchema = z.object({
  identifier: z.string().email(),
})

type FormValues = z.infer<typeof FormSchema>

export const SignInForm = () => {
  const [status, setStatus] = useState<'sign-in' | 'email-sent'>('sign-in')

  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const { isLoaded, setActive, signIn } = useSignIn()
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

    const { startEmailLinkFlow } = signIn.createEmailLinkFlow()

    startTransition(async () => {
      try {
        const signInAttempt = await signIn.create({
          identifier: values.identifier,
        })

        // Start the sign-in flow, by collecting the user's email address.
        const signInFirstFactor = signInAttempt.supportedFirstFactors?.find(
          (ff) =>
            ff.strategy === 'email_link' &&
            ff.safeIdentifier === values.identifier
        )

        if (!signInFirstFactor || signInFirstFactor.strategy !== 'email_link') {
          // Handle errors
          return
        }

        setStatus('email-sent')

        const result = await startEmailLinkFlow({
          emailAddressId: signInFirstFactor.emailAddressId,
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
      {status === 'sign-in' ? (
        <div className="flex flex-col gap-6">
          <h1 className="text-center">
            Welcome back, what is your email address?
          </h1>
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
                <Button loading={isPending} type="submit" className="w-full">
                  Continue with email
                </Button>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/auth/sign-up"
                    className="underline underline-offset-4"
                  >
                    Sign up
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

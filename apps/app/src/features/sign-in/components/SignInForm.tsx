'use client'

import { useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSignIn } from '@clerk/nextjs'
import { generateSignInToken } from '../actions'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@internal/design-system/components/ui/card'
import { Button } from '@internal/design-system/components/ui/button'
import Link from 'next/link'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@internal/design-system/components/ui/form'
import { Input } from '@internal/design-system/components/ui/input'

const FormSchema = z.object({
  identifier: z.string().email(),
})

type FormValues = z.infer<typeof FormSchema>

export const SignInForm = () => {
  const [_, startTransition] = useTransition()
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
      const signInAttempt = await signIn.create({
        identifier: values.identifier,
      })

      // Start the sign-in flow, by collecting
      // the user's email address.
      const signInFirstFactor = signInAttempt.supportedFirstFactors?.find(
        (ff) =>
          ff.strategy === 'email_link' &&
          ff.safeIdentifier === values.identifier
      )

      if (!signInFirstFactor || signInFirstFactor.strategy !== 'email_link') {
        // Handle errors
        return
      }

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

      // Handle errors
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSignIn)}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full">
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
        </CardContent>
      </Card>
    </div>
  )
}

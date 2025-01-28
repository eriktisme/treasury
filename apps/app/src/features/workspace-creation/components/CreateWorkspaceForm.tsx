'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent } from '@internal/design-system/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@internal/design-system/components/ui/form'
import { useTransition } from 'react'
import { Input } from '@internal/design-system/components/ui/input'
import { Button } from '@internal/design-system/components/ui/button'
import { useAuth, useOrganizationList } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { generateSignInToken } from '@/lib/sign-in-token'

const FormSchema = z.object({
  name: z.string().min(1),
})

type FormValues = z.infer<typeof FormSchema>

export const CreateWorkspaceForm = () => {
  const router = useRouter()

  const { sessionId } = useAuth()
  const { createOrganization, isLoaded, setActive } = useOrganizationList()

  const [isPending, startTransition] = useTransition()

  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirectUrl')

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    },
  })

  const onCreateWorkspace = async (values: FormValues) => {
    if (!isLoaded) {
      return
    }

    startTransition(async () => {
      const organization = await createOrganization({ name: values.name })

      await setActive({
        organization: organization.id,
      })

      if (redirectUrl && sessionId) {
        const token = await generateSignInToken(sessionId)

        router.push(`${redirectUrl}?token=${token}&orgId=${organization.id}`)

        return
      }

      router.push(`/${organization.slug}`)
    })
  }

  return (
    <>
      <h1 className="mb-6 text-center">Create a new workspace</h1>
      <p className="mb-8 max-w-md text-center">
        Workspaces are shared environments where teams can work together.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onCreateWorkspace)}
          className="w-full max-w-[480px] text-center"
        >
          <Card className="mb-8 text-left">
            <CardContent className="p-6">
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          <Button
            loading={isPending}
            disabled={!form.formState.isValid}
            className="w-80"
            type="submit"
          >
            Create workspace
          </Button>
        </form>
      </Form>
    </>
  )
}

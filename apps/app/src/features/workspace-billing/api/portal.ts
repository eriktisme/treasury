import { env } from '@/env'
import type { MutationConfig } from '@/lib/react-query'
import { useMutation } from '@tanstack/react-query'
import type {
  CreatePortalBody,
  PortalResponse,
} from '@internal/api-schema/billing'
import { useAuth } from '@clerk/nextjs'

type Options = {
  mutationConfig?: MutationConfig<
    (body: CreatePortalBody) => Promise<PortalResponse>
  >
}

export const useCreatePortalSession = ({ mutationConfig }: Options) => {
  const { onSuccess, ...restConfig } = mutationConfig ?? {}

  const { getToken } = useAuth()

  return useMutation({
    onSuccess: async (...args) => {
      onSuccess?.(...args)
    },
    ...restConfig,
    mutationFn: async (body: CreatePortalBody) =>
      fetch(`${env.NEXT_PUBLIC_API_URL}/billing/portal`, {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await getToken()}`,
        },
        method: 'POST',
        body: JSON.stringify(body),
      }).then((res) => res.json()),
  })
}

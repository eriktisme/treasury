import { env } from '@/env'
import type { MutationConfig } from '@/lib/react-query'
import { useMutation } from '@tanstack/react-query'
import type {
  CreatePortalBody,
  PortalResponse,
} from '@internal/api-schema/billing'
import { useAuth } from '@clerk/nextjs'
import type { GetToken } from '@clerk/types'

interface CreatePortalSessionOptions {
  getToken: GetToken
}

const createPortalSession = async (
  body: CreatePortalBody,
  options: CreatePortalSessionOptions
): Promise<PortalResponse> => {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/billing/portal`, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await options.getToken()}`,
    },
    method: 'POST',
    body: JSON.stringify(body),
  })

  return response.json()
}

type Options = {
  mutationConfig?: MutationConfig<typeof createPortalSession>
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
      createPortalSession(body, { getToken }),
  })
}

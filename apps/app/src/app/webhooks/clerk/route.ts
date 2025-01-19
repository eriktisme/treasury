import { headers } from 'next/headers'
import { Webhook } from 'svix'
import type { OrganizationJSON, WebhookEvent } from '@clerk/backend'
import { env } from '@/env'

const handleOrganizationCreated = async (data: OrganizationJSON) => {
  if (!data.created_by) {
    return new Response('Error occurred', { status: 400 })
  }

  return new Response('Organization created', { status: 201 })
}

export const POST = async (request: Request): Promise<Response> => {
  const headerPayload = await headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    })
  }

  const payload = (await request.json()) as object
  const body = JSON.stringify(payload)

  const webhook = new Webhook(env.CLERK_WEBHOOK_SECRET)

  let event: WebhookEvent | undefined

  try {
    event = webhook.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent
  } catch (error) {
    console.error('Error verifying webhook:', { error })

    return new Response('Error occurred', {
      status: 400,
    })
  }

  const { id } = event.data
  const eventType = event.type

  console.info('Webhook', { id, eventType, body })

  let response: Response = new Response('', { status: 201 })

  switch (eventType) {
    case 'organization.created': {
      response = await handleOrganizationCreated(event.data)
      break
    }
    default: {
      break
    }
  }

  return response
}

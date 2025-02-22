import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { WebhookRequestSchema } from './schema'
import type { Bindings } from '../../../bindings'
import type {
  DeletedObjectJSON,
  OrganizationJSON,
  OrganizationMembershipJSON,
  UserJSON,
  WebhookEvent,
} from '@clerk/backend'
import { analytics } from '@internal/analytics/posthog/server'
import { z } from 'zod'
import { Webhook } from 'svix'

const ConfigSchema = z.object({
  clerkWebhookSecret: z.string(),
})

const config = ConfigSchema.parse({
  clerkWebhookSecret: process.env.CLERK_WEBHOOK_SECRET,
})

const handleUserCreated = (data: UserJSON) => {
  analytics.identify({
    distinctId: data.id,
    properties: {
      email: data.email_addresses.at(0)?.email_address,
      firstName: data.first_name,
      lastName: data.last_name,
      createdAt: new Date(data.created_at),
      avatar: data.image_url,
      phoneNumber: data.phone_numbers.at(0)?.phone_number,
    },
  })

  analytics.capture({
    event: 'User Created',
    distinctId: data.id,
  })

  return 'User created'
}

const handleUserUpdated = (data: UserJSON) => {
  analytics.identify({
    distinctId: data.id,
    properties: {
      email: data.email_addresses.at(0)?.email_address,
      firstName: data.first_name,
      lastName: data.last_name,
      createdAt: new Date(data.created_at),
      phoneNumber: data.phone_numbers.at(0)?.phone_number,
    },
  })

  analytics.capture({
    event: 'User Updated',
    distinctId: data.id,
  })

  return 'User updated'
}

const handleUserDeleted = (data: DeletedObjectJSON) => {
  if (data.id) {
    analytics.identify({
      distinctId: data.id,
      properties: {
        deleted: new Date(),
      },
    })

    analytics.capture({
      event: 'User Deleted',
      distinctId: data.id,
    })
  }

  return 'User deleted'
}

const handleOrganizationCreated = (data: OrganizationJSON) => {
  analytics.groupIdentify({
    groupKey: data.id,
    groupType: 'company',
    distinctId: data.created_by,
    properties: {
      name: data.name,
    },
  })

  if (data.created_by) {
    analytics.capture({
      event: 'Organization Created',
      distinctId: data.created_by,
    })
  }

  return 'Organization created'
}

const handleOrganizationUpdated = (data: OrganizationJSON) => {
  analytics.groupIdentify({
    groupKey: data.id,
    groupType: 'company',
    distinctId: data.created_by,
    properties: {
      name: data.name,
    },
  })

  if (data.created_by) {
    analytics.capture({
      event: 'Organization Updated',
      distinctId: data.created_by,
    })
  }

  return 'Organization updated'
}

const handleOrganizationDeleted = (data: DeletedObjectJSON) => {
  if (data.id) {
    analytics.groupIdentify({
      groupKey: data.id,
      groupType: 'company',
      properties: {
        deleted: new Date(),
      },
    })

    analytics.capture({
      event: 'Organization Deleted',
      distinctId: data.id,
    })
  }

  return 'Organization deleted'
}

const handleOrganizationMembershipCreated = (
  data: OrganizationMembershipJSON
) => {
  analytics.groupIdentify({
    groupKey: data.organization.id,
    groupType: 'company',
    distinctId: data.public_user_data.user_id,
  })

  analytics.capture({
    event: 'Organization Member Created',
    distinctId: data.public_user_data.user_id,
  })

  return 'Organization membership created'
}

const handleOrganizationMembershipDeleted = (
  data: OrganizationMembershipJSON
) => {
  analytics.capture({
    event: 'Organization Member Deleted',
    distinctId: data.public_user_data.user_id,
  })

  return 'Organization membership deleted'
}

export const app = new OpenAPIHono<{ Bindings: Bindings }>()

const post = createRoute({
  method: 'post',
  path: '/',
  summary: 'Process Clerk events',
  request: {
    body: {
      content: {
        'application/json': { schema: WebhookRequestSchema },
      }
    }
  },
  responses: {
    201: {
      content: {
        'text/html': { schema: z.string() },
      },
      description: 'Processed real-time event produced by Clerk',
    },
  },
})

app.openapi(post, async (c) => {
  const request = c.req

  const svixId = request.header('svix-id')
  const svixTimestamp = request.header('svix-timestamp')
  const svixSignature = request.header('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return c.text('Error occurred -- no svix headers', 400)
  }

  const body = await request.json()

  const webhook = new Webhook(config.clerkWebhookSecret)

  let event: WebhookEvent | undefined

  try {
    event = webhook.verify(JSON.stringify(body), {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent
  } catch (error) {
    console.error('Error verifying webhook:', { error })

    return c.text('Error occurred', 400)
  }

  const { id } = event.data
  const eventType = event.type

  let response: string = ''

  switch (eventType) {
    case 'user.created': {
      response = handleUserCreated(event.data)
      break
    }
    case 'user.updated': {
      response = handleUserUpdated(event.data)
      break
    }
    case 'user.deleted': {
      response = handleUserDeleted(event.data)
      break
    }
    case 'organization.created': {
      response = handleOrganizationCreated(event.data)
      break
    }
    case 'organization.updated': {
      response = handleOrganizationUpdated(event.data)
      break
    }
    case 'organization.deleted': {
      response = handleOrganizationDeleted(event.data)
      break
    }
    case 'organizationMembership.created': {
      response = handleOrganizationMembershipCreated(event.data)
      break
    }
    case 'organizationMembership.deleted': {
      response = handleOrganizationMembershipDeleted(event.data)
      break
    }
    default: {
      break
    }
  }

  await analytics.shutdown()

  return c.text(response, 201)
})

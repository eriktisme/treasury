import { z } from '@hono/zod-openapi'

export const CreateSubscriptionScheduleBody = z.object({
  lookupKey: z.string().openapi({
    description: 'The unique identifier for the price.',
    examples: ['basic_monthly', 'basic_yearly'],
  }),
  direction: z.string().openapi({
    description: 'The direction of the subscription change.',
    examples: ['upgrade', 'downgrade'],
  }),
})

export type CreateSubscriptionScheduleBody = z.infer<typeof CreateSubscriptionScheduleBody>

export const SubscriptionSchedule = z.object({
  subscriptionId: z.string().openapi({
    description: 'The unique identifier for the workspace subscription.',
    example: 'sub_1R0lVhJxehjHwVZTqVp7i9XP',
  }),
})

export type SubscriptionSchedule = z.infer<typeof SubscriptionSchedule>

export const SubscriptionScheduleSchema = z
  .object({
    data: z.union([SubscriptionSchedule, z.null()]),
  })
  .openapi('SubscriptionScheduleSchema')

export type SubscriptionScheduleResponse = z.infer<
  typeof SubscriptionScheduleSchema
>

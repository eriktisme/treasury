import type { Construct } from 'constructs'
import type { StackProps } from '@internal/cdk-utils/stack'
import { Stack } from '@internal/cdk-utils/stack'
import { Archive, EventBus } from 'aws-cdk-lib/aws-events'
import { StringParameter } from 'aws-cdk-lib/aws-ssm'
import { EventConsumer } from '@internal/cdk-utils/event-consumer'
import { PersistEvents } from '../constructs/persist-events'

export interface EngineProps extends StackProps {
  clerk: {
    secretKey: string
  }
  databaseUrl: string
  postHog: {
    host: string
    key: string
  }
  stripe: {
    secretKey: string
  }
}

export class Engine extends Stack {
  constructor(scope: Construct, id: string, props: EngineProps) {
    super(scope, id, props)

    const eventBus = new EventBus(this, 'event-bus', {
      eventBusName: `${props.stage}-event-bus`,
    })

    new Archive(this, 'event-bus-archive', {
      sourceEventBus: eventBus,
      eventPattern: {
        source: [
          {
            prefix: '',
          },
        ] as any[],
      },
    })

    new StringParameter(this, 'event-bus-arn', {
      parameterName: `/engine/${props.stage}/event-bus-arn`,
      stringValue: eventBus.eventBusArn,
    })

    new PersistEvents(this, 'persist-events', {
      eventBus,
    })

    new EventConsumer(this, 'create-stripe-customer', {
      eventBus,
      eventPattern: {
        detailType: ['organization.created'],
        source: ['clerk'],
      },
      handlerProps: {
        entry: 'src/functions/create-stripe-customer/index.ts',
        environment: {
          CLERK_SECRET_KEY: props.clerk.secretKey,
          DATABASE_URL: props.databaseUrl,
          POSTHOG_HOST: props.postHog.host,
          POSTHOG_KEY: props.postHog.key,
          STRIPE_SECRET_KEY: props.stripe.secretKey,
        },
      },
    })
  }
}

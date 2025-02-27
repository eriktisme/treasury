import type { Construct } from 'constructs'
import type { StackProps } from '@internal/cdk-utils/stack'
import { Stack } from '@internal/cdk-utils/stack'
import { EventBus } from 'aws-cdk-lib/aws-events'
import { StringParameter } from 'aws-cdk-lib/aws-ssm'

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

    // TODO: Look into archives
    const sourceEventBus = new EventBus(this, 'event-bus', {
      eventBusName: `${props.stage}-event-bus`,
    })

    new StringParameter(this, 'event-bus-arn', {
      parameterName: `/engine/${props.stage}/event-bus-arn`,
      stringValue: sourceEventBus.eventBusArn,
    })
  }
}

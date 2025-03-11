import { Construct } from 'constructs'
import type { EngineProps } from '../index'
import { NodeJSLambda } from '@internal/cdk-utils/lambda'
import type { EventBus } from 'aws-cdk-lib/aws-events'
import { Rule } from 'aws-cdk-lib/aws-events'
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets'

interface Props extends EngineProps {
  eventBus: EventBus
}

export class OnOrganizationCreatedConstruct extends Construct {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id)

    const handler = new NodeJSLambda(this, 'handler', {
      entry: 'src/functions/on-organization-created/index.ts',
      environment: {
        CLERK_SECRET_KEY: props.clerk.secretKey,
        DATABASE_URL: props.databaseUrl,
        POSTHOG_HOST: props.postHog.host,
        POSTHOG_KEY: props.postHog.key,
        STRIPE_SECRET_KEY: props.stripe.secretKey,
      },
    })

    new Rule(this, 'rule', {
      eventBus: props.eventBus,
      eventPattern: {
        detailType: ['organization.created'],
        source: ['clerk'],
      },
      targets: [new LambdaFunction(handler)],
    })
  }
}

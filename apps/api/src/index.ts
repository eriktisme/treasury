import type { StackProps } from '@internal/cdk-utils/stack'
import { Stack } from '@internal/cdk-utils/stack'
import type { Construct } from 'constructs'
import { NodeJSLambda } from '@internal/cdk-utils/lambda'
import { join } from 'path'
import { FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda'
import { EndpointType, LambdaRestApi } from 'aws-cdk-lib/aws-apigateway'
import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager'
import { StringParameter } from 'aws-cdk-lib/aws-ssm'
import {
  ARecord,
  PublicHostedZone,
  RecordTarget,
} from 'aws-cdk-lib/aws-route53'
import { ApiGateway } from 'aws-cdk-lib/aws-route53-targets'
import { EventBus } from 'aws-cdk-lib/aws-events'

export interface ApiServiceProps extends StackProps {
  clerk: {
    publishableKey: string
    secretKey: string
    webhookSecret: string
  }
  databaseUrl: string
  domainName: string
  postHog: {
    host: string
    key: string
  }
  stripe: {
    secretKey: string
    webhookSecret: string
  }
}

export class ApiService extends Stack {
  constructor(scope: Construct, id: string, props: ApiServiceProps) {
    super(scope, id, props)

    const hostedZoneId = StringParameter.fromStringParameterName(
      this,
      'hosted-zone-id',
      `/${props.stage}/hosted-zone-id`
    ).stringValue

    const zone = PublicHostedZone.fromPublicHostedZoneAttributes(
      this,
      'hosted-zone',
      {
        zoneName: props.domainName,
        hostedZoneId,
      }
    )

    const eventBusArn = StringParameter.fromStringParameterName(
      this,
      'event-bus-arn',
      `/engine/${props.stage}/event-bus-arn`,
    ).stringValue

    const eventBus = EventBus.fromEventBusArn(this, 'event-bus', eventBusArn)

    const handler = new NodeJSLambda(this, 'handler', {
      entry: join(__dirname, './src/index.ts'),
      environment: {
        CLERK_PUBLISHABLE_KEY: props.clerk.publishableKey,
        CLERK_SECRET_KEY: props.clerk.secretKey,
        CLERK_WEBHOOK_SECRET: props.clerk.webhookSecret,
        DATABASE_URL: props.databaseUrl,
        EVENT_BUS_NAME: eventBus.eventBusName,
        POSTHOG_HOST: props.postHog.host,
        POSTHOG_KEY: props.postHog.key,
        STRIPE_SECRET_KEY: props.stripe.secretKey,
        STRIPE_WEBHOOK_SECRET: props.stripe.webhookSecret,
      },
    })

    eventBus.grantPutEventsTo(handler)

    handler.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    })

    const domainName = `api.${props.domainName}`

    const certificate = new Certificate(this, 'certificate', {
      domainName,
      validation: CertificateValidation.fromDns(zone),
    })

    const restApi = new LambdaRestApi(this, 'api', {
      deployOptions: {
        tracingEnabled: true,
      },
      domainName: {
        certificate,
        domainName,
      },
      endpointTypes: [EndpointType.REGIONAL],
      handler,
      restApiName: `${props.stage}-api`,
    })

    new ARecord(this, 'api-a', {
      recordName: domainName,
      zone,
      target: RecordTarget.fromAlias(new ApiGateway(restApi)),
    })
  }
}

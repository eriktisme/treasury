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

interface Props extends StackProps {
  clerk: {
    publishableKey: string
    secretKey: string
    webhookSecret: string
  }
  postHog: {
    key: string
    host: string
  }
  databaseUrl: string
  domainName: string
}

export class ApiService extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props)

    const handler = new NodeJSLambda(this, 'handler', {
      entry: join(__dirname, './src/index.ts'),
      environment: {
        CLERK_PUBLISHABLE_KEY: props.clerk.publishableKey,
        CLERK_SECRET_KEY: props.clerk.secretKey,
        CLERK_WEBHOOK_SECRET: props.clerk.webhookSecret,
        DATABASE_URL: props.databaseUrl,
        POSTHOG_HOST: props.postHog.host,
        POSTHOG_KEY: props.postHog.key,
      },
    })

    handler.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    })

    const domainName = `api.${props.domainName}`

    const certificate = new Certificate(this, 'certificate', {
      domainName,
      validation: CertificateValidation.fromDns(),
    })

    new LambdaRestApi(this, 'api', {
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
  }
}

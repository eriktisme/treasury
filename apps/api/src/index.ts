import type { StackProps } from '@internal/cdk-utils/stack'
import { Stack } from '@internal/cdk-utils/stack'
import type { Construct } from 'constructs'
import { NodeJSLambda } from '@internal/cdk-utils/lambda'
import { join } from 'path'
import { FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda'
import { EndpointType, LambdaRestApi } from 'aws-cdk-lib/aws-apigateway'

interface Props extends StackProps {
  clerkPublishableKey: string
  clerkSecretKey: string
  databaseUrl: string
}

export class ApiService extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props)

    const handler = new NodeJSLambda(this, 'handler', {
      entry: join(__dirname, './src/index.ts'),
      environment: {
        CLERK_PUBLISHABLE_KEY: props.clerkPublishableKey,
        CLERK_SECRET_KEY: props.clerkSecretKey,
        DATABASE_URL: props.databaseUrl,
      },
    })

    handler.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    })

    new LambdaRestApi(this, 'api', {
      deployOptions: {
        tracingEnabled: true,
      },
      endpointTypes: [EndpointType.REGIONAL],
      handler,
      restApiName: `${props.stage}-api`,
    })
  }
}

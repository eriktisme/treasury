import type { Construct } from 'constructs'
import type { StackProps } from '@internal/cdk-utils/stack'
import { Stack } from '@internal/cdk-utils/stack'
import { NodeJSLambda } from '@internal/cdk-utils/lambda'
import { OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs'
import { join } from 'path'
import { CustomResource, Duration } from 'aws-cdk-lib'
import { Provider } from 'aws-cdk-lib/custom-resources'
import { computeHash } from './utils'

type Props = StackProps & {
  databaseUrl: string
}

export class MigrationsService extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props)

    const migrationDirectoryPath = join(__dirname, './migrations')

    const onEventHandler = new NodeJSLambda(this, 'function', {
      bundling: {
        banner: '',
        format: OutputFormat.CJS,
        target: 'ES2017',
        commandHooks: {
          afterBundling: (_, outputDir: string) => {
            return [
              `pwd && mkdir -p ${outputDir}/migrations && cp ${migrationDirectoryPath}/* ${outputDir}/migrations`,
            ]
          },
          beforeBundling: () => [],
          beforeInstall: () => [],
        },
      },
      entry: join(__dirname, './src/functions/migrations/index.ts'),
      timeout: Duration.seconds(300),
      environment: {
        POSTGRESS_URL: props.databaseUrl,
      },
    })

    const provider = new Provider(this, 'provider', {
      onEventHandler,
    })

    new CustomResource(this, 'Database:Migrations', {
      serviceToken: provider.serviceToken,
      resourceType: 'Custom::DatabaseMigrations',
      properties: {
        migrationDirectoryHash: computeHash(migrationDirectoryPath),
      },
    })
  }
}

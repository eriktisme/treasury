import { Construct } from 'constructs'
import { join } from 'path'
import { CustomResource, Duration } from 'aws-cdk-lib'
import { Provider } from 'aws-cdk-lib/custom-resources'
import { OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs'
import { computeHash } from './utils'
import { NodeJSLambda } from '@internal/cdk-utils/lambda'

interface MigrationConstructProps {
  databaseUrl: string
}

export class MigrationsConstruct extends Construct {
  constructor(scope: Construct, id: string, props: MigrationConstructProps) {
    super(scope, id)

    const migrationDirectoryPath = join(__dirname, '../../migrations')

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
      entry: join(__dirname, '../src/functions/migrations/index.ts'),
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

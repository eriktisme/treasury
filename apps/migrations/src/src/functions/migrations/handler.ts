import type { CdkCustomResourceResponse, Context } from 'aws-lambda'
import runner from 'node-pg-migrate'
import type { MigrationEvent } from './types'

interface HandlerDeps {
  connectionString: string
}

export const buildHandler = async (
  event: MigrationEvent,
  context: Context,
  deps: HandlerDeps
) => {
  if ('LogicalResourceId' in event) {
    const resp: CdkCustomResourceResponse = {
      LogicalResourceId: event.LogicalResourceId,
      PhysicalResourceId: context.logGroupName,
      RequestId: event.RequestId,
      StackId: event.StackId,
    }

    if (event.RequestType == 'Delete') {
      return {
        ...resp,
        Data: { Result: 'None' },
        Status: 'SUCCESS',
      }
    }

    try {
      const migrationResult = await runner({
        databaseUrl: deps.connectionString,
        dir: `${__dirname}/migrations`,
        direction: 'up',
        migrationsTable: 'migrations',
        verbose: true,
      })

      const nbOfExecutedScripts = migrationResult.length

      return {
        ...resp,
        Data: { Result: nbOfExecutedScripts },
        Status: 'SUCCESS',
      }
    } catch (e) {
      if (e instanceof Error) {
        resp.Reason = e.message
      }

      return {
        ...resp,
        Data: { Result: e },
        Status: 'FAILED',
      }
    }
  }

  try {
    const migrationResult = await runner({
      databaseUrl: deps.connectionString,
      dir: `${__dirname}/migrations`,
      direction: event.direction ?? 'up',
      migrationsTable: 'migrations',
      verbose: true,
    })

    const nbOfExecutedScripts = migrationResult.length

    return {
      nbOfExecutedScripts,
    }
  } catch (e) {
    console.log('Failed to execute migrations', e)

    return {
      e,
    }
  }
}

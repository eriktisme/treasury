import type { StackProps as BaseStackProps } from 'aws-cdk-lib'
import { Stack as BaseStack } from 'aws-cdk-lib'
import type { Construct } from 'constructs'

export interface StackProps extends BaseStackProps {
  stage: string
}

export class Stack extends BaseStack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, {
      ...props,
      stackName:
        props?.stackName ??
        [
          ...scope.node.scopes.map((p) => p.node.id).filter((v) => !!v),
          id,
        ].join('-'),
    })
  }
}

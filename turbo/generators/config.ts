import type { PlopTypes } from '@turbo/gen'

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('next-package', {
    description: 'Generate a new Next.js package for the Monorepo',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message:
          'What is the name of the package? (You can skip the `@internal/` prefix)',
      },
    ],
    actions: [
      (answers) => {
        if (
          'name' in answers &&
          typeof answers.name === 'string' &&
          answers.name.startsWith('@internal/')
        ) {
          answers.name = answers.name.replace('@internal/', '')
        }
        return 'Config sanitized'
      },
      {
        type: 'add',
        path: 'packages/{{ name }}/package.json',
        templateFile: 'templates/next-package/package.json.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{ name }}/tsconfig.json',
        templateFile: 'templates/next-package/tsconfig.json.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{ name }}/.eslintrc.json',
        templateFile: 'templates/next-package/.eslintrc.json.hbs',
      },
    ],
  })

  plop.setGenerator('node-package', {
    description: 'Generate a new Node.js package for the Monorepo',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message:
          'What is the name of the package? (You can skip the `@internal/` prefix)',
      },
    ],
    actions: [
      (answers) => {
        if (
          'name' in answers &&
          typeof answers.name === 'string' &&
          answers.name.startsWith('@internal/')
        ) {
          answers.name = answers.name.replace('@internal/', '')
        }
        return 'Config sanitized'
      },
      {
        type: 'add',
        path: 'packages/{{ name }}/package.json',
        templateFile: 'templates/node-package/package.json.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{ name }}/tsconfig.json',
        templateFile: 'templates/node-package/tsconfig.json.hbs',
      },
      {
        type: 'add',
        path: 'packages/{{ name }}/.eslintrc.json',
        templateFile: 'templates/node-package/.eslintrc.json.hbs',
      },
    ],
  })
}

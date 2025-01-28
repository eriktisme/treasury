import { CreateWorkspaceForm, LoggedInAs, LogOutButton } from '../components'
import { Suspense } from 'react'

export const CreateWorkspacePageTemplate = () => {
  return (
    <div
      className="relative flex min-h-svh flex-col overflow-hidden bg-neutral-50 p-6 md:p-10"
      style={{
        overscrollBehavior: 'contain',
        scrollbarGutter: 'stable',
      }}
    >
      <div className="flex flex-auto flex-col items-center justify-center overflow-x-hidden py-12">
        <Suspense>
          <CreateWorkspaceForm />
        </Suspense>
      </div>
      <div className="fixed right-6 top-6">
        <LoggedInAs />
      </div>
      <div className="fixed left-6 top-6">
        <LogOutButton />
      </div>
    </div>
  )
}

import { LoggedInAs, LogOutButton } from '../components'

export const CreateWorkspacePageTemplate = () => {
  return (
    <div
      className="relative flex min-h-svh flex-col overflow-hidden bg-neutral-50"
      style={{
        overscrollBehavior: 'contain',
        scrollbarGutter: 'stable',
      }}
    >
      <div className="fixed right-6 top-6">
        <LoggedInAs />
      </div>
      <div className="fixed left-6 top-6">
        <LogOutButton />
      </div>
    </div>
  )
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-8 pb-20 lg:p-14">
      Congratulations, your account is ready!
    </div>
  )
}

import { WorkspaceBillingPlansPageTemplate } from '@/features/workspace-billing'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Billing',
}

export default function Page() {
  return <WorkspaceBillingPlansPageTemplate />
}

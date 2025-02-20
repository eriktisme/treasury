import { TooltipProvider } from './components/ui/tooltip'
import { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
  //
}

export const DesignSystemProvider = ({ children }: Readonly<Props>) => (
  <TooltipProvider>{children}</TooltipProvider>
)

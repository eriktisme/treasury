import { TooltipProvider } from './components/ui/tooltip'
import { ThemeProvider, ThemeProviderProps } from 'next-themes'
import { Toaster } from '@internal/design-system/components/ui/sonner'

interface Props extends ThemeProviderProps {
  //
}

export const DesignSystemProvider = ({ children, ...props }: Readonly<Props>) => (
  <ThemeProvider {...props}>
    <TooltipProvider>{children}</TooltipProvider>
    <Toaster />
  </ThemeProvider>
)

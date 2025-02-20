import { TooltipProvider } from './components/ui/tooltip'
import { ThemeProvider, ThemeProviderProps } from 'next-themes'

interface Props extends ThemeProviderProps {
  //
}

export const DesignSystemProvider = ({ children, ...props }: Readonly<Props>) => (
  <ThemeProvider {...props}>
    <TooltipProvider>{children}</TooltipProvider>
  </ThemeProvider>
)

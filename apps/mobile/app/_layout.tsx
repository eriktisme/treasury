import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

export default function Layout() {
  if (!publishableKey) {
    throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env')
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <SafeAreaProvider>
        <ClerkLoaded>
          <Slot />
        </ClerkLoaded>
      </SafeAreaProvider>
    </ClerkProvider>
  )
}

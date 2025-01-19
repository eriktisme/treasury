import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function Layout() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Redirect href="/(authenticated)/dashboard" />
  }

  return <Stack />
}

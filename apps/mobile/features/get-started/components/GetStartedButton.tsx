import { Button } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'
import * as AuthSession from 'expo-auth-session'
import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'

export const GetStartedButton = () => {
  const router = useRouter()

  const { setActive, signIn } = useSignIn()

  const onGettingStarted = async () => {
    const redirectUrl = AuthSession.makeRedirectUri({
      scheme: 'treasury',
      path: '(guest)/get-started',
    })

    const result = await WebBrowser.openAuthSessionAsync(
      `${process.env.EXPO_PUBLIC_APP_URL}/auth/sign-in?redirect_url=${redirectUrl}`
    )

    if (result.type === 'success') {
      const { queryParams } = Linking.parse(result.url)

      if (!queryParams.token) {
        // Handle error
        return
      }

      const ticket = queryParams.token as string

      const signInAttempt = await signIn.create({
        strategy: 'ticket',
        ticket,
      })

      if (signInAttempt.status === 'complete') {
        await setActive?.({
          session: signInAttempt.createdSessionId,
        })

        return router.push('/(authenticated)/dashboard')
      }

      // Handle error
    }
  }

  return <Button title="Get Started" onPress={onGettingStarted} />
}

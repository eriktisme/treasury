import { Button } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'

export const GetStartedButton = () => {
  const redirectUri = Linking.createURL('/(authenticated)/dashboard', {
    scheme: 'treasury',
  })

  const onGettingStarted = async () => {
    await WebBrowser.openAuthSessionAsync(
      `${process.env.EXPO_PUBLIC_APP_URL}?redirect_uri=${redirectUri}`,
      '',
      {
        preferEphemeralSession: true,
      }
    )
  }

  return <Button title="Get Started" onPress={onGettingStarted} />
}

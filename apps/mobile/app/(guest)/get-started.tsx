import { GetStartedButton } from '@/features/get-started'
import { StyleSheet, View } from 'react-native'

export default function Page() {
  return (
    <View style={styles.container}>
      <GetStartedButton />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

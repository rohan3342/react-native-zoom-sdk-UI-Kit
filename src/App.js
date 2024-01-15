import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ZoomVideoSdkProvider } from '@zoom/react-native-videosdk';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default function App() {
  return (
    <View style={styles.container}>
      <ZoomVideoSdkProvider
        config={{
          appGroupId: 'group.test.sdk',
          domain: 'zoom.us',
          enableLog: true,
        }}
      >
        <Text>ROHAN</Text>
      </ZoomVideoSdkProvider>
    </View>
  );
}

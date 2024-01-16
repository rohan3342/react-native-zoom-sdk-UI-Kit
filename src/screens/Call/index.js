import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Call = () => {
  return (
    <View style={styles.container}>
      <Text>Call</Text>
    </View>
  );
};

export default Call;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

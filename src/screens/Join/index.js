import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import COLORS from '../../styles/colors';

const Join = () => {
  return (
    <View style={styles.container}>
      <Text>Join</Text>
    </View>
  );
};

export default Join;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: COLORS.secondary,
  },
});

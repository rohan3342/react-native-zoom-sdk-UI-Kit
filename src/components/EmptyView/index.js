import React from 'react';
import { View, Pressable, Text } from 'react-native';

import Loader from '../Loader';
import styles from './styles';

export default function EmptyView(props) {
  const { title, subTitle, loading, titleStyle, onPress = () => {} } = props;

  return (
    <View style={styles.container}>
      {loading ? (
        <Loader />
      ) : (
        <Pressable onPress={onPress}>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
          <Text style={styles.subTitle}>{subTitle}</Text>
        </Pressable>
      )}
    </View>
  );
}

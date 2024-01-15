import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import styles from './styles';

const Button = React.memo((props) => {
  const {
    Icon,
    title = 'Button',
    titleStyle = {},
    disabled = false,
    onPress = () => {},
    containerStyle = {},
    activeOpacity = 0.8,
  } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={activeOpacity}
      style={[styles.container, disabled && { opacity: 0.5 }, containerStyle]}
    >
      {Icon && <Icon />}
      {title ? (
        <Text style={[styles.title, disabled && { opacity: 0.5 }, titleStyle]}>
          {title}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
});

export default Button;

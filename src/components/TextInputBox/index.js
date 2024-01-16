import React, { useRef } from 'react';
import { TextInput, Pressable } from 'react-native';

import styles from './styles';
import Colors from '../../styles/colors';
import { isTablet, normalizeHeight } from '../../styles/responsive';

export default function ForteTextInput(props) {
  const {
    Icon,
    value = '',
    visible = true,
    editable = true,
    maxLength = 255,
    autoFocus = true,
    blurOnSubmit = true,
    autoCorrect = false,
    onChangeText = null,
    autoComplete = 'off',
    textInputStyle = {},
    autoCapitalize = 'none',
    textColor = Colors.black,
    returnKeyType = 'default',
    placeholder = 'Enter value',
    selectionColor = Colors?.primary,
    placeholderTextColor = Colors?.grey,
    containerStyle = { paddingVertical: isTablet ? normalizeHeight(10) : 0 },
  } = props;

  const textInputRef = useRef(null);

  function onPress() {
    if (editable) {
      textInputRef?.current?.focus();
    } else {
      props?.onPress();
    }
  }

  return (
    <Pressable
      onPress={onPress}
      style={[
        { display: visible ? 'flex' : 'none', zIndex: 1 },
        styles.container,
        containerStyle,
      ]}
    >
      <TextInput
        value={value}
        numberOfLines={1}
        ref={textInputRef}
        editable={editable}
        defaultValue={value}
        maxLength={maxLength}
        autoFocus={autoFocus}
        keyboardType={'default'}
        placeholder={placeholder}
        autoCorrect={autoCorrect}
        autoComplete={autoComplete}
        blurOnSubmit={blurOnSubmit}
        onChangeText={onChangeText}
        returnKeyType={returnKeyType}
        autoCapitalize={autoCapitalize}
        selectionColor={selectionColor}
        placeholderTextColor={placeholderTextColor}
        pointerEvents={editable ? 'auto' : 'none'}
        style={[styles.textInput(textColor), textInputStyle]}
      />
      {Icon && <Icon />}
    </Pressable>
  );
}

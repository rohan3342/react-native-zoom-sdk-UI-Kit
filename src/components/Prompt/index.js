import Modal from 'react-native-modal';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from './styles';
import Button from '../Button';

export default function Prompt(props) {
  const navigation = useNavigation();

  const [visible, setVisible] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    title: '',
    subTitle: '',
  });

  Prompt.show = (config) => {
    setVisible(true);
    setModalInfo({
      title: config?.title || modalInfo?.title,
      subTitle: config?.subTitle || modalInfo?.subTitle,
    });
  };

  function hidePrompt() {
    setVisible(false);
  }

  function onModalHide() {
    setModalInfo({ title: '', subTitle: '' });
  }

  return (
    <Modal
      isVisible={visible}
      useNativeDriver={false}
      animationOutTiming={500}
      onModalHide={onModalHide}
      statusBarTranslucent={true}
      style={styles.modalRootView}
      onBackdropPress={hidePrompt}
      onBackButtonPress={hidePrompt}
      backdropTransitionOutTiming={0}
    >
      <View style={styles.modalInnerView}>
        <Text style={styles.modalTitle} numberOfLines={1}>
          {modalInfo?.title}
        </Text>
        <Text style={styles.modalSubTitle}>{modalInfo?.subTitle}</Text>
        <Button
          title='CANCEL'
          onPress={hidePrompt}
          containerStyle={styles.cancelBtnStyle}
          titleStyle={styles.cancelBtnTextStyle}
        />
      </View>
    </Modal>
  );
}

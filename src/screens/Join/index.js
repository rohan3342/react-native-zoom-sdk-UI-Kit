import React, { useMemo, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import styles from './styles';
import Colors from '../../styles/colors';
import Button from '../../components/Button';
import TextInputBox from '../../components/TextInputBox';
import useLightStatusBar from '../../hooks/useLightStatusBar';
import { ChevronLeft, SwitchOn, SwitchOff } from '../../assets/SVG';

const Join = (props) => {
  const topInset = useSafeAreaInsets().top;
  useLightStatusBar(true, Colors.secondary);
  const [meetingInfo, setMeetingInfo] = useState({
    meetingId: '',
    displayName: '',
    shareVideo: false,
    personalLink: false,
    doNotConnectToAudio: false,
  });

  function onBackBtnPress() {
    props?.navigation?.goBack();
  }

  function setMeetingID(value) {
    setMeetingInfo({ ...meetingInfo, meetingId: value?.trim() });
  }

  function setDisplayName(value) {
    setMeetingInfo({ ...meetingInfo, displayName: value?.trim() });
  }

  function setPersonalLink() {
    setMeetingInfo({
      ...meetingInfo,
      personalLink: !meetingInfo?.personalLink,
    });
  }

  function onJoinPress() {
    if (meetingInfo.meetingId.length === 7) {
      Alert.alert('Meeting ID is not valid');
      return;
    }
    props?.navigation.navigate('Call', {
      roleType: 0,
      sessionPassword: '',
      meetingId: meetingInfo.meetingId,
      shareVideo: meetingInfo.shareVideo,
      displayName: meetingInfo.displayName,
      doNotConnectToAudio: meetingInfo.doNotConnectToAudio,
    });
  }

  const isJoinButtonEnable = useMemo(
    () =>
      !(
        meetingInfo?.displayName?.split('')?.length > 0 &&
        meetingInfo?.meetingId?.split('')?.length > 0
      ),
    [meetingInfo]
  );

  function toggleShareVideo() {
    setMeetingInfo({
      ...meetingInfo,
      shareVideo: !meetingInfo?.shareVideo,
    });
  }

  function toggleConnectToAudio() {
    setMeetingInfo({
      ...meetingInfo,
      doNotConnectToAudio: !meetingInfo?.doNotConnectToAudio,
    });
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerView(topInset)}>
        <TouchableOpacity
          hitSlop={20}
          activeOpacity={0.8}
          onPress={onBackBtnPress}
          style={styles.headerIcon(topInset)}
        >
          <ChevronLeft fill={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.herderTitle}>Join a Meeting</Text>
      </View>
      <View style={styles.mainContainer}>
        <TextInputBox
          maxLength={8}
          onChangeText={setMeetingID}
          value={meetingInfo.meetingId}
          containerStyle={styles.textInputStyle}
          placeholder={
            meetingInfo?.personalLink ? 'Personal Link Name' : 'Meeting ID'
          }
        />
        <Button
          maxLength={24}
          activeOpacity={0.6}
          onPress={setPersonalLink}
          title={
            meetingInfo?.personalLink
              ? 'Join with a personal link name'
              : 'Join with meeting ID'
          }
          titleStyle={styles.personalBtnTitleStyle}
          containerStyle={styles.personalBtnContainerStyle}
        />
        <TextInputBox
          autoFocus={false}
          placeholder={'Display Name'}
          onChangeText={setDisplayName}
          value={meetingInfo.displayName}
        />
        <Button
          title={'Join'}
          onPress={onJoinPress}
          disabled={isJoinButtonEnable}
          titleStyle={[
            styles.btnTitleStyle,
            isJoinButtonEnable && styles.disabledBtnTitle,
          ]}
          containerStyle={[
            styles.btnContainerStyle,
            isJoinButtonEnable && styles.disabledBtn,
          ]}
        />
        <Text style={styles.joinOptionsText}>JOIN OPTIONS</Text>
        <View style={styles.toggleBtnWrapper}>
          <Button
            onPress={toggleConnectToAudio}
            title={`Don't Connect To Audio`}
            titleStyle={styles.toggleBtnTitleStyle}
            SecondIcon={() =>
              meetingInfo?.doNotConnectToAudio ? (
                <SwitchOn fill={Colors.success} />
              ) : (
                <SwitchOff fill={Colors.black020} />
              )
            }
            containerStyle={[styles.toggleBtnStyle, styles.toggleBtnLineStyle]}
          />
          <Button
            onPress={toggleShareVideo}
            title={`Turn Off My Video`}
            containerStyle={styles.toggleBtnStyle}
            titleStyle={styles.toggleBtnTitleStyle}
            SecondIcon={() =>
              meetingInfo?.shareVideo ? (
                <SwitchOn fill={Colors.success} />
              ) : (
                <SwitchOff fill={Colors.black020} />
              )
            }
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Join;

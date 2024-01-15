import React, { useMemo, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import styles from './styles';
import Colors from '../../styles/colors';
import Button from '../../components/Button';
import { ChevronLeft } from '../../assets/SVG';
import { normalize } from '../../styles/responsive';
import TextInputBox from '../../components/TextInputBox';
import useLightStatusBar from '../../hooks/useLightStatusBar';

const Join = (props) => {
  const topInset = useSafeAreaInsets().top;
  useLightStatusBar(true, Colors.secondary);
  const [meetingInfo, setMeetingInfo] = useState({
    meetingId: '',
    displayName: '',
    personalLink: false,
  });

  function onBackBtnPress() {
    props?.navigation?.goBack();
  }

  function setMeetingID(value) {
    setMeetingInfo({ ...meetingInfo, meetingId: value });
  }

  function setDisplayName(value) {
    setMeetingInfo({ ...meetingInfo, displayName: value });
  }

  function setPersonalLink() {
    setMeetingInfo({
      ...meetingInfo,
      personalLink: !meetingInfo?.personalLink,
    });
  }

  function onJoinPress() {}

  const isJoinButtonEnable = useMemo(
    () =>
      !(
        meetingInfo?.displayName?.split('')?.length > 0 &&
        meetingInfo?.meetingId?.split('')?.length > 0
      ),
    [meetingInfo]
  );

  return (
    <View style={styles.container}>
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
          onChangeText={setMeetingID}
          value={meetingInfo.meetingId}
          containerStyle={styles.textInputStyle}
          placeholder={
            meetingInfo?.personalLink ? 'Meeting ID' : 'Personal Link Name'
          }
        />
        <Button
          activeOpacity={0.6}
          onPress={setPersonalLink}
          title={
            meetingInfo?.personalLink
              ? 'Join with meeting ID'
              : 'Join with a personal link name'
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
          titleStyle={styles.btnTitleStyle}
          containerStyle={styles.btnContainerStyle}
        />
      </View>
    </View>
  );
};

export default Join;

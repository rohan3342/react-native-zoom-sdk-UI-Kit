import Clipboard from '@react-native-clipboard/clipboard';
import React, { useEffect, useMemo, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  SwitchOn,
  SwitchOff,
  ChevronLeft,
  CopyToClipBoard,
} from '../../assets/SVG';
import styles from './styles';
import Colors from '../../styles/colors';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import Prompt from '../../components/Prompt';
import TextInputBox from '../../components/TextInputBox';
import { generateUniqueMeetingId } from '../../utils/common';
import useLightStatusBar from '../../hooks/useLightStatusBar';

const Join = (props) => {
  const topInset = useSafeAreaInsets().top;
  const createNewMeeting = props?.route?.params?.isJoin;

  useLightStatusBar(true, Colors.secondary);

  const [loader, setLoader] = useState(true);
  const [clipboard, setClipboard] = useState(false);

  const [meetingInfo, setMeetingInfo] = useState({
    meetingId: '',
    displayName: '',
    shareVideo: false,
    personalLink: false,
    meetingPassword: '',
    doNotConnectToAudio: false,
  });

  useEffect(() => {
    if (createNewMeeting) {
      let meetingId = generateUniqueMeetingId();
      setMeetingInfo({ ...meetingInfo, meetingId });
    }
    setTimeout(() => setLoader(false), 1000);
  }, []);

  function onBackBtnPress() {
    props?.navigation?.goBack();
  }

  function setMeetingID(value) {
    setMeetingInfo({ ...meetingInfo, meetingId: value?.trim() });
  }

  function setDisplayName(value) {
    setMeetingInfo({ ...meetingInfo, displayName: value?.trim() });
  }

  /*
    function setPersonalLink() {
      setMeetingInfo({
        ...meetingInfo,
        personalLink: !meetingInfo?.personalLink,
      });
    }
  */

  function setMeetingPassword(value) {
    setMeetingInfo({ ...meetingInfo, meetingPassword: value?.trim() });
  }

  function onJoinPress() {
    if (meetingInfo.meetingId.length !== 14) {
      Prompt.show({
        title: 'Meeting ID is not valid',
        subTitle: 'Please enter a valid Meeting ID',
      });
      return;
    }

    /*
     sessionName,
      displayName,
      sessionPassword,
      roleType,
      sessionIdleTimeoutMins,
    */
    props?.navigation.navigate('Call', {
      roleType: createNewMeeting ? 1 : 0,
      shareVideo: meetingInfo?.shareVideo,
      shareAudio: meetingInfo?.doNotConnectToAudio,
      sessionName: meetingInfo?.meetingId,
      displayName: meetingInfo?.displayName,
      sessionPassword: meetingInfo.meetingPassword,
      sessionIdleTimeoutMins: '40',
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

  function TextInputIcon() {
    if (createNewMeeting) {
      return (
        <View style={styles.textInputIcon}>
          <CopyToClipBoard
            width={20}
            height={20}
            fill={clipboard ? Colors.primary : Colors.grey}
          />
        </View>
      );
    }
    return false;
  }

  function CopyMeetingID() {
    Clipboard.setString(meetingInfo?.meetingId);
    setClipboard(true);
    setTimeout(() => {
      setClipboard(false);
    }, 1000);
  }

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
        <Text style={styles.herderTitle}>
          {createNewMeeting ? 'Create a Meeting' : 'Join a Meeting'}
        </Text>
      </View>

      {loader ? (
        <View style={styles.loaderWrapper}>
          <Loader />
        </View>
      ) : (
        <View style={styles.mainContainer}>
          <TextInputBox
            maxLength={14}
            Icon={TextInputIcon}
            onPress={CopyMeetingID}
            onChangeText={setMeetingID}
            editable={!createNewMeeting}
            value={meetingInfo.meetingId}
            textInputStyle={styles.textInputStyle}
            containerStyle={styles.textInputContainer}
            placeholder={
              meetingInfo?.personalLink ? 'Personal Link Name' : 'Meeting ID'
            }
          />
          <TextInputBox
            autoFocus={false}
            placeholder={'Meeting Password'}
            onChangeText={setMeetingPassword}
            value={meetingInfo.meetingPassword}
            textInputStyle={styles.textInputStyle}
            containerStyle={styles.textInputContainer}
          />
          {/* <Button
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
          /> */}
          <TextInputBox
            autoFocus={false}
            placeholder={'Your Name'}
            onChangeText={setDisplayName}
            value={meetingInfo.displayName}
            textInputStyle={styles.textInputStyle}
            containerStyle={styles.textInputContainer}
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
                  <SwitchOn fill={Colors.primary} />
                ) : (
                  <SwitchOff fill={Colors.black020} />
                )
              }
              containerStyle={[
                styles.toggleBtnStyle,
                styles.toggleBtnLineStyle,
              ]}
            />
            <Button
              onPress={toggleShareVideo}
              title={`Turn Off My Video`}
              containerStyle={styles.toggleBtnStyle}
              titleStyle={styles.toggleBtnTitleStyle}
              SecondIcon={() =>
                meetingInfo?.shareVideo ? (
                  <SwitchOn fill={Colors.primary} />
                ) : (
                  <SwitchOff fill={Colors.black020} />
                )
              }
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default Join;

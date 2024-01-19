import {
  View,
  Text,
  Alert,
  Modal,
  FlatList,
  Keyboard,
  Platform,
  StatusBar,
  TextInput,
  Pressable,
  BackHandler,
  ActionSheetIOS,
  useWindowDimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  RNKeyboard,
  KeyboardArea,
  SoftInputMode,
} from 'react-native-keyboard-area';
import Animated, {
  Easing,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import ImmersiveMode from 'react-native-immersive-mode';
import Clipboard from '@react-native-clipboard/clipboard';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useEffect, useState, useRef, useCallback } from 'react';

import generateJwt from '../../utils/jwt';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import VideoView from '../../components/VideoView';
import useIsMounted from '../../hooks/useIsMounted';
import BottomTabView from '../../components/BottomTabView';
import {
  Errors,
  useZoom,
  EventType,
  ShareStatus,
  ConsentType,
  NetworkStatus,
  RecordingStatus,
  ZoomVideoSdkUser,
  SystemPermissionType,
  LiveTranscriptionStatus,
  MultiCameraStreamStatus,
  ZoomVideoSdkChatMessage,
  ZoomVideoSdkCRCProtocolType,
  ZoomVideoSDKChatPrivilegeType,
  ZoomVideoSdkLiveTranscriptionMessageInfo,
} from '@zoom/react-native-videosdk';

import styles from './styles';
import Colors from '../../styles/colors';
import {
  VolumeMute,
  VolumeHigh,
  CameraReverse,
  ShieldCheckMark,
} from '../../assets/SVG';
import { normalize, normalizeHeight } from '../../styles/responsive';
import useLightStatusBar from '../../hooks/useLightStatusBar';
import Prompt from '../../components/Prompt';

const Call = (props) => {
  const { navigation, route } = props;
  const topInset = useSafeAreaInsets().top;

  const [
    isReceiveSpokenLanguageContentEnabled,
    setIsReceiveSpokenLanguageContentEnabled,
  ] = useState(false);
  const [newName, setNewName] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [videoInfo, setVideoInfo] = useState('');
  const [users, setUsersInSession] = useState([]);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [sharingUser, setSharingUser] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isInSession, setIsInSession] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isLongTouch, setIsLongTouch] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [onMoreOptions, setOnMoreOptions] = useState([]);
  const [fullScreenUser, setFullScreenUser] = useState([]);
  const [contentHeight, setContentHeight] = useState('100%');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(true);
  const [isVideoMirrored, setIsVideoMirrored] = useState(true);
  const [refreshFlatlist, setRefreshFlatList] = useState(false);
  const [isMicOriginalOn, setIsMicOriginalOn] = useState(false);
  const [isPiPViewEnabled, setIsPiPViewEnabled] = useState(true);
  const [isRecordingStarted, setIsRecordingStarted] = useState(false);
  const [isShareDeviceAudio, setIsShareDeviceAudio] = useState(false);
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [isOriginalAspectRatio, setIsOriginalAspectRatio] = useState(false);
  const [showBottomTab, setShowBottomTab] = useState(false);
  const [cameraReverse, setCameraReverse] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  let touchTimer;
  const zoom = useZoom();
  const isMounted = useIsMounted();
  const windowHeight = useWindowDimensions().height;

  const videoInfoTimer = useRef(0);
  const chatInputRef = useRef(null);
  const isLongTouchRef = useRef(isLongTouch);

  const uiOpacity = useSharedValue(0);
  const inputOpacity = useSharedValue(0);
  const chatSendButtonScale = useSharedValue(0);

  isLongTouchRef.current = isLongTouch;
  useLightStatusBar(false, Colors.black);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setHidden(true);
      }
      return () => {
        if (Platform.OS === 'android') {
          StatusBar.setHidden(false);
        }
      };
    }, [])
  );

  useEffect(() => {
    (async () => {
      const { params } = route;
      const token = await generateJwt(params.sessionName, params.roleType);
      try {
        await zoom.joinSession({
          token: token,
          userName: params?.displayName,
          sessionName: params?.sessionName,
          sessionPassword: params?.sessionPassword,
          audioOptions: {
            mute: true,
            connect: true,
            autoAdjustSpeakerVolume: false,
          },
          videoOptions: { localVideoOn: true },
          sessionIdleTimeoutMins: parseInt(params?.sessionIdleTimeoutMins, 10),
        });
      } catch (e) {
        console.log(e);
        Prompt.show({
          subTitle: 'Please try again!',
          title: 'Failed to Join the Meeting',
        });
        setTimeout(() => navigation.goBack(), 1000);
      }
    })();

    if (Platform.OS === 'android') {
      RNKeyboard.setWindowSoftInputMode(
        SoftInputMode.SOFT_INPUT_ADJUST_NOTHING
      );
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onPressLeave
    );

    return () => {
      backHandler.remove();
      if (Platform.OS === 'android') {
        RNKeyboard.setWindowSoftInputMode(
          SoftInputMode.SOFT_INPUT_ADJUST_RESIZE
        );
      }
    };
  }, []);

  useEffect(() => {
    const updateVideoInfo = () => {
      videoInfoTimer.current = setTimeout(async () => {
        if (!isMounted()) return;

        const videoOn = await fullScreenUser?.videoStatus.isOn();

        // Video statistic info doesn't update when there's no remote users
        if (!fullScreenUser || !videoOn || users.length < 2) {
          clearTimeout(videoInfoTimer.current);
          setVideoInfo('');
          return;
        }

        const fps = isSharing
          ? await fullScreenUser.shareStatisticInfo.getFps()
          : await fullScreenUser.videoStatisticInfo.getFps();

        const height = isSharing
          ? await fullScreenUser.shareStatisticInfo.getHeight()
          : await fullScreenUser.videoStatisticInfo.getHeight();

        const width = isSharing
          ? await fullScreenUser.shareStatisticInfo.getWidth()
          : await fullScreenUser.videoStatisticInfo.getWidth();

        setVideoInfo(`${width}x${height} ${fps}FPS`);
        updateVideoInfo();
      }, 1000);
    };

    updateVideoInfo();

    return () => clearTimeout(videoInfoTimer.current);
  }, [fullScreenUser, users, isMounted, isSharing]);

  useEffect(() => {
    const sessionJoinListener = zoom.addListener(
      EventType.onSessionJoin,
      async (session) => {
        setIsInSession(true);
        toggleUI();
        zoom.session.getSessionName().then(setSessionName);
        const mySelf = new ZoomVideoSdkUser(session.mySelf);
        const remoteUsers = await zoom.session.getRemoteUsers();
        const muted = await mySelf.audioStatus.isMuted();
        const videoOn = await mySelf.videoStatus.isOn();
        const speakerOn = await zoom.audioHelper.getSpeakerStatus();
        const originalAspectRatio =
          await zoom.videoHelper.isOriginalAspectRatioEnabled();
        const videoMirrored = await zoom.videoHelper.isMyVideoMirrored();
        const isReceiveSpokenLanguageContent =
          await zoom.liveTranscriptionHelper.isReceiveSpokenLanguageContentEnabled();

        setUsersInSession([mySelf, ...remoteUsers]);
        setIsMuted(muted);
        setIsVideoOn(videoOn);
        setIsSpeakerOn(speakerOn);
        setFullScreenUser(mySelf);
        setIsOriginalAspectRatio(originalAspectRatio);
        setIsReceiveSpokenLanguageContentEnabled(
          isReceiveSpokenLanguageContent
        );
      }
    );

    const sessionLeaveListener = zoom.addListener(
      EventType.onSessionLeave,
      () => {
        setIsInSession(false);
        setShowBottomTab(false);
        setUsersInSession([]);
        navigation.goBack();
      }
    );

    const sessionNeedPasswordListener = zoom.addListener(
      EventType.onSessionNeedPassword,
      () => {
        Alert.alert('SessionNeedPassword');
      }
    );

    const sessionPasswordWrongListener = zoom.addListener(
      EventType.onSessionPasswordWrong,
      () => {
        Alert.alert('SessionPasswordWrong');
      }
    );

    const userVideoStatusChangedListener = zoom.addListener(
      EventType.onUserVideoStatusChanged,
      async ({ changedUsers }) => {
        const mySelf = new ZoomVideoSdkUser(await zoom.session.getMySelf());
        changedUsers.map((u) => {
          if (mySelf.userId === u.userId) {
            mySelf.videoStatus.isOn().then((on) => setIsVideoOn(on));
          }
        });
      }
    );

    const userAudioStatusChangedListener = zoom.addListener(
      EventType.onUserAudioStatusChanged,
      async ({ changedUsers }) => {
        const mySelf = new ZoomVideoSdkUser(await zoom.session.getMySelf());
        changedUsers.map((u) => {
          if (mySelf.userId === u.userId) {
            mySelf.audioStatus.isMuted().then((muted) => setIsMuted(muted));
          }
        });
      }
    );

    const userJoinListener = zoom.addListener(
      EventType.onUserJoin,
      async ({ remoteUsers }) => {
        if (!isMounted()) return;
        const mySelf = await zoom.session.getMySelf();
        const remote = remoteUsers.map((user) => new ZoomVideoSdkUser(user));
        setUsersInSession([mySelf, ...remote]);
      }
    );

    const userLeaveListener = zoom.addListener(
      EventType.onUserLeave,
      async ({ remoteUsers, leftUsers }) => {
        if (!isMounted()) return;
        const mySelf = await zoom.session.getMySelf();
        const remote = remoteUsers.map((user) => new ZoomVideoSdkUser(user));
        if (fullScreenUser) {
          leftUsers.map((user) => {
            if (fullScreenUser.userId === user.userId) {
              setFullScreenUser(mySelf);
              return;
            }
          });
        } else {
          setFullScreenUser(mySelf);
        }
        setUsersInSession([mySelf, ...remote]);
      }
    );

    const userNameChangedListener = zoom.addListener(
      EventType.onUserNameChanged,
      async ({ changedUser }) => {
        setUsersInSession(
          users.map((u) => {
            if (u && u.userId === changedUser.userId) {
              return new ZoomVideoSdkUser(changedUser);
            }
            return u;
          })
        );
      }
    );

    const userShareStatusChangeListener = zoom.addListener(
      EventType.onUserShareStatusChanged,
      async ({ user, status }) => {
        const shareUser = new ZoomVideoSdkUser(user);
        const mySelf = await zoom.session.getMySelf();

        if (user.userId && status === ShareStatus.Start) {
          setSharingUser(shareUser);
          setFullScreenUser(shareUser);
          setIsSharing(shareUser.userId === mySelf.userId);
        } else {
          setSharingUser(undefined);
          setIsSharing(false);
        }
      }
    );

    const userRecordingConsentListener = zoom.addListener(
      EventType.onUserRecordingConsent,
      async ({ user }) => {
        console.log(`userRecordingConsentListener: user= ${user.userName}`);
      }
    );

    const commandReceived = zoom.addListener(
      EventType.onCommandReceived,
      (params) => {
        console.log('sender: ', params?.sender, ', command: ', params?.command);
      }
    );

    const chatNewMessageNotify = zoom.addListener(
      EventType.onChatNewMessageNotify,
      (newMessage) => {
        if (!isMounted()) return;
        setChatMessages([
          new ZoomVideoSdkChatMessage(newMessage),
          ...chatMessages,
        ]);
      }
    );

    const chatDeleteMessageNotify = zoom.addListener(
      EventType.onChatDeleteMessageNotify,
      (params) => {
        console.log(
          'onChatDeleteMessageNotify: messageID: ',
          params?.messageID,
          ', deleteBy: ',
          params?.deleteBy
        );
      }
    );

    const liveStreamStatusChangeListener = zoom.addListener(
      EventType.onLiveStreamStatusChanged,
      ({ status }) => {
        console.log(`onLiveStreamStatusChanged: ${status}`);
      }
    );

    const liveTranscriptionStatusChangeListener = zoom.addListener(
      EventType.onLiveTranscriptionStatus,
      ({ status }) => {
        console.log(`onLiveTranscriptionStatus: ${status}`);
      }
    );

    const liveTranscriptionMsgInfoReceivedListener = zoom.addListener(
      EventType.onLiveTranscriptionMsgInfoReceived,
      ({ messageInfo }) => {
        console.log(messageInfo);
        const message = new ZoomVideoSdkLiveTranscriptionMessageInfo(
          messageInfo
        );
        console.log(
          `onLiveTranscriptionMsgInfoReceived: ${message.messageContent}`
        );
      }
    );

    const originalLanguageMsgInfoReceivedListener = zoom.addListener(
      EventType.onOriginalLanguageMsgReceived,
      ({ messageInfo }) => {
        console.log(messageInfo);
        const message = new ZoomVideoSdkLiveTranscriptionMessageInfo(
          messageInfo
        );
        console.log(`onOriginalLanguageMsgReceived: ${message.messageContent}`);
      }
    );

    const cloudRecordingStatusListener = zoom.addListener(
      EventType.onCloudRecordingStatus,
      async ({ status }) => {
        console.log(`cloudRecordingStatusListener: ${status}`);
        const mySelf = await zoom.session.getMySelf();
        if (status === RecordingStatus.Start) {
          if (!mySelf.isHost) {
            const options = [
              {
                text: 'accept',
                onPress: async () => {
                  await zoom.acceptRecordingConsent();
                },
              },
              {
                text: 'decline',
                onPress: async () => {
                  const mySelf = await zoom.session.getMySelf();
                  const currentConsentType =
                    await zoom.getRecordingConsentType();
                  if (
                    currentConsentType === ConsentType.ConsentType_Individual
                  ) {
                    await zoom.declineRecordingConsent();
                  } else {
                    await zoom.declineRecordingConsent();
                    zoom.leaveSession(false);
                  }
                },
              },
            ];
            Alert.alert('The session is being recorded.', '', options, {
              cancelable: true,
            });
          }
          setIsRecordingStarted(true);
        } else {
          setIsRecordingStarted(false);
        }
      }
    );

    const networkStatusChangeListener = zoom.addListener(
      EventType.onUserVideoNetworkStatusChanged,
      async ({ user, status }) => {
        const networkUser = new ZoomVideoSdkUser(user);
        if (status == NetworkStatus.Bad) {
          console.log(
            `onUserVideoNetworkStatusChanged: status= ${status}, user= ${networkUser.userName}`
          );
        }
      }
    );

    const inviteByPhoneStatusListener = zoom.addListener(
      EventType.onInviteByPhoneStatus,
      (params) => {
        console.log(params);
        console.log('status: ', params?.status, ', reason: ', params?.reason);
      }
    );

    const multiCameraStreamStatusChangedListener = zoom.addListener(
      EventType.onMultiCameraStreamStatusChanged,
      ({ status, changedUser }) => {
        users.map((u) => {
          if (changedUser.userId === u.userId) {
            if (status === MultiCameraStreamStatus.Joined) {
              u.hasMultiCamera = true;
            } else if (status === MultiCameraStreamStatus.Left) {
              u.hasMultiCamera = false;
            }
          }
        });
      }
    );

    const requireSystemPermission = zoom.addListener(
      EventType.onRequireSystemPermission,
      ({ permissionType }) => {
        switch (permissionType) {
          case SystemPermissionType.Camera:
            Alert.alert(
              "Can't Access Camera",
              'please turn on the toggle in system settings to grant permission'
            );
            break;
          case SystemPermissionType.Microphone:
            Alert.alert(
              "Can't Access Camera",
              'please turn on the toggle in system settings to grant permission'
            );
            break;
        }
      }
    );

    const eventErrorListener = zoom.addListener(
      EventType.onError,
      async (error) => {
        console.log('Error: ', JSON.stringify(error));
        switch (error.errorType) {
          case Errors.SessionJoinFailed:
            Prompt.show({
              subTitle: 'Please try again!',
              title: 'Failed to Join the Meeting',
            });
            setTimeout(() => navigation.goBack(), 1000);
            break;
          default:
        }
      }
    );

    const callCRCDeviceStatusListener = zoom.addListener(
      EventType.onCallCRCDeviceStatusChanged,
      (params) => {
        console.log('callCRCDeviceStatus: ', params?.status);
      }
    );

    const chatPrivilegeChangedListener = zoom.addListener(
      EventType.onChatPrivilegeChanged,
      (params) => {
        console.log('ZoomVideoSdkCRCProtocolType: ', params?.privilege);
      }
    );

    return () => {
      sessionJoinListener.remove();
      sessionLeaveListener.remove();
      sessionPasswordWrongListener.remove();
      sessionNeedPasswordListener.remove();
      userVideoStatusChangedListener.remove();
      userAudioStatusChangedListener.remove();
      userRecordingConsentListener.remove();
      userJoinListener.remove();
      userLeaveListener.remove();
      userNameChangedListener.remove();
      userShareStatusChangeListener.remove();
      chatNewMessageNotify.remove();
      liveStreamStatusChangeListener.remove();
      cloudRecordingStatusListener.remove();
      inviteByPhoneStatusListener.remove();
      eventErrorListener.remove();
      commandReceived.remove();
      chatDeleteMessageNotify.remove();
      liveTranscriptionStatusChangeListener.remove();
      liveTranscriptionMsgInfoReceivedListener.remove();
      multiCameraStreamStatusChangedListener.remove();
      requireSystemPermission.remove();
      networkStatusChangeListener.remove();
      callCRCDeviceStatusListener.remove();
      originalLanguageMsgInfoReceivedListener.remove();
      chatPrivilegeChangedListener.remove();
    };
  }, [zoom, route, users, chatMessages, isMounted]);

  const keyboardHeightChange = (isOpen, height) => {
    if (!isOpen) {
      scaleChatSend(false);
      chatInputRef.current?.clear();
    }
    setIsKeyboardOpen(!isOpen);
    setContentHeight(windowHeight - height);
  };

  // onPress event for FlatList since RN doesn't provide container-on-press event
  const onListTouchStart = () => {
    touchTimer = setTimeout(() => {
      setIsLongTouch(true);
    }, 200);
  };

  // onPress event for FlatList since RN doesn't provide container-on-press event
  const onListTouchEnd = (event) => {
    // Toggle UI behavior
    // - Toggle only when user list or chat list is tapped
    // - Block toggling when tapping on a list item
    // - Block toggling when keyboard is shown
    if (event._targetInst.elementType.includes('Scroll') && isKeyboardOpen) {
      !isLongTouchRef.current && toggleUI();
    }
    clearTimeout(touchTimer);
    setIsLongTouch(false);
  };

  const uiOpacityAnimatedStyle = useAnimatedStyle(() => ({
    opacity: uiOpacity.value,
  }));

  const inputOpacityAnimatedStyle = useAnimatedStyle(() => ({
    opacity: inputOpacity.value,
  }));

  const chatSendButtonScaleAnimatedStyle = useAnimatedStyle(() => ({
    width: 38 * chatSendButtonScale.value,
    marginLeft: 8 * chatSendButtonScale.value,
    transform: [{ scale: chatSendButtonScale.value }],
  }));

  const toggleUI = () => {
    const easeIn = Easing.in(Easing.exp);
    const easeOut = Easing.out(Easing.exp);
    uiOpacity.value = withTiming(uiOpacity.value === 0 ? 100 : 0, {
      duration: 300,
      easing: uiOpacity.value === 0 ? easeIn : easeOut,
    });
    inputOpacity.value = withTiming(inputOpacity.value === 0 ? 100 : 0, {
      duration: 300,
      easing: inputOpacity.value === 0 ? easeIn : easeOut,
    });
    setTimeout(() => {
      setShowBottomTab((prev) => !prev);
    }, 100);
  };

  const sendChatMessage = async () => {
    chatInputRef.current?.clear();
    await zoom.chatHelper.sendChatToAll(chatMessage);
    setChatMessage('');
    // send the chat as a command
    zoom.cmdChannel.sendCommand(null, chatMessage);
  };

  const scaleChatSend = (show) => {
    const easeIn = Easing.in(Easing.exp);
    const easeOut = Easing.out(Easing.exp);
    chatSendButtonScale.value = withTiming(show ? 1 : 0, {
      duration: 500,
      easing: show ? easeIn : easeOut,
    });
  };

  const deleteChatMessage = async (msgId, message) => {
    const canBeDelete = await zoom.chatHelper.canChatMessageBeDeleted(msgId);
    if (canBeDelete === true || msgId == null) {
      const error = await zoom.chatHelper.deleteChatMessage(msgId);
      if (error === Errors.Success) {
        const chatIndex = chatMessages.indexOf(message);
        chatMessages.splice(chatIndex, 1);
        setRefreshFlatList(!refreshFlatlist);
      } else {
        Alert.alert(error);
      }
    } else {
      Alert.alert('Message could not be deleted');
    }
  };

  const leaveSession = (endSession) => {
    zoom.leaveSession(endSession);
    navigation.goBack();
  };

  const onPressAudio = async () => {
    const mySelf = await zoom.session.getMySelf();
    const muted = await mySelf.audioStatus.isMuted();
    muted
      ? await zoom.audioHelper.unmuteAudio(mySelf.userId)
      : await zoom.audioHelper.muteAudio(mySelf.userId);
  };

  const onPressVideo = async () => {
    const mySelf = await zoom.session.getMySelf();
    const videoOn = await mySelf.videoStatus.isOn();
    videoOn
      ? await zoom.videoHelper.stopVideo()
      : await zoom.videoHelper.startVideo();
  };

  const onPressShare = async () => {
    const isOtherSharing = await zoom.shareHelper.isOtherSharing();
    const isShareLocked = await zoom.shareHelper.isShareLocked();

    if (isOtherSharing) {
      Alert.alert('Other is sharing');
    } else if (isShareLocked) {
      Alert.alert('Share is locked by host');
    } else if (isSharing) {
      zoom.shareHelper.stopShare();
    } else {
      zoom.shareHelper.shareScreen();
    }
  };

  const onPressMore = async () => {
    const mySelf = await zoom.session.getMySelf();
    const isShareLocked = await zoom.shareHelper.isShareLocked();
    const isFullScreenUserManager = await fullScreenUser?.getIsManager();
    const canSwitchSpeaker = await zoom.audioHelper.canSwitchSpeaker();
    const canStartRecording = await zoom.recordingHelper.canStartRecording();
    const isSupportPhoneFeature =
      await zoom.phoneHelper.isSupportPhoneFeature();
    const startLiveTranscription =
      (await zoom.liveTranscriptionHelper.getLiveTranscriptionStatus()) ===
      LiveTranscriptionStatus.Start;
    const canCallOutToCRC = await zoom.CRCHelper.isCRCEnabled();
    let options = [
      {
        text: `Mirror the video`,
        onPress: async () => {
          await zoom.videoHelper.mirrorMyVideo(!isVideoMirrored);
          setIsVideoMirrored(await zoom.videoHelper.isMyVideoMirrored());
        },
      },
      {
        text: `${startLiveTranscription ? 'Stop' : 'Start'} Live Transcription`,
        onPress: async () => {
          const canStartLiveTranscription =
            await zoom.liveTranscriptionHelper.canStartLiveTranscription();
          if (canStartLiveTranscription === true) {
            if (startLiveTranscription) {
              const error =
                await zoom.liveTranscriptionHelper.stopLiveTranscription();
              console.log('stopLiveTranscription= ' + error);
            } else {
              const error =
                await zoom.liveTranscriptionHelper.startLiveTranscription();
              console.log('startLiveTranscription= ' + error);
            }
          } else {
            Alert.alert('Live transcription not supported');
          }
        },
      },
      {
        text: `${
          isReceiveSpokenLanguageContentEnabled ? 'Disable' : 'Enable'
        } receiving original caption`,
        onPress: async () => {
          await zoom.liveTranscriptionHelper.enableReceiveSpokenLanguageContent(
            !isReceiveSpokenLanguageContentEnabled
          );
          setIsReceiveSpokenLanguageContentEnabled(
            await zoom.liveTranscriptionHelper.isReceiveSpokenLanguageContentEnabled()
          );
          console.log(
            'isReceiveSpokenLanguageContentEnabled = ' +
              isReceiveSpokenLanguageContentEnabled
          );
        },
      },
      // { text: 'Switch Camera', onPress: () => zoom.videoHelper.switchCamera() },
      // {
      //   text: `${
      //     isOriginalAspectRatio ? 'Enable' : 'Disable'
      //   } original aspect ratio`,
      //   onPress: async () => {
      //     await zoom.videoHelper.enableOriginalAspectRatio(
      //       !isOriginalAspectRatio
      //     );
      //     setIsOriginalAspectRatio(
      //       await zoom.videoHelper.isOriginalAspectRatioEnabled()
      //     );
      //     console.log('isOriginalAspectRatio= ' + isOriginalAspectRatio);
      //   },
      // },
      {
        text: `Get Session Dial-in Number infos`,
        onPress: async () => {
          console.log(
            'session number= ' + (await zoom.session.getSessionNumber())
          );
        },
      },
      // { text: 'Switch Camera', onPress: () => zoom.videoHelper.switchCamera() },
      // {
      //   text: `${isMicOriginalOn ? 'Disable' : 'Enable'} Original Sound`,
      //   onPress: async () => {
      //     await zoom.audioSettingHelper.enableMicOriginalInput(
      //       !isMicOriginalOn
      //     );
      //     console.log(
      //       `Original sound ${isMicOriginalOn ? 'Disabled' : 'Enabled'}`
      //     );
      //     setIsMicOriginalOn(!isMicOriginalOn);
      //   },
      // },
      // {
      //   text: 'Change chat privilege',
      //   onPress: async () => {
      //     await zoom.chatHelper.changeChatPrivilege(
      //       ZoomVideoSDKChatPrivilegeType.ZoomVideoSDKChatPrivilege_Publicly
      //     );
      //   },
      // },
    ];

    if (isSharing) {
      options = [
        {
          text: `${
            isShareDeviceAudio ? 'Disable' : 'Enable'
          } share device audio when sharing screen.`,
          onPress: async () => {
            const result = zoom.shareHelper.enableShareDeviceAudio(
              !isShareDeviceAudio
            );
            setIsShareDeviceAudio(!isShareDeviceAudio);
          },
        },
        ...options,
      ];
    }

    if (canCallOutToCRC) {
      options = [
        {
          text: `Call-out to CRC devices`,
          onPress: async () => {
            const result = await zoom.CRCHelper.callCRCDevice(
              'bjn.vc',
              ZoomVideoSdkCRCProtocolType.ZoomVideoSDKCRCProtocol_H323
            );
            console.log('CRC result= ' + result);
          },
        },
        {
          text: `Cancel call-out to CRC devices`,
          onPress: async () => {
            const result = await zoom.CRCHelper.cancelCallCRCDevice();
            console.log('cancel result= ' + result);
          },
        },
        ...options,
      ];
    }

    if (isSupportPhoneFeature) {
      options = [
        ...options,
        {
          text: `Invite By Phone`,
          onPress: async () => {
            console.log(await zoom.phoneHelper.getSupportCountryInfo());
            zoom.phoneHelper.inviteByPhone(
              '<Country Code>',
              '<Phone Number>',
              '<Display Name>'
            );
          },
        },
      ];
    }

    if (canSwitchSpeaker) {
      options = [
        ...options,
        {
          text: `Turn ${isSpeakerOn ? 'off' : 'on'} Speaker`,
          onPress: toggleSpeaker,
        },
      ];
    }

    /*
      if (mySelf.isHost) {
        options = [
          ...options,
          {
            text: `${isShareLocked ? 'Unlock' : 'Lock'} Share`,
            onPress: () => zoom.shareHelper.lockShare(!isShareLocked),
          },
          {
            text: `${isFullScreenUserManager ? 'Revoke' : 'Make'} Manager`,
            onPress: () => {
              fullScreenUser &&
                (isFullScreenUserManager
                  ? zoom.userHelper.revokeManager(fullScreenUser.userId)
                  : zoom.userHelper.makeManager(fullScreenUser.userId));
            },
          },
          {
            text: 'Change Name',
            onPress: () => setIsRenameModalVisible(true),
          },
        ];

        if (canStartRecording) {
          options = [
            {
              text: `${isRecordingStarted ? 'Stop' : 'Start'} Recording`,
              onPress: async () => {
                if (!isRecordingStarted) {
                  await zoom.recordingHelper.startCloudRecording();
                } else {
                  await zoom.recordingHelper.stopCloudRecording();
                }
              },
            },
            ...options,
          ];
        }
      }
    */

    // if (Platform.OS === 'ios') {
    //   options = [
    //     ...options,
    //     {
    //       text: `${isPiPViewEnabled ? 'Disable' : 'Enable'} PiP view`,
    //       onPress: () => {
    //         setIsPiPViewEnabled(!isPiPViewEnabled);
    //       },
    //     },
    //   ];
    // }

    setOnMoreOptions(options);
    setModalVisible(true);
  };

  const toggleSpeaker = async () => {
    try {
      if (!isSpeakerOn) {
        zoom.audioHelper.startAudio();
      } else {
        zoom.audioHelper.stopAudio();
      }
      // await zoom.audioHelper.setSpeaker(!isSpeakerOn);
      setIsSpeakerOn(!isSpeakerOn);
    } catch (error) {
      console.log('toggleSpeaker', error);
    }
  };

  const SwitchCamera = async () => {
    await zoom.videoHelper.switchCamera();
    setCameraReverse((prev) => !prev);
  };

  const onPressLeave = async () => {
    const mySelf = await zoom.session.getMySelf();
    const options = [
      {
        text: 'Leave Session',
        onPress: () => leaveSession(false),
      },
    ];

    if (mySelf.isHost) {
      options.unshift({
        text: 'End Session',
        onPress: () => leaveSession(true),
      });
    }

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', ...options.map((option) => option.text)],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex !== 0) {
            options[buttonIndex - 1].onPress();
          }
        }
      );
    } else {
      Alert.alert('Do you want to leave this session?', '', options, {
        cancelable: true,
      });
    }
  };

  const onInfoPress = () => {
    setShowInfo((prev) => !prev);
  };

  const onSelectedUser = async (selectedUser) => {
    var userIsSharing;
    if (selectedUser != null && selectedUser.isSharing != null) {
      userIsSharing = selectedUser.isSharing;
    } else {
      userIsSharing = false;
    }

    const options = [
      {
        text: 'Current volume',
        onPress: async () => {
          console.log('user volume');
          const userVolume = await selectedUser.getUserVolume(
            selectedUser.userId,
            userIsSharing
          );
          console.log(
            'user ' + selectedUser.userId + "'s volume is " + userVolume
          );
        },
      },
      {
        text: 'Volume up',
        onPress: async () => {
          var canSetVolume = await selectedUser.canSetUserVolume(
            selectedUser.userId,
            userIsSharing
          );
          if (canSetVolume) {
            var userVolume = await selectedUser.getUserVolume(
              selectedUser.userId,
              userIsSharing
            );
            if (userVolume < 10) {
              var updatedVolume = userVolume + 1;
              await selectedUser.setUserVolume(
                selectedUser.userId,
                userIsSharing,
                updatedVolume
              );
            } else {
              Alert.alert('Cannot volume up.');
            }
          } else {
            Alert.alert('Volume change not authorized!');
          }
        },
      },
      {
        text: 'Volume down',
        onPress: async () => {
          var canSetVolume = await selectedUser.canSetUserVolume(
            selectedUser.userId,
            userIsSharing
          );
          if (canSetVolume) {
            var userVolume = await selectedUser.getUserVolume(
              selectedUser.userId,
              userIsSharing
            );
            if (userVolume > 0) {
              var updatedVolume = userVolume - 1;
              await selectedUser.setUserVolume(
                selectedUser.userId,
                userIsSharing,
                updatedVolume
              );
            } else {
              Alert.alert('Cannot volume down.');
            }
          } else {
            Alert.alert('Volume change not authorized!');
          }
        },
      },
    ];
    Alert.alert('Volume options', '', options, { cancelable: true });
  };

  const contentStyles = {
    ...styles.container,
    height: contentHeight,
  };

  return (
    <View style={contentStyles}>
      <View style={styles.fullScreenVideo}>
        <VideoView
          preview={false}
          fullScreen={true}
          user={fullScreenUser}
          hasMultiCamera={false}
          multiCameraIndex={'0'}
          isPiPView={isPiPViewEnabled}
          onPress={() => {
            isKeyboardOpen ? toggleUI() : Keyboard.dismiss();
          }}
          sharing={fullScreenUser?.userId === sharingUser?.userId}
        />
      </View>

      <LinearGradient
        colors={[
          Colors.black060,
          Colors.transparent,
          Colors.transparent,
          Colors.black060,
        ]}
        pointerEvents='none'
        locations={[0, 0.12, 0.88, 1]}
        style={styles.fullScreenVideo}
      />

      <View style={styles.safeArea} pointerEvents='box-none'>
        <Animated.View
          style={[styles.contents, uiOpacityAnimatedStyle]}
          pointerEvents='box-none'
        >
          <View
            style={[
              styles.headerView,
              {
                paddingTop: normalizeHeight(
                  topInset || StatusBar.currentHeight
                ),
              },
            ]}
            pointerEvents='box-none'
          >
            <View style={styles.headerViewBtnWrapper}>
              <Button
                title={false}
                onPress={SwitchCamera}
                containerStyle={styles.backBtn}
                Icon={() => (
                  <CameraReverse
                    width={normalize(25)}
                    height={normalize(25)}
                    fill={cameraReverse ? Colors.silver : Colors.white}
                  />
                )}
              />
              <Button
                title={false}
                onPress={toggleSpeaker}
                containerStyle={styles.backBtn}
                Icon={() =>
                  isSpeakerOn ? (
                    <VolumeHigh
                      fill={Colors.success}
                      width={normalize(25)}
                      height={normalize(25)}
                    />
                  ) : (
                    <VolumeMute
                      fill={Colors.error}
                      width={normalize(25)}
                      height={normalize(25)}
                    />
                  )
                }
              />
            </View>
            <Pressable onPress={onInfoPress} style={styles.infoBtn}>
              <Text style={styles.infoBtnText}>Idanim</Text>
              <ShieldCheckMark
                fill={Colors.success}
                width={normalize(18)}
                height={normalize(18)}
              />
            </Pressable>
            <Pressable onPress={onPressLeave} style={styles.leaveButton}>
              <Text style={styles.leaveText}>End</Text>
            </Pressable>
          </View>

          <View style={styles.middleWrapper} pointerEvents='box-none'>
            {/* Chat Message Code     
            <FlatList
              inverted
              data={chatMessages}
              fadingEdgeLength={50}
              extraData={refreshFlatlist}
              onTouchEnd={onListTouchEnd}
              onTouchStart={onListTouchStart}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.chatList}
              keyExtractor={(item, index) =>
                `${String(item.timestamp)}${index}`
              }
              renderItem={({ item }) => (
                <View>
                  <View style={styles.chatMessage}>
                    <Text style={styles.chatUser}>
                      {item.senderUser.userName}:
                    </Text>
                    <Text style={styles.chatContent}> {item.content}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                      Alert.alert('Delete Message', 'Delete this message?', [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'OK',
                          onPress: () => {
                            deleteChatMessage(item.messageID, item);
                          },
                        },
                      ]);
                    }}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
             */}
          </View>
        </Animated.View>

        <View
          pointerEvents='box-none'
          style={styles.bottomWrapper(showBottomTab)}
        >
          {isInSession && isKeyboardOpen && (
            <FlatList
              horizontal
              data={users}
              extraData={users}
              snapToInterval={100}
              decelerationRate={0}
              fadingEdgeLength={50}
              style={styles.userList}
              snapToAlignment='center'
              onTouchEnd={onListTouchEnd}
              onTouchStart={onListTouchStart}
              keyExtractor={(item) => item.userId}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.userListContentContainer}
              renderItem={({ item }) => (
                <VideoView
                  user={item}
                  key={item.userId}
                  focused={item.userId === fullScreenUser?.userId}
                  onPress={(selectedUser) => setFullScreenUser(selectedUser)}
                  onLongPress={(selectedUser) => onSelectedUser(selectedUser)}
                />
              )}
            />
          )}

          {/*
          Chat Message Input Box   
           <Animated.View style={inputOpacityAnimatedStyle}>
            <View style={styles.chatInputWrapper}>
              <TextInput
                ref={chatInputRef}
                style={styles.chatInput}
                placeholder='Type comment'
                onSubmitEditing={sendChatMessage}
                onChangeText={(text) => {
                  scaleChatSend(text.length !== 0);
                  setChatMessage(text);
                }}
                placeholderTextColor={Colors.hit_grey}
              />
              <Animated.View
                style={[
                  chatSendButtonScaleAnimatedStyle,
                  styles.chatSendButton,
                ]}
              >
                <Button
                  title={false}
                  onPress={sendChatMessage}
                  containerStyle={styles.controlBtnStyle}
                  Icon={() => (
                    <Send
                      fill={Colors.error}
                      width={normalize(20)}
                      height={normalize(20)}
                    />
                  )}
                />
              </Animated.View>
            </View>
          </Animated.View>
           */}
        </View>

        <Modal
          visible={showInfo}
          transparent={true}
          animationType='fade'
          statusBarTranslucent
        >
          <View style={styles.modalWrapper}>
            <TouchableWithoutFeedback onPress={onInfoPress}>
              <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>
            <View style={styles.infoModalView}>
              <Text style={styles.titleText}>Meeting and User Info</Text>
              <Pressable
                style={styles.textWrapper}
                onPress={() => Clipboard.setString(sessionName)}
              >
                <Text style={styles.headerText}>Meeting Id</Text>
                <Text style={styles.subText}>{sessionName}</Text>
              </Pressable>
              <Pressable
                style={styles.textWrapper}
                onPress={() =>
                  Clipboard.setString(route.params.sessionPassword)
                }
              >
                <Text style={styles.headerText}>Password</Text>
                <Text style={styles.subText}>
                  {route.params.sessionPassword || ''}
                </Text>
              </Pressable>
              <View style={styles.textWrapper}>
                <Text style={styles.headerText}>Participants</Text>
                <Text style={styles.subText}>{users.length}</Text>
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.headerText}>
                  {'FPS  (require more than 1 participants)'}
                </Text>
                <Text style={styles.subText}>{videoInfo || '-'}</Text>
              </View>
              <Pressable onPress={onInfoPress} style={styles.infoCloseBtn}>
                <Text style={styles.infoCloseBtnText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal
          transparent={true}
          animationType='fade'
          statusBarTranslucent
          visible={isRenameModalVisible}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <Text style={styles.modalTitleText}>Change Name</Text>
              <TextInput
                placeholder='New name'
                style={styles.renameInput}
                placeholderTextColor={Colors.hit_grey}
                onChangeText={(text) => setNewName(text)}
              />
              <View style={styles.modalActionContainer}>
                <Pressable
                  style={styles.modalActionApply}
                  onPress={() => {
                    if (fullScreenUser) {
                      zoom.userHelper.changeName(
                        newName,
                        fullScreenUser.userId
                      );
                      setNewName('');
                      setIsRenameModalVisible(false);
                    }
                  }}
                >
                  <Text style={styles.modalActionApplyText}>Apply</Text>
                </Pressable>
                <Pressable
                  style={styles.modalAction}
                  onPress={() => {
                    setNewName('');
                    setIsRenameModalVisible(false);
                  }}
                >
                  <Text style={styles.modalActionText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          transparent={true}
          animationType='fade'
          statusBarTranslucent
          visible={modalVisible}
        >
          <View style={styles.moreListWrapper}>
            <View style={styles.moreList}>
              {onMoreOptions.map((option, index) => (
                <View key={index} style={styles.moreItemWrapper}>
                  <Pressable
                    key={index}
                    onPress={() => {
                      option.onPress();
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.moreItemText}>{option.text}</Text>
                  </Pressable>
                </View>
              ))}
              <View style={styles.cancelButton}>
                <Pressable onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <KeyboardArea
          isOpen={false}
          style={styles.keyboardArea}
          onChange={keyboardHeightChange}
        />

        {!isInSession && (
          <View style={styles.connectingWrapper}>
            <Loader size={normalize(24)} color={Colors.white} />
            <Text style={styles.connectingText}>Connecting...</Text>
          </View>
        )}
        {showBottomTab && (
          <BottomTabView
            isMuted={!isMuted}
            isVideoOn={isVideoOn}
            isSharing={isSharing}
            onPressMore={onPressMore}
            onPressAudio={onPressAudio}
            onPressVideo={onPressVideo}
            onPressShare={onPressShare}
            isRecordingStarted={isRecordingStarted}
          />
        )}
      </View>
    </View>
  );
};

export default Call;

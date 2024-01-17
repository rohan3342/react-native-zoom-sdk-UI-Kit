import {
  useZoom,
  ZoomView,
  EventType,
  VideoAspect,
} from '@zoom/react-native-videosdk';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';

import styles from './styles';
import useIsMounted from '../../hooks/useIsMounted';
import { normalize } from '../../styles/responsive';
import { Avatar, Volume, VolumeMute } from '../../assets/SVG';

const SHOW_TALKING_ICON_DURATION = 2000;

function VideoView(props) {
  const {
    user,
    preview,
    sharing,
    focused,
    onPress,
    isPiPView,
    fullScreen,
    videoAspect,
    onLongPress,
    hasMultiCamera,
    multiCameraIndex,
  } = props;

  const zoom = useZoom();
  const isMounted = useIsMounted();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isTalking, setIsTalking] = useState(false);

  useEffect(() => {
    const updateVideoStatus = () => {
      if (!user) return;
      (async () => {
        isMounted() && setIsVideoOn(await user.videoStatus.isOn());
      })();
    };

    const resetAudioStatus = () => {
      setIsTalking(false);
      setIsMuted(false);
    };

    const updateAudioStatus = async () => {
      if (!isMounted()) return;
      const muted = await user?.audioStatus.isMuted();
      const talking = await user?.audioStatus.isTalking();
      setIsMuted(muted);
      setIsTalking(talking);
      if (talking) {
        setTimeout(() => {
          isMounted() && setIsTalking(false);
        }, SHOW_TALKING_ICON_DURATION);
      }
    };

    updateVideoStatus();

    const userVideoStatusChangedListener = zoom.addListener(
      EventType.onUserVideoStatusChanged,
      async ({ changedUsers }) => {
        changedUsers.map((u) => {
          if (user && u.userId === user.userId) {
            updateVideoStatus();
            return;
          }
        });
      }
    );

    const userAudioStatusChangedListener = zoom.addListener(
      EventType.onUserAudioStatusChanged,
      async ({ changedUsers }) => {
        changedUsers.map((u) => {
          if (user && u.userId === user.userId) {
            (async () => {
              if (!isMounted()) return;
              resetAudioStatus();
              await updateAudioStatus();
            })();
            return;
          }
        });
      }
    );

    const userActiveAudioChangedListener = zoom.addListener(
      EventType.onUserActiveAudioChanged,
      async ({ changedUsers }) => {
        changedUsers.map((u) => {
          if (user && u.userId === user.userId) {
            (async () => {
              if (!isMounted()) return;
              await updateAudioStatus();
            })();
            return;
          }
        });
      }
    );

    return () => {
      userVideoStatusChangedListener.remove();
      userAudioStatusChangedListener.remove();
      userActiveAudioChangedListener.remove();
    };
  }, [zoom, user, isMounted]);

  if (!user) return null;
  const smallView = [styles.smallView, focused && styles.focusedBorder];
  const containerStyle = fullScreen ? styles.fullScreen : smallView;
  const avatarStyle = fullScreen ? styles.avatarLarge : styles.avatarSmall;
  const aspect = videoAspect || VideoAspect.PanAndScan;

  return (
    <TouchableWithoutFeedback
      onPress={() => onPress(user)}
      onLongPress={() => onLongPress(user)}
    >
      <View style={containerStyle}>
        {isVideoOn || sharing ? (
          <ZoomView
            sharing={sharing}
            preview={preview}
            userId={user.userId}
            videoAspect={aspect}
            isPiPView={isPiPView}
            style={styles.zoomView}
            fullScreen={fullScreen}
            hasMultiCamera={hasMultiCamera}
            multiCameraIndex={multiCameraIndex}
          />
        ) : (
          <Avatar width={avatarStyle?.width} height={avatarStyle?.height} />
        )}
        {!fullScreen && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.userName}</Text>
            {isTalking && (
              <Volume width={normalize(12)} height={normalize(12)} />
            )}
            {isMuted && (
              <VolumeMute width={normalize(12)} height={normalize(12)} />
            )}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

export default VideoView;

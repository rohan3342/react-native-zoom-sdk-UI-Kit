import {
  View,
  Text,
  Image,
  Alert,
  Platform,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {
  RESULTS,
  PERMISSIONS,
  openSettings,
  checkMultiple,
  requestMultiple,
} from 'react-native-permissions';
import React, { useEffect } from 'react';
import Carousel from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import { EventType, useZoom } from '@zoom/react-native-videosdk';

import styles from './styles';
import PaginationItem from '../../components/PaginationItem';

const introImages = [
  require('../../assets/IMG/intro-image2.png'),
  require('../../assets/IMG/intro-image3.png'),
  require('../../assets/IMG/intro-image4.png'),
  require('../../assets/IMG/intro-image5.png'),
  require('../../assets/IMG/intro-image6.png'),
];

// TODO: Enable photo library permission when sharing view is done.
const platformPermissions = {
  ios: [
    PERMISSIONS.IOS.CAMERA,
    PERMISSIONS.IOS.MICROPHONE,
    //PERMISSIONS.IOS.PHOTO_LIBRARY,
  ],
  android: [
    PERMISSIONS.ANDROID.CAMERA,
    PERMISSIONS.ANDROID.RECORD_AUDIO,
    PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
    PERMISSIONS.ANDROID.READ_PHONE_STATE,
    PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  ],
};

const modeConfig = {
  parallaxScrollingScale: 0.9,
  parallaxScrollingOffset: 50,
};

function IntroScreen({ navigation }) {
  const zoom = useZoom();
  const introIndex = useSharedValue(0);
  const carouselWidth = useWindowDimensions().width;

  useEffect(() => {
    const permissions = platformPermissions[Platform.OS];
    let blockedAny = false;
    let notGranted = [];

    checkMultiple(permissions).then((statuses) => {
      permissions.map((p) => {
        const status = statuses[p];
        if (status === RESULTS.BLOCKED) {
          blockedAny = true;
        } else if (status !== RESULTS.GRANTED) {
          notGranted.push(p);
        }
      });
      notGranted.length && requestMultiple(notGranted);
      blockedAny && openSettings();
    });

    const inputProxyAccount = zoom.addListener(
      EventType.onProxySettingNotification,
      () => {
        Alert.alert(
          'You are using a proxy, please open your browser to login.'
        );
      }
    );

    const sslCertVerifiedFailNotification = zoom.addListener(
      EventType.onSSLCertVerifiedFailNotification,
      () => {
        Alert.alert('SSL Certificate Verify Fail Notification.');
      }
    );

    return () => {
      inputProxyAccount.remove();
      sslCertVerifiedFailNotification.remove();
    };
  }, []);

  function onProgressChange(_, index) {
    if (Number.isInteger(index)) {
      introIndex.value = index;
    }
  }

  function renderItem({ item }) {
    return <Image style={styles.introImage} source={item} />;
  }

  return (
    <ImageBackground
      style={styles.container}
      source={require('../../assets/IMG/intro-bg.png')}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.topWrapper}>
          {!!introIndex && (
            <View style={styles.dotsContainer}>
              {introImages.map((_, index) => {
                return (
                  <PaginationItem
                    key={index}
                    index={index}
                    activeDot={introIndex}
                    width={carouselWidth / 40}
                    length={introImages.length}
                  />
                );
              })}
            </View>
          )}
        </View>
        <Carousel
          loop
          autoPlay={false}
          mode={'parallax'}
          snapEnabled={true}
          data={introImages}
          pagingEnabled={true}
          width={carouselWidth}
          modeConfig={modeConfig}
          renderItem={renderItem}
          height={carouselWidth * 2}
          scrollAnimationDuration={500}
          onProgressChange={onProgressChange}
        />
        <View style={styles.bottomWrapper} pointerEvents='box-none'>
          <Image source={require('../../assets/IMG/curve-mask.png')} />
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              disabled={true}
              activeOpacity={0.8}
              style={styles.joinButton}
            >
              <Text style={styles.joinText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.guestButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.guestText}>Join a Meeting</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

export default IntroScreen;

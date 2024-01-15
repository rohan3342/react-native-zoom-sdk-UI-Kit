import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import styles from './styles';
import Colors from '../../styles/colors';
import Button from '../../components/Button';
import { normalize } from '../../styles/responsive';
import useLightStatusBar from '../../hooks/useLightStatusBar';
import { VideoCam, Add, Calendar, ShareScreen } from '../../assets/SVG';

const Home = (props) => {
  const topInset = useSafeAreaInsets().top;
  useLightStatusBar(false, Colors.tertiary);

  const ButtonData = useMemo(() => [
    {
      title: 'New Meeting',
      titleStyle: styles.titleStyle,
      containerStyle: styles.containerStyle,
      onPress: () => props?.navigation?.navigate('Join'),
      Icon: () => (
        <View
          style={[styles.iconContainer, { backgroundColor: Colors.orange }]}
        >
          <VideoCam width={normalize(30)} height={normalize(30)} />
        </View>
      ),
    },
    {
      title: 'Join',
      titleStyle: styles.titleStyle,
      containerStyle: styles.containerStyle,
      onPress: () => props?.navigation?.navigate('Join', { isJoin: true }),
      Icon: () => (
        <View
          style={[styles.iconContainer, { backgroundColor: Colors.primary }]}
        >
          <View style={styles.iconView}>
            <Add
              fill={Colors.primary}
              width={normalize(26)}
              height={normalize(26)}
            />
          </View>
        </View>
      ),
    },
    {
      disabled: true,
      title: 'Schedule',
      Icon: () => (
        <View
          style={[
            styles.iconContainer,
            {
              opacity: 0.5,
              backgroundColor: Colors.primary,
            },
          ]}
        >
          <Calendar
            width={normalize(30)}
            height={normalize(30)}
            fill={Colors.secondary}
          />
        </View>
      ),
      containerStyle: styles.containerStyle,
      titleStyle: { ...styles.titleStyle, opacity: 0.5 },
    },
    {
      disabled: true,
      title: 'Share Screen',
      Icon: () => (
        <View
          style={[
            styles.iconContainer,
            {
              opacity: 0.5,
              backgroundColor: Colors.primary,
            },
          ]}
        >
          <ShareScreen
            width={normalize(40)}
            height={normalize(40)}
            fill={Colors.secondary}
          />
        </View>
      ),
      containerStyle: styles.containerStyle,
      titleStyle: { ...styles.titleStyle, opacity: 0.5 },
    },
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.headerView(topInset)}>
        <Text style={styles.herderTitle}>Meeting</Text>
      </View>
      <View style={styles.buttonWrapper}>
        {ButtonData.map((el, _in) => (
          <Button key={_in} {...el} />
        ))}
      </View>
    </View>
  );
};

export default Home;

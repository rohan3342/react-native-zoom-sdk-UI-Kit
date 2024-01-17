import {
  View,
  Text,
  Platform,
  Pressable,
  StatusBar,
  ScrollView,
  PanResponder,
} from 'react-native';
import React, { useState, useRef, useCallback } from 'react';

import {
  More,
  Record,
  Message,
  Settings,
  CameraOn,
  CameraOff,
  GroupUser,
  VolumeHigh,
  VolumeMute,
  ScreenShareOn,
  ScreenShareOff,
} from '../../assets/SVG';
import styles from './styles';
import Colors from '../../styles/colors';
import { normalize } from '../../styles/responsive';
import ImmersiveMode from 'react-native-immersive-mode';
import { useFocusEffect } from '@react-navigation/native';

const GetIcon = ({ name, state }) => {
  switch (name) {
    case 'Audio':
      return state ? (
        <VolumeHigh
          width={normalize(22)}
          fill={Colors.success}
          height={normalize(22)}
        />
      ) : (
        <VolumeMute width={normalize(22)} height={normalize(22)} />
      );
    case 'Video':
      return state ? (
        <CameraOn
          width={normalize(22)}
          fill={Colors.success}
          height={normalize(22)}
        />
      ) : (
        <CameraOff width={normalize(22)} height={normalize(22)} />
      );
    case 'Participants':
      return (
        <GroupUser
          width={normalize(22)}
          height={normalize(22)}
          fill={Colors.secondary}
        />
      );
    case 'Chat':
      return (
        <Message
          width={normalize(22)}
          height={normalize(22)}
          fill={Colors.secondary}
        />
      );
    case 'Share':
      return state ? (
        <ScreenShareOn
          width={normalize(22)}
          fill={Colors.success}
          height={normalize(22)}
        />
      ) : (
        <ScreenShareOff width={normalize(22)} height={normalize(22)} />
      );
    case 'More':
      return (
        <More
          width={normalize(22)}
          height={normalize(22)}
          fill={Colors.secondary}
        />
      );

    case 'Record':
      return (
        <Record
          width={normalize(22)}
          height={normalize(22)}
          fill={state ? Colors.error : Colors.secondary}
        />
      );
    default:
      return (
        <Settings
          width={normalize(22)}
          height={normalize(22)}
          fill={Colors.secondary}
        />
      );
  }
};

const TabContainer = React.memo(({ children, tabContainerStyle = {} }) => (
  <View style={tabContainerStyle}>{children}</View>
));

const TabView = React.memo(({ children, tabViewStyle = {} }) => (
  <View style={tabViewStyle}>{children}</View>
));

const TabBar = React.memo(
  ({ children, tabBarStyle = {}, scrollViewProps, currentTabIndex }) => {
    const scrollViewRef = useRef(null);

    React.useEffect(() => {
      // Reset scroll position when currentTabIndex is set to 0
      if (scrollViewRef.current && currentTabIndex === 0) {
        scrollViewRef.current.scrollTo({ x: 0, animated: true });
      }
    }, [currentTabIndex]);

    return (
      <ScrollView
        horizontal
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        style={[styles.tabBarScrollView, tabBarStyle]}
        {...scrollViewProps}
      >
        {children}
      </ScrollView>
    );
  }
);

const TabItem = React.memo(({ children, onPress, tabItemStyle = {} }) => (
  <Pressable onPress={onPress} style={tabItemStyle}>
    {children}
  </Pressable>
));

const BottomTabView = () => {
  const swiped = useRef(null);
  const [currentTabIndex, setTabIndex] = useState(0);
  const [containerHeight, setContainerHeight] = useState('0%');
  const [tabItems, setTabItems] = useState([
    {
      name: 'Audio',
      height: '0%',
      state: false,
      type: 'toggle',
      onPress: () => {
        console.log('Audio Pressed');
      },
    },
    {
      name: 'Video',
      height: '0%',
      state: false,
      type: 'toggle',
      onPress: () => {
        console.log('Video Pressed');
      },
    },
    {
      name: 'Participants',
      height: '50%',
      state: false,
      type: 'list',
      onPress: () => {
        console.log('Participants Pressed');
      },
    },
    {
      name: 'Chat',
      height: '50%',
      state: false,
      type: 'list',
      onPress: () => {
        console.log('Chat Pressed');
      },
    },
    {
      name: 'Share',
      height: '0%',
      state: false,
      type: 'toggle',
      onPress: () => {
        console.log('Share Pressed');
      },
    },
    {
      name: 'Record',
      height: '0%',
      state: false,
      type: 'toggle',
      onPress: () => {
        console.log('Record Pressed');
      },
    },
    {
      name: 'More',
      height: '0%',
      state: false,
      type: 'modal',
      onPress: () => {
        console.log('More Pressed');
      },
    },
  ]);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setHidden(true);
      if (Platform.OS === 'android') {
        ImmersiveMode.setBarMode('Full');
        ImmersiveMode.fullLayout(true);
      }
      return () => {
        StatusBar.setHidden(false);
        if (Platform.OS === 'android') {
          ImmersiveMode.setBarMode('Normal');
          ImmersiveMode.fullLayout(false);
        }
      };
    }, [])
  );

  const onTabBarItemPressed = useCallback(
    (item, index) => {
      const newTabItems = [...tabItems];
      if (item.type === 'toggle') {
        newTabItems[index] = { ...item, state: !item.state };
      }
      setTabItems(newTabItems);
      if (item.type === 'list' && currentTabIndex === index) {
        setTabIndex(0);
        setContainerHeight(tabItems[0].height);
      } else {
        setTabIndex(index);
        setContainerHeight(item.height);
      }
      item?.onPress?.();
    },
    [tabItems, currentTabIndex]
  );

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dy } = gestureState;
        return Math.abs(dy) > 50 || dy < -50;
      },
      onPanResponderMove: (_, gestureState) => {
        if (swiped.current) {
          return;
        }

        const dy = gestureState?.dy;
        if (Math.abs(dy) > 50) {
          swiped.current = true;
        }
      },
      onPanResponderRelease: (_, gestureState) =>
        onPanResponderRelease(gestureState),
    })
  ).current;

  const onPanResponderRelease = (gestureState) => {
    const dy = gestureState?.dy;
    if (currentTabIndex >= 0 && currentTabIndex < tabItems.length) {
      if (dy < -50) {
        // Swipe up
        tabItems[currentTabIndex].height = '100%';
        setContainerHeight(tabItems[currentTabIndex].height);
      } else if (dy > 50) {
        // Swipe down
        tabItems[currentTabIndex].height =
          tabItems[currentTabIndex].height === '100%' ? '50%' : '0%';
        setContainerHeight(tabItems[currentTabIndex].height);
        if (tabItems[currentTabIndex].height === '0%') {
          setTabIndex(0);
        }
      }
    }
    swiped.current = false;
  };

  const tabItemsRendered = tabItems.map((item, index) => (
    <React.Fragment key={item.name}>
      <TabItem
        tabItemStyle={styles.tabItemStyle}
        onPress={() => onTabBarItemPressed(item, index)}
      >
        <GetIcon name={item?.name} state={item?.state} />
        <Text style={[styles.tabItemText, { color: getColor(item, index) }]}>
          {item.name}
        </Text>
      </TabItem>
      {index === 1 && <View style={styles.separatorLine} />}
    </React.Fragment>
  ));

  const tabViewsRendered = tabItems.map((item, index) => (
    <TabView
      key={item.name}
      tabViewStyle={styles.tabViewStyle(currentTabIndex === index)}
    >
      {item?.type === 'list' && (
        <View style={styles.tabViewHeader(containerHeight)}>
          <View style={styles.tabViewHeaderLine} />
        </View>
      )}
    </TabView>
  ));

  function getColor(item, index) {
    if (item?.type === 'toggle') {
      return item.state ? Colors.success : Colors.white;
    }
    return Colors.white;
    // return currentTabIndex === index ? Colors.black : Colors.white;
  }

  return (
    <TabContainer tabContainerStyle={styles.container(containerHeight)}>
      <View style={styles.tabBarWrapperView(containerHeight)}>
        <TabBar
          tabBarStyle={styles.tabBarStyle}
          currentTabIndex={currentTabIndex}
        >
          {tabItemsRendered}
        </TabBar>
      </View>
      <View
        {...panResponder.panHandlers}
        style={styles.tabViewWrapperView(containerHeight)}
      >
        {tabViewsRendered}
      </View>
    </TabContainer>
  );
};

export default BottomTabView;

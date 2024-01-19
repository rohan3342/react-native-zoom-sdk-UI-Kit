import React, { useState, useRef, useCallback } from 'react';
import { View, Text, FlatList, Pressable, PanResponder } from 'react-native';

import {
  More,
  MicOn,
  MicOff,
  Record,
  Message,
  Settings,
  CameraOn,
  CameraOff,
  GroupUser,
  ScreenShareOn,
  ScreenShareOff,
} from '../../assets/SVG';
import styles from './styles';
import Colors from '../../styles/colors';
import { normalize } from '../../styles/responsive';

const GetIcon = ({ name, state }) => {
  switch (name) {
    case 'Mic':
      return state ? (
        <MicOn
          width={normalize(22)}
          fill={Colors.success}
          height={normalize(22)}
          stroke={Colors.success}
        />
      ) : (
        <MicOff width={normalize(22)} height={normalize(22)} />
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

const TabItem = React.memo(({ children, onPress, tabItemStyle = {} }) => (
  <Pressable onPress={onPress} style={tabItemStyle}>
    {children}
  </Pressable>
));

const BottomTabView = (props) => {
  const swiped = useRef(null);
  const [currentTabIndex, setTabIndex] = useState(0);
  const [containerHeight, setContainerHeight] = useState('0%');
  const [tabItems, setTabItems] = useState([
    {
      name: 'Mic',
      height: '0%',
      state: props?.isMuted || false,
      type: 'toggle',
      onPress: () => {
        props?.onPressAudio?.();
        console.log('Mic Pressed');
      },
    },
    {
      name: 'Video',
      height: '0%',
      state: props?.isVideoOn || false,
      type: 'toggle',
      onPress: () => {
        props?.onPressVideo?.();
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
      state: props?.isSharing || false,
      type: 'toggle',
      onPress: () => {
        // props?.onPressShare?.();
        console.log('Share Pressed');
      },
    },
    {
      height: '0%',
      type: 'toggle',
      name: 'Record',
      state: props?.isRecordingStarted || false,
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
        props?.onPressMore?.();
        console.log('More Pressed');
      },
    },
  ]);

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
        <View style={styles.tabBarStyle} pointerEvents='box-none'>
          <FlatList
            onTouchEnd={props?.onTouchEnd}
            onTouchStart={props?.onTouchStart}
            horizontal
            data={tabItems}
            renderItem={({ item, index }) => (
              <>
                <TabItem
                  tabItemStyle={styles.tabItemStyle}
                  onPress={() => onTabBarItemPressed(item, index)}
                >
                  <GetIcon name={item?.name} state={item?.state} />
                  <Text
                    style={[
                      styles.tabItemText,
                      { color: getColor(item, index) },
                    ]}
                  >
                    {item.name}
                  </Text>
                </TabItem>
                {index === 1 && <View style={styles.separatorLine} />}
              </>
            )}
          />
        </View>
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

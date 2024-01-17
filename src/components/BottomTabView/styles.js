import { Platform, StatusBar, StyleSheet } from 'react-native';

import {
  normalize,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  WINDOW_HEIGHT,
  normalizeFont,
  normalizeHeight,
} from '../../styles/responsive';
import Colors from '../../styles/colors';

const styles = StyleSheet.create({
  container: (currentHeight) => ({
    zIndex: 1,
    bottom: 0,
    width: SCREEN_WIDTH,
    position: 'absolute',
    justifyContent: 'flex-end',
    height: getContainerHeight(currentHeight),
    // paddingBottom: getContainerPaddingBottom(),
  }),
  tabBarWrapperView: (currentHeight) => ({
    width: '100%',
    backgroundColor: Colors.black,
    height: getTabBarWrapperHeight(currentHeight),
  }),
  tabBarStyle: {
    padding: 5,
    width: '100%',
    height: '100%',
  },
  tabBarScrollView: {
    backgroundColor: Colors.black,
  },
  tabViewWrapperView: (height) => ({
    flexDirection: 'row',
    height: getContainerHeight(height, true),
  }),
  tabViewStyle: (zIndex) => ({
    bottom: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: zIndex ? 1 : -1,
    backgroundColor: Colors.mirage,
  }),
  tabViewHeader: (height) => ({
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: normalizeHeight(10),
    paddingTop: height === '100%' ? normalizeHeight(20) : normalizeHeight(10),
  }),
  tabViewHeaderLine: {
    width: normalize(60),
    height: normalizeHeight(4),
    borderRadius: normalize(8),
    backgroundColor: Colors.silver,
  },
  tabItemStyle: {
    flex: 1,
    margin: 4,
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  tabItemText: {
    fontSize: normalizeFont(10),
    marginTop: normalizeHeight(2),
  },
  separatorLine: {
    width: 1,
    height: '65%',
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: Colors.grey,
  },
});

function getContainerHeight(height, tabView) {
  if (height === '0%') {
    if (tabView) {
      return SCREEN_HEIGHT * 0;
    }
    return SCREEN_HEIGHT * 0.1;
  } else if (height === '50%') {
    return SCREEN_HEIGHT * 0.5;
  } else {
    return SCREEN_HEIGHT;
  }
}

function getContainerPaddingBottom() {
  if (Platform.OS === 'android') {
    return SCREEN_HEIGHT - WINDOW_HEIGHT + StatusBar.currentHeight;
  } else {
    return 0;
  }
}

function getTabBarWrapperHeight(height, tabView) {
  if (height === '0%') {
    return '100%';
  } else if (height === '50%') {
    return '20%';
  } else {
    return '0%';
  }
}

export default styles;

import DeviceInfo from 'react-native-device-info';
import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

const baseWidths = {
  mobile: 375,
  tablet: 768,
};

const baseHeights = {
  mobile: 812,
  tablet: 1024,
};

const isTablet = () => DeviceInfo.isTablet();

const guidelineBaseWidth = isTablet() ? baseWidths.tablet : baseWidths.mobile;
const guidelineBaseHeight = isTablet()
  ? baseHeights.tablet
  : baseHeights.mobile;

const scale = SCREEN_WIDTH / guidelineBaseWidth;

const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    return cache.has(key)
      ? cache.get(key)
      : (() => {
          const result = fn(...args);
          cache.set(key, result);
          return result;
        })();
  };
};

const normalize = memoize((size) =>
  Math.floor((SCREEN_WIDTH / guidelineBaseWidth) * size)
);
const normalizeHeight = memoize((size) =>
  Math.floor((SCREEN_HEIGHT / guidelineBaseHeight) * size)
);
const normalizeFont = memoize((size) =>
  Platform.OS === 'android'
    ? Math.round(PixelRatio.roundToNearestPixel(size * scale)) - 2
    : Math.round(PixelRatio.roundToNearestPixel(size * scale))
);

export {
  isTablet,
  normalize,
  SCREEN_WIDTH,
  WINDOW_WIDTH,
  SCREEN_HEIGHT,
  WINDOW_HEIGHT,
  normalizeFont,
  normalizeHeight,
};

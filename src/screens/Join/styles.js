import { StyleSheet } from 'react-native';

import Colors from '../../styles/colors';
import {
  SCREEN_WIDTH,
  normalize,
  normalizeFont,
  normalizeHeight,
} from '../../styles/responsive';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.off_white,
  },
  headerView: (top) => ({
    width: '100%',
    alignItems: 'center',
    paddingTop: top ?? 0,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
  }),
  headerIcon: (top) => ({
    left: normalize(16),
    position: 'absolute',
    top: top + normalizeHeight(16) ?? normalizeHeight(16),
  }),
  herderTitle: {
    fontWeight: '500',
    color: Colors.tertiary,
    fontSize: normalizeFont(16),
    paddingVertical: normalizeHeight(16),
  },
  mainContainer: {
    flex: 1,
  },
  textInputStyle: {
    marginTop: normalizeHeight(35),
  },
  personalBtnContainerStyle: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: normalizeHeight(14),
    backgroundColor: Colors.transparent,
  },
  personalBtnTitleStyle: {
    fontWeight: '500',
    color: Colors.primary,
    fontSize: normalizeFont(12),
  },
  btnContainerStyle: {
    marginTop: normalizeHeight(28),
    backgroundColor: Colors.primary,
    marginHorizontal: normalize(16),
    width: SCREEN_WIDTH - normalize(32),
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2.62,
    shadowOpacity: 0.23,
    elevation: 4,
  },
  btnTitleStyle: {
    fontWeight: '500',
    color: Colors.secondary,
    fontSize: normalizeFont(16),
  },
});

export default styles;

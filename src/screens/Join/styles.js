import { StyleSheet } from 'react-native';

import {
  SCREEN_WIDTH,
  normalize,
  normalizeFont,
  normalizeHeight,
} from '../../styles/responsive';
import Colors from '../../styles/colors';

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
  loaderWrapper: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
  },
  herderTitle: {
    fontWeight: '500',
    color: Colors.tertiary,
    fontSize: normalizeFont(16),
    paddingVertical: normalizeHeight(16),
  },
  mainContainer: {
    flex: 1,
    paddingBottom: normalize(30),
    paddingTop: normalizeHeight(20),
  },
  textInputStyle: {
    marginTop: normalizeHeight(12),
  },
  textInputIcon: {
    right: normalize(16),
    position: 'absolute',
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
  },
  disabledBtn: {
    opacity: 0.8,
    backgroundColor: Colors.black030,
  },
  disabledBtnTitle: {
    opacity: 0.8,
    color: Colors.tertiary,
  },
  btnTitleStyle: {
    fontWeight: '500',
    color: Colors.secondary,
    fontSize: normalizeFont(16),
  },
  joinOptionsText: {
    letterSpacing: 0,
    color: Colors.grey,
    marginLeft: normalize(16),
    fontSize: normalizeFont(11),
    marginTop: normalizeHeight(30),
    marginBottom: normalizeHeight(4),
  },
  toggleBtnWrapper: {
    width: '100%',
    paddingLeft: normalize(16),
    borderTopWidth: normalize(1),
    borderTopColor: Colors.black010,
    borderBottomWidth: normalize(1),
    backgroundColor: Colors.secondary,
    borderBottomColor: Colors.black010,
  },
  toggleBtnStyle: {
    width: '100%',
    borderRadius: 0,
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: normalize(16),
    justifyContent: 'space-between',
    backgroundColor: Colors.secondary,
  },
  toggleBtnLineStyle: {
    borderBottomWidth: normalize(1),
    borderBottomColor: Colors.black010,
  },
  toggleBtnTitleStyle: {
    color: Colors.tertiary,
    fontSize: normalizeFont(13),
  },
});

export default styles;

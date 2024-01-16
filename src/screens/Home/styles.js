import { StyleSheet } from 'react-native';

import Colors from '../../styles/colors';
import {
  normalize,
  normalizeFont,
  normalizeHeight,
} from '../../styles/responsive';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  headerView: (top) => ({
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.tertiary,
    paddingTop: top ?? 0,
  }),
  herderTitle: {
    fontWeight: '500',
    color: Colors.secondary,
    fontSize: normalizeFont(16),
    paddingVertical: normalizeHeight(16),
  },
  buttonWrapper: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderBottomWidth: normalize(1),
    backgroundColor: Colors.secondary,
    paddingVertical: normalizeHeight(12),
    borderBottomColor: Colors.off_white,
  },
  titleStyle: {
    fontSize: normalizeFont(13),
    paddingTop: normalizeHeight(10),
  },
  containerStyle: {
    width: normalize(130),
    height: normalize(130),
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
  },
  iconContainer: {
    alignItems: 'center',
    width: normalize(70),
    height: normalize(70),
    justifyContent: 'center',
    borderRadius: normalize(14),
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 1.62,
    shadowOpacity: 0.23,
    elevation: 2,
  },
  iconView: {
    padding: normalize(5),
    borderRadius: normalize(4),
    backgroundColor: Colors.secondary,
  },
});

export default styles;

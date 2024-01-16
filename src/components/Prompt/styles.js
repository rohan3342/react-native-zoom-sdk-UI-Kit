import { StyleSheet } from 'react-native';

import {
  normalize,
  normalizeFont,
  normalizeHeight,
} from '../../styles/responsive';
import Colors from '../../styles/colors';

const styles = StyleSheet.create({
  modalRootView: {
    margin: 0,
    justifyContent: 'flex-end',
    backgroundColor: Colors?.transparent,
  },
  modalInnerView: {
    padding: normalize(20),
    backgroundColor: Colors?.secondary,
  },
  modalTitle: {
    fontWeight: 'bold',
    color: Colors?.black,
    fontSize: normalizeFont(24),
    marginBottom: normalizeHeight(10),
  },
  modalSubTitle: {
    fontWeight: '400',
    color: Colors?.tertiary,
    fontSize: normalizeFont(16),
    marginBottom: normalizeHeight(20),
  },
  cancelBtnStyle: {
    width: '100%',
    marginVertical: normalizeHeight(16),
  },
  cancelBtnTextStyle: {
    color: Colors?.black,
    fontSize: normalizeFont(14),
  },
});

export default styles;

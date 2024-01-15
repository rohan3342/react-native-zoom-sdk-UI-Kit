import { StyleSheet } from 'react-native';

import Colors from '../../styles/colors';
import { normalizeFont, normalizeHeight } from '../../styles/responsive';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    color: Colors.tertiary,
    fontSize: normalizeFont(16),
  },
  subTitle: {
    textAlign: 'center',
    color: Colors.tertiary,
    fontSize: normalizeFont(12),
    marginTop: normalizeHeight(2),
  },
});
export default styles;

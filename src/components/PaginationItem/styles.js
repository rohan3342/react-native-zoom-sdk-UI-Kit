import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  dotStyle: (width) => ({
    width,
    height: width,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: 'white',
  }),
  animatedDotStyle: {
    flex: 1,
    borderRadius: 50,
    backgroundColor: '#26292E',
  },
});

export default styles;

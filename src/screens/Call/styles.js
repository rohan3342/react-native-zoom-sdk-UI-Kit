import { StyleSheet } from 'react-native';

import Colors from '../../styles/colors';
import {
  normalize,
  normalizeFont,
  normalizeHeight,
} from '../../styles/responsive';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.dark_grey,
  },
  fullScreenVideo: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  connectingWrapper: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectingText: {
    fontWeight: 'bold',
    color: Colors.secondary,
    fontSize: normalizeFont(24),
  },
  safeArea: {
    flex: 1,
  },
  contents: {
    flex: 1,
    alignItems: 'stretch',
  },
  sessionInfo: {
    width: normalize(200),
    padding: normalize(8),
    borderRadius: normalize(8),
    backgroundColor: Colors.black060,
  },
  sessionInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sessionName: {
    fontWeight: 'bold',
    color: Colors.secondary,
    fontSize: normalizeFont(16),
  },
  numberOfUsers: {
    color: Colors.secondary,
    fontSize: normalizeFont(13),
  },
  topWrapper: {
    flexDirection: 'row',
    padding: normalize(8),
    alignItems: 'flex-start',
    paddingTop: normalizeHeight(16),
    justifyContent: 'space-between',
  },
  topRightWrapper: {
    alignItems: 'flex-end',
    paddingTop: normalizeHeight(8),
  },
  middleWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(8),
  },
  bottomWrapper: {
    paddingHorizontal: normalize(8),
  },
  leaveButton: {
    borderRadius: normalize(24),
    backgroundColor: Colors.black060,
    paddingHorizontal: normalize(24),
    marginBottom: normalizeHeight(16),
    paddingVertical: normalizeHeight(6),
  },
  leaveText: {
    fontWeight: 'bold',
    color: Colors.error,
    fontSize: normalizeFont(14),
  },
  videoInfo: {
    alignItems: 'center',
    borderRadius: normalize(8),
    paddingHorizontal: normalize(16),
    backgroundColor: Colors.dark_grey,
    paddingVertical: normalizeHeight(8),
  },
  videoInfoText: {
    color: Colors.secondary,
    fontSize: normalizeFont(12),
  },
  chatList: {
    paddingRight: normalize(16),
  },
  chatMessage: {
    flexDirection: 'row',
    padding: normalize(8),
    alignSelf: 'flex-start',
    borderWidth: normalize(2),
    borderRadius: normalize(8),
    borderColor: Colors.white050,
    marginBottom: normalizeHeight(8),
    backgroundColor: Colors.black060,
  },
  chatUser: {
    color: Colors.silver,
    fontSize: normalizeFont(14),
  },
  chatContent: {
    color: Colors.secondary,
    fontSize: normalizeFont(14),
  },
  controls: {
    alignSelf: 'center',
    paddingTop: normalizeHeight(24),
  },
  controlButton: {
    marginBottom: 12,
  },
  controlBtnStyle: {
    width: normalize(40),
    height: normalize(40),
    backgroundColor: Colors.black060,
  },
  deleteButton: {
    fontSize: 10,
    paddingLeft: 4,
  },
  deleteText: {
    color: Colors.secondary,
  },
  userList: {
    width: '100%',
  },
  userListContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  chatInputWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chatInput: {
    height: 40,
    marginVertical: 8,
    color: Colors.hit_grey,
    borderColor: Colors.grey,
    borderWidth: normalize(1),
    borderRadius: normalize(6),
    backgroundColor: Colors.black060,
    paddingHorizontal: normalize(16),
  },
  chatSendButton: {
    height: normalizeHeight(36),
  },
  moreListWrapper: {
    bottom: 0,
    position: 'absolute',
    borderRadius: normalize(10),
    marginHorizontal: normalize(40),
    backgroundColor: Colors.white090,
  },
  moreList: {
    overflow: 'hidden',
    borderRadius: normalize(10),
  },
  moreItemText: {
    color: Colors.black,
    textAlign: 'center',
  },
  moreItemWrapper: {
    textAlign: 'center',
    alignItems: 'center',
    borderBottomWidth: 0,
    padding: normalize(5),
    borderWidth: normalize(1),
    fontSize: normalizeFont(90),
    borderColor: Colors.black020,
    paddingHorizontal: normalize(30),
  },
  cancelButton: {
    borderTopWidth: 1,
    alignItems: 'center',
    borderColor: Colors.black020,
    paddingTop: normalizeHeight(20),
    paddingBottom: normalizeHeight(20),
  },
  cancelButtonText: {
    color: Colors.primary,
    fontSize: normalizeFont(20),
  },
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.black050,
  },
  modal: {
    paddingLeft: normalize(24),
    borderRadius: normalize(8),
    paddingRight: normalize(16),
    paddingTop: normalizeHeight(16),
    backgroundColor: Colors.secondary,
    paddingBottom: normalizeHeight(24),
  },
  modalTitleText: {
    fontSize: normalizeFont(18),
    marginBottom: normalizeHeight(8),
  },
  modalActionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalAction: {
    marginTop: normalizeHeight(16),
    paddingHorizontal: normalize(24),
  },
  modalActionText: {
    fontWeight: 'bold',
    color: Colors.hit_grey,
    fontSize: normalizeFont(14),
  },
  moreItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: normalizeHeight(16),
    justifyContent: 'space-between',
  },
  moreItemText: {
    fontSize: normalizeFont(16),
  },
  moreItemIcon: {
    width: normalize(36),
    height: normalize(36),
    marginLeft: normalize(48),
  },
  moreModalTitle: {
    fontSize: normalizeFont(24),
  },
  renameInput: {
    borderWidth: 0,
    color: Colors.black,
    width: normalize(200),
    borderColor: Colors.hit_grey,
    marginTop: normalizeHeight(16),
    borderBottomWidth: normalize(1),
  },
  keyboardArea: {
    width: 0,
    height: 0,
    zIndex: normalizeHeight(-100),
  },
});

export default styles;

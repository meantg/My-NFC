import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

const CommonDialog = ({
  visible,
  title = 'Thông báo',
  message = 'Bạn đã đăng nhập thành công',
  buttonText = 'Đóng',
  onButtonPress = () => {},
  type = 'success', // 'success' or 'error'
}) => {
  const isError = type === 'error';
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onButtonPress}>
      <View style={styles.overlay}>
        <View style={styles.dialogContainer}>
          <View style={styles.iconWrapper}>
            <View
              style={[
                styles.iconCircle,
                isError ? styles.iconCircleError : styles.iconCircleSuccess,
              ]}>
              <Text
                style={[
                  styles.iconCheck,
                  isError ? styles.iconCross : styles.iconCheckmark,
                ]}>
                {isError ? '✗' : '✓'}
              </Text>
            </View>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity
            style={[
              styles.button,
              isError ? styles.buttonError : styles.buttonSuccess,
            ]}
            onPress={onButtonPress}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  iconWrapper: {
    position: 'absolute',
    top: -30,
    alignSelf: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  iconCircleSuccess: {
    backgroundColor: '#2ecc71',
  },
  iconCircleError: {
    backgroundColor: '#e74c3c',
  },
  iconCheck: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  iconCheckmark: {
    color: '#fff',
  },
  iconCross: {
    color: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    paddingTop: 15,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 28,
    marginHorizontal: 8,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    alignSelf: 'stretch',
    marginHorizontal: 16,
  },
  buttonSuccess: {
    backgroundColor: '#2ecc71',
  },
  buttonError: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CommonDialog;

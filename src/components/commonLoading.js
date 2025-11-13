import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import {icCircleSuccess, icSuccess} from '../images';

const CommonLoading = ({
  visible = false,
  text = 'Đang tải...',
  backgroundColor = 'rgba(0, 0, 0, 0.7)',
  spinnerColor = '#fff',
  textColor = '#FFFFFF',
  size = 'large',
  isComplete = false,
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      statusBarTranslucent={true}>
      <View style={[styles.container, {backgroundColor}]}>
        <View style={styles.loadingContainer}>
          {isComplete ? (
            <Image
              source={icCircleSuccess}
              style={{width: 50, height: 50}}
              resizeMode="contain"
            />
          ) : (
            <ActivityIndicator
              size={size}
              color={spinnerColor}
              style={styles.spinner}
            />
          )}
          {text && (
            <Text style={[styles.loadingText, {color: textColor}]}>{text}</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  spinner: {
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 25,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default CommonLoading;

import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Modal} from 'react-native';

const CommonLoading = ({
  visible = false,
  text = 'Đang tải...',
  backgroundColor = 'rgba(0, 0, 0, 0.7)',
  spinnerColor = '#fff',
  textColor = '#FFFFFF',
  size = 'large',
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      statusBarTranslucent={true}>
      <View style={[styles.container, {backgroundColor}]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size={size}
            color={spinnerColor}
            style={styles.spinner}
          />
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
    fontSize: 25,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default CommonLoading;

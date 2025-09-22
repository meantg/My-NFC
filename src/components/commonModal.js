/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {icWarningColor} from '../images';

const CommonModal = ({
  isWarning,
  icWarning = icWarningColor,
  warningTitle,
  visible,
  onClose,
  header,
  headerTxtStyle,
  content,
  bottomContent,
  isHaveCloseBtn = true,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View onPress={onClose} style={{flex: 1}}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            style={styles.modalContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            {/* Header */}
            <View
              style={[
                styles.headerRow,
                !isWarning &&
                  header && {borderBottomWidth: 1, borderColor: '#E2E7FB'},
                !isHaveCloseBtn && {
                  justifyContent: 'center',
                  borderBottomWidth: 0,
                },
              ]}>
              {header ? (
                <Text style={[styles.headerText, headerTxtStyle]}>
                  {isWarning ? '' : header}
                </Text>
              ) : (
                <View style={{flex: 1}} />
              )}
              {isHaveCloseBtn && (
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
            {/* Content */}
            <View>
              {isWarning ? (
                <View
                  style={[
                    styles.content,
                    {justifyContent: 'center', alignItems: 'center'},
                  ]}>
                  <Image source={icWarning} style={styles.warningIcon} />
                  <Text style={styles.warningTitle}>{warningTitle}</Text>
                </View>
              ) : (
                <View style={styles.content}>{content}</View>
              )}
            </View>
            {/* Bottom */}
            {bottomContent ? (
              <View
                style={[
                  styles.bottom,
                  !isWarning && {
                    borderTopColor: '#E2E7FB',
                    borderTopWidth: 1,
                    paddingTop: 24,
                  },
                ]}>
                {bottomContent}
              </View>
            ) : (
              <View style={{height: 20}}></View>
            )}
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  warningIcon: {
    width: 175,
    height: 175,
  },
  warningTitle: {
    fontSize: 16,
    color: '#38434E',
    padding: 20,
    textAlign: 'center',
  },
  modalContainer: {
    width: '95%',
    borderRadius: 20,
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'ios' ? 24 : 0,
    paddingHorizontal: 0,
    alignItems: 'stretch',
    marginBottom: 25,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  closeBtn: {
    padding: 8,
    marginLeft: 8,
  },
  closeIcon: {
    fontSize: 24,
    color: '#A0A0A0',
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 0,
    paddingBottom: 0,
    paddingTop: 0,
    backgroundColor: '#fff',
  },
  bottom: {
    marginVertical: 24,
  },
});

export default CommonModal;

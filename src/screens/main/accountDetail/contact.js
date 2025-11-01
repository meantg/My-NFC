import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CommonHeader from '../../../components/commonHeader';

const ContactInformation = ({navigation}) => {
  const [locationName, setLocationName] = useState('');

  const handleContinue = () => {
    navigation.navigate('WebsiteConfig');
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Header */}
      <CommonHeader
        title="Thông Tin Liên Hệ"
        titleStyle={{color: '#111921'}}
        onBack={() => navigation.goBack()}
        white={true}
      />
      <View style={styles.infoContainer}>
        <View style={styles.itemWrapper}>
          <View style={styles.infoItem}>
            <Text style={styles.title}>TÊN CÔNG TY</Text>
            <Text style={styles.detail}>Công ty TNHH Nextap</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.title}>HOTLINE</Text>
            <Text style={[styles.detail, {color: '#213AE8'}]}>0905123123</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.title}>EMAIL</Text>
            <Text style={styles.detail}>nextap@gmail.com</Text>
          </View>
          <View style={[styles.infoItem, {borderBottomWidth: 0}]}>
            <Text style={styles.title}>ĐỊA CHỈ</Text>
            <Text style={styles.detail}>999 Hoàng Diệu, Hà Nội</Text>
          </View>
        </View>
      </View>
      {/* Form */}
      {/* Bottom Buttons */}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  detail: {
    color: '#111921',
    fontSize: 15,
    fontWeight: '500',
  },
  title: {
    color: '#787D90',
    fontSize: 12,
    fontWeight: '600',
  },
  infoContainer: {
    flex: 1,
    backgroundColor: '#f0f5fc',
  },
  itemWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 15,
    borderWidth: 1,
    borderColor: '#E2E7FB',
  },
  infoItem: {
    borderBottomWidth: 1,
    borderColor: '#E2E7FB',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 20,
    paddingHorizontal: 16,
    minHeight: 100,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  formContainer: {
    padding: 16,
    marginTop: 8,
  },
  sectionLabel: {
    color: '#009459',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    color: '#000',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    borderWidth: 0,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#222',
    marginBottom: 0,
    flex: 1,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 12,
  },
  leftIcon: {
    position: 'absolute',
    width: 20,
    height: 20,
    tintColor: '#A0A0A0',
    zIndex: 1,
  },
  rightIconBtn: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  rightIcon: {
    width: 22,
    height: 22,
    tintColor: '#A0A0A0',
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C9CCDC',
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelBtnText: {
    color: '#38434E',
    fontSize: 16,
    fontWeight: '600',
  },
  continueBtn: {
    flex: 1,
    backgroundColor: '',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  continueBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ContactInformation;

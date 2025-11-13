import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import CommonHeader from '../../../components/commonHeader';
import CommonButton from '../../../components/commonButton';
import CommonTextInput from '../../../components/commonTextInput';
import {useDispatch} from 'react-redux';
import {changeUserPasswordAsync} from '../../../store/slices/authSlice';
import CommonLoading from '../../../components/commonLoading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOCAL_STORAGE_KEY } from '../../../utils/const';

const ChangePassword = ({navigation}) => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState({
    current: '',
    newPassword: '',
    reNewPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Đang tải ...');

  // Password validation function
  const validatePassword = password => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 8;

    return {
      hasLetter,
      hasNumber,
      hasMinLength,
      isValid: hasLetter && hasNumber && hasMinLength,
    };
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};

    // Validate current password
    if (!password.current.trim()) {
      newErrors.current = 'Vui lòng nhập mật khẩu hiện tại';
    }

    // Validate new password
    const passwordValidation = validatePassword(password.newPassword);
    if (!password.newPassword.trim()) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (!passwordValidation.isValid) {
      let errorMsg = 'Mật khẩu mới phải có:';
      if (!passwordValidation.hasLetter) errorMsg += ' ít nhất 1 chữ cái,';
      if (!passwordValidation.hasNumber) errorMsg += ' ít nhất 1 số,';
      if (!passwordValidation.hasMinLength) errorMsg += ' ít nhất 8 ký tự';
      newErrors.newPassword = errorMsg;
    }

    // Validate password confirmation
    if (!password.reNewPassword.trim()) {
      newErrors.reNewPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (password.newPassword !== password.reNewPassword) {
      newErrors.reNewPassword = 'Xác nhận mật khẩu mới không khớp';
    }
    return newErrors;
  };

  const handleContinue = () => {
    let error = validateForm();
    if (Object.keys(error).length > 0) {
      Alert.alert('Lỗi xác thực', Object.values(error)[0]);
      return;
    }
    setLoading(true);
    dispatch(
      changeUserPasswordAsync({
        currentPassword: password.current,
        newPassword: password.newPassword,
      }),
    ).then(async res => {
      console.log('changeUserPasswordAsync', res);
      if (res.payload.username) {
        setLoadingText('Đổi mật khẩu thành công !');
        await AsyncStorage.removeItem(LOCAL_STORAGE_KEY.AUTH_TOKEN);
        await AsyncStorage.removeItem(LOCAL_STORAGE_KEY.LOGIN_INFOR);
        setTimeout(() => {
          setLoading(false);
          navigation.replace('Authentication');
        }, 1000);
      } else {
        setLoading(false);
        Alert.alert('Thông báo', res.payload.message);
      }
    });
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Header */}
      <CommonLoading
        visible={loading}
        text={loadingText}
        isComplete={loadingText === 'Đổi mật khẩu thành công !'}
      />
      <CommonHeader
        title="Đổi Mật Khẩu"
        titleStyle={{color: '#111921'}}
        onBack={() => navigation.goBack()}
        white={true}
      />
      {/* Form */}
      <ScrollView style={styles.formContainer}>
        {/* Current Password */}
        <CommonTextInput
          title={'Mật khẩu hiện tại'}
          style={{marginBottom: 15}}
          isPassword={true}
          value={password.current}
          onChangeText={text => setPassword({...password, current: text})}
        />

        {/* New Password */}
        <CommonTextInput
          title={'Mật khẩu mới'}
          style={{marginBottom: 15}}
          isPassword={true}
          value={password.newPassword}
          onChangeText={text => setPassword({...password, newPassword: text})}
        />

        {/* Confirm New Password */}
        <CommonTextInput
          title={'Xác nhận mật khẩu mới'}
          style={{marginBottom: 15}}
          isPassword={true}
          value={password.reNewPassword}
          onChangeText={text => setPassword({...password, reNewPassword: text})}
        />
        {/* Cấu hình WiFi */}
        <CommonButton
          text="Lưu Cập Nhật"
          onPress={handleContinue}
          style={{marginTop: 16}}
          textStyle={{color: '#fff'}}
        />
      </ScrollView>
      {/* Bottom Buttons */}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#f0f5fc',
    paddingHorizontal: 25,
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

export default ChangePassword;

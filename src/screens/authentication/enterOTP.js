/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import CommonDialog from '../../components/commonDialog';
import {icBack} from '../../images';
import {commonStyles} from '../../utils/styles';
import {useAuth} from '../../store/hooks/useAuth';

const EnterOTPScreen = ({navigation, route}) => {
  const {verifyOTP, resetOTP} = useAuth();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [dialog, setDialog] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'success',
    buttonText: 'OK',
    onPress: null,
  });
  const [focusedInput, setFocusedInput] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);
  const email = route.params?.email || '';
  const checkOtp = otp.every(digit => digit !== '');

  useEffect(() => {
    let interval = null;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const showDialog = ({
    title,
    message,
    type = 'success',
    buttonText = 'OK',
    onPress,
  }) => {
    setDialog({
      visible: true,
      title,
      message,
      type,
      buttonText,
      onPress,
    });
  };

  const hideDialog = () => {
    setDialog(prev => ({...prev, visible: false}));
  };

  const handleOtpChange = (text, index) => {
    if (text.length <= 1) {
      const newOtp = [...otp];
      // Convert to uppercase for consistency
      newOtp[index] = text.toUpperCase();
      setOtp(newOtp);

      // Auto-focus next input
      if (text.length === 1 && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        // If current input is empty and not the first input, go to previous and delete
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else if (otp[index] !== '') {
        // If current input has value, clear it
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleVerifyOTP = async () => {
    if (!checkOtp) {
      showDialog({
        title: 'Lỗi',
        message: 'Vui lòng nhập đầy đủ mã OTP',
        type: 'error',
      });
      return;
    }

    setIsVerifying(true);
    const otpString = otp.join('');

    try {
      const result = await verifyOTP({otp: otpString, email});
      if (result.success) {
        showDialog({
          title: 'Thành công',
          message: 'Xác thực OTP thành công!',
          type: 'success',
          buttonText: 'OK',
          onPress: () => navigation.navigate('Login'),
        });
      } else {
        showDialog({
          title: 'Lỗi',
          message: result.error || 'Mã OTP không đúng. Vui lòng thử lại.',
          type: 'error',
        });
      }
    } catch (error) {
      showDialog({
        title: 'Lỗi',
        message: 'Có lỗi xảy ra. Vui lòng thử lại.',
        type: 'error',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      const result = await resetOTP(email);
      if (result.success) {
        setTimer(30);
        setCanResend(false);
        setOtp(['', '', '', '']);
        showDialog({
          title: 'Thành công',
          message: 'Mã OTP mới đã được gửi đến email của bạn.',
          type: 'success',
        });
      } else {
        showDialog({
          title: 'Lỗi',
          message:
            result.error || 'Không thể gửi lại mã OTP. Vui lòng thử lại.',
          type: 'error',
        });
      }
    } catch (error) {
      showDialog({
        title: 'Lỗi',
        message: 'Có lỗi xảy ra. Vui lòng thử lại.',
        type: 'error',
      });
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={commonStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView scrollEnabled={false} style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackToLogin}>
            <Image source={icBack} style={styles.backButton} />
          </TouchableOpacity>
          <Text style={styles.title}>Xác Thực OTP</Text>
          <TouchableOpacity
            style={{opacity: 0}}
            disabled={true}
            onPress={handleBackToLogin}>
            <Image source={icBack} style={styles.backButton} />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Vui lòng nhập mã OTP 4 chữ số đã được gửi đến email
          <Text style={{fontWeight: 'bold'}}> {email}</Text>
        </Text>

        <View style={styles.form}>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  focusedInput === index && {borderColor: '#213AE8'},
                  digit !== '' && {borderColor: '#213AE8'},
                ]}
                value={digit}
                onChangeText={text => handleOtpChange(text, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                onFocus={() => setFocusedInput(index)}
                onBlur={() => setFocusedInput(null)}
                keyboardType="default"
                maxLength={1}
                textAlign="center"
                placeholderTextColor={'#787D90'}
                autoCapitalize="characters"
              />
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.verifyButton,
              !checkOtp && {backgroundColor: '#C9CCDC', opacity: 0.5},
            ]}
            disabled={!checkOtp || isVerifying}
            onPress={handleVerifyOTP}>
            <Text style={styles.verifyButtonText}>
              {isVerifying ? 'Đang xác thực...' : 'Xác Thực OTP'}
            </Text>
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Không nhận được mã? </Text>
            <TouchableOpacity disabled={!canResend} onPress={handleResendOTP}>
              <Text
                style={[styles.resendLink, !canResend && {color: '#C9CCDC'}]}>
                {canResend ? 'Gửi lại' : `Gửi lại (${timer}s)`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <CommonDialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        buttonText={dialog.buttonText}
        type={dialog.type}
        onButtonPress={() => {
          if (dialog.onPress) {
            dialog.onPress();
          }
          hideDialog();
        }}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9FF',
    paddingTop: 25,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  backButton: {
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111921',
    textAlign: 'center',
    marginBottom: 8,
    top: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#38434E',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  form: {
    width: '95%',
    alignSelf: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    color: '#38434E',
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#213AE8',
    textDecorationLine: 'underline',
  },
});

export default EnterOTPScreen;

/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
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
import {icBack, imgSentResetPasswordDone} from '../../images';
import {validateEmail} from '../../utils/func';
import {commonStyles} from '../../utils/styles';

const ForgotPasswordScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [dialog, setDialog] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'success',
    buttonText: 'OK',
    onPress: null,
  });
  const [focusedInput, setFocusedInput] = useState('');
  const [isSentRequest, setIsSentRequest] = useState(false);
  const checkEmail = email.trim() && email.length > 6;

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

  const handleResetPassword = () => {
    if (!email.trim() || !validateEmail(email)) {
      showDialog({
        title: 'Lỗi',
        message: 'Vui lòng nhập địa chỉ email hợp lệ',
        type: 'error',
      });
      return;
    }

    // Add your password reset logic here
    console.log('Password reset attempt for:', email);

    // For now, just show a success dialog
    // showDialog({
    //   title: 'Reset Link Sent',
    //   message:
    //     'If an account with this email exists, you will receive a password reset link shortly.',
    //   type: 'success',
    //   buttonText: 'OK',
    //   onPress: () => navigation.navigate('Login'),
    // });
    setIsSentRequest(true);
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={commonStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {isSentRequest ? (
        <View
          scrollEnabled={false}
          style={[
            styles.content,
            {
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 40,
              top: -25,
            },
          ]}>
          <Image
            source={imgSentResetPasswordDone}
            style={styles.imgSentResetPasswordDone}
          />
          <Text
            style={{
              fontSize: 24,
              fontWeight: '700',
              marginBottom: 10,
              marginTop: 40,
            }}>
            Yêu cầu thành công
          </Text>
          <Text style={styles.subtitle}>
            {`Chúng tôi đã nhận được yêu cầu từ bạn, hãy chú ý hòm mail để nhận được \nphản hồi sớm nhất.`}
          </Text>
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: 60,
              left: 0,
              right: 0,
              alignItems: 'center',
            }}
            onPress={handleBackToLogin}>
            <Text style={styles.backToLoginText}>Về Đăng Nhập</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView scrollEnabled={false} style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBackToLogin}>
              <Image source={icBack} style={styles.backButton} />
            </TouchableOpacity>
            <Text style={styles.title}>Quên Mật Khẩu</Text>
            <TouchableOpacity
              style={{opacity: 0}}
              disabled={true}
              onPress={handleBackToLogin}>
              <Image source={icBack} style={styles.backButton} />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>
            Vui lòng nhập địa chỉ email đăng ký của bạn bên dưới. Chúng tôi sẽ
            giúp bạn.
          </Text>
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === 'email' && {borderColor: '#213AE8'},
                ]}
                placeholder="Nhập"
                placeholderTextColor={'#787D90'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.resetButton,
                !checkEmail && {backgroundColor: '#C9CCDC', opacity: 0.5},
              ]}
              disabled={!checkEmail}
              onPress={handleResetPassword}>
              <Text style={styles.resetButtonText}>Gửi Yêu Cầu</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
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
  imgSentResetPasswordDone: {
    width: 175,
    height: 175,
  },
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
    marginBottom: 10,
    lineHeight: 24,
  },
  form: {
    width: '95%',
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  resetButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backToLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backToLoginText: {
    color: '#213AE8',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  backToLoginLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;

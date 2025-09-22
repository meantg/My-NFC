import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import CommonDialog from '../../components/commonDialog';
import {icBack, icEye, imgRegisterSuccess} from '../../images';
import {convertErrorMessage, validateEmail} from '../../utils/func';
import {commonStyles} from '../../utils/styles';
import {useAuth} from '../../store/hooks/useAuth';

const RegisterScreen = ({navigation}) => {
  const {register} = useAuth();
  const [name, setName] = useState({
    firstName: '',
    lastName: '',
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dialog, setDialog] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'success',
    buttonText: 'OK',
    onPress: null,
  });
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleRegister = async () => {
    if (
      !name.firstName.trim() ||
      !name.lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      showDialog({
        title: 'Lỗi',
        message: 'Vui lòng nhập đầy đủ thông tin',
        type: 'error',
      });
      return;
    }
    if (!validateEmail(email)) {
      showDialog({
        title: 'Thông báo',
        message: 'Vui lòng nhập địa chỉ email hợp lệ',
        type: 'error',
      });
      return;
    }
    if (password.length < 6) {
      showDialog({
        title: 'Thông báo',
        message: 'Mật khẩu phải có ít nhất 6 ký tự',
        type: 'error',
      });
      return;
    }
    if (password !== confirmPassword) {
      showDialog({
        title: 'Thông báo',
        message: 'Mật khẩu không khớp',
        type: 'error',
      });
      return;
    }
    setLoading(true);
    try {
      const result = await register({
        userData: {
          firstName: name.firstName,
          lastName: name.lastName,
          email,
          password,
        },
      });
      setLoading(false);
      if (result.success) {
        return navigation.navigate('EnterOTP', {email});
      } else {
        console.log('result', result);
        let msg = convertErrorMessage(result.error);
        showDialog({
          title: 'Thông báo',
          message:
            msg ||
            'Đã xảy ra lỗi trong quá trình đăng ký, vui lòng thử lại sau!',
          type: 'error',
        });
      }
    } catch (error) {
      showDialog({
        title: 'Thông báo',
        message: 'Đã xảy ra lỗi trong quá trình đăng ký, vui lòng thử lại sau!',
        type: 'error',
      });
    }
    // For now, just show a success dialog and navigate to login
    // showDialog({
    //   title: 'Thành công',
    //   message: 'Tạo tài khoản thành công',
    //   type: 'success',
    //   buttonText: 'OK',
    //   onPress: () => navigation.navigate('Login'),
    // });
  };

  const handleLogin = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.pop(''); // or any safe route
    }
  };

  if (isRegisterSuccess) {
    return (
      <View style={commonStyles.container}>
        <View style={styles.content}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image
              source={imgRegisterSuccess}
              style={{width: 175, height: 175}}
            />
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                marginBottom: 10,
                marginTop: 40,
              }}>
              Thành công
            </Text>
            <Text style={[styles.subtitle, {paddingHorizontal: 25}]}>
              Cảm ơn bạn đã đăng ký sử dụng dịch vụ của chúng tôi. Chúc bạn có
              những trải nghiệm tuyệt vời
            </Text>
            <TouchableOpacity
              style={styles.backToLoginBtn}
              onPress={handleLogin}>
              <Text style={styles.backToLoginText}>Khám Phá Ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      style={commonStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogin}>
          <Image source={icBack} style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.title}>Đăng Ký</Text>
        <TouchableOpacity
          style={{opacity: 0}}
          disabled={true}
          onPress={handleLogin}>
          <Image source={icBack} style={styles.backButton} />
        </TouchableOpacity>
      </View>
      <ScrollView bounces={false} style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Họ</Text>
            <TextInput
              style={[
                styles.input,
                focusedInput === 'firstName' && {borderColor: '#213AE8'},
              ]}
              placeholder="Nhập"
              placeholderTextColor={'#787D90'}
              value={name.firstName}
              onChangeText={txt => setName({...name, firstName: txt})}
              autoCapitalize="words"
              autoCorrect={false}
              onFocus={() => setFocusedInput('firstName')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tên</Text>
            <TextInput
              style={[
                styles.input,
                focusedInput === 'lastName' && {borderColor: '#213AE8'},
              ]}
              placeholder="Nhập"
              placeholderTextColor={'#787D90'}
              value={name.lastName}
              onChangeText={txt => setName({...name, lastName: txt})}
              autoCapitalize="words"
              autoCorrect={false}
              onFocus={() => setFocusedInput('lastName')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mật Khẩu</Text>
            <View>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === 'password' && {borderColor: '#213AE8'},
                ]}
                placeholder="Nhập"
                placeholderTextColor={'#787D90'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity
                style={styles.showButton}
                onPress={() => setShowPassword(prev => !prev)}>
                <Image source={icEye} style={styles.eyeIcon} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nhập Lại Mật Khẩu</Text>
            <View>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === 'confirmPassword' && {
                    borderColor: '#213AE8',
                  },
                ]}
                placeholder="Nhập"
                placeholderTextColor={'#787D90'}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setFocusedInput('confirmPassword')}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity
                style={styles.showButton}
                onPress={() => setShowConfirmPassword(prev => !prev)}>
                <Image source={icEye} style={styles.eyeIcon} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            disabled={loading}
            style={styles.registerButton}
            onPress={handleRegister}>
            <Text style={styles.registerButtonText}>
              {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Bạn đã có tài khoản? </Text>
          </View>
          <TouchableOpacity style={{alignSelf: 'center'}} onPress={handleLogin}>
            <Text style={styles.loginLink}>Đăng Nhập</Text>
          </TouchableOpacity>
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
  backToLoginBtn: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#213AE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    height: 48,
  },
  backToLoginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  showButton: {
    position: 'absolute',
    right: 10,
    top: 13,
    zIndex: 10,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  backButton: {
    width: 20,
    height: 20,
  },
  content: {
    flex: 1,
    padding: 20,
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
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    width: '95%',
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    color: '#38434E',
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
  registerButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#38434E',
    fontSize: 16,
    fontWeight: '400',
  },
  loginLink: {
    color: '#213AE8',
    textDecorationLine: 'underline',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RegisterScreen;

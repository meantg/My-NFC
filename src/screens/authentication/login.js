/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
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
import {icEye} from '../../images';
import {convertErrorMessage, validateEmail} from '../../utils/func';
import {commonStyles} from '../../utils/styles';
import {useAuth} from '../../store/hooks/useAuth';
import CommonLoading from '../../components/commonLoading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOCAL_STORAGE_KEY} from '../../utils/const';

const LoginScreen = ({navigation}) => {
  const {login} = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState({
    type: false,
    message: '',
  });
  const validateLogin =
    !email?.trim() ||
    !password?.trim() ||
    email?.length < 7 ||
    password?.length < 8;
  const [focusedInput, setFocusedInput] = useState('');

  useEffect(() => {
    getLoginInfor();
  }, []);

  const getLoginInfor = async () => {
    const loginInfor = await AsyncStorage.getItem(
      LOCAL_STORAGE_KEY.LOGIN_INFOR,
    );
    const loginInforData = JSON.parse(loginInfor);
    console.log('logged in before', loginInforData);
    if (
      loginInforData.username.length > 0 &&
      loginInforData.password.length > 0
    ) {
      setLoading(true);
      setEmail(loginInforData.username);
      setPassword(loginInforData.password);
      setTimeout(() => {
        handleLogin(loginInforData.username, loginInforData.password);
      }, 1000);
    }
  };

  const showError = (errorStatus, message) => {
    setDialogMessage({type: errorStatus, message});
    setDialogVisible(true);
  };

  const handleLogin = async (_email, _password) => {
    let loginEmail = _email || email;
    let loginPassword = _password || password;
    console.log('handleLogin', loginEmail, loginPassword);
    if (!validateEmail(loginEmail)) {
      showError(false, 'Email không hợp lệ');
      return;
    }
    if (!loginEmail.trim() || !loginPassword.trim()) {
      showError(false, 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    setLoading(true);
    await login({
      username: loginEmail,
      password: loginPassword,
    }).then(async res => {
      console.log('login res', res);
      setLoading(false);
      if (res.success) {
        try {
          email.length > 0 &&
            (await AsyncStorage.setItem(
              LOCAL_STORAGE_KEY.LOGIN_INFOR,
              JSON.stringify({username: email, password}),
            ));
          setTimeout(() => {
            navigation.replace('Main');
          }, 500);
        } catch (error) {
          console.log('error while configuration login infor', error);
        }
      } else {
        console.log('Else error', res);
        setTimeout(() => {
          showError(false, convertErrorMessage(res.error));
        }, 500);
      }
    });
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView
      style={commonStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <CommonLoading visible={loading} />
      <View style={styles.content}>
        {/* <Image
          source={require('../../images/img/NextapLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        /> */}
        <Text
          style={[
            styles.label,
            {
              fontSize: 45,
              fontWeight: 'bold',
              alignSelf: 'center',
              marginBottom: 20,
            },
          ]}>
          MyTap
        </Text>
        <ScrollView scrollEnabled={false} style={styles.form}>
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
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          <View style={styles.inputContainer}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.label}>Mật khẩu</Text>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text
                  style={[
                    styles.label,
                    {
                      fontWeight: '500',
                      color: '#213AE8',
                      textDecorationLine: 'underline',
                    },
                  ]}>
                  Quên mật khẩu ?
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.passwordInputWrapper}>
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
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity
                style={styles.showButton}
                onPress={() => setShowPassword(prev => !prev)}>
                <Image source={icEye} style={styles.showButtonIcon} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.loginButton,
              validateLogin && {backgroundColor: '#C9CCDC', opacity: 0.5},
            ]}
            onPress={() => handleLogin()}
            disabled={validateLogin || loading}>
            <Text style={styles.loginButtonText}>
              {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Bạn chưa có tài khoản?</Text>
          </View>
          <TouchableOpacity
            style={{alignSelf: 'center'}}
            onPress={handleRegister}>
            <Text style={styles.registerLink}>Đăng Ký Ngay</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <CommonDialog
        visible={dialogVisible}
        title={dialogMessage.type ? 'Thành công' : 'Lỗi'}
        message={dialogMessage.message}
        buttonText="OK"
        onButtonPress={() => setDialogVisible(false)}
        type={dialogMessage.type ? 'success' : 'error'}
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
  splashScreen: {
    width: '100%',
    height: '100%',
  },
  logo: {
    width: 150,
    height: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: '20%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
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
  passwordInputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCFE2',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: 'black',
  },
  showButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 10,
    zIndex: 1,
  },
  showButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: '#38434E',
    fontSize: 16,
  },
  registerLink: {
    color: '#213AE8',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
});

export default LoginScreen;

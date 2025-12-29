import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PreLoginScreen from '../screens/authentication/prelogin';
import LoginScreen from '../screens/authentication/login';
import RegisterScreen from '../screens/authentication/register';
import ForgotPasswordScreen from '../screens/authentication/forgotPassword';
import EnterOTPScreen from '../screens/authentication/enterOTP';
import ShareQR from '../screens/main/locationDetail/shareQR';

const Stack = createNativeStackNavigator();

const AuthenticationScreen = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="PreLogin" component={PreLoginScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="EnterOTP" component={EnterOTPScreen} />
      <Stack.Screen name="ShareQR" component={ShareQR} />
    </Stack.Navigator>
  );
};

export default AuthenticationScreen;

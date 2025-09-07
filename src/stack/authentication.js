import React from 'react';
import {Text, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/authentication/login';
import RegisterScreen from '../screens/authentication/register';
import ForgotPasswordScreen from '../screens/authentication/forgotPassword';
import EnterOTPScreen from '../screens/authentication/enterOTP';

const Stack = createNativeStackNavigator();

const AuthenticationScreen = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="EnterOTP" component={EnterOTPScreen} />
    </Stack.Navigator>
  );
};

export default AuthenticationScreen;

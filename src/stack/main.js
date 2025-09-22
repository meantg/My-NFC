import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import HomeTabs from '../screens/main/homeTabs';
import WebsiteConfigScreen from '../screens/main/newDevice/websiteConfig';
import PreviewUI from '../screens/main/newDevice/previewUI';
import AccountInformation from '../screens/main/accountDetail/information';
import ContactInformation from '../screens/main/accountDetail/contact';
import ChangePassword from '../screens/main/accountDetail/changePassword';
import AddNewLocationScreen from '../screens/main/newDevice/addNewLocation';
import LocationDetail from '../screens/main/locationDetail/detail';
import ShareQR from '../screens/main/locationDetail/shareQR';

const Stack = createNativeStackNavigator();

const MainStackScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeTabs" component={HomeTabs} />
      <Stack.Screen name="AddNewLocation" component={AddNewLocationScreen} />
      <Stack.Screen name="WebsiteConfig" component={WebsiteConfigScreen} />
      <Stack.Screen name="PreviewUI" component={PreviewUI} />
      {/* AccountSetting */}
      <Stack.Screen name="AccountInformation" component={AccountInformation} />
      <Stack.Screen name="ContactInformation" component={ContactInformation} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      {/* LocationDetail */}
      <Stack.Screen name="LocationDetail" component={LocationDetail} />
      <Stack.Screen name="ShareQR" component={ShareQR} />
    </Stack.Navigator>
  );
};

export default MainStackScreen;

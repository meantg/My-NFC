import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import HomeTabs from '../screens/main/homeTabs';
import AddNewTagScreen from '../screens/main/newDevice/addNewTag';
import WebsiteConfigScreen from '../screens/main/newDevice/websiteConfig';
import PreviewUI from '../screens/main/newDevice/previewUI';
import AccountInformation from '../screens/main/accountDetail/information';
import ContactInformation from '../screens/main/accountDetail/contact';
import ChangePassword from '../screens/main/accountDetail/changePassword';
import DeviceDetail from '../screens/main/deviceDetail/detail';
import ShareQR from '../screens/main/newDevice/shareQR';

const Stack = createNativeStackNavigator();

const MainStackScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeTabs" component={HomeTabs} />
      <Stack.Screen name="AddNewTag" component={AddNewTagScreen} />
      <Stack.Screen name="WebsiteConfig" component={WebsiteConfigScreen} />
      <Stack.Screen name="PreviewUI" component={PreviewUI} />
      {/* AccountSetting */}
      <Stack.Screen name="AccountInformation" component={AccountInformation} />
      <Stack.Screen name="ContactInformation" component={ContactInformation} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      {/* DeviceDetail */}
      <Stack.Screen name="DeviceDetail" component={DeviceDetail} />
      <Stack.Screen name="ShareQR" component={ShareQR} />
    </Stack.Navigator>
  );
};

export default MainStackScreen;

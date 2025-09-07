// In App.js in a new project

import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {store} from '../app/store';
import AuthenticationScreen from './authentication';
import MainStackScreen from './main';
import {StatusBar, View} from 'react-native';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <View style={{flex: 1, backgroundColor: '#F4F9FF'}}>
        <StatusBar barStyle="dark-content" />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Authentication">
            <Stack.Screen
              name="Authentication"
              component={AuthenticationScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Main"
              component={MainStackScreen}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </Provider>
  );
};

export default App;

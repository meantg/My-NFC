/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './src/stack/root';
import {enableScreens} from 'react-native-screens';
import 'react-native-devsettings/withAsyncStorage';

enableScreens();

AppRegistry.registerComponent(appName, () => App);

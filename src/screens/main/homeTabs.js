/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './home';
import WriteScreen from './write';
import AccountScreen from './accountScreen';
import {Image, Platform, Text, TouchableOpacity, View} from 'react-native';
import {
  icAccountActive,
  icAccountInactive,
  icAddWhite,
  icListActive,
  icListInactive,
} from '../../images';
import LinearGradient from 'react-native-linear-gradient';

const Tab = createBottomTabNavigator();

const PlusButton = ({navigation}) => {
  return (
    <View
      style={[
        {
          zIndex: 1000,
          top: -15,
          borderRadius: 45,
        },
        // Platform.OS === 'ios' && {
        //   borderWidth: 4,
        //   borderColor: '#162ED033',
        // },
      ]}>
      <LinearGradient
        colors={['#1B38FF', '#071DAF']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={{
          zIndex: 1000,
          borderWidth: 4,
          borderColor: '#162ED033',
          borderRadius: 45,
        }}>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            width: 45,
            height: 45,
            borderRadius: 45,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => navigation.navigate('AddNewLocation')}>
          <Image source={icAddWhite} style={{width: 32, height: 32}} />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'android' ? 60 : 90,
          paddingHorizontal: 5,
          paddingTop: 0,
          backgroundColor: 'white',
          position: 'absolute',
          borderTopWidth: 1,
          shadowColor: '#162ED033',
          shadowOffset: {width: 0, height: 0},
          shadowOpacity: 1,
          shadowRadius: 5,
          elevation: 10,
        },
      }}>
      <Tab.Screen
        name="HomeTab"
        options={({navigation, isFocused}) => ({
          tabBarButton: props => {
            return (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  navigation.navigate('HomeTab');
                }}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <Image
                  source={
                    props.accessibilityState.selected
                      ? icListActive
                      : icListInactive
                  }
                  style={{width: 27, height: 24, marginRight: 8}}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: props.accessibilityState.selected
                      ? '#162ED0'
                      : '#38434E',
                  }}>
                  Danh Sách
                </Text>
              </TouchableOpacity>
            );
          },
        })}
        component={HomeScreen}
      />
      {/* <Tab.Screen
        name="WriteTab"
        options={{title: 'Write'}}
        component={WriteScreen}
      /> */}
      <Tab.Screen
        name="WriteTab"
        options={({navigation}) => ({
          tabBarButton: () => <PlusButton navigation={navigation} />,
        })}
        component={WriteScreen}
      />
      <Tab.Screen
        name="AccountTab"
        options={({navigation, isFocused}) => ({
          tabBarButton: props => {
            return (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  navigation.navigate('AccountTab');
                }}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <Image
                  source={
                    props.accessibilityState.selected
                      ? icAccountActive
                      : icAccountInactive
                  }
                  style={{width: 26, height: 26, marginRight: 8}}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: props.accessibilityState.selected
                      ? '#162ED0'
                      : '#38434E',
                  }}>
                  Tài Khoản
                </Text>
              </TouchableOpacity>
            );
          },
        })}
        component={AccountScreen}
      />
    </Tab.Navigator>
  );
};

export default HomeTabs;

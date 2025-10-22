import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  icAccountInfo,
  icContactInfo,
  icKeyGrey,
  icLogoutGrey,
  icSampleAvatar,
} from '../../images';
import {useAuth} from '../../store/hooks/useAuth';
import CommonLoading from '../../components/commonLoading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOCAL_STORAGE_KEY} from '../../utils/const';

const user = {
  name: 'Nguyễn Văn An',
  email: 'annguyenvan@gmail.com',
  avatar: icSampleAvatar, // Replace with your asset or keep as placeholder
};

const options = [
  {
    icon: icAccountInfo,
    label: 'Đổi thông tin cá nhân',
    screenName: 'AccountInformation',
  },
  {icon: icKeyGrey, label: 'Đổi mật khẩu', screenName: 'ChangePassword'},
  // {
  //   icon: icContactInfo,
  //   label: 'Thông tin liên hệ',
  //   screenName: 'ContactInformation',
  // },
  {icon: icLogoutGrey, label: 'Đăng xuất', screenName: 'Logout'},
];

const AccountScreen = ({navigation}) => {
  const {logout, user} = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    logout().then(async res => {
      if (res.success) {
        await AsyncStorage.removeItem(LOCAL_STORAGE_KEY.AUTH_TOKEN);
        await AsyncStorage.removeItem(LOCAL_STORAGE_KEY.LOGIN_INFOR);
        setTimeout(() => {
          setLoading(false);
          navigation.replace('Authentication');
        }, 1000);
      }
    });
  };

  const handleItemPress = screenName => {
    if (screenName === 'Logout') {
      handleLogout();
    } else {
      navigation.navigate(screenName);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <CommonLoading visible={loading} text="Đang đăng xuất ..." />
      {/* Top blank/status bar area */}
      <View style={{height: 44}} />
      {/* Avatar and user info */}
      <View style={styles.avatarContainer}>
        <Image source={user.avatar || icSampleAvatar} style={styles.avatar} />
        <Text style={styles.userName}>{user.username}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>
      {/* Options */}
      <View style={styles.optionsContainer}>
        {options.map((item, idx) => (
          <TouchableOpacity
            key={item.label}
            style={styles.optionBtn}
            onPress={() => handleItemPress(item.screenName)}
            activeOpacity={0.8}>
            {item.icon && (
              <Image source={item.icon} style={styles.optionIcon} />
            )}
            <Text style={styles.optionLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f5fc',
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: '#7b8ca6',
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '90%',
    alignItems: 'center',
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8faff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e3e8f0',
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  optionIcon: {
    width: 20,
    height: 20,
    borderRadius: 14,
    marginRight: 16,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: 'black',
  },
});

export default AccountScreen;

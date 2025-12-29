import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import {
  icAccountInfo,
  icContactInfo,
  icKeyGrey,
  icLogoutGrey,
  icSampleAvatar,
  icDeleteAccount,
} from '../../images';
import { useAuth } from '../../store/hooks/useAuth';
import CommonLoading from '../../components/commonLoading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOCAL_STORAGE_KEY } from '../../utils/const';

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
  { icon: icKeyGrey, label: 'Đổi mật khẩu', screenName: 'ChangePassword' },
  // {
  //   icon: icContactInfo,
  //   label: 'Thông tin liên hệ',
  //   screenName: 'ContactInformation',
  // },
  { icon: icLogoutGrey, label: 'Đăng xuất', screenName: 'Logout' },
  { icon: icDeleteAccount, label: 'Xoá tài khoản', screenName: 'DeleteAccount' },
];

const AccountScreen = ({ navigation }) => {
  const { logout, user, deleteAccount } = useAuth();
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
    } else if (screenName === 'DeleteAccount') {
      confirmDeleteAccount();
    } else {
      navigation.navigate(screenName);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    await deleteAccount().then(async res => {
      if (res.success) {
        setLoading(false);
        Alert.alert('Thông báo', 'Tài khoản đã được xoá');
        await AsyncStorage.removeItem(LOCAL_STORAGE_KEY.AUTH_TOKEN);
        await AsyncStorage.removeItem(LOCAL_STORAGE_KEY.LOGIN_INFOR);
        setTimeout(() => {
          setLoading(false);
          navigation.replace('Authentication');
        }, 1000);
      } else {
        setLoading(false);
        Alert.alert('Thông báo', 'Đã xảy ra lỗi trong quá trình xoá tài khoản, vui lòng thử lại !');
      }
    });
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      '⚠️ Xoá tài khoản',
      'Bạn có chắc chắn muốn xoá tài khoản không?\n\nTất cả dữ liệu của bạn bao gồm thông tin cá nhân và dữ liệu sản phẩm sẽ bị xoá vĩnh viễn và không thể khôi phục.',
      [
        {
          text: 'Huỷ',
          style: 'cancel',
        },
        {
          text: 'Xoá tài khoản',
          style: 'destructive',
          onPress: () => {
            // TODO: Call API to delete account
            console.log('Tài khoản đã được xoá');
            handleDeleteAccount()
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <CommonLoading visible={loading} text="Đang đăng xuất ..." />
      {/* Top blank/status bar area */}
      <View style={{ height: 44 }} />
      {/* Avatar and user info */}
      <View style={styles.avatarContainer}>
        <Image source={user?.avatar || icSampleAvatar} style={styles.avatar} />
        <Text style={styles.userName}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
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
            <Text style={[styles.optionLabel, item.screenName === 'DeleteAccount' && { color: '#FF0000' }]}>{item.label}</Text>
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  optionIcon: {
    width: 20,
    height: 20,
    borderRadius: 14,
    marginRight: 16,
    resizeMode: 'contain',
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: 'black',
  },
});

export default AccountScreen;

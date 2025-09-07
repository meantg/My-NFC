/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import CommonButton from '../../../components/commonButton';
import CommonHeader from '../../../components/commonHeader';
import CommonModal from '../../../components/commonModal';
import {
  icCloseGrey,
  icEye,
  icSearchGrey,
  icTickBlue,
  icWifi,
} from '../../../images';

const AddNewTagScreen = ({navigation}) => {
  const [locationName, setLocationName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [modalWifiVisible, setModalWifiVisible] = useState(false);
  const [listWifi, setListWifi] = useState([]);
  const [selectedWifi, setSelectedWifi] = useState(null);
  const passwordInputRef = useRef(null);
  useEffect(() => {
    requestPermissions();
    if (Platform.OS === 'ios') {
      getCurrentWifiIOS();
    }
  }, []);

  const getCurrentWifiIOS = async () => {
    try {
      const currentSSID = await WifiManager.getCurrentWifiSSID();
      console.log(`Your current Wi-Fi SSID is ${currentSSID}`);
      setSelectedWifi({SSID: currentSSID, password: ''});
    } catch (error) {
      console.log('Cannot get current SSID!', error);
    }
    return;
  };

  async function requestPermissions() {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Quyền truy cập vị trí',
          message: 'App cần quyền truy cập vị trí để quét mạng Wifi',
          buttonPositive: 'OK',
        },
      );
    }
  }

  async function scanWifi() {
    try {
      await requestPermissions();
      const networks = await WifiManager.loadWifiList();
      const _networks = Object.values(
        networks.reduce((acc, item) => {
          if (!acc[item.SSID]) {
            acc[item.SSID] = item;
          }
          return acc;
        }, {}),
      );
      console.log('Available Networks:', _networks.length);
      setListWifi(_networks);
      // networks is an array of objects like:
      // [{ SSID: 'NetworkName', BSSID: 'xx:xx:xx:xx:xx:xx', level: -45, frequency: 2412, capabilities: 'WPA2' }]
    } catch (error) {
      console.error('Error scanning Wi-Fi:', error);
    }
  }

  const handleContinue = () => {
    navigation.navigate('WebsiteConfig', {
      locationName,
      wifi: selectedWifi,
    });
  };

  const openWifiModal = async () => {
    await scanWifi();
    setModalWifiVisible(true);
  };

  const renderBottomContent = () => {
    return (
      <CommonButton
        text="Lưu"
        style={{width: '90%'}}
        onPress={() => setModalWifiVisible(false)}
      />
    );
  };

  const renderModalContent = () => {
    return (
      <View style={{minHeight: 300, maxHeight: 400}}>
        <ScrollView style={{flex: 1}}>
          {listWifi.map((item, index) => (
            <TouchableOpacity
              onPress={() => setSelectedWifi(item)}
              key={index}
              style={[
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  borderTopWidth: 1,
                  borderTopColor: '#E2E7FB',
                },
                selectedWifi?.SSID === item.SSID && {
                  backgroundColor: '#E2E7FB',
                },
              ]}>
              <Image source={icWifi} style={{width: 20, height: 20}} />
              <Text style={{marginLeft: 10, color: '#38434E'}}>
                {item.SSID}
              </Text>
              {selectedWifi?.SSID === item.SSID && (
                <Image
                  source={icTickBlue}
                  style={{width: 20, height: 20, marginLeft: 'auto'}}
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Header */}
      <CommonHeader title="Thêm Vị Trí" onBack={() => navigation.goBack()} />
      {/* Form */}
      <ScrollView style={styles.formContainer}>
        {/* Tên vị trí */}
        <View style={[styles.card, {paddingHorizontal: 16, paddingTop: 10}]}>
          <Text style={styles.sectionLabel}>TÊN VỊ TRÍ</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập"
            placeholderTextColor="#A0A0A0"
            value={locationName}
            onChangeText={setLocationName}
          />
        </View>
        {/* Cấu hình WiFi */}
        <View style={styles.card}>
          <Text
            style={[styles.sectionLabel, {paddingLeft: 16, paddingTop: 16}]}>
            CẤU HÌNH WIFI
          </Text>
          {/* Mạng WiFi */}
          <View
            style={[
              styles.inputGroup,
              {
                borderBottomWidth: 1,
                borderBottomColor: '#E2E7FB',
                paddingHorizontal: 16,
              },
            ]}>
            <Text style={styles.inputLabel}>MẠNG WIFI</Text>
            <TouchableOpacity
              onPress={openWifiModal}
              disabled={Platform.OS === 'ios'}
              style={styles.inputWithIcon}>
              <Image
                source={selectedWifi?.SSID ? icWifi : icSearchGrey}
                style={styles.leftIcon}
              />
              <View pointerEvents="none">
                <TextInput
                  style={[styles.input, {paddingLeft: 32}]}
                  placeholder="Tìm"
                  placeholderTextColor="#A0A0A0"
                  value={selectedWifi?.SSID}
                />
              </View>
              {Platform.OS === 'android' && selectedWifi?.SSID && (
                <TouchableOpacity
                  style={styles.rightIconBtn}
                  onPress={() => setSelectedWifi(null)}>
                  <Image source={icCloseGrey} style={styles.rightIcon} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>
          {/* Mật khẩu WiFi */}
          <View style={[styles.inputGroup, {paddingHorizontal: 16}]}>
            <Text style={styles.inputLabel}>MẬT KHẨU WIFI</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                ref={passwordInputRef}
                style={styles.input}
                placeholder="Nhập"
                placeholderTextColor="#A0A0A0"
                value={selectedWifi?.password}
                onChangeText={txt => {
                  setSelectedWifi(prev => ({
                    ...prev,
                    password: txt,
                  }));
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.rightIconBtn}
                onPress={() => setShowPassword(prev => !prev)}>
                <Image source={icEye} style={styles.rightIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Bottom Buttons */}
      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}>
          <Text style={styles.cancelBtnText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={
            !(locationName.length > 0 && selectedWifi?.password?.length > 0)
          }
          style={[
            styles.continueBtn,
            locationName.length > 0 &&
              selectedWifi?.password?.length > 0 && {
                backgroundColor: '#162ED0',
              },
          ]}
          onPress={handleContinue}>
          <Text style={styles.continueBtnText}>Tiếp Tục</Text>
        </TouchableOpacity>
      </View>
      <CommonModal
        visible={modalWifiVisible}
        header={'Danh sách Wifi'}
        content={renderModalContent()}
        bottomContent={renderBottomContent()}
        onClose={() => {
          setModalWifiVisible(false);
          setListWifi([]);
        }}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 20,
    paddingHorizontal: 16,
    minHeight: 100,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  formContainer: {
    padding: 16,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#091FB41A',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#E2E7FB',
  },
  sectionLabel: {
    color: '#009459',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    color: '#000',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    borderWidth: 0,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#222',
    marginBottom: 0,
    flex: 1,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 12,
  },
  leftIcon: {
    position: 'absolute',
    width: 20,
    height: 20,
    tintColor: '#A0A0A0',
    zIndex: 1,
  },
  rightIconBtn: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  rightIcon: {
    width: 20,
    height: 20,
    tintColor: '#A0A0A0',
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C9CCDC',
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelBtnText: {
    color: '#38434E',
    fontSize: 16,
    fontWeight: '600',
  },
  continueBtn: {
    flex: 1,
    backgroundColor: '#C9CCDC',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 8,
  },
  continueBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddNewTagScreen;

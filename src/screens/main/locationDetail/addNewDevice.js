/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Image, Keyboard, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NfcManager from 'react-native-nfc-manager';
import CommonButton from '../../../components/commonButton';
import CommonTextInput from '../../../components/commonTextInput';
import { icClose, icCreateUIDone, icEye, icRadioSelected, icRadioUnSelect, icWarningColor, icWifiLocation, imgScanNFC } from '../../../images';
import { useUser } from '../../../store/hooks/useUser';
import { removePasswordProtection, writeNdefMessageWithAuth } from '../../../utils/func';

NfcManager.start();

const AddNewDeviceScreen = ({ navigation, route, setIsModalVisible, wifi, locationData, tagData, wifiList, openWifiModal, modalData, getLocationData, isEdit }) => {
  const { userActivateTag } = useUser()
  const [wifiData, setWifiData] = useState({ ssid: '', password: '' });
  const [productName, setProductName] = useState('');
  const [cardPassword, setCardPassword] = useState();
  const [uri, setUri] = useState('');
  const [deviceType, setDeviceType] = useState('WIFI_SIMPLE');
  const [step, setStep] = useState(1);

  useEffect(() => {
    console.log(locationData);
    console.log('tagData', tagData);
    console.log('wifiList', wifiList);
    console.log('productName', productName);
    console.log('cardPassword', cardPassword);
    console.log('modalData', modalData);
    if (wifi) {
      setWifiData({ ssid: wifi?.SSID, password: wifi?.password });
    }
    if (modalData) {
      setProductName(modalData.name);
      setCardPassword(modalData.key);
    }
    if (tagData?.uid) {
      setDeviceType(tagData?.type === 'wifi' ? 'WIFI_SIMPLE' : 'URI');
    }
  }, [wifi, tagData])

  const handleWrite = async () => {
    try {
      let data = { ...wifiData, productName, cardPassword, uri }
      console.log('handleWrite', data);
      await writeNdefMessageWithAuth({ type: deviceType, data }).then(res => {
        console.log('res', res);
        if (!res) {
          //error
          setStep(3);
        } else {
          //success
          let tag = {
            'name': productName,
            'data': JSON.stringify(data),
            'key': cardPassword,
            'groupId': locationData._id,
            'uid': tagData?.uid,
          }
          userActivateTag(tag).then(res => {
            setStep(4);
          })
        }
      })
    } catch (error) {
      console.log('error in handleWrite', error);
    }
  }

  const removePassword = async () => {
    await removePasswordProtection();
  };

  const renderInputs = () => {
    switch (deviceType) {
      case 'WIFI_SIMPLE':
        return (
          <>
            <CommonTextInput
              title={'Tên wifi (SSID)'}
              value={wifiData.ssid}
              onChangeText={text => setWifiData({ ...wifiData, ssid: text })}
              rightIcon={Platform.OS === 'android' ? icWifiLocation : null}
              onRightPress={() => openWifiModal({
                'name': productName,
                'key': cardPassword,
                'groupId': locationData._id,
                'uid': tagData?.uid,
                'ssid': wifiData.ssid,
              })}
              // onPress={() => openWifiModal({
              //   'name': productName,
              //   'key': cardPassword,
              //   'groupId': locationData._id,
              //   'uid': tagData?.uid,
              //   'ssid': wifiData.ssid,
              // })}
            />
            <CommonTextInput
              title={'Mật khẩu wifi'}
              isPassword={true}
              value={wifiData.password}
              onChangeText={text => setWifiData({ ...wifiData, password: text })}
            />
          </>
        );
      case 'URI':
        return (
          <CommonTextInput
            title={'URL'}
            value={uri}
            onChangeText={setUri}
            autoCapitalize="none"
            keyboardType="url"
          />
        );
    }
  };

  if (step !== 1) {
    return (
      <View>
        <View style={{ position: 'absolute', top: -10, left: 0, paddingBottom: 10, marginBottom: 10, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#38434E' }}>Quét Thẻ NFC</Text>
        </View>
        <View
          style={{
            height: 250,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 40,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: '#38434E',
              textAlign: 'center',
              marginBottom: 20,
              fontWeight: '500',
            }}>
            {step === 3 ? 'Đã xảy ra lỗi trong quá trình quét thẻ,\nvui lòng thử lại !' : step === 4 ? (isEdit ? `Sửa sản phẩm thành công` :  `Thêm sản phẩm thành công`) : 'Vui lòng đặt thẻ lên khu vực quét NFC\ncủa điện thoại và chờ hoàn tất'}
          </Text>
          <Image source={step === 3 ? icWarningColor : step === 4 ? icCreateUIDone : imgScanNFC} style={{ width: 200, height: 200 }} />
        </View>
        <CommonButton grey={step === 2} text={step === 3 ? 'Thử lại' : step === 4 ? 'Đóng' : 'Hủy'} onPress={() => {
          if (step === 3) {
            setStep(2);
            handleWrite();
          } else if (step === 4) {
            setIsModalVisible(false);
            getLocationData();
            setStep(1);
          } else {
            setIsModalVisible(false)
          }
        }} btnContainerStyle={{ marginTop: 40, marginHorizontal: 20 }} />
      </View>
    );
  }

  return (
    <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()} style={styles.container}>
      <View style={{ position: 'absolute', top: -10, left: 0, borderBottomWidth: 1, borderColor: '#E2E7FB', paddingBottom: 10, marginBottom: 10, width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, left: 15, fontWeight: 'bold', color: '#38434E' }}>{isEdit ? `Sửa sản phẩm` : `Thêm sản phẩm`}</Text>
        {/* <TouchableOpacity style={{ marginRight: 15 }} onPress={() => setIsModalVisible(false)}>
          <Image source={icClose} style={{ width: 20, height: 20 }} />
        </TouchableOpacity> */}
      </View>
      <ScrollView>
        <View style={{ padding: 20, marginTop: 20 }}>
          <Text style={{ fontSize: 16, color: '#38434E' }}>Loại sản phẩm</Text>
          <View pointerEvents='none' style={{ flexDirection: 'row', marginTop: 10 }}>
            <TouchableOpacity
              onPress={() => setDeviceType('WIFI_SIMPLE')}
              style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Image source={deviceType === 'WIFI_SIMPLE' ? icRadioSelected : icRadioUnSelect} style={{ width: 20, height: 20 }} />
              <Text style={{ fontSize: 16, color: '#38434E', marginLeft: 10 }}>Wifi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setDeviceType('URI')}
              style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Image source={deviceType === 'URI' ? icRadioSelected : icRadioUnSelect} style={{ width: 20, height: 20 }} />
              <Text style={{ fontSize: 16, color: '#38434E', marginLeft: 10 }}>Website</Text>
            </TouchableOpacity>
          </View>
          <CommonTextInput rightIcon={null} title={'Tên sản phẩm'} value={productName} onChangeText={text => setProductName(text)} />
          <CommonTextInput maxLength={4} rightIcon={icEye} isPassword title={'Mật khẩu thẻ (4 ký tự)'} value={cardPassword} onChangeText={text => setCardPassword(text)} />
          {renderInputs()}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 20,
              marginBottom: -20,
            }}>
            <CommonButton
              onPress={() => {
                setIsModalVisible(false);
                setStep(1);
                setWifiData({ ssid: '', password: '' });
                setProductName('');
              }}
              text="Đóng"
              white={true}
              btnContainerStyle={{ flex: 1, marginRight: 10 }}
            />
            <CommonButton
              disabled={
                !productName ||
                (deviceType === 'WIFI_SIMPLE' && (!wifiData.ssid || !wifiData.password)) ||
                (deviceType === 'URI' && !uri)
              }
              onPress={() => {
                Platform.OS === 'android' && setStep(2);
                handleWrite();
              }}
              text={isEdit ? `Cập Nhật` : `Thêm`} btnContainerStyle={{ flex: 1 }} />
            {/* <CommonButton
              onPress={() => {
                removePasswordProtection();
              }}
              text="Xóa thẻ" btnContainerStyle={{ flex: 1 }} /> */}
          </View>
        </View>
      </ScrollView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
    color: '#38434E',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#666',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddNewDeviceScreen;
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CommonButton from '../../../components/commonButton';
import CommonHeader from '../../../components/commonHeader';
import CommonModal from '../../../components/commonModal';
import {
  icEditGrey,
  icLoading,
  icSettingGrey,
  icShare,
  icTickBlue,
  icTrashBin,
  icTrashGrey,
  icWarningColor,
  icWifiGrey,
  imgScanNFC,
} from '../../../images';
import AddNewDeviceScreen from './addNewDevice';
import WifiManager from 'react-native-wifi-reborn';
import {readTag, removePasswordProtection} from '../../../utils/func';
import {useUser} from '../../../store/hooks/useUser';
import {useIsFocused} from '@react-navigation/native';

const LocationDetail = ({navigation, route}) => {
  const {checkUID, fetchProducts, deleteTag} = useUser();
  const isFocused = useIsFocused();
  const _locationName = route.params?.locationName;
  const _locationData = route.params?.locationData;
  const isAdd = route.params?.isAdd;
  const [locationData, setLocationData] = useState({
    name: '',
    products: [],
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalWifiVisible, setIsModalWifiVisible] = useState(false);
  const [tagData, setTagData] = useState({
    type: '',
    uid: '',
  });
  const [modalType, setModalType] = useState(null);
  const [wifi, setWifi] = useState(null);
  const [wifiList, setWifiList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getLocationData();
    if (Platform.OS === 'ios') {
      getCurrentWifiIOS();
    } else {
      getListWifi();
    }
  }, []);

  // useEffect(()=>{
  //   if (isFocused) {
  //     getLocationData();
  //   }
  // },[isFocused])

  const getLocationData = async () => {
    await fetchProducts().then(res => {
      const id = _locationData._id;
      if (res.success) {
        let findLocation = res.data.find(l => l._id == id);
        if (findLocation) {
          setLocationData(findLocation);
        }
      } else {
        setLocationData(_locationData);
      }
    });
  };

  const getListWifi = async () => {
    try {
      await WifiManager.loadWifiList().then(res => {
        let data = res;
        const uniqueSSID = Object.values(
          data.reduce((acc, item) => {
            if (!acc[item.SSID] || acc[item.SSID].level < item.level) {
              acc[item.SSID] = item;
            }
            return acc;
          }, {}),
        ).filter(item => {
          return (
            item.SSID !== 'NULL' &&
            item.SSID !== '' &&
            item.SSID !== null &&
            item.SSID !== undefined &&
            !item.SSID.includes('<hidden>') &&
            !item.SSID.includes('hidden')
          );
        });
        setWifiList(uniqueSSID);
      });
    } catch (error) {
      console.log('getListWifi', error);
    }
  };

  const getCurrentWifiIOS = async () => {
    try {
      const currentSSID = await WifiManager.getCurrentWifiSSID();
      console.log(`Your current Wi-Fi SSID is ${currentSSID}`);
      setWifi({SSID: currentSSID, password: ''});
    } catch (error) {
      console.log('Cannot get current SSID!', error);
      __DEV__ && setWifi({SSID: 'abc test', password: '12345678'});
    }
    return;
  };

  const handleReadTag = async () => {
    await readTag().then(async res => {
      console.log('handleReadTag', res);
      if (res.serialNumber) {
        setLoading(true);
        await checkUID(res.serialNumber).then(res => {
          console.log('checkUID', res);
          if (res.success) {
            setModalType('addNew');
            setLoading(false);
            setTagData({
              uid: res.data.uid,
              type: res.data.data?.type,
            });
          } else {
            setLoading(false);
            setError(res.error);
          }
        });
      }
    });
  };

  const deleteProduct = async () => {
    setModalType('readTag');
    await removePasswordProtection(modalData.key)
      .then(async res => {
        console.log('removePasswordProtection', res);
        if (res) {
          await deleteTag(modalData._id)
            .then(res => {
              console.log('deleteProduct', res);
              if (res.success) {
                setIsModalVisible(false);
                getLocationData();
              }
            })
            .catch(err => {
              console.log('deleteProduct error', err);
            });
        }
      })
      .catch(err => {
        console.log('removePasswordProtection error', err);
      });
  };

  const handleDeleteProduct = item => {
    console.log('handleDeleteProduct', item);
    let data = JSON.parse(item.data);
    console.log('data', data);
    setModalData({...item, key: data.cardPassword});
    setModalType('delete');
    setIsModalVisible(true);
  };

  const handleEditProduct = item => {
    console.log('handleEditProdct', item);
    let data = JSON.parse(item.data);
    console.log('data', data);
    setTagData({uid: item.uid, type: item.type});
    setWifi({SSID: data.ssid, password: data.password});
    setModalData({...item, key: data.cardPassword});
    setModalType('edit');
    setTimeout(() => {
      setIsModalVisible(true);
    }, 300);
  };

  const renderModalWifiContent = () => {
    return (
      <View style={{borderTopColor: '#E2E7FB', borderTopWidth: 1}}>
        <ScrollView style={{paddingHorizontal: 15}}>
          {wifiList.map((item, index) => (
            <TouchableOpacity
              style={{paddingVertical: 10, flexDirection: 'row'}}
              key={index}
              onPress={() => setWifi(item)}>
              <Image
                source={icWifiGrey}
                style={{width: 20, height: 20, marginRight: 12}}
              />
              <Text style={{color: '#38434E', flex: 1}}>{item.SSID}</Text>
              {wifi?.SSID === item.SSID && (
                <Image
                  source={icTickBlue}
                  style={{width: 20, height: 20, marginRight: 12}}
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderModalWifiButton = () => {
    return (
      <View
        style={{
          paddingHorizontal: 15,
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-around',
        }}>
        <CommonButton
          btnContainerStyle={{width: '48%'}}
          grey
          text="Đóng"
          onPress={() => {
            setWifi(null);
            setIsModalWifiVisible(false);
            setIsModalVisible(true);
          }}
        />
        <CommonButton
          btnContainerStyle={{width: '48%'}}
          text="Chọn"
          onPress={item => {
            setIsModalWifiVisible(false);
            setIsModalVisible(true);
          }}
        />
      </View>
    );
  };
  //
  const renderModalContent = () => {
    if (modalType === 'delete') {
      return (
        <View>
          <Text>Bạn có chắc chắn muốn xóa sản phẩm này không?</Text>
        </View>
      );
    } else if (modalType === 'readTag') {
      return (
        <View>
          <Text>Quét thẻ NFC</Text>
        </View>
      );
    } else if (modalType === 'addNew' || modalType === 'edit') {
      return (
        <View style={{}}>
          <AddNewDeviceScreen
            setIsModalVisible={setIsModalVisible}
            wifi={wifi}
            locationData={locationData}
            tagData={tagData}
            wifiList={wifiList}
            openWifiModal={data => {
              setModalData(data);
              setIsModalVisible(false);
              setIsModalWifiVisible(true);
            }}
            modalData={modalData}
            getLocationData={getLocationData}
            isEdit={modalType === 'edit'}
          />
        </View>
      );
    }
  };

  const renderModalButton = () => {
    if (modalType === 'delete') {
      return (
        <View style={{marginTop: -60}}>
          <Text style={styles.warningTitle}>
            Bạn có chắc chắn muốn xóa sản phẩm
            <Text style={{fontWeight: 'bold'}}>
              {`\n`}
              {modalData.name}{' '}
            </Text>{' '}
            khỏi vị trí này không?
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              paddingHorizontal: 15,
            }}>
            <CommonButton
              onPress={() => {
                setIsModalVisible(false);
              }}
              text="Đóng"
              white={true}
              btnContainerStyle={{flex: 1, marginRight: 10}}
            />
            <CommonButton
              onPress={deleteProduct}
              red={true}
              text="Xóa"
              btnContainerStyle={{flex: 1}}
            />
          </View>
        </View>
      );
    } else if (modalType === 'addNew' || modalType === 'edit') {
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            paddingHorizontal: 15,
          }}>
          <CommonButton
            onPress={() => {
              setIsModalVisible(false);
            }}
            text="Đóng"
            white={true}
            btnContainerStyle={{flex: 1, marginRight: 10}}
          />
          <CommonButton text="Thêm" btnContainerStyle={{flex: 1}} />
        </View>
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Header */}
      <CommonHeader
        title={locationData?.name || _locationData.name}
        titleStyle={{color: '#111921'}}
        onBack={() => (_locationName ? navigation.pop(2) : navigation.goBack())}
        white={true}
        rightContent={
          <TouchableOpacity>
            <Image source={icSettingGrey} style={{width: 20, height: 20}} />
          </TouchableOpacity>
        }
      />
      {/* Form */}
      <ScrollView style={styles.formContainer}>
        {locationData?.products?.map((item, index) => (
          <TouchableOpacity
            onPress={() => handleEditProduct(item)}
            key={index}
            style={styles.productItem}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Image
                source={icWifiGrey}
                style={{width: 20, height: 20, marginRight: 12}}
              />
              <Text style={styles.productItemTitle}>{item.name}</Text>
            </View>
            <View style={styles.productItemRight}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ShareQR', {item})}>
                <Image
                  source={icShare}
                  style={{width: 18, height: 18, marginRight: 15}}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteProduct(item)}>
                <Image
                  source={icTrashGrey}
                  style={{width: 20, height: 20, marginRight: 15}}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleEditProduct(item)}>
                <Image source={icEditGrey} style={{width: 20, height: 20}} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <CommonButton
        text="Thêm Sản Phẩm"
        style={{
          margin: 12,
          width: '90%',
          marginBottom: 30,
        }}
        onPress={() => {
          setModalData(null);
          setWifi(null);
          setTagData({uid: '', type: ''});
          setModalType('readTag');
          setError('');
          setIsModalVisible(true);
          handleReadTag();
        }}
      />
      {/* Bottom Buttons */}
      <CommonModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setModalType('readTag');
          setLoading(false);
        }}
        // header={modalType === 'addNew' ? 'Thêm Sản Phẩm' : `Sửa Sản Phẩm`}
        isWarning={modalType === 'delete' || modalType === 'readTag'}
        icWarning={
          modalType === 'readTag'
            ? loading
              ? icLoading
              : error
              ? icWarningColor
              : imgScanNFC
            : icTrashBin
        }
        isHaveCloseBtn={
          modalType === 'readTag' ? (loading ? false : true) : false
        }
        warningTitle={
          modalType === 'readTag' &&
          (loading
            ? `Đang kiểm tra thẻ NFC trên hệ thống ...`
            : error
            ? error
            : `Vui lòng đặt thẻ lên khu vực quét NFC của điện thoại và chờ hoàn tất`)
        }
        content={renderModalContent()}
        bottomContent={modalType === 'delete' && renderModalButton()}
      />
      <CommonModal
        visible={isModalWifiVisible}
        header={'Danh sách wifi'}
        onClose={() => {
          console.log('close wifi');
          setIsModalWifiVisible(false);
          setIsModalVisible(true);
        }}
        isHaveCloseBtn={false}
        content={renderModalWifiContent()}
        bottomContent={renderModalWifiButton()}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  warningTitle: {
    fontSize: 16,
    color: '#38434E',
    padding: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    color: '#38434E',
    fontWeight: '500',
    marginBottom: 6,
    position: 'relative',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E7FB',
  },
  productItemTitle: {
    flex: 1,
    color: '#38434E',
  },
  productItemRight: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
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
  },
  formContainer: {
    flex: 1,
    padding: 16,
    marginTop: 2,
    backgroundColor: '#f0f5fc',
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
    width: 22,
    height: 22,
    tintColor: '#A0A0A0',
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    backgroundColor: '',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  continueBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LocationDetail;

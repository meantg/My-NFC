/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  icAddGrey,
  icAddTagGrey,
  icCreateUIDone,
  icEditGrey,
  icLoading,
  icRadioSelected,
  icRadioUnSelect,
  icWarningColor,
  icWifiGrey,
  imgScanNFC,
  NextapLogo,
} from '../../images';
import { commonStyles } from '../../utils/styles';
import { useAuth } from '../../store/hooks/useAuth';
import { useUser } from '../../store/hooks/useUser';
import { useIsFocused } from '@react-navigation/native';
import CommonModal from '../../components/commonModal';
import CommonButton from '../../components/commonButton';
import { readTag } from '../../utils/func';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOCAL_STORAGE_KEY } from '../../utils/const';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { fetchProducts, adminCreateTag, pushProductToNfc } = useUser();
  const isFocused = useIsFocused();
  const [lsLocation, setLsLocation] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deviceType, setDeviceType] = useState('wifi');
  const [readTagStep, setReadTagStep] = useState(1);  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadSavedNfcData();
  }, []);

  useEffect(() => {
    isFocused && getLocationData();
  }, [isFocused]);

  const loadSavedNfcData = async () => {
    const savedData = await AsyncStorage.getItem(LOCAL_STORAGE_KEY.NFC_DATA_LIST);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      let pushData = parsedData.map(item => ({
        name: item.name,
        uid: item.uid,
        key: item.key,
        data: (item.data),
      }));
      await pushProductToNfc(pushData).then(async res => {
        getLocationData();
        if (res.success) {
          await AsyncStorage.removeItem(LOCAL_STORAGE_KEY.NFC_DATA_LIST);
        }
      });
    }
  };

  const handleReadNFC = async () => {
    setReadTagStep(2);
    await readTag().then(async res => {
      console.log('readTag', res);
      setLoading(true);
      if (res.serialNumber) {
        await adminCreateTag({
          type: deviceType,
          uid: res.serialNumber,
        }).then(res => {
          setTimeout(() => {
            setLoading(false);
            setError(!res.success);
          }, 300);
        });
      }
      setReadTagStep(3);
    });
  };

  const getLocationData = async () => {
    await fetchProducts().then(res => {
      console.log('getLocationData', res);
      if (res.success) {
        setLsLocation(res.data);
      } else {
        setLsLocation([
          {
            _id: '1',
            name: 'ĐẠI SẢNH',
            products: [
              { id: 1, name: 'Wifi A', key: 'abcd1234' },
              { id: 2, name: 'Cổng chào', key: '123456789' },
            ],
          },
        ]);
      }
    });
  };

  const renderModalContent = () => {
    return (
      <View style={{ padding: 15 }}>
        <Text style={{ fontSize: 16, color: '#38434E' }}>Loại sản phẩm</Text>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <TouchableOpacity
            onPress={() => setDeviceType('wifi')}
            style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Image
              source={deviceType === 'wifi' ? icRadioSelected : icRadioUnSelect}
              style={{ width: 20, height: 20 }}
            />
            <Text style={{ fontSize: 16, color: '#38434E', marginLeft: 10 }}>
              Wifi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDeviceType('website')}
            style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Image
              source={
                deviceType === 'website' ? icRadioSelected : icRadioUnSelect
              }
              style={{ width: 20, height: 20 }}
            />
            <Text style={{ fontSize: 16, color: '#38434E', marginLeft: 10 }}>
              Website
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderBottomContent = () => {
    if (readTagStep == 2) {
      return null;
    }
    return (
      <View style={{ paddingHorizontal: 15, marginBottom: 40 }}>
        <CommonButton
          onPress={handleReadNFC}
          text={
            readTagStep == 3
              ? error
                ? 'Thử lại'
                : 'Tiếp tục thêm thẻ NFC'
              : 'Thêm'
          }
          btnContainerStyle={{ flex: 1 }}
        />
      </View>
    );
  };

  const handleAddNewTag = () => {
    setModalVisible(true);
  };

  const handleOpenDeviceDetail = (item, isAdd) => {
    navigation.navigate('LocationDetail', { locationData: item, isAdd });
  };

  const renderProduct = () => {
    // Example data for one section
    const section = {
      title: 'ĐẠI SẢNH',
      count: 2,
      products: [
        { id: '1', name: 'Wifi A' },
        { id: '2', name: 'Cổng chào' },
      ],
    };
    return (
      <FlatList
        data={lsLocation}
        style={{
          margin: 12,
          borderRadius: 12,
          overflow: 'hidden',
        }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ paddingBottom: 100 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item._id}
            onPress={() => handleOpenDeviceDetail(item)}
            style={styles.homeItemContainer}>
            <LinearGradient
              colors={['#EAF6FF', '#D0E8FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.productHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.productHeaderTitle}>{item.name}</Text>
                <Text style={styles.productHeaderSubtitle}>
                  {item.products?.length} sản phẩm
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleOpenDeviceDetail(item)}
                style={styles.productHeaderIconBtn}>
                <Image source={icEditGrey} style={{ width: 24, height: 24 }} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleOpenDeviceDetail(item, true)}
                style={styles.productHeaderIconBtn}>
                <Image source={icAddGrey} style={{ width: 24, height: 24 }} />
              </TouchableOpacity>
            </LinearGradient>
            {/* {item.products.map((item, idx) => (
              <View key={item.id} style={styles.productRow}>
                <Image
                  source={icWifiGrey}
                  style={{ width: 24, height: 24, marginRight: 8 }}
                />
                <Text style={styles.productRowText}>{item.name}</Text>
              </View>
            ))} */}
          </TouchableOpacity>
        )}
      />
    );
  };

  return (
    <View style={commonStyles.container}>
      {/* User Info */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, {fontSize: 30, fontWeight: 'bold'}]}>MyTap</Text>
        <Text style={styles.headerTitle}>
          🤚 XIN CHÀO {user?.firstName?.toUpperCase()}{' '}
          {user?.lastName?.toUpperCase()} !
        </Text>
        {user?.isAdmin && (
          <TouchableOpacity
            style={styles.addNewTagAdmin}
            onPress={handleAddNewTag}>
            <Image source={icAddTagGrey} style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.addNewTagAdmin}
          onPress={handleAddNewTag}>
          <Image source={icAddTagGrey} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
      </View>
      {renderProduct()}
      <CommonModal
        visible={modalVisible}
        header={readTagStep !== 2 ? 'Quét thẻ NFC' : 'Thêm mới thẻ NFC'}
        isWarning={readTagStep !== 1}
        icWarning={
          readTagStep == 3
            ? error
              ? icWarningColor
              : icCreateUIDone
            : loading
              ? icLoading
              : imgScanNFC
        }
        warningTitle={
          readTagStep == 3
            ? error
              ? 'Đã xảy ra lỗi khi thêm thẻ NFC,\nvui lòng thử lại '
              : 'Thêm mới thẻ NFC thành công'
            : loading
              ? 'Đang khởi tạo thẻ NFC ...'
              : 'Vui lòng đặt thẻ lên khu vực quét NFC của điện thoại và chờ hoàn tất'
        }
        content={renderModalContent()}
        bottomContent={renderBottomContent()}
        onClose={() => {
          setModalVisible(false);
          setReadTagStep(1);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addNewTagAdmin: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  header: {
    paddingLeft: 20,
    marginTop: Platform.OS === 'android' ? 0 : 40,
  },
  headerIcon: {
    width: 132,
    height: 44,
    resizeMode: 'contain',
    color: '#38434E',
  },
  noProduct: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '30%',
  },
  noProductTxt: {
    fontSize: 16,
    color: '#38434E',
    textAlign: 'center',
    marginTop: 5,
  },
  noProductBtn: {
    backgroundColor: '#162ED0',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
  },
  noProductBtnTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noProductIcon: {
    width: 175,
    height: 175,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 16,
    color: '#222',
    marginTop: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eee',
  },
  greeting: {
    fontSize: 14,
    color: '#888',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  list: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  itemAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eee',
  },
  itemInfo: {
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  itemDesc: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 56,
    left: '50%',
    marginLeft: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: -2,
  },
  bottomTab: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 56,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    zIndex: 5,
  },
  tabActive: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: '#000',
    backgroundColor: '#fff',
  },
  tabActiveText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,
  },
  tabInactive: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  tabInactiveText: {
    color: '#bbb',
    fontSize: 15,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  productHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    letterSpacing: 0.5,
  },
  productHeaderSubtitle: {
    fontSize: 15,
    color: '#A0A0A0',
    marginTop: 2,
  },
  productHeaderIconBtn: {
    marginLeft: 12,
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#fff',
  },
  productRowText: {
    fontSize: 16,
    color: '#38434E',
  },
  homeItemContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    borderWidth: 2,
    borderColor: '#E2E7FB',
    // shadowColor: '#091FB41A',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.2,
    shadowRadius: 10,
    marginTop: 15,
  },
});

export default HomeScreen;

/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import CommonButton from '../../../components/commonButton';
import CommonHeader from '../../../components/commonHeader';
import CommonModal from '../../../components/commonModal';
import {
  icEditGrey,
  icSettingGrey,
  icTrashBin,
  icTrashGrey,
  icWifiGrey
} from '../../../images';
import AddNewDeviceScreen from './addNewDevice';

const DeviceDetail = ({navigation}) => {
  const [locationName, setLocationName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productType, setProductType] = useState('wifi');

  const handleContinue = () => {
    navigation.navigate('WebsiteConfig');
  };

  const productList = [
    {
      title: 'Wifi A',
      type: 'wifi',
    },
    {
      title: 'Wifi B',
      type: 'wifi',
    },
    {
      title: 'Wifi C',
      type: 'wifi',
    },
    {
      title: 'Wifi đại sảnh',
      type: 'wifi',
    },
    {
      title: 'Cổng chào',
      type: 'wifi',
    },
  ];

  const handleDeleteProduct = item => {
    setSelectedProduct(item);
    setModalType('delete');
    setIsModalVisible(true);
  };

  const handleEditProduct = item => {
    setSelectedProduct(item);
    setModalType('edit');
    setIsModalVisible(true);
  };
// 
  const renderModalContent = () => {
    if (modalType === 'delete') {
      return (
        <View>
          <Text>Bạn có chắc chắn muốn xóa sản phẩm này không?</Text>
        </View>
      );
    } else if (modalType === 'addNew' || modalType === 'edit') {
      // if (Platform.OS === 'android') {
      //   return (
      //     <View
      //       style={{
      //         height: 250,
      //         alignItems: 'center',
      //         justifyContent: 'center',
      //         marginTop: 10,
      //       }}>
      //       <Text
      //         style={{
      //           fontSize: 16,
      //           color: '#38434E',
      //           textAlign: 'center',
      //           marginBottom: 20,
      //           fontWeight: '500',
      //         }}>
      //         {`Vui lòng đặt thẻ lên khu vực quét NFC\ncủa điện thoại và chờ hoàn tất`}
      //       </Text>
      //       <Image source={imgScanNFC} style={{width: 200, height: 200}} />
      //     </View>
      //   );
      // }
      return (
        <View style={{}}>
          <AddNewDeviceScreen setIsModalVisible={setIsModalVisible} />
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
              {selectedProduct.title}{' '}
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
            <CommonButton red={true} text="Xóa" btnContainerStyle={{flex: 1}} />
          </View>
        </View>
      );
    } else if (modalType === 'addNew' || modalType === 'edit') {
      // if (Platform.OS === 'android') {
      //   return (
      //     <View
      //       style={{
      //         flexDirection: 'row',
      //         justifyContent: 'center',
      //         paddingHorizontal: 15,
      //       }}>
      //       <CommonButton
      //         text="Hủy"
      //         grey
      //         btnContainerStyle={{flex: 1}}
      //         onPress={() => {
      //           setIsModalVisible(false);
      //         }}
      //       />
      //     </View>
      //   );
      // }
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
        title="Tên Khu Vực"
        titleStyle={{color: '#111921'}}
        onBack={() => navigation.goBack()}
        white={true}
        rightContent={
          <TouchableOpacity>
            <Image source={icSettingGrey} style={{width: 20, height: 20}} />
          </TouchableOpacity>
        }
      />
      {/* Form */}
      <ScrollView style={styles.formContainer}>
        {productList.map((item, index) => (
          <TouchableOpacity
            onPress={() => handleEditProduct(item)}
            key={index}
            style={styles.productItem}>
            <Image
              source={icWifiGrey}
              style={{width: 20, height: 20, marginRight: 12}}
            />
            <Text style={styles.productItemTitle}>{item.title}</Text>
            <View style={styles.productItemRight}>
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
          setIsModalVisible(true);
          setModalType('addNew');
        }}
      />
      {/* Bottom Buttons */}
      <CommonModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
        }}
        // header={modalType === 'addNew' ? 'Thêm Sản Phẩm' : `Sửa Sản Phẩm`}
        isWarning={modalType === 'delete'}
        icWarning={icTrashBin}
        isHaveCloseBtn={false}
        // warningTitle={`Bạn có chắc chắn muốn xóa sản phẩm ${selectedProduct.title} khỏi vị trí này không?`}
        content={renderModalContent()}
        bottomContent={modalType === 'delete' && renderModalButton()}
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

export default DeviceDetail;

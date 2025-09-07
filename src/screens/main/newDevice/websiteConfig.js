/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CommonHeader from '../../../components/commonHeader';
import {
  ic6DotsGrey,
  icAddGrey,
  icCloseGrey,
  icEditGrey,
  icEye,
  icLink,
  icMonitorGrey,
  icRating,
  icSearchGrey,
  icText,
  icTickBlue,
  icWifiColor,
} from '../../../images';
import CommonModal from '../../../components/commonModal';
import CommonTextInput from '../../../components/commonTextInput';
import UIConfig from './UIConfig';

const CONTENT_ITEMS = [
  {
    id: '1',
    type: 'text',
    label: 'Văn Bản',
    value: 'Chào mừng bạn',
    icon: icText, // Placeholder, replace with image if available
  },
  {
    id: '2',
    type: 'wifi',
    label: 'Wifi',
    value: 'Wifi đại sảnh',
    icon: icWifiColor, // Placeholder, replace with image if available
  },
  {
    id: '3',
    type: 'link',
    label: 'Liên Kết',
    value: 'Ẩm thực đường phố',
    icon: icLink, // Placeholder, replace with image if available
  },
  {
    id: '4',
    type: 'rating',
    label: 'Đánh Giá',
    value: 'Đánh giá dịch vụ',
    icon: icRating, // Placeholder, replace with image if available
  },
];

const WebsiteConfigScreen = ({navigation}) => {
  const [tab, setTab] = useState('layout');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isWarningModal, setIsWarningModal] = useState(false);
  const [contentType, setContentType] = useState(null);
  const [contentData, setContentData] = useState({
    title: '',
    description: '',
    wifiName: '',
    wifiSSID: '',
    password: '',
  });
  const [step, setStep] = useState(1);

  const handlePreview = () => {
    // navigation.navigate('Preview');
  };

  const handleFindWifi = () => {
    console.log('handleFindWifi');
  };

  const handleAdd = () => {
    setIsModalVisible(true);
    setIsWarningModal(false);
  };

  const renderModalContent = () => {
    if (step === 1) {
      return (
        <View>
          {CONTENT_ITEMS.map((item, idx) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setContentType(item)}
              style={[
                {
                  borderBottomWidth: 1,
                  borderColor: '#E2E7FB',
                  flexDirection: 'row',
                  alignItems: 'center',
                },
              ]}>
              <LinearGradient
                colors={
                  item.type === contentType?.type
                    ? ['#DEE8FF', '#F4F9FF']
                    : ['#fff', '#fff']
                }
                start={{x: 0, y: 0}}
                end={{x: 0.3, y: 0}}
                style={{
                  flex: 1,
                  padding: 15,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={styles.dragHandle}>
                  <Image source={item.icon} style={{width: 16, height: 16}} />
                </View>
                <View style={{flex: 1}}>
                  <Text
                    style={[
                      styles.cardLabel,
                      {fontWeight: '400', color: '#38434E'},
                    ]}>
                    {item.label}
                  </Text>
                </View>
                {item.type === contentType?.type && (
                  <Image source={icTickBlue} style={{width: 16, height: 16}} />
                )}
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    if (step === 2) {
      return (
        <View style={{paddingHorizontal: 15}}>
          <CommonTextInput
            title={contentType.type === 'wifi' ? 'Tên wifi' : 'Tiêu đề'}
            value={contentData?.title}
            onChangeText={text => setContentData({...contentData, title: text})}
            rightIcon={icCloseGrey}
            onRightPress={() => setContentData({...contentData, title: ''})}
          />
          <CommonTextInput
            onPress={handleFindWifi}
            title={
              contentType.type === 'text'
                ? 'Mô tả'
                : contentType.type === 'link'
                ? 'Đường dẫn'
                : contentType.type === 'rating'
                ? 'Đánh giá'
                : 'Mạng wifi'
            }
            placeholder={
              contentType.type === 'wifi' && !contentData?.wifiSSID
                ? `Tìm`
                : `Nhập`
            }
            value={contentData?.description}
            onChangeText={text =>
              setContentData({...contentData, description: text})
            }
            rightIcon={icCloseGrey}
            leftIcon={icSearchGrey}
            onRightPress={() =>
              setContentData({...contentData, description: ''})
            }
          />
          {contentType.type === 'wifi' && (
            <CommonTextInput
              title="Mật khẩu wifi"
              value={contentData?.password}
              onChangeText={text =>
                setContentData({...contentData, password: text})
              }
              rightIcon={icEye}
              isPassword={true}
              onRightPress={() =>
                setContentData({...contentData, password: ''})
              }
            />
          )}
        </View>
      );
    }
  };

  const renderModalButton = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
        }}>
        {(step === 2 || isWarningModal) && (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => {
              setIsModalVisible(false);
              setIsWarningModal(false);
              if (step === 2) {
                setStep(1);
                setContentType(null);
                setContentData({
                  title: '',
                  description: '',
                  wifiName: '',
                  wifiSSID: '',
                  password: '',
                });
              }
            }}>
            <Text style={styles.cancelBtnText}>
              {step === 2 ? `Đóng` : `Hủy`}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            setStep(2);
          }}
          style={{flex: 1, alignItems: 'center'}}>
          <LinearGradient
            colors={
              isWarningModal ? ['#B22626', '#770303'] : ['#162ED0', '#071DAF']
            }
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.doneBtnGradient}>
            <Text style={styles.doneBtnText}>
              {isWarningModal ? 'Hủy Bỏ' : step === 2 ? 'Thêm' : 'Tiếp Tục'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#EAF1FF', '#F6FBFF']}
        style={StyleSheet.absoluteFill}
      />
      {/* Header */}
      <CommonHeader
        title="Cấu Hình Website"
        onBack={() => navigation.goBack()}
        rightContent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.skipText}>BỎ QUA</Text>
          </TouchableOpacity>
        }
      />
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, tab === 'layout' && styles.tabActive]}
          onPress={() => setTab('layout')}>
          <Text
            style={[styles.tabText, tab === 'layout' && styles.tabTextActive]}>
            BỐ CỤC
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'theme' && styles.tabActive]}
          onPress={() => setTab('theme')}>
          <Text
            style={[styles.tabText, tab === 'theme' && styles.tabTextActive]}>
            GIAO DIỆN
          </Text>
        </TouchableOpacity>
      </View>
      {/* Menu */}
      {tab === 'layout' ? (
        <View style={{flex: 1}}>
          <View style={styles.menuContainer}>
            <View style={[styles.menuItem, {flex: 1}]}>
              <Text style={[styles.menuText, {paddingLeft: 15}]}>NỘI DUNG</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity onPress={handlePreview} style={styles.menuItem}>
                <Image
                  source={icMonitorGrey}
                  style={{width: 20, height: 20, marginRight: 8}}
                />
                <Text style={styles.menuText}>XEM TRƯỚC</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAdd} style={styles.menuItem}>
                <Image
                  source={icAddGrey}
                  style={{width: 20, height: 20, marginRight: 8}}
                />
                <Text style={styles.menuText}>THÊM</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Content List */}
          <ScrollView
            style={styles.contentList}
            contentContainerStyle={{paddingBottom: 24}}>
            {CONTENT_ITEMS.map((item, idx) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.dragHandle}>
                  <Image source={ic6DotsGrey} style={styles.iconText} />
                </View>
                <View style={styles.iconBox}>
                  {/* Replace with image if available */}
                  <Image source={item.icon} style={styles.iconText} />
                </View>
                <View style={{flex: 1}}>
                  <Text
                    style={[styles.cardLabel, {textTransform: 'uppercase'}]}>
                    {item.label}
                  </Text>
                  <Text style={styles.cardValue}>{item.value}</Text>
                </View>
                <TouchableOpacity style={styles.editBtn}>
                  <Image source={icEditGrey} style={styles.iconText} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          {/* Bottom Buttons */}
          <View style={styles.bottomButtonsContainer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setIsWarningModal(true);
                setIsModalVisible(true);
              }}>
              <Text style={styles.cancelBtnText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTab('theme')}
              style={styles.doneBtn}>
              <LinearGradient
                colors={['#162ED0', '#071DAF']}
                style={styles.doneBtnGradient}>
                <Text style={styles.doneBtnText}>Tiếp Tục</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <UIConfig />
      )}
      <CommonModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setIsWarningModal(false);
          if (step === 2) {
            setStep(1);
            setContentType(null);
            setContentData({
              title: '',
              description: '',
              wifiName: '',
              wifiSSID: '',
              password: '',
            });
          }
        }}
        header={step === 1 ? `Thêm Nội Dung` : `Thêm ${contentType?.label}`}
        isWarning={isWarningModal}
        warningTitle={`Bạn có chắc muốn hủy bỏ quá trình\nthêm mới vị trí không?`}
        content={renderModalContent()}
        bottomContent={renderModalButton()}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  skipText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'right',
    marginRight: 2,
  },
  doneBtnGradient: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E7FB',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    backgroundColor: '#0217A5',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A0A0A0',
  },
  tabTextActive: {
    color: '#fff',
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuItem: {
    marginRight: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#38434E',
  },
  menuTextActive: {
    color: '#009459',
  },
  contentList: {
    flex: 1,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#091FB41A',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  dragHandle: {
    width: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  dragDots: {
    fontSize: 18,
    color: '#C9CCDC',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F6FBFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    width: 24,
    height: 24,
  },
  cardLabel: {
    fontSize: 14,
    color: '#787D90',
    fontWeight: '700',
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 15,
    color: '#38434E',
    fontWeight: '500',
  },
  editBtn: {
    marginLeft: 10,
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  editIcon: {
    fontSize: 18,
    color: '#A0A0A0',
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
  doneBtn: {
    flex: 1,
    alignItems: 'center',
    marginLeft: 8,
  },
  doneBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WebsiteConfigScreen;

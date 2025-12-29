/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  ScrollView,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { commonStyles } from '../../utils/styles';
import CommonLoading from '../../components/commonLoading';
import CommonTextInput from '../../components/commonTextInput';
import { imgScanNFC, icTrashGrey, icRadioSelected, icRadioUnSelect, icCreateUIDone, icWarningColor, icEye, icWifiGrey, icEditGrey, icShare } from '../../images';
import { readTag, writeNdefMessageWithAuth, removePasswordProtection } from '../../utils/func';
import NfcManager from 'react-native-nfc-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOCAL_STORAGE_KEY } from '../../utils/const';
import { useUser } from '../../store/hooks/useUser';

// NFC List Item component (like LocationItem in detail.js)
const NfcListItem = ({ item, onPress, onDelete, onEdit, onShare }) => {
  const [isExpand, setIsExpand] = useState(false);

  const handlePress = () => {
    setIsExpand(!isExpand);
  };

  // Get written data for display
  const productName = item.hasWrittenData
    ? item.writtenData?.productName || item.name || item.serialNumber
    : item.serialNumber;
  const ssid = item.writtenData?.ssid || '';
  const password = item.writtenData?.password || '';

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={1}
      style={styles.productItem}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={icWifiGrey}
            style={{ width: 20, height: 20, marginRight: 12 }}
          />
          <Text style={styles.productItemTitle}>{productName}</Text>
        </View>
        <View style={styles.productItemRight}>
          <TouchableOpacity onPress={onShare}>
            <Image
              source={icShare}
              style={{ width: 18, height: 18, marginRight: 25 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete}>
            <Image
              source={icTrashGrey}
              style={{ width: 20, height: 20, marginRight: 20 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onEdit}>
            <Image source={icEditGrey} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
        </View>
      </View>
      {isExpand && item.hasWrittenData && (
        <View style={{ paddingTop: 10 }}>
          <Text style={styles.productItemTitle}>Wifi: {ssid}</Text>
          <Text style={styles.productItemTitle}>Password: {password}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const PreLoginScreen = ({ navigation }) => {
  const { checkUID } = useUser();
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Đang quét...');
  const [nfcSupported, setNfcSupported] = useState(true);
  const [nfcData, setNfcData] = useState(null);
  const [showNfcModal, setShowNfcModal] = useState(false);
  const [savedNfcList, setSavedNfcList] = useState([]);
  const [selectedNfcItem, setSelectedNfcItem] = useState(null);

  // Write modal states
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [writeStep, setWriteStep] = useState(1); // 1: form, 2: writing, 3: error, 4: success
  const [deviceType, setDeviceType] = useState('WIFI_SIMPLE');
  const [productName, setProductName] = useState('');
  const [cardPassword, setCardPassword] = useState('');
  const [wifiData, setWifiData] = useState({ ssid: '', password: '' });
  const [uri, setUri] = useState('');
  const [currentTagData, setCurrentTagData] = useState(null);

  useEffect(() => {
    checkNfcSupport();
    getLoginInfor();
    loadSavedNfcData();
  }, []);

  const getLoginInfor = async () => {
    const loginInfor = await AsyncStorage.getItem(LOCAL_STORAGE_KEY.LOGIN_INFOR);
    if (loginInfor && loginInfor.length > 0) {
      navigation.navigate('Login');
    }
  };

  const loadSavedNfcData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(LOCAL_STORAGE_KEY.NFC_DATA_LIST);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log('parsedData', parsedData);
        setSavedNfcList(parsedData);
      }
    } catch (error) {
      console.log('Error loading saved NFC data:', error);
    }
  };

  const saveNfcDataToStorage = async (newNfcData) => {
    try {
      // Check if tag already exists
      const existingIndex = savedNfcList.findIndex(
        item => item.serialNumber === newNfcData.serialNumber,
      );

      let updatedList;
      if (existingIndex !== -1) {
        // Update existing tag
        updatedList = [...savedNfcList];
        updatedList[existingIndex] = {
          ...newNfcData,
          updatedAt: new Date().toISOString(),
        };
      } else {
        // Add new tag
        updatedList = [
          ...savedNfcList,
          {
            ...newNfcData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
      }

      await AsyncStorage.setItem(
        LOCAL_STORAGE_KEY.NFC_DATA_LIST,
        JSON.stringify(updatedList),
      );
      setSavedNfcList(updatedList);
      return true;
    } catch (error) {
      console.log('Error saving NFC data:', error);
      return false;
    }
  };

  const deleteNfcData = async (item) => {
    // Get card password from item (like detail.js uses modalData.key)
    const cardKey = item.key || item.writtenData?.cardPassword;
    
    if (!cardKey) {
      // No password protection, just delete from local storage
      try {
        const updatedList = savedNfcList.filter(
          i => i.serialNumber !== item.serialNumber,
        );
        await AsyncStorage.setItem(
          LOCAL_STORAGE_KEY.NFC_DATA_LIST,
          JSON.stringify(updatedList),
        );
        setSavedNfcList(updatedList);
        setShowNfcModal(false);
        setSelectedNfcItem(null);
      } catch (error) {
        console.log('Error deleting NFC data:', error);
      }
      return;
    }

    // Has password - need to remove password protection first (like detail.js deleteProduct)
    setLoading(true);
    setLoadingText('Đang xóa bảo vệ mật khẩu...');

    await removePasswordProtection(cardKey)
      .then(async res => {
        console.log('removePasswordProtection', res);
        if (res) {
          // Success - delete from local storage
          try {
            const updatedList = savedNfcList.filter(
              i => i.serialNumber !== item.serialNumber,
            );
            await AsyncStorage.setItem(
              LOCAL_STORAGE_KEY.NFC_DATA_LIST,
              JSON.stringify(updatedList),
            );
            setSavedNfcList(updatedList);
            setShowNfcModal(false);
            setSelectedNfcItem(null);
            setLoading(false);
          } catch (error) {
            console.log('Error deleting NFC data:', error);
            setLoading(false);
          }
        } else {
          setLoading(false);
          setNfcData({ error: 'Đã xảy ra lỗi trong quá trình xóa thẻ NFC, vui lòng thử lại !' });
          setShowNfcModal(true);
        }
      })
      .catch(err => {
        console.log('removePasswordProtection error', err);
        setLoading(false);
        setNfcData({ error: 'Đã xảy ra lỗi trong quá trình xóa thẻ NFC, vui lòng thử lại !' });
        setShowNfcModal(true);
      });
  };

  const confirmDeleteNfc = (item) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa thẻ NFC này khỏi danh sách?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => deleteNfcData(item),
        },
      ],
    );
  };

  const checkNfcSupport = async () => {
    try {
      const supported = await NfcManager.isSupported();
      if (supported) {
        await NfcManager.start();
      }
      setNfcSupported(supported);
    } catch (error) {
      console.log('NFC init error:', error);
      setNfcSupported(false);
    }
  };

  const handleGoToLogin = () => {
    navigation.navigate('Login');
  };

  const handleScanNfc = async () => {
    if (!nfcSupported) {
      setNfcData({ error: 'Thiết bị không hỗ trợ NFC' });
      setShowNfcModal(true);
      return;
    }

    try {
      const isEnabled = await NfcManager.isEnabled();
      if (!isEnabled) {
        setNfcData({ error: 'NFC chưa được bật. Vui lòng bật NFC trong cài đặt.' });
        setShowNfcModal(true);
        if (Platform.OS === 'android') {
          NfcManager.goToNfcSetting();
        }
        return;
      }

      setLoading(true);
      setLoadingText('Đặt thẻ NFC gần thiết bị...');

      await readTag().then(async res => {
        console.log('handleReadTag', res);

        if (res && res.serialNumber) {
          setLoadingText('Đang kiểm tra thẻ NFC trên hệ thống...');

          // Call checkUID API to verify tag on server (like detail.js)
          const checkResult = await checkUID(res.serialNumber);
          console.log('checkUID result:', checkResult);
          if (!checkResult.success) {
            setLoading(false);
            setNfcData({ error: checkResult.error });
            setShowNfcModal(true);
            return;
          }

          const formattedData = formatNfcData(res);

          // Add server data if checkUID was successful
          if (checkResult.success) {
            formattedData.serverUid = checkResult.data.uid;
            formattedData.serverType = checkResult.data.data?.type;
            formattedData.isRegistered = true;
            formattedData.serverData = checkResult.data;
          } else {
            formattedData.isRegistered = false;
            formattedData.serverError = checkResult.error;
          }

          setLoadingText('Đang lưu dữ liệu...');
          const saved = await saveNfcDataToStorage(formattedData);

          setLoading(false);

          if (saved) {
            setNfcData(formattedData);
            setShowNfcModal(true);
          } else {
            setNfcData({ error: 'Không thể lưu dữ liệu NFC' });
            setShowNfcModal(true);
          }
        } else {
          setLoading(false);
          setNfcData({ error: 'Không tìm thấy thẻ NFC' });
          setShowNfcModal(true);
        }
      });
    } catch (error) {
      setLoading(false);
      console.log('NFC scan error:', error);
      setNfcData({ error: `Lỗi quét NFC: ${error.message || error}` });
      setShowNfcModal(true);
    }
  };

  const formatNfcData = tag => {
    const data = {
      serialNumber: tag.serialNumber || 'N/A',
      tagType: tag.tagType || 'N/A',
      chip: tag.chip || 'N/A',
      tech: tag.tech || 'N/A',
      atqa: tag.atqa || 'N/A',
      sak: tag.sak || 'N/A',
      memoryInfo: tag.memoryInfo || 'N/A',
      dataFormat: tag.dataFormat || 'N/A',
      size: tag.size || 'N/A',
      writable: tag.writable,
      passwordProtected: tag.passwordProtected,
    };

    // Parse NDEF records if available
    if (tag.records && tag.records.length > 0) {
      data.ndefRecords = tag.records.map((record, index) => ({
        index: index + 1,
        type: record.type || 'N/A',
        payload: record.payload || record.text || record.uri || 'Trống',
      }));
    }

    return data;
  };

  const closeNfcModal = () => {
    setShowNfcModal(false);
    setTimeout(() => {
      setNfcData(null);
      setSelectedNfcItem(null);
    }, 300);
  };

  const openNfcDetail = item => {
    setSelectedNfcItem(item);
    setNfcData(item);
    setShowNfcModal(true);
  };

  // Write NFC functions
  const openWriteModal = (tagData = null) => {
    setCurrentTagData(tagData);
    setWriteStep(1);
    setDeviceType('WIFI_SIMPLE');
    setProductName('');
    setCardPassword('');
    setWifiData({ ssid: '', password: '' });
    setUri('');
    setShowWriteModal(true);
  };

  // Scan and write new tag (like addNewDevice.js flow)
  const handleScanAndWrite = async () => {
    if (!nfcSupported) {
      setNfcData({ error: 'Thiết bị không hỗ trợ NFC' });
      setShowNfcModal(true);
      return;
    }

    try {
      const isEnabled = await NfcManager.isEnabled();
      if (!isEnabled) {
        setNfcData({ error: 'NFC chưa được bật. Vui lòng bật NFC trong cài đặt.' });
        setShowNfcModal(true);
        if (Platform.OS === 'android') {
          NfcManager.goToNfcSetting();
        }
        return;
      }

      setLoading(true);
      setLoadingText('Quét thẻ NFC để ghi dữ liệu...');

      await readTag().then(async res => {
        console.log('handleScanAndWrite - readTag result:', res);

        if (res && res.serialNumber) {
          setLoadingText('Đang kiểm tra thẻ...');

          // Check UID on server
          const checkResult = await checkUID(res.serialNumber);
          console.log('checkUID result:', checkResult);
          if (!checkResult.success) {
            setLoading(false);
            setNfcData({ error: checkResult.error });
            setShowNfcModal(true);
            return;
          }

          const tagData = {
            serialNumber: res.serialNumber,
            chip: res.chip || 'N/A',
            tagType: res.tagType || 'N/A',
            isRegistered: checkResult.success,
            serverUid: checkResult.success ? checkResult.data.uid : null,
            serverType: checkResult.success ? checkResult.data.data?.type : null,
          };

          setLoading(false);
          // Open write modal with scanned tag data
          openWriteModal(tagData);
        } else {
          setLoading(false);
          setNfcData({ error: 'Không tìm thấy thẻ NFC' });
          setShowNfcModal(true);
        }
      });
    } catch (error) {
      setLoading(false);
      console.log('Scan error:', error);
      setNfcData({ error: `Lỗi quét NFC: ${error.message || error}` });
      setShowNfcModal(true);
    }
  };

  const closeWriteModal = () => {
    setShowWriteModal(false);
    setWriteStep(1);
    setCurrentTagData(null);
  };

  const handleWrite = async () => {
    try {
      const data = { ...wifiData, productName, cardPassword, uri };
      console.log('handleWrite', data);

      if (Platform.OS === 'android') {
        setWriteStep(2);
      }

      const result = await writeNdefMessageWithAuth({ type: deviceType, data });
      console.log('writeNdefMessageWithAuth result:', result);

      if (!result) {
        setWriteStep(3); // Error
      } else {
        // Success - save written data to local storage (like addNewDevice.js)
        const writtenTagData = {
          // Tag identifier - use currentTagData's serialNumber if available
          serialNumber: currentTagData?.serialNumber || `local_${Date.now()}`,
          uid: currentTagData?.serialNumber || `local_${Date.now()}`,
          // Product info (like addNewDevice.js format)
          name: productName,
          type: deviceType === 'WIFI_SIMPLE' ? 'wifi' : 'uri',
          key: cardPassword,
          // Store full data as JSON string (like addNewDevice.js)
          data: JSON.stringify(data),
          // Parsed written data for display
          writtenData: {
            type: deviceType,
            productName,
            cardPassword,
            ...(deviceType === 'WIFI_SIMPLE'
              ? { ssid: wifiData.ssid, password: wifiData.password }
              : { uri }),
          },
          hasWrittenData: true,
          writtenAt: new Date().toISOString(),
          createdAt: currentTagData?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          // Keep original tag info if available
          chip: currentTagData?.chip || 'N/A',
          tagType: currentTagData?.tagType || 'N/A',
        };
        await saveNfcDataToStorage(writtenTagData);
        setWriteStep(4); // Success
      }
    } catch (error) {
      console.log('error in handleWrite', error);
      setWriteStep(3); // Error
    }
  };

  const isWriteFormValid = () => {
    if (!productName || !cardPassword || cardPassword.length !== 4) {
      return false;
    }
    if (deviceType === 'WIFI_SIMPLE') {
      return wifiData.ssid && wifiData.password;
    }
    if (deviceType === 'URI') {
      return uri;
    }
    return false;
  };

  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderWriteModal = () => (
    <Modal
      visible={showWriteModal}
      transparent
      animationType="fade"
      onRequestClose={closeWriteModal}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <View style={styles.modalOverlay}>
          <View style={styles.writeModalContainer}>
            {writeStep === 1 ? (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Ghi dữ liệu NFC</Text>
                  <TouchableOpacity onPress={closeWriteModal} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.writeModalContent}>
                  <Text style={styles.writeLabel}>Loại sản phẩm</Text>
                  <View style={styles.deviceTypeContainer}>
                    <TouchableOpacity
                      style={styles.deviceTypeOption}
                      onPress={() => setDeviceType('WIFI_SIMPLE')}>
                      <Image
                        source={deviceType === 'WIFI_SIMPLE' ? icRadioSelected : icRadioUnSelect}
                        style={styles.radioIcon}
                      />
                      <Text style={styles.deviceTypeText}>Wifi</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                    style={styles.deviceTypeOption}
                    onPress={() => setDeviceType('URI')}>
                    <Image
                      source={deviceType === 'URI' ? icRadioSelected : icRadioUnSelect}
                      style={styles.radioIcon}
                    />
                    <Text style={styles.deviceTypeText}>Website</Text>
                  </TouchableOpacity> */}
                  </View>

                  <CommonTextInput
                    title="Tên sản phẩm"
                    value={productName}
                    onChangeText={setProductName}
                    rightIcon={null}
                  />

                  <CommonTextInput
                    title="Mật khẩu thẻ (4 ký tự)"
                    value={cardPassword}
                    onChangeText={text => setCardPassword(text.slice(0, 4))}
                    maxLength={4}
                    isPassword
                    rightIcon={icEye}
                  />

                  {deviceType === 'WIFI_SIMPLE' ? (
                    <>
                      <CommonTextInput
                        title="Tên wifi (SSID)"
                        value={wifiData.ssid}
                        onChangeText={text => setWifiData({ ...wifiData, ssid: text })}
                        rightIcon={null}
                      />
                      <CommonTextInput
                        title="Mật khẩu wifi"
                        value={wifiData.password}
                        onChangeText={text => setWifiData({ ...wifiData, password: text })}
                        isPassword
                        rightIcon={icEye}
                        style={{paddingBottom: 50}}
                      />
                    </>
                  ) : (
                    <CommonTextInput
                      title="URL"
                      value={uri}
                      onChangeText={setUri}
                      autoCapitalize="none"
                      keyboardType="url"
                      rightIcon={null}
                    />
                  )}
                </ScrollView>
                <View style={styles.writeModalButtons}>
                  <TouchableOpacity
                    style={styles.writeModalCancelButton}
                    onPress={closeWriteModal}>
                    <Text style={styles.writeModalCancelText}>Đóng</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.writeModalSubmitButton,
                      !isWriteFormValid() && styles.writeModalSubmitButtonDisabled,
                    ]}
                    onPress={handleWrite}
                    disabled={!isWriteFormValid()}>
                    <Text style={styles.writeModalSubmitText}>Ghi thẻ</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.writeStatusContainer}>
                <Text style={styles.writeStatusTitle}>
                  {writeStep === 2
                    ? 'Đang ghi thẻ NFC...'
                    : writeStep === 3
                      ? 'Đã xảy ra lỗi'
                      : 'Ghi thẻ thành công!'}
                </Text>
                <Text style={styles.writeStatusDescription}>
                  {writeStep === 2
                    ? 'Vui lòng đặt thẻ lên khu vực quét NFC\ncủa điện thoại và chờ hoàn tất'
                    : writeStep === 3
                      ? 'Đã xảy ra lỗi trong quá trình ghi thẻ,\nvui lòng thử lại!'
                      : 'Dữ liệu đã được ghi vào thẻ NFC thành công'}
                </Text>
                <Image
                  source={
                    writeStep === 2
                      ? imgScanNFC
                      : writeStep === 3
                        ? icWarningColor
                        : icCreateUIDone
                  }
                  style={styles.writeStatusIcon}
                  resizeMode="contain"
                />
                <View style={styles.writeStatusButtonContainer}>
                  {writeStep !== 4 && <TouchableOpacity
                    style={[
                      styles.writeStatusButton,
                      writeStep === 3 && styles.writeStatusButtonRetry,
                    ]}
                    onPress={() => {
                      if (writeStep === 3) {
                        setWriteStep(2);
                        handleWrite();
                      } else if (writeStep === 4) {
                        closeWriteModal();
                        loadSavedNfcData();
                      }
                    }}>
                    <Text style={styles.writeStatusButtonText}>
                      {writeStep === 3 ? 'Thử lại' : writeStep === 4 ? 'Đóng' : ''}
                    </Text>
                  </TouchableOpacity>}
                  <TouchableOpacity
                    style={[
                      styles.writeStatusButton,
                      // writeStep === 3 && styles.writeStatusButtonRetry,
                    ]}
                    onPress={() => {
                      closeWriteModal();
                    }}>
                    <Text style={styles.writeStatusButtonText}>
                      Đóng
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  const renderNfcDataModal = () => (
    <Modal
      visible={showNfcModal}
      transparent
      animationType="fade"
      onRequestClose={closeNfcModal}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {nfcData?.error
                ? 'Thông báo'
                : nfcData?.hasWrittenData
                  ? 'Chi tiết sản phẩm'
                  : 'Thông tin thẻ NFC'}
            </Text>
            <TouchableOpacity onPress={closeNfcModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {nfcData?.error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{nfcData.error}</Text>
              </View>
            ) : nfcData?.hasWrittenData && nfcData.writtenData ? (
              /* Show written data prominently - like detail.js */
              <>
                <View style={styles.productInfoSection}>
                  <Text style={styles.productName}>
                    {nfcData.writtenData.productName}
                  </Text>
                  <View style={styles.productTypeBadge}>
                    <Text style={styles.productTypeBadgeText}>
                      {nfcData.writtenData.type === 'WIFI_SIMPLE' ? '📶 Wifi' : '🔗 Website'}
                    </Text>
                  </View>
                </View>

                {nfcData.writtenData.type === 'WIFI_SIMPLE' ? (
                  <View style={styles.writtenInfoContainer}>
                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>Tên wifi (SSID):</Text>
                      <Text style={styles.dataValue}>
                        {nfcData.writtenData.ssid}
                      </Text>
                    </View>
                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>Mật khẩu wifi:</Text>
                      <Text style={styles.dataValue}>{nfcData.writtenData.password}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.writtenInfoContainer}>
                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>URL:</Text>
                      <Text style={[styles.dataValue, styles.urlText]} numberOfLines={2}>
                        {nfcData.writtenData.uri}
                      </Text>
                    </View>
                  </View>
                )}

                {/* <View style={styles.tagInfoSection}>
                  <Text style={styles.sectionTitle}>Thông tin thẻ</Text>
                  <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>UID:</Text>
                    <Text style={styles.dataValue}>{nfcData?.serialNumber}</Text>
                  </View>
                  <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>Chip:</Text>
                    <Text style={styles.dataValue}>{nfcData?.chip}</Text>
                  </View>
                  {nfcData.writtenAt && (
                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>Ghi lúc:</Text>
                      <Text style={styles.dataValue}>
                        {formatDate(nfcData.writtenAt)}
                      </Text>
                    </View>
                  )}
                </View> */}
              </>
            ) : (
              /* Show raw tag info when no data written */
              <>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Serial Number:</Text>
                  <Text style={styles.dataValue}>{nfcData?.serialNumber}</Text>
                </View>

                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Loại thẻ:</Text>
                  <Text style={styles.dataValue}>{nfcData?.tagType}</Text>
                </View>

                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Chip:</Text>
                  <Text style={styles.dataValue}>{nfcData?.chip}</Text>
                </View>

                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Công nghệ:</Text>
                  <Text style={styles.dataValue}>{nfcData?.tech}</Text>
                </View>

                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>ATQA:</Text>
                  <Text style={styles.dataValue}>{nfcData?.atqa}</Text>
                </View>

                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>SAK:</Text>
                  <Text style={styles.dataValue}>{nfcData?.sak}</Text>
                </View>

                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Bộ nhớ:</Text>
                  <Text style={styles.dataValue}>{nfcData?.memoryInfo}</Text>
                </View>

                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Định dạng:</Text>
                  <Text style={styles.dataValue}>{nfcData?.dataFormat}</Text>
                </View>

                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Kích thước:</Text>
                  <Text style={styles.dataValue}>{nfcData?.size}</Text>
                </View>

                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Có thể ghi:</Text>
                  <Text style={styles.dataValue}>
                    {nfcData?.writable ? 'Có' : 'Không'}
                  </Text>
                </View>

                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Bảo vệ mật khẩu:</Text>
                  <Text style={styles.dataValue}>
                    {nfcData?.passwordProtected ? 'Có' : 'Không'}
                  </Text>
                </View>

                {/* Server registration status */}
                <View style={styles.serverStatusSection}>
                  <Text style={styles.sectionTitle}>Trạng thái đăng ký:</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      nfcData?.isRegistered
                        ? styles.statusRegistered
                        : styles.statusNotRegistered,
                    ]}>
                    <Text
                      style={[
                        styles.statusBadgeText,
                        nfcData?.isRegistered
                          ? styles.statusRegisteredText
                          : styles.statusNotRegisteredText,
                      ]}>
                      {nfcData?.isRegistered
                        ? '✓ Đã đăng ký trên hệ thống'
                        : '✗ Chưa đăng ký'}
                    </Text>
                  </View>
                  {nfcData?.isRegistered && nfcData?.serverType && (
                    <View style={styles.dataRow}>
                      <Text style={styles.dataLabel}>Loại:</Text>
                      <Text style={styles.dataValue}>
                        {nfcData.serverType === 'wifi' ? 'Wifi' : 'Website'}
                      </Text>
                    </View>
                  )}
                  {!nfcData?.isRegistered && nfcData?.serverError && (
                    <Text style={styles.serverErrorText}>
                      {nfcData.serverError}
                    </Text>
                  )}
                </View>

                {nfcData?.ndefRecords && nfcData.ndefRecords.length > 0 && (
                  <View style={styles.ndefSection}>
                    <Text style={styles.sectionTitle}>NDEF Records:</Text>
                    {nfcData.ndefRecords.map((record, idx) => (
                      <View key={idx} style={styles.recordContainer}>
                        <Text style={styles.recordIndex}>
                          Record #{record.index}
                        </Text>
                        <Text style={styles.recordDetail}>
                          Loại: {record.type}
                        </Text>
                        <Text style={styles.recordDetail}>
                          Nội dung: {record.payload}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
          </ScrollView>

          <View style={styles.modalButtonContainer}>
            {selectedNfcItem && !nfcData?.error && (
              <>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => confirmDeleteNfc(selectedNfcItem)}>
                  <Text style={styles.deleteButtonText}>Xóa</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={styles.writeButton}
                  onPress={() => {
                    closeNfcModal();
                    setTimeout(() => openWriteModal(selectedNfcItem), 300);
                  }}>
                  <Text style={styles.writeButtonText}>Ghi thẻ</Text>
                </TouchableOpacity> */}
              </>
            )}
            <TouchableOpacity
              style={[
                styles.modalButton,
                selectedNfcItem && !nfcData?.error && { flex: 1 },
              ]}
              onPress={closeNfcModal}>
              <Text style={styles.modalButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={commonStyles.container}>
      <CommonLoading visible={loading} text={loadingText} />
      <View style={styles.content}>
        <Text style={styles.title}>MyTap</Text>
        <Text style={styles.subtitle}>Chào mừng bạn đến với MyTap</Text>

        {!nfcSupported && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>
              ⚠️ Thiết bị của bạn không hỗ trợ NFC
            </Text>
          </View>
        )}

        {/* Saved NFC List - Main Content */}
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {savedNfcList.length > 0 ? (
            <View style={styles.savedListContainer}>
              <Text style={styles.savedListTitle}>
                Danh sách thẻ NFC ({savedNfcList.length})
              </Text>
              {savedNfcList.map((item, index) => (
                <NfcListItem
                  key={item.serialNumber || index}
                  item={item}
                  onPress={() => openNfcDetail(item)}
                  onDelete={() => confirmDeleteNfc(item)}
                  onEdit={() => {
                    setCurrentTagData(item);
                    openWriteModal(item);
                  }}
                  onShare={() => navigation.navigate('ShareQR', { item })}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Image
                source={imgScanNFC}
                style={styles.emptyIcon}
                resizeMode="contain"
              />
              <Text style={styles.emptyTitle}>Chưa có sản phẩm nào</Text>
              <Text style={styles.emptyDescription}>
                Nhấn nút bên dưới để quét và lưu sản phẩm
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom Buttons */}
        <View style={styles.bottomContainer}>
          <View style={styles.actionButtonsRow}>
            {/* <TouchableOpacity
                style={styles.scanButton}
                onPress={handleScanNfc}
                activeOpacity={0.8}>
                <Image
                  source={imgScanNFC}
                  style={styles.scanButtonIcon}
                  resizeMode="contain"
                />
                <Text style={styles.scanButtonText}>Quét thẻ</Text>
              </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.writeNewButton}
              onPress={handleScanAndWrite}
              activeOpacity={0.8}>
              <Text style={styles.writeNewButtonText}>✏️ Bắt đầu</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleGoToLogin}
            activeOpacity={0.8}>
            <Text style={styles.loginButtonText}>Đăng Ký / Đăng Nhập</Text>
          </TouchableOpacity>
          <Text style={styles.loginHintText}>
            Đăng nhập để quản lý sản phẩm ở bất cứ thiết bị nào
          </Text>
        </View>
      </View>

      {renderNfcDataModal()}
      {renderWriteModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  writeStatusButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  writeStatusButton: {
    flex: 1,
  },
  writeStatusButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: '12%',
  },
  scrollContainer: {
    flex: 1,
  },
  title: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#38434E',
    alignSelf: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#787D90',
    alignSelf: 'center',
    marginBottom: 20,
  },
  warningContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    alignItems: 'center',
  },
  warningText: {
    fontSize: 14,
    color: '#E65100',
    textAlign: 'center',
  },
  // Product item styles (like LocationItem in detail.js)
  productItem: {
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
  // Empty state styles
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    marginBottom: 20,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#38434E',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#787D90',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  // Saved NFC List styles
  savedListContainer: {
    flex: 1,
  },
  savedListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#38434E',
    marginBottom: 16,
  },
  savedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8EAFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  savedItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  savedItemImage: {
    width: 28,
    height: 28,
  },
  savedItemContent: {
    flex: 1,
  },
  savedItemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  savedItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#38434E',
    flex: 1,
  },
  savedItemBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  savedItemBadgeRegistered: {
    backgroundColor: '#E8F5E9',
  },
  savedItemBadgeNotRegistered: {
    backgroundColor: '#FFF3E0',
  },
  savedItemBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  savedItemBadgeTextRegistered: {
    color: '#2E7D32',
  },
  savedItemBadgeTextNotRegistered: {
    color: '#E65100',
  },
  savedItemSubtitle: {
    fontSize: 13,
    color: '#787D90',
  },
  savedItemDate: {
    fontSize: 12,
    color: '#A0A5B5',
    marginTop: 4,
  },
  savedItemTypeBadge: {
    backgroundColor: '#E8F0FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  savedItemTypeBadgeText: {
    fontSize: 11,
    color: '#213AE8',
    fontWeight: '500',
  },
  savedItemDelete: {
    padding: 8,
  },
  savedItemDeleteIcon: {
    width: 20,
    height: 20,
    tintColor: '#E74C3C',
  },
  // Bottom buttons styles
  bottomContainer: {
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    gap: 12,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  scanButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#213AE8',
  },
  scanButtonIcon: {
    width: 20,
    height: 20,
    tintColor: '#213AE8',
  },
  scanButtonText: {
    color: '#213AE8',
    fontSize: 15,
    fontWeight: '600',
  },
  writeNewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#213AE8',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  writeNewButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#213AE8',
  },
  loginButtonText: {
    color: '#213AE8',
    fontSize: 16,
    fontWeight: '600',
  },
  loginHintText: {
    fontSize: 13,
    color: '#787D90',
    textAlign: 'center',
    marginTop: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAFF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#38434E',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F4F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#787D90',
    fontWeight: '600',
  },
  modalContent: {
    padding: 20,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F9FF',
  },
  dataLabel: {
    fontSize: 15,
    color: '#787D90',
    flex: 1,
  },
  dataValue: {
    fontSize: 15,
    color: '#38434E',
    fontWeight: '500',
    flex: 1.5,
    textAlign: 'right',
  },
  // Product info section (for written data)
  productInfoSection: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAFF',
    marginBottom: 16,
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#38434E',
    marginBottom: 12,
    textAlign: 'center',
  },
  productTypeBadge: {
    backgroundColor: '#E8F0FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  productTypeBadgeText: {
    fontSize: 14,
    color: '#213AE8',
    fontWeight: '600',
  },
  writtenInfoContainer: {
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tagInfoSection: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8EAFF',
  },
  urlText: {
    color: '#213AE8',
  },
  writtenDataSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8EAFF',
  },
  writtenDataContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 12,
  },
  ndefSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#38434E',
    marginBottom: 12,
  },
  // Server status styles
  serverStatusSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8EAFF',
  },
  statusBadge: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  statusRegistered: {
    backgroundColor: '#E8F5E9',
  },
  statusNotRegistered: {
    backgroundColor: '#FFF3E0',
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusRegisteredText: {
    color: '#2E7D32',
  },
  statusNotRegisteredText: {
    color: '#E65100',
  },
  serverErrorText: {
    fontSize: 13,
    color: '#787D90',
    textAlign: 'center',
    marginTop: 4,
  },
  recordContainer: {
    backgroundColor: '#F4F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  recordIndex: {
    fontSize: 14,
    fontWeight: '600',
    color: '#213AE8',
    marginBottom: 8,
  },
  recordDetail: {
    fontSize: 14,
    color: '#38434E',
    marginBottom: 4,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#213AE8',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E74C3C',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  deleteButtonText: {
    color: '#E74C3C',
    fontSize: 16,
    fontWeight: '600',
  },
  writeButton: {
    backgroundColor: '#2E7D32',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  writeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Write modal styles
  writeModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  writeModalContent: {
    padding: 20,
  },
  writeLabel: {
    fontSize: 16,
    color: '#38434E',
    marginBottom: 12,
  },
  deviceTypeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  deviceTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  deviceTypeText: {
    fontSize: 16,
    color: '#38434E',
  },
  writeModalButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  writeModalCancelButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#C9CCDC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  writeModalCancelText: {
    color: '#38434E',
    fontSize: 16,
    fontWeight: '600',
  },
  writeModalSubmitButton: {
    flex: 1,
    backgroundColor: '#213AE8',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  writeModalSubmitButtonDisabled: {
    backgroundColor: '#C9CCDC',
    opacity: 0.5,
  },
  writeModalSubmitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  writeStatusContainer: {
    alignItems: 'center',
    padding: 30,
    paddingTop: 40,
  },
  writeStatusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#38434E',
    marginBottom: 12,
    textAlign: 'center',
  },
  writeStatusDescription: {
    fontSize: 16,
    color: '#787D90',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  writeStatusIcon: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  writeStatusButton: {
    backgroundColor: '#213AE8',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    minWidth: 150,
    alignItems: 'center',
  },
  writeStatusButtonRetry: {
    backgroundColor: '#E65100',
  },
  writeStatusButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PreLoginScreen;

/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
// import Icon from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import CommonHeader from '../../../components/commonHeader';
import {shareQRSvg} from '../../../images/shareQR';
import {postConvertSVGToImage} from '../../../store/api/userApi';
import {fillWifiSvg} from '../../../utils/func';

export default function ShareQR({navigation, route}) {
  console.log('shareQR', route.params);
  const data = JSON.parse(route.params.item.data);
  const ssid = data.ssid;
  const password = data.password;
  const wifiData = `WIFI:T:WPA;S:${ssid};P:${password};;`;
  const [svgData, setSvgData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleSVGWifi();
  }, []);

  const handleSVGWifi = async () => {
    setLoading(true);
    const svgWifi = await fillWifiSvg(shareQRSvg, ssid, password);
    console.log('svgWifi', svgWifi);
    setSvgData(svgWifi);
    handleCapture(svgWifi.filePath);
  };

  // Save PNG to file system
  const handleCapture = async filePath => {
    try {
      let uri = filePath || svgData.filePath;
      // For simulator (absolute path without "file://")
      if (!uri.startsWith('file://')) {
        uri = 'file://' + uri;
      }

      // For Android "content://" URIs, copy to a temp file
      if (uri.startsWith('content://')) {
        const destPath = `${RNFS.TemporaryDirectoryPath}/temp-upload.svg`;
        await RNFS.copyFile(uri, destPath);
        uri = 'file://' + destPath;
      }
      const formData = new FormData();
      formData.append('svgFile', {
        uri: uri,
        name: 'wifi_qr.svg',
        type: 'image/svg+xml',
      });
      console.log('uri', uri);
      console.log('formData', formData);
      await postConvertSVGToImage(formData).then(async res => {
        console.log('res', res);
        if (res) {
          const arrayBuffer = res;
          const base64data = global.Buffer.from(arrayBuffer).toString('base64'); // <-- Encode PNG to base64
          // 6️⃣ Save file to local storage
          const filePath = `${RNFS.DocumentDirectoryPath}/converted_wifi.png`;
          await RNFS.writeFile(filePath, base64data, 'base64');
          setSvgData(prev => ({...prev, imgUri: filePath}));
          console.log('✅ PNG saved at:', filePath);
          setTimeout(() => {
            setLoading(false);
          }, 500);
        } else {
          setTimeout(() => {
            setLoading(false);
          }, 500);
          Alert.alert('❌ Error', res.message);
        }
      });
    } catch (error) {
      console.log('handleCapture error', error);
      Alert.alert('❌ Error', error.message);
    }
    // try {
    //   const uri = await viewShotRef.current?.capture();

    //   // Create filename with timestamp
    //   const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    //   const fileName = `wifi_qr_${timestamp}.png`;

    //   // Save to Downloads folder
    //   const downloadsPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

    //   await RNFS.copyFile(uri, downloadsPath);
    //   Alert.alert('✅ Saved', `QR code saved to Downloads:\n${fileName}`);
    //   return downloadsPath;
    // } catch (error) {
    //   Alert.alert('❌ Error', error.message);
    // }
  };

  const handleDownload = async () => {
    try {
      if (!svgData.imgUri) {
        Alert.alert('❌ Error', 'No image available to download');
        return;
      }

      setLoading(true);

      // Create filename with timestamp
      const fileName = `Wifi_${ssid}.png`;

      // Get Downloads directory path
      const downloadsPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      // Copy file from cache to Downloads folder
      await RNFS.copyFile(svgData.imgUri, downloadsPath);

      Alert.alert(
        '✅ Tải xuống QR thành công',
        `QR đã được lưu vào thư mục Downloads: ${fileName}`,
        [{text: 'OK'}],
      );
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert(
        '❌ Download Failed',
        error.message || 'Failed to download image',
      );
    } finally {
      setLoading(false);
    }
  };

  // Share PNG
  const handleShare = async () => {
    try {
      await Share.open({
        title: 'Share WiFi QR Code',
        url: svgData.imgUri,
        filename: `Wifi ${ssid}`,
        type: 'image/png',
      });
    } catch (error) {
      if (error.message !== 'User did not share') {
        Alert.alert('❌ Error', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CommonHeader
        title={'Chia sẻ QR'}
        titleStyle={{color: '#111921'}}
        onBack={() => navigation.goBack()}
        white={true}
      />
      <View style={{flex: 1, alignItems: 'center'}}>
        <View style={styles.shareContainer}>
          <View style={styles.qrCard}>
            <View style={styles.qrWrapper}>
              <QRCode
                value={wifiData}
                size={160}
                logoSize={40}
                logoBackgroundColor="transparent"
              />
            </View>
            <View style={styles.textBox}>
              <Text style={styles.text}>📶 {ssid}</Text>
              <Text style={styles.text}>🔑 {password}</Text>
            </View>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: '#3A7BF6',
                  opacity: loading ? 0.3 : 1,
                },
              ]}
              disabled={loading}
              onPress={handleShare}>
              <Text style={styles.buttonText}>{`${
                loading ? 'Đang tải...' : 'Chia sẻ  📤'
              }`}</Text>
            </TouchableOpacity>
            {Platform.OS === 'android' && (
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: '#3A7BF6',
                    opacity: loading ? 0.3 : 1,
                  },
                ]}
                disabled={loading}
                onPress={handleDownload}>
                <Text style={styles.buttonText}>{`${
                  loading ? 'Đang tải...' : 'Tải xuống  📥'
                }`}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareContainer: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
  svgBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  qrCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    marginTop: 50, // Adjust this to position QR code in the right spot on the SVG
  },
  qrWrapper: {
    marginBottom: 15,
  },
  textBox: {
    alignItems: 'center',
  },
  text: {
    fontSize: 25,
    fontWeight: '500',
    marginVertical: 2,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

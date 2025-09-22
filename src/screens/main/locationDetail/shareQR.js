import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
// import Icon from 'react-native-vector-icons/Ionicons';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import {SvgXml} from 'react-native-svg';
import {shareQRSvg} from '../../../images/index';
import CommonHeader from '../../../components/commonHeader';

export default function ShareQR({navigation, route}) {
  console.log('shareQR', route.params);
  const data = JSON.parse(route.params.item.data);
  const ssid = data.ssid;
  const password = data.password;
  const wifiData = `WIFI:T:WPA;S:${ssid};P:${password};;`;

  const viewShotRef = useRef();

  // Save PNG to file system
  const handleCapture = async () => {
    try {
      const uri = await viewShotRef.current.capture();

      // Create filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `wifi_qr_${timestamp}.png`;

      // Save to Downloads folder
      const downloadsPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      await RNFS.copyFile(uri, downloadsPath);
      Alert.alert('✅ Saved', `QR code saved to Downloads:\n${fileName}`);
      return downloadsPath;
    } catch (error) {
      Alert.alert('❌ Error', error.message);
    }
  };

  // Share PNG
  const handleShare = async () => {
    try {
      const filePath = await handleCapture();

      if (!filePath) return;

      await Share.open({
        title: 'Share WiFi QR Code',
        message: `Here is the WiFi QR code for ${ssid}`,
        url: 'file://' + filePath,
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
        // rightContent={
        //   <TouchableOpacity>
        //     <Image source={icSettingGrey} style={{width: 20, height: 20}} />
        //   </TouchableOpacity>
        // }
      />
      <ViewShot ref={viewShotRef} options={{format: 'png', quality: 1.0}}>
        <View style={styles.shareContainer}>
          {/* SVG Background */}
          {/* <SvgXml
            xml={shareQRSvg}
            width="100%"
            height="100%"
            style={styles.svgBackground}
          /> */}

          {/* QR Code positioned over the SVG */}
          <View style={styles.qrOverlay}>
            <View style={styles.qrCard}>
              <View style={styles.qrWrapper}>
                <QRCode
                  value={wifiData}
                  size={160}
                  // logo={<Icon name="camera-outline" size={40} color="#000" />}
                  logoSize={40}
                  logoBackgroundColor="transparent"
                />
              </View>
              <View style={styles.textBox}>
                <Text style={styles.text}>📶 {ssid}</Text>
                <Text style={styles.text}>🔑 {password}</Text>
              </View>
            </View>
          </View>
        </View>
      </ViewShot>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={handleCapture}>
          <Text style={styles.buttonText}>💾 Save PNG</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#34A853'}]}
          onPress={handleShare}>
          <Text style={styles.buttonText}>📤 Share PNG</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  shareContainer: {
    width: 400,
    height: 600,
    position: 'relative',
    backgroundColor: '#fff',
  },
  svgBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  qrOverlay: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 50, // Adjust this to position QR code in the right spot on the SVG
  },
  qrWrapper: {
    marginBottom: 15,
  },
  textBox: {
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 2,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
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

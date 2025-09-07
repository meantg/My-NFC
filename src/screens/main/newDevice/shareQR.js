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
import Icon from 'react-native-vector-icons/Ionicons';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';

export default function ShareQR() {
  const ssid = 'Cabana Guest';
  const password = 'MH7j)f%3Jd';
  const wifiData = `WIFI:T:WPA;S:${ssid};P:${password};;`;

  const viewShotRef = useRef();

  // Save PNG to file system
  const handleCapture = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      const filePath = `${RNFS.DocumentDirectoryPath}/wifi_qr.png`;

      await RNFS.copyFile(uri, filePath);
      Alert.alert('✅ Saved', `QR code saved at:\n${filePath}`);
      return filePath;
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
      <ViewShot ref={viewShotRef} options={{format: 'png', quality: 1.0}}>
        <View style={styles.card}>
          <View style={styles.qrWrapper}>
            <QRCode
              value={wifiData}
              size={160}
              logo={<Icon name="camera-outline" size={40} color="#000" />}
              logoSize={40}
              logoBackgroundColor="transparent"
            />
          </View>
          <View style={styles.textBox}>
            <Text style={styles.text}>📶 {ssid}</Text>
            <Text style={styles.text}>🔑 {password}</Text>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
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

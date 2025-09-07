/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import NFCProxy from '../../../NFCProxy';

const WriteScreen = ({ navigation, route }) => {
  const type = route.params?.type || 'WIFI_SIMPLE';
  const [wifiData, setWifiData] = useState({ ssid: '', password: '' });
  const [text, setText] = useState('');
  const [uri, setUri] = useState('');

  const handleWrite = async () => {
    try {
      let value;
      switch (type) {
        case 'WIFI_SIMPLE':
          value = wifiData;
          break;
        case 'TEXT':
          value = text;
          break;
        case 'URI':
          value = uri;
          break;
      }
      await NFCProxy.writeNdef({ type, value });
      navigation.navigate('Home');
    } catch (error) {
      console.error('Write failed:', error);
    }
  };

  const renderInputs = () => {
    switch (type) {
      case 'WIFI_SIMPLE':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter SSID"
              value={wifiData.ssid}
              onChangeText={text => setWifiData({ ...wifiData, ssid: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              value={wifiData.password}
              onChangeText={text => setWifiData({ ...wifiData, password: text })}
              secureTextEntry
            />
          </>
        );
      case 'TEXT':
        return (
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter Text"
            value={text}
            onChangeText={setText}
            multiline
          />
        );
      case 'URI':
        return (
          <TextInput
            style={styles.input}
            placeholder="Enter URI (e.g., https://example.com)"
            value={uri}
            onChangeText={setUri}
            autoCapitalize="none"
            keyboardType="url"
          />
        );
    }
  };

  const getButtonText = () => {
    switch (type) {
      case 'WIFI_SIMPLE':
        return 'Write WIFI';
      case 'TEXT':
        return 'Write TEXT';
      case 'URI':
        return 'Write URI';
    }
  };

  return (
    <View style={styles.container}>
      {renderInputs()}
      <TouchableOpacity style={styles.button} onPress={handleWrite}>
        <Text style={styles.buttonText}>{getButtonText()}</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.button, styles.backButton]} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    fontSize: 16,
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

export default WriteScreen;
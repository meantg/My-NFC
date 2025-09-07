/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import {
  icWifiColor,
  icLink,
  icRating,
  imgThemeSpring,
  icClose,
  icCreateUIDone,
} from '../../../images';
import {useNavigation} from '@react-navigation/native';
import {BlurView} from '@react-native-community/blur';
import {useEffect, useState} from 'react';
import CommonButton from '../../../components/commonButton';

// Example default config, replace with props/config from UIConfig
const defaultConfig = {
  bgImage: imgThemeSpring, // fallback image
  bgColor: '#F2F5FF',
  txtColor: '#00112B',
  cardColor: '#FFE7C2',
  borderColor: '#C75A00',
  btnStyle: {borderRadius: 45},
  buttons: [
    {
      icon: icWifiColor,
      text: 'Wifi đại sảnh',
    },
    {
      icon: icLink,
      text: 'Ẩm thực đường phố',
    },
    {
      icon: icRating,
      text: 'Đánh giá dịch vụ',
    },
  ],
};

const PreviewUI = ({route}) => {
  const [config, setConfig] = useState(defaultConfig);
  const [isComplete, setIsComplete] = useState(false);
  const {
    bgImage,
    bgColor,
    txtColor,
    cardColor,
    borderColor,
    btnStyle,
    buttons,
  } = config;

  const navigation = useNavigation();

  useEffect(() => {
    console.log('params', JSON.stringify(route.params, 0, 2));
    if (route.params?.config) {
      setConfig({
        bgImage: route.params.config.theme.img,
        bgColor: route.params.config.bgColor,
        txtColor: route.params.config.txtColor,
        cardColor: route.params.config.cardColor,
        borderColor: route.params.config.borderColor,
        btnStyle: route.params.config.btnStyle.style,
        buttons: defaultConfig.buttons,
      });
    } else {
      setIsComplete(true);
    }
  }, [route.params]);

  if (isComplete) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={icCreateUIDone}
          style={{width: 175, height: 175, marginBottom: 30}}
        />
        <Text
          style={{
            color: '#38434E',
            fontSize: 24,
            fontWeight: '700',
            textAlign: 'center',
          }}>
          Thành công
        </Text>
        <Text
          style={{
            color: '#38434E',
            fontSize: 16,
            textAlign: 'center',
            marginTop: 15,
          }}>
          {`Bạn đã thêm vị trí thành công.\nTrở về danh sách để quản lý vị trí của bạn`}
        </Text>
        <CommonButton
          onPress={() => navigation.goBack()}
          text="Khám Phá Ngay"
          style={{marginTop: 30, paddingHorizontal: 20}}
        />
      </View>
    );
  }
  return (
    <View style={{flex: 1, backgroundColor: bgColor}}>
      <ImageBackground
        source={bgImage}
        style={styles.bg}
        imageStyle={{resizeMode: 'cover'}}>
        {/* Close button */}
        <View style={styles.header}>
          <BlurView
            style={styles.absolute}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
          />
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => navigation.goBack()}>
            <Image source={icClose} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>
        {/* Content */}
        <View style={styles.container}>
          <Text style={[styles.title, {color: txtColor}]}>Chào mừng bạn</Text>
          <View style={{height: 24}} />
          {buttons.map((btn, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.button,
                {
                  backgroundColor: cardColor,
                  borderColor: borderColor,
                  ...btnStyle,
                },
              ]}
              activeOpacity={0.8}>
              <Image source={btn.icon} style={styles.buttonIcon} />
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={[styles.buttonText, {color: txtColor}]}>
                  {btn.text}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100, // or 44 for iOS
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 12, // adjust for status bar
    paddingHorizontal: 20,
    backgroundColor: 'transparent', // or a light gradient if needed
    zIndex: 20,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  closeBtn: {
    padding: 8,
    top: 10,
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  bg: {
    flex: 1,
  },
  closeText: {
    fontSize: 28,
    color: '#888',
    fontWeight: '600',
    lineHeight: 32,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 140,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 18,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    position: 'absolute',
    left: 12,
    top: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PreviewUI;

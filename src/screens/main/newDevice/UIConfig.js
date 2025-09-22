/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Image,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CommonHeader from '../../../components/commonHeader';
import Slider from '@react-native-community/slider';
import {
  icDownGrey,
  icImageGrey,
  icMonitorGrey,
  icTickBlue,
  imgThemeAutumn,
  imgThemeSpring,
  imgThemeSummer,
  imgThemeWinter,
} from '../../../images';
import CommonModal from '../../../components/commonModal';
import ColorPicker, {Panel1, HueSlider} from 'reanimated-color-picker';
import {hexToRgb} from '../../../utils/func';
import {useNavigation} from '@react-navigation/native';

const themeOptions = [
  {label: 'Mùa xuân', value: 'spring', img: imgThemeSpring},
  {label: 'Mùa hè', value: 'summer', img: imgThemeSummer},
  {label: 'Mùa thu', value: 'autumn', img: imgThemeAutumn},
  {label: 'Mùa đông', value: 'winter', img: imgThemeWinter},
  // {label: '4 mùa', value: '4seasons'},
];

const btnStyles = [
  {label: 'Bo tròn', value: 'all-rounded', style: {borderRadius: 45}},
  {label: 'Bo ít', value: 'rounded', style: {borderRadius: 10}},
  {label: 'Vuông', value: 'square', style: {borderRadius: 0}},
];

const UIConfig = ({contentList}) => {
  const navigation = useNavigation();
  const [useTemplate, setUseTemplate] = useState(true);
  const [contentStart, setContentStart] = useState(0.5);
  const [blur, setBlur] = useState(0.5);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [contentType, setContentType] = useState();
  const [contentData, setContentData] = useState({
    theme: null,
    txtColor: '#00112B',
    cardColor: '#FFE7C2',
    borderColor: '#C75A00',
    bgColor: '#F2F5FF',
    btnStyle: btnStyles[0],
    startPoint: 0.5,
    bgImage: null,
    bgOpacity: 0.5,
  });

  useEffect(() => {
    setContentData(prev => ({...prev, theme: themeOptions[0]}));
  }, []);

  useEffect(() => {
    console.log('contentList', contentList);
    console.log('contentData', contentData);
  }, [contentData]);

  const onSelectColor = ({hex, rgb}) => {
    // do something with the selected color.
    try {
      if (contentType === 'txtColor') {
        setContentData(prev => ({...prev, txtColor: hex}));
      } else if (contentType === 'cardColor') {
        setContentData(prev => ({...prev, cardColor: hex}));
      } else if (contentType === 'borderColor') {
        setContentData(prev => ({...prev, borderColor: hex}));
      } else if (contentType === 'bgColor') {
        setContentData(prev => ({...prev, bgColor: hex}));
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const handlePreviewUI = (isDone = false) => {
    navigation.navigate('PreviewUI', {
      config: contentData,
      contentList,
      isDone,
    });
  };

  const renderModalContent = () => {
    //choose color
    if (
      contentType === 'txtColor' ||
      contentType === 'cardColor' ||
      contentType === 'borderColor' ||
      contentType === 'bgColor'
    ) {
      return (
        <ScrollView style={{paddingHorizontal: 5}}>
          <ColorPicker
            style={{width: '95%', alignSelf: 'center', marginTop: 20}}
            value={contentData[contentType]}
            onCompleteJS={onSelectColor}>
            {/* <Preview key={'preview'} /> */}
            <Panel1 style={{borderRadius: 8, marginBottom: 15}} />
            <HueSlider
              thumbSize={22}
              sliderThickness={12}
              style={{borderRadius: 45, marginBottom: 15}}
            />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 2}}>
                <Text
                  style={{fontSize: 12, color: '#38434E', fontWeight: '800'}}>
                  Hex
                </Text>
                <View
                  style={{
                    padding: 10,
                    borderWidth: 1,
                    borderColor: '#E2E7FB',
                    borderRadius: 10,
                    marginRight: 10,
                    marginTop: 5,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      textAlign: 'center',
                      color: '#38434E',
                      fontWeight: '500',
                    }}>
                    {contentData[contentType]}
                  </Text>
                </View>
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={{fontSize: 12, color: '#38434E', fontWeight: '800'}}>
                  R
                </Text>
                <View
                  style={{
                    padding: 10,
                    borderWidth: 1,
                    borderColor: '#E2E7FB',
                    borderRadius: 10,
                    marginRight: 10,
                    marginTop: 5,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      textAlign: 'center',
                      color: '#38434E',
                      fontWeight: '500',
                    }}>
                    {hexToRgb(contentData[contentType]).r}
                  </Text>
                </View>
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={{fontSize: 12, color: '#38434E', fontWeight: '800'}}>
                  G
                </Text>
                <View
                  style={{
                    padding: 10,
                    borderWidth: 1,
                    borderColor: '#E2E7FB',
                    borderRadius: 10,
                    marginRight: 10,
                    marginTop: 5,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      textAlign: 'center',
                      color: '#38434E',
                      fontWeight: '500',
                    }}>
                    {hexToRgb(contentData[contentType]).g}
                  </Text>
                </View>
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={{fontSize: 12, color: '#38434E', fontWeight: '800'}}>
                  B
                </Text>
                <View
                  style={{
                    padding: 10,
                    borderWidth: 1,
                    borderColor: '#E2E7FB',
                    borderRadius: 10,
                    marginRight: 10,
                    marginTop: 5,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      textAlign: 'center',
                      color: '#38434E',
                      fontWeight: '500',
                    }}>
                    {hexToRgb(contentData[contentType]).b}
                  </Text>
                </View>
              </View>
            </View>
          </ColorPicker>
        </ScrollView>
      );
    }
    if (contentType === 'btnStyle') {
      return (
        <View>
          {btnStyles.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() =>
                setContentData(prev => ({...prev, btnStyle: item}))
              }
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
                  item.value === contentData?.btnStyle?.value
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
                <View style={{flex: 1, alignItems: 'flex-start'}}>
                  <View
                    style={[
                      styles.buttonStyleBtn,
                      {
                        backgroundColor: contentData.cardColor,
                        borderColor: contentData.borderColor,
                        borderWidth: 1,
                        width: 90,
                        height: 27,
                      },
                      item.style,
                    ]}>
                    <Text
                      style={[
                        styles.cardLabel,
                        {
                          fontWeight: '400',
                          color: '#38434E',
                          fontSize: 12,
                          fontWeight: '800',
                          textAlign: 'center',
                        },
                      ]}>
                      {item.label}
                    </Text>
                  </View>
                </View>
                {item.value === contentData?.btnStyle?.value && (
                  <Image source={icTickBlue} style={{width: 16, height: 16}} />
                )}
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    return (
      <View>
        {themeOptions.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => setContentData(prev => ({...prev, theme: item}))}
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
                item.value === contentData?.theme?.value
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
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={[
                    styles.cardLabel,
                    {fontWeight: '400', color: '#38434E'},
                  ]}>
                  {item.label}
                </Text>
                <Image
                  source={item.img}
                  style={{width: 40, height: 20}}
                  resizeMode="center"
                />
              </View>
              {item.value === contentData?.theme?.value && (
                <Image
                  source={icTickBlue}
                  style={{width: 16, height: 16, marginLeft: 15}}
                />
              )}
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderModalButton = () => {
    return (
      <View style={{paddingBottom: 20, top: -15, paddingHorizontal: 20}}>
        <TouchableOpacity
          onPress={() => {
            setIsModalVisible(false);
          }}
          style={{flex: 1, alignItems: 'center'}}>
          <LinearGradient
            colors={['#162ED0', '#071DAF']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.doneBtnGradient}>
            <Text style={styles.doneBtnText}>Lưu</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <LinearGradient
        colors={['#EAF1FF', '#F6FBFF']}
        style={StyleSheet.absoluteFill}
      />
      {/* <CommonHeader title="Giao Diện" onBack={() => navigation.goBack()} /> */}
      <ScrollView contentContainerStyle={{padding: 10, paddingBottom: 32}}>
        {/* Top Row */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}>
          <Text style={styles.sectionTitle}>GIAO DIỆN</Text>
          <View style={{flex: 1}} />
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() => handlePreviewUI()}>
            <Image
              source={icMonitorGrey}
              style={{width: 16, height: 16, marginRight: 5}}
            />
            <Text style={styles.previewText}>XEM TRƯỚC</Text>
          </TouchableOpacity>
        </View>
        {/* Switch */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 18,
          }}>
          <Switch
            value={useTemplate}
            onValueChange={setUseTemplate}
            trackColor={{false: '#C9CCDC', true: '#009459'}}
            thumbColor={useTemplate ? '#fff' : '#fff'}
            style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}
          />
          <Text style={styles.switchLabel}>Dùng giao diện mẫu</Text>
        </View>
        {/* Dropdown */}
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => {
            setIsModalVisible(true);
            setContentType('theme');
          }}>
          <Text style={styles.dropdownText}>{contentData?.theme?.label}</Text>
          <Image source={icDownGrey} style={{width: 16, height: 16}} />
        </TouchableOpacity>
        {/* Color Pickers */}
        <View style={styles.card}>
          <TouchableOpacity
            onPress={() => {
              setIsModalVisible(true);
              setContentType('txtColor');
            }}
            style={styles.rowBetween}>
            <Text style={styles.label}>Màu chữ</Text>
            <View
              style={[
                styles.colorBlock,
                {backgroundColor: contentData.txtColor},
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsModalVisible(true);
              setContentType('cardColor');
            }}
            style={styles.rowBetween}>
            <Text style={styles.label}>Màu thẻ</Text>
            <View
              style={[
                styles.colorBlock,
                {backgroundColor: contentData.cardColor},
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsModalVisible(true);
              setContentType('borderColor');
            }}
            style={styles.rowBetween}>
            <Text style={styles.label}>Màu viền</Text>
            <View
              style={[
                styles.colorBlock,
                {backgroundColor: contentData.borderColor},
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsModalVisible(true);
              setContentType('bgColor');
            }}
            style={styles.rowBetween}>
            <Text style={styles.label}>Màu nền</Text>
            <View
              style={[
                styles.colorBlock,
                {backgroundColor: contentData.bgColor},
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsModalVisible(true);
              setContentType('btnStyle');
            }}
            style={styles.rowBetween}>
            <Text style={styles.label}>Kiểu nút</Text>
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(true);
                setContentType('btnStyle');
              }}
              style={[
                styles.buttonStyleBtn,
                {
                  backgroundColor: contentData.cardColor,
                  borderColor: contentData.borderColor,
                  borderWidth: 1,
                },
                contentData.btnStyle.style,
              ]}>
              <Text
                style={[
                  styles.buttonStyleText,
                  {
                    color: contentData.txtColor,
                  },
                ]}>
                {contentData.btnStyle.label}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <View style={[styles.rowBetween, {borderBottomColor: '#fff'}]}>
            <Text style={styles.label}>Điểm bắt đầu nội dung</Text>
          </View>
          <View
            style={{
              borderBottomColor: '#E2E7FB',
              borderBottomWidth: 1,
              paddingBottom: 15,
            }}>
            <Slider
              style={{width: '90%', height: 32, left: '5%'}}
              minimumValue={0}
              maximumValue={1}
              step={0.01}
              value={contentStart}
              onValueChange={setContentStart}
              minimumTrackTintColor="#213AE8"
              maximumTrackTintColor="#E2E7FB"
              thumbTintColor="#213AE8"
            />
          </View>
          <View style={[styles.rowBetween, {borderBottomColor: '#fff'}]}>
            <Text style={styles.label}>Hình nền</Text>
          </View>
          <View
            style={{
              borderBottomColor: '#E2E7FB',
              borderBottomWidth: 1,
              paddingBottom: 15,
            }}>
            <TouchableOpacity style={styles.bgUploadBox}>
              <Image
                source={icImageGrey}
                style={{width: 24, height: 24, marginRight: 10}}
              />
              <Text style={styles.bgUploadText}>Nhấn để tải hình nền</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.rowBetween, {borderBottomColor: '#fff'}]}>
            <Text style={styles.label}>Độ nhòe sau thẻ</Text>
          </View>
          <View>
            <Slider
              style={{width: '90%', height: 32, left: '5%', marginBottom: 20}}
              minimumValue={0}
              maximumValue={1}
              step={0.01}
              value={blur}
              onValueChange={setBlur}
              minimumTrackTintColor="#213AE8"
              maximumTrackTintColor="#E2E7FB"
              thumbTintColor="#213AE8"
            />
          </View>
        </View>
        {/* Bottom Buttons */}
      </ScrollView>
      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}>
          <Text style={styles.cancelBtnText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handlePreviewUI(true)}
          style={styles.doneBtn}>
          <LinearGradient
            colors={['#162ED0', '#071DAF']}
            style={styles.doneBtnGradient}>
            <Text style={styles.doneBtnText}>Hoàn Tất</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <CommonModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          // setIsWarningModal(false);
          // setContentType(null);
          // setContentData({});
        }}
        header={
          contentType === 'theme'
            ? `Giao diện mẫu`
            : contentType === 'txtColor'
            ? `Màu chữ`
            : contentType === 'cardColor'
            ? `Màu thẻ`
            : contentType === 'borderColor'
            ? `Màu viền`
            : contentType === 'bgColor'
            ? `Màu nền`
            : `Kiểu nút`
        }
        // isWarning={isWarningModal}
        warningTitle={`Bạn có chắc muốn hủy bỏ quá trình\nthêm mới vị trí không?`}
        content={renderModalContent()}
        bottomContent={renderModalButton()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    color: '#009459',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 10,
  },
  cardLabel: {
    fontSize: 14,
    color: '#787D90',
    fontWeight: '700',
    marginBottom: 2,
  },
  previewText: {
    color: '#38434E',
    fontWeight: '500',
    fontSize: 14,
  },
  switchLabel: {
    marginLeft: 10,
    fontSize: 15,
    color: '#38434E',
    fontWeight: '500',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C9CCDC',
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  dropdownText: {
    flex: 1,
    fontSize: 17,
    color: '#38434E',
    fontWeight: '500',
  },
  dropdownIcon: {
    fontSize: 18,
    color: '#A0A0A0',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#091FB41A',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#E2E7FB',
    borderBottomWidth: 1,
    padding: 15,
  },
  label: {
    color: '#38434E',
    fontSize: 15,
    fontWeight: '500',
  },
  colorBlock: {
    width: 70,
    height: 24,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E2E7FB',
  },
  buttonStyleBtn: {
    backgroundColor: '#009459',
    borderRadius: 45,
    paddingHorizontal: 16,
    paddingVertical: 4,
    height: 24,
  },
  buttonStyleText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#E2E7FB',
    borderRadius: 3,
    marginVertical: 10,
    position: 'relative',
    overflow: 'visible',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#213AE8',
    borderRadius: 3,
    height: 6,
    zIndex: 1,
  },
  sliderThumb: {
    position: 'absolute',
    top: -7,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#213AE8',
    borderWidth: 3,
    borderColor: '#fff',
    zIndex: 2,
    elevation: 2,
  },
  bgUploadBox: {
    borderWidth: 1,
    borderColor: '#C9CCDC',
    borderRadius: 12,
    backgroundColor: '#F8FAFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: 18,
    marginBottom: 14,
    marginTop: 2,
    marginHorizontal: 15,
    borderStyle: 'dashed',
  },
  bgUploadIcon: {
    fontSize: 22,
    color: '#A0A0A0',
    marginRight: 8,
  },
  bgUploadText: {
    color: '#787D90',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 20,
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
  doneBtnGradient: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
});

export default UIConfig;

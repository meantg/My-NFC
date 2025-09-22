import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {icEye} from '../images';

const CommonTextInput = ({
  title,
  value,
  onChangeText,
  placeholder = 'Nhập',
  rightIcon = icEye,
  leftIcon,
  onRightPress,
  isFocused,
  onFocus,
  onBlur,
  style,
  inputProps,
  isPassword = false,
  onPress,
  maxLength = 100,
}) => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  return (
    <View style={[{marginTop: 15}, style]}>
      {title ? (
        <Text style={[styles.title, isFocused && styles.titleFocused]}>
          {title}
          {isFocused && <View style={styles.underline} />}
        </Text>
      ) : null}
      <TouchableOpacity
        activeOpacity={onPress ? 1 : 0.5}
        style={styles.inputWrapper}
        onPress={onPress}>
        {leftIcon && <Image source={leftIcon} style={styles.leftIcon} />}
        <View style={{flex: 1}} pointerEvents={onPress ? 'none' : 'auto'}>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            secureTextEntry={isPassword && !isShowPassword}
            placeholderTextColor="#A0A0A0"
            onFocus={onFocus}
            onBlur={onBlur}
            maxLength={maxLength}
            {...inputProps}
          />
        </View>
        {rightIcon || value?.length > 0 || isPassword ? (
          <TouchableOpacity
            style={styles.rightIconBtn}
            onPress={() => {
              if (isPassword) {
                setIsShowPassword(!isShowPassword);
              } else {
                onRightPress();
              }
            }}>
            {typeof rightIcon === 'string' ? (
              <Text style={styles.rightIconText}>{rightIcon}</Text>
            ) : (
              <Image source={rightIcon} style={styles.rightIconImg} />
            )}
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    color: '#38434E',
    fontWeight: '500',
    marginBottom: 6,
    position: 'relative',
  },
  titleFocused: {
    color: '#162ED0',
    textDecorationLine: 'underline',
    textDecorationColor: '#162ED0',
    textDecorationThickness: 2,
  },
  underline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -2,
    height: 2,
    backgroundColor: '#162ED0',
    borderRadius: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C9CCDC',
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    fontWeight: '400',
    paddingVertical: 6,
    backgroundColor: 'white',
  },
  rightIconBtn: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconText: {
    fontSize: 18,
    color: '#8B94A3',
    fontWeight: 'bold',
  },
  rightIconImg: {
    width: 20,
    height: 20,
    tintColor: '#8B94A3',
    right: -10,
  },
  leftIcon: {
    width: 16,
    height: 16,
    tintColor: '#8B94A3',
    marginRight: 8,
  },
});

export default CommonTextInput;

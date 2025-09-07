import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const CommonButton = ({
  onPress,
  text = 'Lưu',
  colors = ['#162ED0', '#071DAF'],
  style,
  btnContainerStyle,
  white = false,
  red = false,
  grey = false,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[{alignItems: 'center'}, btnContainerStyle]}>
      <LinearGradient
        colors={
          white
            ? ['#fff', '#fff']
            : red
            ? ['#B22626', '#770303']
            : grey
            ? ['#A9B2C9', '#7E89AA']
            : colors
        }
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={[
          styles.doneBtnGradient,
          style,
          white && {borderWidth: 1.5, borderColor: '#CCCFE2'},
          disabled && {opacity: 0.5},
        ]}>
        <Text style={[styles.doneBtnText, white && {color: '#38434E'}]}>
          {text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  doneBtnGradient: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  doneBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CommonButton;

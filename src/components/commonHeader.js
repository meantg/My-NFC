import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {icBack, icBackBlack} from '../images';

const CommonHeader = ({
  title,
  titleStyle,
  onBack,
  rightContent,
  headerColor = ['#1B3FD0', '#3A7BF6'],
  whiteHeaderColor = ['#fff', '#fff'],
  leftIcon = icBack,
  white = false,
}) => {
  return (
    <LinearGradient
      colors={white ? whiteHeaderColor : headerColor}
      start={{x: 0.3, y: 0.3}}
      end={{x: 0, y: 0}}
      style={styles.header}>
      <TouchableOpacity
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        onPress={onBack}
        style={styles.backButton}>
        <Image
          source={white ? icBackBlack : leftIcon}
          style={[styles.backButtonIcon, {tintColor: !white ? '#fff' : '#000'}]}
        />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, titleStyle]}>{title}</Text>
      <View style={{width: 80, alignItems: 'flex-end'}}>{rightContent}</View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
    minHeight: 60,
  },
  backButton: {
    width: 80,
  },
  backButtonIcon: {
    width: 20,
    height: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#F4F9FF',
  },
});

export default CommonHeader;

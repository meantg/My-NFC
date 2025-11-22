/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {icEditGrey, icShare, icTrashGrey, icWifiGrey} from '../../../images';

export const LocationItem = ({
  handleEditProduct,
  handleDeleteProduct,
  item,
  styles,
  navigation,
  handleLongPress,
  isSelect,
  onSelectItem,
  isCancel,
}) => {
  const [isExpand, setIsExpand] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  console.log(item);
  const tagData = JSON.parse(item.data);
  console.log('tagData', tagData);

  useEffect(()=>{
    if (isSelect) {
      setIsSelected(false);
    }
    if (isCancel) {
      setIsSelected(false);
    }
  },[isSelect, isCancel]);

  const onPress = () => {
    if (isSelect) {
      setIsSelected(!isSelected);
      onSelectItem?.(item);
    } else {
      setIsExpand(!isExpand);
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={() => handleLongPress(item)}
      activeOpacity={1}
      style={[styles.productItem, isSelected && {borderWidth: 2, borderColor: '#162ED0'}]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={icWifiGrey}
            style={{width: 20, height: 20, marginRight: 12}}
          />
          <Text style={styles.productItemTitle}>{item.name}</Text>
        </View>
        {!isSelect && (
          <View style={styles.productItemRight}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ShareQR', {item})}>
              <Image
                source={icShare}
                style={{width: 18, height: 18, marginRight: 25}}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteProduct(item)}>
              <Image
                source={icTrashGrey}
                style={{width: 20, height: 20, marginRight: 20}}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleEditProduct(item)}>
              <Image source={icEditGrey} style={{width: 20, height: 20}} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {isExpand && (
        <View style={{paddingTop: 10}}>
          <Text style={styles.productItemTitle}>Wifi: {tagData.ssid}</Text>
          <Text style={styles.productItemTitle}>
            Password: {tagData.password}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

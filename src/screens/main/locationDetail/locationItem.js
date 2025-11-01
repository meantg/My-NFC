import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {icEditGrey, icShare, icTrashGrey, icWifiGrey} from '../../../images';

export const LocationItem = ({
  handleEditProduct,
  handleDeleteProduct,
  item,
  styles,
  navigation,
}) => {
  const [isExpand, setIsExpand] = useState(false);
  console.log(item);
  const tagData = JSON.parse(item.data);
  console.log('tagData', tagData);
  return (
    <TouchableOpacity
      onPress={() => setIsExpand(!isExpand)}
      activeOpacity={1}
      style={styles.productItem}>
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

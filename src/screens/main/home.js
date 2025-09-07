/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {icAddGrey, icEditGrey, icWifiGrey, NextapLogo} from '../../images';
import {commonStyles} from '../../utils/styles';
import {useAuth} from '../../store/hooks/useAuth';

const HomeScreen = ({navigation}) => {
  const {user} = useAuth();
  const handleOpenDeviceDetail = () => {
    navigation.navigate('DeviceDetail');
  };

  const renderProduct = () => {
    // Example data for one section
    const section = {
      title: 'ĐẠI SẢNH',
      count: 2,
      products: [
        {id: '1', name: 'Wifi A'},
        {id: '2', name: 'Cổng chào'},
      ],
    };
    return (
      <ScrollView
        style={{
          margin: 12,
          borderRadius: 12,
          overflow: 'hidden',
        }}>
        <TouchableOpacity
          onPress={handleOpenDeviceDetail}
          style={styles.homeItemContainer}>
          <LinearGradient
            colors={['#EAF6FF', '#D0E8FF']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.productHeader}>
            <View style={{flex: 1}}>
              <Text style={styles.productHeaderTitle}>{section.title}</Text>
              <Text style={styles.productHeaderSubtitle}>
                {section.count} sản phẩm
              </Text>
            </View>
            <TouchableOpacity style={styles.productHeaderIconBtn}>
              <Image source={icEditGrey} style={{width: 24, height: 24}} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.productHeaderIconBtn}>
              <Image source={icAddGrey} style={{width: 24, height: 24}} />
            </TouchableOpacity>
          </LinearGradient>
          {section.products.map((item, idx) => (
            <View key={item.id} style={styles.productRow}>
              <Image
                source={icWifiGrey}
                style={{width: 24, height: 24, marginRight: 8}}
              />
              <Text style={styles.productRowText}>{item.name}</Text>
            </View>
          ))}
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <View style={commonStyles.container}>
      {/* User Info */}
      <View style={styles.header}>
        <Image source={NextapLogo} style={styles.headerIcon} />
        <Text style={styles.headerTitle}>
          🤚 XIN CHÀO {user?.displayName?.toUpperCase()} !
        </Text>
      </View>
      {renderProduct()}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingLeft: 20,
    marginTop: Platform.OS === 'android' ? 0 : 40,
  },
  headerIcon: {
    width: 132,
    height: 44,
    resizeMode: 'contain',
    color: '#38434E',
  },
  noProduct: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '30%',
  },
  noProductTxt: {
    fontSize: 16,
    color: '#38434E',
    textAlign: 'center',
    marginTop: 5,
  },
  noProductBtn: {
    backgroundColor: '#162ED0',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
  },
  noProductBtnTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noProductIcon: {
    width: 175,
    height: 175,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 16,
    color: '#222',
    marginTop: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eee',
  },
  greeting: {
    fontSize: 14,
    color: '#888',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  list: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  itemAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eee',
  },
  itemInfo: {
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  itemDesc: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 56,
    left: '50%',
    marginLeft: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: -2,
  },
  bottomTab: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 56,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    zIndex: 5,
  },
  tabActive: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: '#000',
    backgroundColor: '#fff',
  },
  tabActiveText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,
  },
  tabInactive: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  tabInactiveText: {
    color: '#bbb',
    fontSize: 15,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  productHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#13B26B',
    letterSpacing: 0.5,
  },
  productHeaderSubtitle: {
    fontSize: 15,
    color: '#A0A0A0',
    marginTop: 2,
  },
  productHeaderIconBtn: {
    marginLeft: 12,
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#fff',
  },
  productRowText: {
    fontSize: 16,
    color: '#38434E',
  },
  homeItemContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    borderWidth: 2,
    borderColor: '#E2E7FB',
    shadowColor: '#091FB41A',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
});

export default HomeScreen;

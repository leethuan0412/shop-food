import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Button,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import {Icon} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/core';

export default function ProductStateScreen({route}) {
  const [Orders, setOrder] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState('');
  const [playerIds, setPlayerId] = React.useState([]);
  const navigation = useNavigation();
  var orderId = route.params.data.id;

  var playerId = route.params.data.uid;

  const getOrders = () => {
    const data = [];
    firestore()
      .collection('Orders')
      .doc(orderId)
      .get()
      .then((documentSnapshot) => {
        setOrder(documentSnapshot.data());
        setLoading(true);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  // console.log(Orders);
  React.useEffect(getOrders, []);

  // get player id
  const getPlayerID = () => {
    const data = [];
    firestore()
      .collection('PlayerId')
      .doc(playerId)
      .get()
      .then((documentSnapshot) => {
        setPlayerId(documentSnapshot.data().playerID);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // console.log(playerIds);
  React.useEffect(getPlayerID, []);

  const getTotalOrder = () => {
    {
      let result = Orders.productOrders?.reduce(
        (total, item) =>
          total + (item.products.price * item.quantity * 100) / 100,
        0,
      );

      return result;
    }
  };
  // console.log(Orders.productOrders);
  // console.log(getTotalOrder());
  function SendNotificationToUser(playerIds, statusOrder) {
    const url = 'https://onesignal.com/api/v1/notifications';
    const data = {
      app_id: '5dd9ce2f-0d68-4436-96de-a4e90c42902e',
      include_player_ids: [playerIds],
      large_icon: 'ic_action_cloud_upload',
      android_group: 'group-1',
      android_group_message: {en: 'You have $[notif_count] new messages'},
      ios_badgeType: 'Increase',
      ios_badgeCount: 1,
      thread_id: 1,
      summary_arg_count: 1,
      summary_arg: 'React Native',
      body: '????n h??ng',
      type: 'privated',
      // createdTime: firestore.Timestamp.now(),

      // userUid: signedInUser.uid,
      type: 'public',
      headings: {
        en: 'B???n c?? m???t th??ng b??o t??? ThuanMart',
      },
      contents: {
        en: '????n h??ng c???a b???n: ' + statusOrder,
      },
      big_picture: 'imageUrl',

      ios_attachments: {
        id1: '',
      },
    };

    axios
      .post(url, data)
      .then((response) => {
        console.log(
          'send notification about Satus order to user successfully ...',
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const contentProductOrders = () => {
    return (
      <View style={{flex: 1, position: 'relative'}}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={styles.dateOrder}>
            Ng??y ?????t: {''}
            {Orders.createdDate?.toDate().getMonth() + 1}
            {'/'}
            {Orders.createdDate?.toDate().getDate()}
            {'/'}
            {Orders.createdDate?.toDate().getFullYear()}{' '}
            {Orders.createdDate?.toDate().toLocaleTimeString('vi_VN')}
          </Text>
          {Orders.discount > 0 && (
            <Text style={{color: 'orange', fontWeight: '700'}}>
              Gi???m gi?? : {Orders.discount}.000VN??
            </Text>
          )}
          <Text style={{color: 'red', fontWeight: '700'}}>
            T???NG C???NG :{getTotalOrder() - Orders.discount}.000VN??{' '}
          </Text>
          <Text style={{color: 'black', fontWeight: '700'}}>
            Ng?????i nh???n :{Orders.Name}
          </Text>
          <Text style={{color: 'black', fontWeight: '700'}}>
            ?????a ch??? :{Orders.Address}
          </Text>
          <Picker
            selectedValue={selectedValue}
            style={{height: 50, width: 250}}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedValue(itemValue)
            }>
            <Picker.Item label={Orders.status} value="x??c nh???n" />
            <Picker.Item
              label="ch??? l???y h??ng"
              value="ch??? l???y h??ng"
            />
            <Picker.Item label="??ang giao h??ng" value="??ang giao h??ng" />
            <Picker.Item label="Giao th??nh c??ng" value="Giao th??nh c??ng" />
            <Picker.Item label="h???y ????n" value="h???y ????n" />
          </Picker>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            firestore()
              .collection('Orders')
              .doc(orderId)
              .update({
                status: selectedValue,
              })
              .then(() => {
                if (selectedValue !== 'Giao th??nh c??ng') {
                  if (selectedValue == 'h???y ????n') {
                    SendNotificationToUser(
                      playerIds,
                      selectedValue === 'h???y ????n'
                        ? '????n h??ng ???? b??? h???y'
                        : '',
                    );
                  } else {
                    SendNotificationToUser(
                      playerIds,
                      selectedValue === 'x??c nh???n'
                        ? '??ang giao h??ng'
                        : '???? ???????c x??c nh???n',
                    );
                  }
                }

                navigation.navigate('ListOrderScreen');
              })
          }
          style={{
            // padding: 10,
            height: 40,
            width:200,
            borderRadius: 30,
            alignItems: 'center',
            alignSelf:'center',justifyContent:'center',
            // width: '100%',
            backgroundColor: '#009387',
            marginBottom: 3,
          }}>
          <Text style={{color: 'white'}}>C???p nh???t tr???ng th??i ????n h??ng</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View>
      {loading ? (
        <React.Fragment>
          <FlatList
            data={Orders.productOrders}
            renderItem={({item, index}) => {
              return (
                <SafeAreaView style={{flex: 1}}>
                  <TouchableOpacity
                    style={styles.card}
                    onPress={() => {
                      // nav(item.uid);
                      // navigation.navigate('ProductStateScreen', {uid: item.id});
                    }}>
                    <TouchableOpacity key={'product' + index}>
                      <Image
                        style={styles.image}
                        source={{uri: item.products.imageUrl[0]}}
                      />
                    </TouchableOpacity>

                    <View
                      style={{
                        fontSize: 14,
                        flex: 1,
                        fontWeight: '700',
                        alignSelf: 'center',
                        alignItems: 'center',
                        color: 'green',
                        paddingHorizontal: 5,
                        width: '80%',
                      }}>
                      <Text style={{color: 'red'}}>{item.products.name}</Text>
                      <Text style={{color: 'black', fontWeight: '700'}}>
                        S??? l?????ng :{item.quantity}
                      </Text>
                      <Text style={{color: 'black'}}>
                        Gi?? : {item.products.price * item.quantity}.000VN??
                      </Text>
                    </View>
                  </TouchableOpacity>
                </SafeAreaView>
              );
            }}
            ListFooterComponent={contentProductOrders()}
            keyExtractor={(Orders, uid) => 'Orders+' + uid}
          />
        </React.Fragment>
      ) : (
        <Text style={{textAlign: 'center'}}>??ang t???i d??? li???u.....</Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  contentList: {
    flex: 1,
  },
  cardContent: {
    marginLeft: 20,
  },
  image: {
    width: 70,
    height: 70,
    borderWidth: 2,
    borderRadius: 10,
  },

  card: {
    marginHorizontal: 8,
    width: '95%',
    borderWidth: 1,
    borderColor: 'green',
    marginTop: 20,
    backgroundColor: 'white',
    padding: 10,
    flexDirection: 'row',
    borderRadius: 30,
  },
  nameOrder: {
    fontSize: 13,
    flex: 1,
    alignSelf: 'center',
    color: '#3399ff',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 16,
    flex: 1,
    alignSelf: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
  address: {
    fontSize: 14,
    flex: 1,
    fontWeight: '700',
    alignSelf: 'center',
    color: 'red',
  },
  price: {
    fontSize: 14,
    flex: 1,
    fontWeight: '700',
    alignSelf: 'center',
    color: 'red',
  },
  followButton: {
    marginTop: 10,
    height: 35,
    width: 130,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'green',
  },
  dateOrder: {
    color: 'green',
    fontSize: 14,
  },
});

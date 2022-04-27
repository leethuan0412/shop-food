/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/prop-types */

import * as Animatable from 'react-native-animatable';
import * as Yup from 'yup';

import React from 'react';
import {Button, Headline, TextInput, TouchableRipple, useTheme} from 'react-native-paper';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ImageBackground,
  // Image,
  View,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, {image, SvgUri} from 'react-native-svg';
import TextBox from '../../../components/Texbox';
import colors from '../../../constants/color';
import {signInAction} from '../actions/';
import {Switch} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import {Alert} from 'react-native';
import Eye from '../components/eye.svg';
import Eyehint from '../components/eyehint.svg';

// YUP
const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .email('Gmail không đúng định dạng')
    .required(' Địa chỉ gmail không được để trống'),
  password: Yup.string()
    .min(6, 'mật khẩu phải lớn hơn 6 kí tự')
    .required('Mật khẩu không được để trống'),
});

const SignIn = () => {
  const Touch =
  Platform.OS === 'ios' ? TouchableOpacity : TouchableWithoutFeedback;
  const loading = useSelector((state) => state.auth.loading);
  const signedInUser = useSelector((state) => state.auth);
  const [visible, setVisible] = React.useState(false);
  const [isSecureText, setSecureText] = React.useState(true);

  const dispatch = useDispatch();
  
  const paperColor = useTheme().colors;

  
  const navigation = useNavigation();
 
  const containerRef = React.useRef(null);
  const logoRef = React.useRef(null);
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);


  const [loggedInUser, setLoggedInUser] = React.useState(null);

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('@LoggedInUser', JSON.stringify(value));
    } catch (e) {
      // console.log('Save failed: ', e);
    }
  };

  const getData = async () => {
    try {
      let data = await AsyncStorage.getItem('@LoggedInUser');
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch (e) {
      // console.log('Get failed: ', e);
    }
  };

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        containerRef.current.transitionTo({height: 0}, 1000);
       

        containerRef.current.fadeOutUpBig(750);
        logoRef.current.transitionTo({height: 0}, 750);
        logoRef.current.fadeOutUpBig(500);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        containerRef.current.transitionTo({height: 170}, 500); 
        containerRef.current.fadeInDownBig(750);

        logoRef.current.transitionTo({height: 240}, 150);
        logoRef.current.fadeInDownBig(1000);
      },
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const getinfologin = () => {
    getData().then((u) => {
      if (u) {
        if (u.email && u.password);
      }
      setLoggedInUser(u);
    });
  };
  React.useEffect(getinfologin, []);
  console.log(loggedInUser);
  return (
    <View style={{flex: 1,backgroundColor:'white'}}>
      {/* <ImageBackground source={image} resizeMode='cover' style={{flex:1}}> */}
      
  
      {/* <TouchableOpacity
        activeOpacity={1}
        style={{flex: 1, backgroundColor: colors.WHITE}}
        onPress={Keyboard.dismiss}
        > */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{flex: 1}}>
          <Formik
            enableReinitialize
            initialValues={{
              email: loggedInUser ? loggedInUser.email : '',
              password: loggedInUser ? loggedInUser.password : '',
            }}
            validationSchema={SignInSchema}
            onSubmit={(values) => {
              loading;
              dispatch(signInAction(values.email, values.password));

              if (isSwitchOn == true) {
                storeData({
                  email: values.email,
                  password: values.password,
                });
              }

              // setIsSwitchOn(true);
            }}>
            {(formik) => (
              <React.Fragment>
                <Animatable.View
                  ref={containerRef}
                  duration={1000}
                  animation="fadeIn"
                  style={{
                    height: 240,
                    backgroundColor: '#009387',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Animatable.View
                      style={{
                        height: 200,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      ref={logoRef}>
                     
                      <Image
                        style={{width: 100, height: 80}}
                        source={require('../components/logo.jpg')}
                        resizeMode="contain"
                      />
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 30,
                          fontWeight: 'bold',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        Thuan Mart
                      </Text>
                      <View height={4} />
                      <Text style={{color: 'white', fontWeight: '700',fontSize:14}}>
                        Uy tín, chất lượng tạo nên thương hiệu
                      </Text>
                      <Text
                        style={{
                          color: 'white',
                          fontWeight: '700',
                          textAlign: 'center',
                        }}>
                      </Text>
                    </Animatable.View>
                  </View>
                </Animatable.View>
                <View
                  style={{alignItems: 'center', padding: 16, paddingTop: 36}}>
                  {/* <Headline
                    style={{color: paperColor.primary, fontWeight: '400'}}>
                    ĐĂNG NHẬP
                  </Headline> */}
                </View>
                <View
                  style={{flex: 0, justifyContent: 'flex-start', padding: 16}}>
                  <TextBox
                    name="email"
                    autoCapitalize="none"
                    iconName="email"
                    // disabled={loading}
                    placeholder="Nhập email của bạn "
                    containerStyle={{borderWidth: 0, backgroundColor: 'white'}}
                    inputContainerStyle={{borderBottomWidth: 1.5}}
                    leftIconContainerStyle={{marginLeft: 12}}
                    onBlur={() => {
                      formik.handleBlur('email'), setIsSwitchOn(false);
                    }}
                    onChangeText={formik.handleChange('email')}
                    value={formik.values.email}
                    style={{fontSize:15}}

                  />
                  <View height={10} />
                  <View > 
                  <TextBox
                    name="password"
                    iconName="lock"
                    secureTextEntry
                    // disabled={loading}
                    placeholder="Mật khẩu"
                    containerStyle={{borderWidth: 0, backgroundColor: 'white'}}
                    inputContainerStyle={{borderBottomWidth: 1.5,}}
                    leftIconContainerStyle={{marginLeft: 12}}
                    onBlur={() => {
                      formik.handleBlur('password');
                    }}
                    onChangeText={formik.handleChange('password')}
                    value={formik.values.password}
                    // maxLength={10}
                    // iconName1="eye"
                    // style={{fontSize:15,backgroundColor:null}}
                  />
                      </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                      style={{alignSelf: 'center'}}
                      onPress={() => {
                        storeData({
                          email: formik.values.email,
                          password: formik.values.password,
                        });
                        setIsSwitchOn(true);
                      }}>
                      <Text
                        style={{alignSelf: 'center', paddingHorizontal: 10}}>
                        Lưu mật khẩu:
                      </Text>
                    </TouchableOpacity>

                    {
                      <Switch
                        style={{alignSelf: 'center', marginLeft: -80}}
                        value={
                          formik.values.email && formik.values.password
                            ? isSwitchOn
                            : null
                        }
                        color="#1E90FF"
                        onValueChange={() => {
                          setIsSwitchOn(false);
                          if (isSwitchOn == true) {
                            AsyncStorage.clear();
                          } else {
                            storeData({
                              email: formik.values.email,
                              password: formik.values.password,
                            });
                            setIsSwitchOn(true);
                          }
                        }}
                      />
                    }

                    <View
                      style={{
                        alignItems: 'flex-end',
                        marginBottom: 12,
                        marginTop: 12,
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('ForgotPasswordScreen');
                        }}>
                        <Text style={{color: colors.PRIMARY_FONT}}>
                          Quên mật khẩu?
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {signedInUser.error && (
                    <Text style={{color: 'red', textAlign: 'center'}}>
                      {signedInUser.error == 'auth/user-not-found'
                        ? 'Tài khoản gmail không tồn tại'
                        : 'Mật khẩu không chính xác'}
                    </Text>
                  )}
                </View>
                <Animatable.View 
                  animation="fadeIn"
                  duration={1000}
                  style={{flex: 1, padding: 16, justifyContent: 'flex-end',marginBottom:20,}}>
                  <Button
                    disabled={loading}
                    loading={loading}
                    labelStyle={{fontSize: 18}}
                    style={{
                      height: 48,
                      alignItems: 'center',
                      justifyContent: 'center',
                      // backgroundColor:'green',
                      borderRadius:16,
                      
                    }}
                    uppercase={false}
                    icon="key"
                    mode="contained"
                   
                    onPress={formik.handleSubmit}
                   dark >
                    {loading ? 'Đang đăng nhập ...' : 'Đăng nhập'}
                  </Button>

                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('RegisterScreen');
                    }}>
                    <View style={{alignItems: 'center', padding: 12}}>
                      <Text style={{color: colors.PRIMARY_FONT}}>
                        Bạn chưa có tài khoản? Đăng ký
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Animatable.View>
              </React.Fragment>
            )}
          </Formik>
        </KeyboardAvoidingView>
      {/* </TouchableOpacity> */}
      {/* </ImageBackground> */}
    </View>
  );
};

export default SignIn;

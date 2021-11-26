/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useRef, useState, useEffect} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  Platform,
  PermissionsAndroid,
  NativeModules,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import scanCls from './BarCodeScanner.js';
import BarcodeScanner from 'react-native-scan-barcode';
//import BarCodeParser from './BarCodeParser.js';
import { parseBarcode } from './barcodeParser2.js';

const App = () => {
  const fncChar = String.fromCharCode(29);
  const clsRnCamera = new RNCamera();
  const ScanBarcodeApp = new scanCls();
  const isDarkMode = useColorScheme() === 'dark';
  const camRef = useRef();
  const [textInput, setTextInput] = useState(undefined);
  const [rawTextInput, setRawTextInput] = useState(undefined);
  const [cameraAuth, setCameraAuth] = useState(undefined);
  const [scannerLoading, setScannerLoading] = useState(false);
  const [cameraAuthLoading, setCameraAuthLoading] = useState(true);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  console.log('cameraAuth:', cameraAuth);

  useEffect(() => {
    //Para solicitar permiso de camara a Android.
    cameraAuthRequest();
  }, []);

  const cameraAuthRequest = async () => {
    const {hasCameraPermissions} = await areCameraPermissionsGranted();

    setCameraAuth(
      {
        isAuthorized: hasCameraPermissions,
        isAuthorizationChecked: true,
      },
      this._onStatusChange,
    );
    setCameraAuthLoading(false);
  };

  const areCameraPermissionsGranted = async () => {
    let cameraPermissions = {
      title: 'Permission to use camera',
      message: 'We need your permission to use your camera',
      buttonPositive: 'Ok',
      buttonNegative: 'Cancel',
    };
    // const {
    //   androidCameraPermissionOptions,
    // } = this.props;

    //let cameraPermissions = androidCameraPermissionOptions;

    const { hasCameraPermissions } = await requestPermissions(
      CameraManager,
      cameraPermissions,
    );

    return { hasCameraPermissions };
  };

  const requestPermissions = async (
    CameraManager,
    androidCameraPermissionOptions,
  ) => {
    let hasCameraPermissions = false;

    if (Platform.OS === 'ios') {
      hasCameraPermissions =
        await CameraManager.checkVideoAuthorizationStatus();
    } else if (Platform.OS === 'android') {
      const cameraPermissionResult = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        //androidCameraPermissionOptions,
      );

      if (typeof cameraPermissionResult === 'boolean') {
        hasCameraPermissions = cameraPermissionResult;
      } else {
        hasCameraPermissions =
          cameraPermissionResult === PermissionsAndroid.RESULTS.GRANTED;
      }
    } else if (Platform.OS === 'windows') {
      hasCameraPermissions = await CameraManager.checkMediaCapturePermission();
    }

    return {
      hasCameraPermissions,
    };
  };
  //const codeParser = new BarCodeParser();

  

  const handleBarCodeRead = (barcodeData) => {
    console.log('raw barcodeData send:',barcodeData.data);
    setCameraAuthLoading(true);
    console.log(barcodeData.type);
    
    //Valido que el escanner devuelva Data_matrix o Code_128 y que utilice el Asci (29) que define el estandar GS1.
    //Esto se hizo de esta forma ya que no encontre una libreria que detecte GS1 directamente.
    if ((barcodeData.type === 'DATA_MATRIX' || barcodeData.type === 'CODE_128') && barcodeData.data.includes(fncChar)) {
      const parsedCode = parseBarcode(barcodeData.data);
      console.log(parsedCode);
    };

    setTextInput(`Tipo Codigo: ${barcodeData.type}`);
    setRawTextInput(`data: ${barcodeData.data}`);
    setTimeout(() => {
      setCameraAuthLoading(false);
    }, 1000);
  };

  const renderScanner = () => {
    return ScanBarcodeApp.render();
  };
  //console.log('camRef:',camRef.current?.barCodeTypes)

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Text style={styles.text}>BARDCODE SCANNER</Text>
          
          {!cameraAuthLoading && (
            <BarcodeScanner
              onBarCodeRead={handleBarCodeRead}
              style={{flex: 1, height: 400}}
              torchMode="off"
              cameraType="back"
              viewFinderShowLoadingIndicator={scannerLoading}
            />
          )}

          {/*renderScanner()*/}

          {/* <RNCamera
            ref={camRef}
            style={styles.camPreview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.on}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            captureAudio={false}
            androidRecordAudioPermissionOptions={{
              title: 'Permission to use audio recording',
              message: 'We need your permission to use your audio',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}onBarCodeRead={handleBarCodeRead}
            //onGoogleVisionBarcodesDetected={({ barcodes }) => {
            //  console.log(barcodes);
            //}}
        />  */}
          <Text style={{fontWeight: '700'}}>{textInput}</Text>
          <Text style={{fontWeight: '700'}}>{rawTextInput}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  highlight: {
    fontWeight: '700',
  },
  text: {
    fontWeight: '700',
    height: 50,
    //backgroundColor:'red',
  },
  camPreview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
    padding: 20,
    marginTop: 14,
    height: 400,
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

const CameraManager = NativeModules.RNCameraManager ||
  NativeModules.RNCameraModule || {
    stubbed: true,
    Type: {
      back: 1,
    },
    AutoFocus: {
      on: 1,
    },
    FlashMode: {
      off: 0,
    },
    WhiteBalance: {},
    BarCodeType: {},
    FaceDetection: {
      fast: 1,
      Mode: {},
      Landmarks: {
        none: 0,
      },
      Classifications: {
        none: 0,
      },
    },
    GoogleVisionBarcodeDetection: {
      BarcodeType: 0,
      BarcodeMode: 0,
    },
  };

export default App;

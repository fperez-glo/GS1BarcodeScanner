import  {
    AppRegistry,
    Text,
    View,
  } from 'react-native';
  import React, {Component, useState} from 'react'
  import BarcodeScanner from 'react-native-scan-barcode';
  
 export default class ScanBarcodeApp extends Component {
     
    constructor(props) {
      super(props);
  
      this.state = {
        torchMode: 'off',
        cameraType: 'back',
      };
    }
    console(){
        console.log('holaaa desde barcodescanner')
    }
    barcodeReceived(e) {
      console.log('Barcode: ' + e.data);
      console.log('Type: ' + e.type);
      
    }
  
    render() {
        
        console.log('pasa por RENDERRRR!!!')
      return (
          <View>
        <BarcodeScanner
          onBarCodeRead={this.barcodeReceived}
          style={{ flex: 1,height:400 }}
          torchMode={this.state.torchMode}
          cameraType={this.state.cameraType}
        />
        <Text style={{color:'white',marginTop:0, fontWeight:'700'}}></Text>
        </View>
      );
    }
  }
  AppRegistry.registerComponent('ScanBarcodeApp', () => ScanBarcodeApp);
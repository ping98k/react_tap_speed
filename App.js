/* eslint-disable react-native/no-inline-styles */
import Slider from '@react-native-community/slider';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  TouchableOpacity,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const App = () => {
  return <MainApp />;
};

export default App;
const num = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
class MainApp extends React.Component {
  componentDidMount() {
    this.init()
  }

  timer = null
  counter = null

  state = {
    count: 3,
    time: msToTime(0),
    isRunning: false,
    listReq: [],
    listPass: [],
    listErr: []
  }
  init = () => {
    this.timerReset();
    var lr = []
    while (lr.length < this.state.count) {
      var i = parseInt(Math.random() * 10) % 9

      if (lr.includes(i)) continue;
      lr.push(i)
      console.log(lr);
    }
    this.setState({ listReq: lr, listPass: [], listErr: [] })
  }

  colowSw = (i) => {

    if (this.state.listReq.includes(i)) return col.grey2;
    if (this.state.listPass.includes(i)) return col.blue;
    if (this.state.listErr.includes(i)) return col.red;
    return col.grey1;
  }

  timerStart = () => {
    this.setState({ isRunning: true });
    this.counter = performance.now();
    this.timer = setInterval(() => {
     
     // console.time("cal")
      var diff = performance.now() - this.counter;
      var time = msToTime(diff);
     // console.timeEnd("cal")
      this.setState({ time })
    }, 1000 / 10)
  }

  onPress = (i) => {


    this.setState(s => {
      if (s.listPass.length == 0 && s.listErr.length == 0) {
        this.timerStart();
      }
      if (s.listReq.includes(i)) {
        s.listReq = s.listReq.filter(v => v != i);
        s.listPass = [...s.listPass, i]
      } else {
        s.listReq = s.listReq.filter(v => v != i);
        s.listPass = s.listPass.filter(v => v != i);
        s.listErr = [...s.listErr, i]

      }
      if (s.listReq.length == 0) {
        this.timerStop();
      }
      return s
    });
  }
  timerStop = () => {
    clearInterval(this.timer)
    var diff = performance.now() - this.counter;
    var time = msToTime(diff);
    this.setState({ isRunning: false, time });
  }

  timerReset = () => {
    this.timerStop();

    this.setState({ isRunning: false, time: msToTime(0) });
  }

  render() {
    const table = num.map(i => {
      const row = i.map(ii => <SqButton key={ii} color={this.colowSw(ii)} onPress={_ => this.onPress(ii)} />)
      return <View key={i[0]} style={{ flexDirection: "row" }} >{row}</View>
    })
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{ fontSize: 30 }}>{this.state.time}</Text>
        <View style={{ height: 50 }}></View>
        {table}
        <View style={{ height: 50 }}></View>
        <View style={{ flexDirection: "row" }}>
          <Button onPress={_ => this.state.isRunning ? this.timerStop() : this.timerStart()}
            title={this.state.isRunning ? "Stop" : "Start"}></Button>
          <View style={{ width: 50 }}></View>
          <Button title="Reset" onPress={this.init} />
        </View>
        <View style={{ height: 20 }}></View>
        <Slider
          style={{ width: 300, height: 40 }}
          minimumValue={1}
          maximumValue={9}
          onValueChange={v => {
            console.log(v);
            this.setState({ count: v }, () => { this.init() })
          }}
          value={this.state.count}
          step={1}
        />
      </View>
    );
  }
}

const SqButton = ({ color, onPress }) => <TouchableOpacity onPress={onPress} >
  <View style={{ margin: 5, backgroundColor: color, width: 100, height: 100, borderRadius: 2 }} ></View>
</TouchableOpacity>

const col = {
  red: "#eb4034",
  grey1: "#d4d4d4",
  grey2: "#737373",
  blue: "#5465ff"
}

function msToTime(s) {
  // Pad to 2 or 3 digits, default is 2
  function pad(n, z) {
    z = z || 2;
    return ('00' + n).slice(-z);
  }

  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;
  var strms = pad(Number.parseInt(ms), 3)
  return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + strms;
}
import 'dart:async';
import 'dart:io';
import 'package:web_socket_channel/io.dart';
import 'package:flutter/material.dart';
import 'package:sensors/sensors.dart';

class HomeView extends StatefulWidget {
  @override
  _HomeViewState createState() => _HomeViewState();
}

class _HomeViewState extends State<HomeView> {
  AccelerometerEvent? _eventAccel;
  GyroscopeEvent? _eventGyro;
  int _lsmTime = 20;
  Timer? _timer;
  IOWebSocketChannel? _socket;
  bool _socketIsConnected = false;
  String _status = '';

  StreamSubscription<AccelerometerEvent>? _accelStream;
  StreamSubscription<GyroscopeEvent>? _gyroStream;

  TextEditingController _ipEditingController = TextEditingController();
  // TextEditingController _portEditingController = TextEditingController();

  bool sensorIsActivated = false;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(Duration(milliseconds: _lsmTime), (_) {
      setPosition(_eventAccel, _eventGyro);
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _accelStream?.cancel();
    _gyroStream?.cancel();
    _socket?.sink.close();
    super.dispose();
  }

  Future<void> _connectSocketChannel() async {
    if (_ipEditingController.text.isEmpty) {
      return;
    }

    var URL =
        'ws://${_ipEditingController.text}:8080';

    try {
      WebSocket.connect(URL).then((ws) {
        _socket = IOWebSocketChannel(ws);
        connectionListener(true);
      }).catchError((err) {
        connectionListener(false);
      });
    } catch (e) {
      connectionListener(false);
    }
  }

  void sendMessage(message) {
    try {
      _socket?.sink.add('$message');
    } catch (e) {
      setState(() {
        _status = 'Status: Connection problems, try to connect again';
        _socketIsConnected = false;
      });
    }
  }

  void connectionListener(bool connected) {
    setState(() {
      _status = 'Status: ' + (connected ? 'Connected' : 'Failed to connect');
      _socketIsConnected = connected;
    });
  }

  void setPosition(
      AccelerometerEvent? currentAccel, GyroscopeEvent? currentGyro) {
    if (currentAccel == null || currentGyro == null) {
      return;
    }

    if (_socketIsConnected) {
      sendMessage('${[
        currentAccel.x,
        currentAccel.y,
        currentAccel.z,
        currentGyro.x,
        currentGyro.y,
        currentGyro.z,
      ]}');
    }
  }

  void startTimer() {
    if (_accelStream == null && _gyroStream == null) {
      _accelStream = accelerometerEvents.listen((AccelerometerEvent event) {
        setState(() {
          _eventAccel = event;
        });
      });
      _gyroStream = gyroscopeEvents.listen((GyroscopeEvent event) {
        setState(() {
          _eventGyro = event;
        });
      });
    } else {
      _accelStream?.resume();
      _gyroStream?.resume();
    }
  }

  void pauseTimer() {
    _accelStream?.pause();
    _gyroStream?.pause();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('GyroCAD'),
        backgroundColor: Colors.blueGrey,
      ),
      body: Container(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: <Widget>[
            const Padding(padding: EdgeInsets.only(bottom: 40.0)),
            customTextField(
                _ipEditingController, 'Put the Web Socket IP here'),
            const Padding(padding: EdgeInsets.only(bottom: 5.0)),
            // customTextField(
            //     _portEditingController, 'PORT Server Example: 8080'),
            const Padding(padding: EdgeInsets.only(bottom: 20.0)),
            OutlinedButton(
              child: Text(
                  !_socketIsConnected ? 'Connect Server' : 'Disconnect Server'),
              onPressed: () {
                if (!_socketIsConnected) {
                  _connectSocketChannel();
                } else {
                  setState(() {
                    _socketIsConnected = false;
                    _socket?.sink.close();
                    _status = '';
                  });
                }
              },
            ),
            const Padding(padding: EdgeInsets.only(bottom: 20.0)),
            Text(_status),
            const Padding(padding: EdgeInsets.only(bottom: 20.0)),
            const Padding(padding: EdgeInsets.only(bottom: 10.0)),
            OutlinedButton(
              child: Text(!sensorIsActivated ? 'Start' : 'Stop'),
              onPressed: () {
                if (!sensorIsActivated) {
                  startTimer();
                  setState(() {
                    sensorIsActivated = true;
                  });
                } else {
                  pauseTimer();
                  setState(() {
                    sensorIsActivated = false;
                  });
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  TextField customTextField(TextEditingController controller, String text) {
    return TextField(
      controller: controller,
      decoration: InputDecoration(
        border: const OutlineInputBorder(
          borderRadius: BorderRadius.all(Radius.circular(6.0)),
        ),
        filled: true,
        fillColor: Colors.white60,
        contentPadding: const EdgeInsets.all(15.0),
        hintText: text,
      ),
    );
  }
}

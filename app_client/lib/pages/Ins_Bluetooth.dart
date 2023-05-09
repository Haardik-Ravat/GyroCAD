import 'package:app_client/pages/bluetooth.dart';
import 'package:flutter/material.dart';
import 'package:app_client/pages/widgets.dart';
class Ins_Bluetooth extends StatefulWidget {
  const Ins_Bluetooth({Key? key}) : super(key: key);

  @override
  State<Ins_Bluetooth> createState() => _Ins_BluetoothState();
}

class _Ins_BluetoothState extends State<Ins_Bluetooth> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Bluetooth Instructions'),
        backgroundColor: Colors.blueGrey,
      ),
      body: Container(
        width: MediaQuery.of(context).size.width,
        height: MediaQuery.of(context).size.height,

        child: SingleChildScrollView(
          child: Padding(
            padding: EdgeInsets.fromLTRB(
                20, MediaQuery.of(context).size.height * 0.2, 20, 0),
            child: Column(
              children: <Widget>[

                const Text(
                 "Bluetooth Instructions"
                ),
                firebaseUIButton(context, "Connect via BLuetooth", () {
                  Navigator.push(context, MaterialPageRoute(builder: (context) => Bluetooth()));
                }),
              ],


            ),
          ),
        ),
      ),
    );
  }
}

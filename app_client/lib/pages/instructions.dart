import 'package:app_client/pages/home/home.dart';
import 'package:flutter/material.dart';
import 'package:app_client/pages/start.dart';
import 'package:app_client/pages/widgets.dart';

class Instructions extends StatefulWidget {
  const Instructions({Key? key}) : super(key: key);

  @override
  State<Instructions> createState() => _InstructionsState();
}

class _InstructionsState extends State<Instructions> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
                    "We're no strangers to love  You know the rules and so do I    A full commitment's what I'm thinking of  You wouldn't get this from any other guy I just wanna tell you how I'm feelingGotta make you understand"
                ),
                firebaseUIButton(context, "Set your IP", () {
                  Navigator.push(context, MaterialPageRoute(builder: (context) => HomeView()));
                }),
              ],


            ),
          ),
        ),
      ),
    );
  }
}

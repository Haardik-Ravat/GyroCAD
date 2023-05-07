const WebSocket = require("ws");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const port = 8000;
app.listen(port, () => {
  console.log("Listening on port " + port);
});

const responseData = {
  accx: " ",
  accy: " ",
  accz: " ",
  gyrx: " ",
  gyry: " ",
  gyrz: " ",
};

const wss = new WebSocket.Server({ port: 8080 });
wss.on("connection", function connection(ws) {
  console.log("Client connected");

  ws.on("message", function incoming(data) {
    data = data.toString();
    var jsonObject = JSON.parse(data);
    // console.log(data);
    responseData.accx = jsonObject[0];
    responseData.accy = jsonObject[1];
    responseData.accz = jsonObject[2];
    responseData.gyrx = jsonObject[3];
    responseData.gyry = jsonObject[4];
    responseData.gyrz = jsonObject[5];
  });

  ws.on("close", function close() {
    console.log("Client disconnected");
  });
});

app.get("/", (req, res) => {
  const content = JSON.stringify(responseData);
  res.setHeader("Content-Type", "application/json");

  res.send(content);
});

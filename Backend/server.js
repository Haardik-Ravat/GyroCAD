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
  w: " ",
  x: " ",
  y: " ",
  z: " ",
};

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
  console.log("Client connected");

  ws.on("message", function incoming(data) {
    data = data.toString();
    var jsonObject = JSON.parse(data);
    // console.log(jsonObject[0]);
    responseData.w = jsonObject[0];
    responseData.x = jsonObject[1];
    responseData.y = jsonObject[2];
    responseData.z = jsonObject[3];
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

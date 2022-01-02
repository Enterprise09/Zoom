# Zoom

<img src="https://img.shields.io/badge/Node.js-14.15.1-brightgreen">
<img src="https://img.shields.io/badge/Develop-~ing-orange">

> simple Zoom clone using Node.js, WebRTC and Websockets.

## 1. Socket.io

> <a href="https://socket.io/">Documentation</a>

- 실시간 양방향 이벤트 기반 통신

    <img src="https://socket.io/images/bidirectional-communication.png">

- 서버와 브라우저 간의 실시간 통신을 지원
- WebSocket Server 위에서 작동
  > HTTP Server 만 있을 경우 작동불가 - http://localhost:3000<br />
  > 'WS'프로토콜을 이용 - ws://localhost:3000<br />

## 2. Web RTC

> <a href="https://developer.mozilla.org/ko/docs/Web/API/WebRTC_API">Documentation</a>

- Web Real-Time Communication
- 중간자 없이 브라우저 간에 임의의 데이터 및 미디어를 연결된 다른 피어들과 교환
- Stream 개념을 이용한 여러개의 Track 형태로 제공
- DataChannel를 이용하면 이미지, 텍스트, 파일등을 바이너리 데이터로 전송가능
  > 바이너리 파일 형태로 교환하기 때문에 속도면에서 더욱 빠름

## 3. Node.js - Express Server

> <a href="https://expressjs.com/">Documentation</a>

- Express Framework를 이용한 Node.js기반의 서버
- 각각의 브라우저에 이벤트를 발생시킴
- Socket.io를 이용하기 위하여 HTTP Server 위에 WebSocket Server 구축

```js
//server.js
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});
```

## 4. STUN Server

- 각 브라우저의 IP주소를 알려주기 위해서 사용됨
- Google이 제공하는 Public STUN Server를 이용

    <img src="https://mdn.mozillademos.org/files/6115/webrtc-stun.png" style="background-color: white;">

```js
// app.js
myPeerConnection = new RTCPeerConnection({
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
      ],
    },
  ],
});
```

## 5. Version

<img src="https://img.shields.io/badge/Develop-~ing-orange">

- 2022.01.01

  > 2개의 클라이언트가 Peer-To-Peer연결<br />  
  > 연결을 통해서 화상 회의 가능
  >
  > > 카메라 On/Off & 카메라 변경<br />
  > > 오디오 음소거 가능

- 2022.01 ~ 02 (~ing)
  > RTCDataChannel를 이용
  >
  > - 여러개의 피어 연결가능
  > - 채팅기능
  > - 방생성, 참가 기능

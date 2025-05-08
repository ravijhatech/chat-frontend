// import React from 'react'
// import {BrowserRouter as Router , Route ,Routes} from "react-router-dom";
// import Card from './card';
// import AddBlog from './AddBlog';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path='/' element={<Card/>}/>
//         <Route path='/addblog' element={<AddBlog/>}/>
//       </Routes>
//     </Router>
//   )
// }

// export default App




import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('https://chat-backend-1-4mz1.onrender.com');
const roomId = 'room123';

function App() {
  const localVideo = useRef();
  const remoteVideo = useRef();
  const peerConnection = useRef(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const remoteSocketId = useRef(null);

  useEffect(() => {
    socket.emit('join', roomId);
    axios.get(`https://chat-backend-1-4mz1.onrender.com/messages/${roomId}`).then(res => {
      setMessages(res.data);
    });

    socket.on('user-joined', async (id) => {
      remoteSocketId.current = id;
      await initConnection();
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit('offer', { offer, to: id });
    });

    socket.on('offer', async ({ offer, from }) => {
      remoteSocketId.current = from;
      await initConnection();
      await peerConnection.current.setRemoteDescription(offer);
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit('answer', { answer, to: from });
    });

    socket.on('answer', async ({ answer }) => {
      await peerConnection.current.setRemoteDescription(answer);
    });

    socket.on('ice-candidate', async ({ candidate }) => {
      await peerConnection.current.addIceCandidate(candidate);
    });

    socket.on('chat-message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
  }, []);

  const initConnection = async () => {
    if (peerConnection.current) return;

    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    peerConnection.current.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit('ice-candidate', { candidate: e.candidate, to: remoteSocketId.current });
      }
    };

    peerConnection.current.ontrack = (e) => {
      remoteVideo.current.srcObject = e.streams[0];
    };

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));
    localVideo.current.srcObject = stream;
  };

  const sendMessage = () => {
    if (text.trim()) {
      const msg = { roomId, sender: 'You', message: text };
      socket.emit('chat-message', msg);
      setMessages(prev => [...prev, msg]);
      setText('');
    }
  };

  return (
    <div>
      <h2>Live Video Call</h2>
      <div style={{ display: 'flex', gap: '10px'}}>
        <video ref={localVideo} autoPlay muted playsInline width="200px" />
        <video ref={remoteVideo} autoPlay playsInline width="50%" />
      </div>

    
       


      </div>
    </div>
  );
}

export default App;

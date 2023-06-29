import React, { createContext, useState, useRef, useEffect } from 'react';
import Peer, { SignalData } from 'simple-peer';
import useSocket from "@hooks/useSocket";

interface ContextProviderProps {
  children: React.ReactNode;
}

interface CallData {
  isReceivingCall: boolean;
  from: string;
  name: string;
  signal: SignalData;
}

interface MediaStreamConstraints {
  video: boolean;
  audio: boolean;
}

interface SocketContextValue {
  call: CallData;
  callAccepted: boolean;
  myVideo: React.RefObject<HTMLVideoElement | null>;
  userVideo: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | undefined;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  callEnded: boolean;
  me: string;
  callUser: (id: string) => void;
  leaveCall: () => void;
  answerCall: () => void;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

// const socket = io('http://localhost:3095');
//const socket = io('https://warm-wildwood-81069.herokuapp.com');

const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
  const [socket] = useSocket("video");

  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [callEnded, setCallEnded] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | undefined>();
  const [name, setName] = useState<string>('');
  const [call, setCall] = useState<CallData>({ isReceivingCall: false, from: '', name: '', signal: {} as SignalData });
  const [me, setMe] = useState<string>('');

  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<Peer.Instance | null>(null);

  // 페이자가 뜨자마자 video, mic 에 접근권한 필요하니까..!
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => { //promise를 리턴함. chain해서, stream으로 받아와..
        setStream(currentStream); // 이 결과를 저장해야해서...!
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
    });

    socket?.on('me', (id) => setMe(id));

    socket?.on('callUser', ({ from, name: callerName, signal }) => {
      console.log(`get called from(${from}) name(${name})`)
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data: any) => {
      socket?.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream: MediaStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    peer.signal(call.signal); //이건 내 영상으 저쪽에 보내는 것이다.

    connectionRef.current = peer; //connection 객체에 peer를 할당. (peer와의 interaction을 위해서)
  };

  // 말 그대로 전화 걸기
  const callUser = (id: string) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    console.log(`call user id => ${id}`)
    peer.on('signal', (data: any) => {
      socket?.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });

    peer.on('stream', (currentStream: MediaStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    socket?.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    window.location.reload();
  };

  // SocketContext의 여러가지 data를 props를 사용하지 않고 넘겨주는 것임.
  // 이 ContextProvider에서 만든 모든 객체들이 SocketContext의 value에 access 가능.
  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };

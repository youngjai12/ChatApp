import React, {useContext, useRef} from 'react';
import { SocketContext } from './context';


const VideoPlayer = () => {
  const socketContext = useContext(SocketContext);

  if (!socketContext) {
    return null;
  }

  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = socketContext

  return ( <>
      <div>VideoPlayer</div>;
      <div>
        {stream && myVideo && (
          <video playsInline muted ref={myVideo as React.RefObject<HTMLVideoElement>} autoPlay />
        )}
        {callAccepted && !callEnded && (
          <div>
            <div>{call.name || name}</div>
            <video playsInline ref={userVideo as React.RefObject<HTMLVideoElement>} autoPlay />
          </div>
        )}
      </div>
    </>
  )
};

export default VideoPlayer;

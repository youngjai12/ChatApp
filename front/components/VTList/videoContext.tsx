import React, {useContext, useRef} from 'react';
import { SocketContext } from './context';
import ImageComponent from "@components/ShowImage";


const VideoPlayer = () => {
  const socketContext = useContext(SocketContext);

  if (!socketContext) {
    return null;
  }

  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = socketContext
  const imgUrl = "https://oaidalleapiprodscus.blob.core.windows.net/private/org-j2Qrvj9IvxRV4daXGW7NZQOR/user-7rytGwJHGuxzPax8nWJoN6Ov/img-yeVoBky1Gi46S02SMSjbMTky.png?st=2023-06-29T15%3A33%3A26Z&se=2023-06-29T17%3A33%3A26Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-06-28T20%3A53%3A11Z&ske=2023-06-29T20%3A53%3A11Z&sks=b&skv=2021-08-06&sig=XRWpve6/s0%2BevUCvPAnlPyNbsTS%2BM%2B0Vsm9fgZPH7Bk%3D"
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
        <ImageComponent imageUrl={imgUrl} />
      </div>
    </>
  )
};

export default VideoPlayer;

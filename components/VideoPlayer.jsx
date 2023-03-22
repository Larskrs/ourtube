import { useState } from "react";

function VideoPlayer({ id, onEnded }) {

    const [quality, setQuality] = useState(135);

    return (



      <>
        <video
          src={`/api/videos?videoId=${id}&quality=${quality}`}
          width="800px"
          style={{maxWidth: `100%`, maxHeight: `800px`}}
          height="auto"
          controls
          autoPlay
          poster={"/api/thumbnail?id=" + id}
          id="video-player"
          
          onEnded={() => {
            onEnded()
          }}
          />
          <div style={{gap: `.25rem`, display: `flex`}}>
            <button onClick={() => setQuality(1080)}>1080p</button>
            <button onClick={() => setQuality(720)}>720p</button>
            <button onClick={() => setQuality(135)}>Stupid</button>
          </div>
        </>
    )
  }
  
  export default VideoPlayer;
import { useState } from "react";

function VideoPlayer({ id, onEnded }) {

    const [quality, setQuality] = useState(135);
    const source = `/api/videos?videoId=${id}&quality=${quality}`
    return (



      <div style={{display: `flex`, flexDirection: `column`, gap: `1rem`}}>
        <video
          src={source}
          style={{width: `100vw`, maxWidth: `100%`, maxHeight: `800px`}}
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
            <span>{""}</span>
            <button onClick={() => { navigator.clipboard.writeText(location.host +  source); alert("Copied Link to clipboard") }}>Copy</button>
          </div>
        </div>
    )
  }
  
  export default VideoPlayer;
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { shortTxt } from "../lib/TextLib";

function VideoPlayer({ id, onEnded, title, qualities=[360] }) {

  
    const [quality, setQuality] = useState(qualities != null ? qualities[qualities.length - 1] : 360);
    const [progress, setProgress] = useState(0)

    useEffect(() => {
      const vd = document.getElementById('video');
      const vp = document.getElementById('video-player');
      const duration = vd.duration

      

      vp.onfullscreenchange = (event) => {

        

        console.log({event})
        
        const fullscreened = event.target
        console.log({fullscreened})
        
        if (document.fullscreenElement) {
          console.log("Changing max video size for fullscreen.")
          vd.style = "width: 100vw; height: 100vh;"
        } else {
          console.log("Changing smallest video size for normal view.")
          vd.style = "width: 100vw; max-width: 100%; max-height: 80vh; aspect-ratio: 16/9;"
        } 
      }
    //   const progressBar = document.getElementById('progress');
    //   progressBar.addEventListener("click", (e) => {
    //     const pos =
    //       (e.pageX - progressBar.offsetLeft - progressBar.offsetParent.offsetLeft) /
    //       progressBar.offsetWidth;
    //     vd.currentTime = pos * vd.duration;
    //     console.log(vd.currentTime, vd.duration, progress)
    //     setProgress((vd.currentTime / vd.duration) * 100)
    //   });

    //   vd.ontimeupdate = function () {
    //     setProgress((vd.currentTime / vd.duration) * 100)
    //   }

    //   function keyPress (e) {
    //     if(e.key === "Escape") {
    //         handleFullScreen(e)
    //     }
    // }


    }, [])

    
    
    const source = `/api/videos?videoId=${id}&quality=${quality}`
    return (

      <div key={id}>

      <div id={"video-player"} className="video-player" style={{display: `flex`, flexDirection: `column`, gap: `1rem`}}>

        <video
          key={id}
          src={source}
          style={{width: `100vw`, maxWidth: `100%`, maxHeight: `80vh`, aspectRatio: 16/9}}
          height="auto"
          controls
          autoPlay
          // preload="none"
          className="video"
          poster={"/api/thumbnail?id=" + id}
          id="video"
          controlsList="nodownload nofullscreen"
          onClick={togglePlay}
          title={title}
          
          onEnded={() => {
            onEnded()
          }}
          
          />

          <div className="overlay">
            <h2 className="title">{shortTxt(title, 50)}</h2>
            {/* <div className="controls">
              <progress className="progress" id="progress" value={progress} max={100} min={0}></progress>

              <button style={{right: `0`}} type="button" className="fullscreen" onClick={handleFullScreen} >FS</button>
              <button style={{right: `0`}} type="button" className="fullscreen" onClick={togglePlay} >P/P</button>

              <button onClick={() => setQuality(1080)}>1080p</button>
              <button onClick={() => setQuality(720)}>720p</button>
              <button onClick={() => setQuality(135)}>Stupid</button>

            </div> */}
          </div>
          <div style={{display: `flex`, gap: `.25rem`, width: `100%`, margin: `0`}}>
            {qualities.map((q) => {
              return (
                <button key={q} style={quality == q ? {outline: `2px solid #5448C8`} : {}} onClick={() => setQuality(q)}>{q}p</button>
              )
            })}
            
              {qualities.length == 0 && <p>Sorry, this content is not yet ready or has simply given up. Please give it some time.</p> }
            
          </div>
        </div>

          
          <style jsx>{`

            .video-player:hover .controls {
              opacity: 1;
              
            }
            :not(.video-player:hover) .overlay {
              color: black;
              opacity: 1;
              
              animation: linear .5s 2s hide forwards;
            }
            .controls {
              opacity: 1;
              display: flex;
              position: absolute;
              bottom: 0px;
              width: 100%;
              padding: .5rem;
              gap: .25rem;
              align-items: center;
              flex-wrap: wrap;
              background-color: #3333301;
              z-index: 9;
              animation: linear 2s hide;
              pointer-events: all;
              font-size: 10px;
              background: rgb(0,0,0);
              background: linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(255,255,255,0) 100%); 
            }
            .progress[value] {
              /* Reset the default appearance */
              -webkit-appearance: none;
              -moz-appearence: none;
               appearance: none;
            
              width: 100%;
              height: 10px;
              border: none;
              border-radius: 2px;
              background: #00000080;
              color: black;
            }
            progress[value]::-webkit-progress-value {
              background-image:
                 -webkit-linear-gradient(-45deg, 
                                         transparent 33%, rgba(0, 0, 0, .1) 33%, 
                                         rgba(0,0, 0, .1) 66%, transparent 66%),
                 -webkit-linear-gradient(top, 
                                         rgba(255, 255, 255, .25), 
                                         rgba(0, 0, 0, .25)),
                 -webkit-linear-gradient(left, #09c, #f44);
            
                border-radius: 2px; 
                background-size: 35px 20px, 100% 100%, 100% 100%;
            }
            .overlay {
              opacity: 1;
              display: flex;
              position: absolute;
              bottom: 0;
              left: 0;
              height: 100%;
              width: 100%;
              pointer-events: none;
            }
            .title {
              position: absolute;
              left: 10px;
              top: 10px;
              font-size: 30px;
            }
            .video-player {
              position: relative;
              z-index: 9;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            

            @keyframes hide {
              0% {
                opacity: 1;
              }
              100% {
                opacity: 0;
              }
            }

          `}</style>

          </div>
    )

    function handleFullScreen(event) {

      const vp = document.getElementById('video-player')
      if (document.fullscreenElement) {
        document.exitFullscreen(); return; 
      } 

      vp.requestFullscreen();


    }
    function togglePlay () {

      const video = document.getElementById('video')

      if (video.paused || video.ended) {
        video.play();
      } else {
        video.pause();
      }

    } 

  }
  
  export default VideoPlayer;
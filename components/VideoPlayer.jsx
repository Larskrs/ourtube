function VideoPlayer({ id, onEnded }) {
    return (
      <video
        src={`/api/videos?videoId=${id}`}
        width="800px"
        style={{maxWidth: `100%`, maxHeight: `800px`}}
        height="auto"
        controls
        autoPlay
        id="video-player"
        onEnded={() => {
          onEnded()
        }}
      />
    );
  }
  
  export default VideoPlayer;
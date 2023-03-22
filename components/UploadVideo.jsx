import React, { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { uuidv4 } from "uuid"
import Link from "next/link";
import supabase from "../lib/Supabase";
import VideoPlayer from "./VideoPlayer";


function VideoUpload() {
  const [file, setFile] = useState();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [link, setLink] = useState("")
  const [title, setTitle] = useState("")
  const [id, setId] = useState("")
  const [published, setPublished] = useState(false)


  async function handleSubmit() {
    const data = new FormData();

    if (!file) return;

    setSubmitting(true);

    const newId = Date.now()
    const newName = newId+".mp4";
    const newFile = new File([file], newName);
    setId(newId)

    data.append("file", newFile);

    const config = {
      onUploadProgress: function (progressEvent) {
        const percentComplete = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
          );
          
          setProgress(percentComplete);
        },
      };
      
      try {
        await axios.post("/api/videos", data, config);
      } catch (e) {
        setError(e.message);
      } finally {
        setSubmitting(false);
        setProgress(0);
        setLink("/videos/" + newId)
    }
  }
  
  function handleSetFile(event) {
    const files = event.target.files;
    
    if (files?.length) {
      setFile(files[0]);
    }
  }
  
  async function handlePublish (event) {
    
    if (submitting) { return;}
    if (!file) { return;}
    if (!title) { return;}
    
    
    const {data, error} = await supabase.from("videos")
    .insert({
      id: id,
      source: "/api/videos?videoId=" + id,
      title: title,
      storage: process.env.NEXT_PUBLIC_STORAGE_ID,
    })
    .select("*")
    

    
    
    
    console.log({data, error})
    
    
    setPublished(true);
  } 

  function canPublish () {
    if (submitting) { return false;}
    if (!file) { return false;}
    if (!link) { return false;} 
    if (!title) { return false;}
    return true;
  }

  return (
    <>
    <div className="main">

        <h3>Video Publisher</h3>
        <p>Fill out this form to anonymously publish a video.</p>

        {error && <p>{error}</p>}
        {submitting && <p>{progress}%</p>}
        {submitting && <progress hidden={!submitting} value={progress} max={100} />}
        <form className="form" action="POST">
          <div>
            <label htmlFor="file">File</label>
            <input type="file" id="file" accept=".mp4" onChange={handleSetFile} />
          </div>
        </form>
        <button onClick={handleSubmit}>Upload video</button>

      <div className="form">
        <form>
          <label htmlFor="title">Video Title</label>
          <input placeholder="This is my title..." autoComplete="off" type="text" id="title" onChange={(event) => {setTitle(event.target.value)}} />
        </form>
        {!published && <button disabled={!canPublish()} onClick={handlePublish} className={"publish"}>Publish</button>}
        {published && <Link style={{color: `aquamarine`}} href={link}>{link}</Link>}
        {/* {id && link && <VideoPlayer onEnded={() => {}} id={id} />} */}
      </div>
    </div>


      <style jsx>{`

        .publish {
          border: none;
          border-radius: 10px;
          padding: 10px 50px;
          font-weight: 700;
          cursor: pointer;
          background: #5448C8;
          transition: all 0.1s 
        }
        .publish:disabled {
          background: transparent;
          scale: 1.5;
        }
        .main {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          background: var(--form);
          border-radius: 10px;
          padding: 10px;
          
        }
        .form  {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .preview {
          width: 200px
        }

      `}</style>

      </>
  );
}

export default VideoUpload;
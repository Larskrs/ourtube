import React, { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { uuidv4 } from "uuid"
import Link from "next/link";
import supabase from "../lib/Supabase";
import VideoPlayer from "../components/VideoPlayer";
import BaseLayout from "../layouts/BaseLayout";

function VideoUpload() {
  const [file, setFile] = useState();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [link, setLink] = useState("")
  const [title, setTitle] = useState("")
  const [id, setId] = useState("")
  const [published, setPublished] = useState(false)
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState("")
  const [fileTempUrl, setFileTempUrl] = useState("")

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

    setFileTempUrl(URL.createObjectURL(files[0]))
    
    if (files?.length) {
      setFile(files[0]);
    }
  }
  
  async function handlePublish (event) {
    
    if (submitting) { return;}
    if (!file) { return;}
    if (!title) { return;}
    
    
    const {data, error} = await supabase.from("videos")
    .update({
      source: "/api/videos?videoId=" + id,
      title: title,
      tags: tags,
    })
    .eq("id", id)
    .select("*")
    

    
    
    
    console.log({data, error})
    
    
    setPublished(true);
  } 

  function canPublish () {
    if (submitting) { return false;}
    if (!file) { return false;}
    if (!link) { return false;} 
    if (!title) { return false;}
    if (!tags) { return false}
    if (tags.length <= 0) { return false;}
    
    return true;
  }

  return (
    <>
    <BaseLayout>
    <div className="main">

        <h3>Video Publisher</h3>
        <p>Fill out this form to anonymously publish a video.</p>

        {error && <p>{error}</p>}
        {submitting && <p>{progress}%</p>}
        {submitting && <progress hidden={!submitting} value={progress} max={100} />}
        {!id && <form className="form" action="POST">
          <div>
            <label htmlFor="file">File</label>
            <input type="file" id="file" accept=".mp4" onChange={handleSetFile} />
          </div>
        </form>
        }
        {file && fileTempUrl && !id &&  
          <div style={{minWidth: `400px`, maxWidth: `400px`, background: `var(--gray-100)`, padding: `.5rem`, borderRadius: `10px`, border: `1px solid var(--gray-300)`, display: `flex`}}>
            <video controls autoplay style={{display: `flex`, width: `100%`}} src={fileTempUrl} />
         </div>
        }
        {id && !submitting && <>
            <div style={{minWidth: `400px`, maxWidth: `400px`, background: `var(--gray-100)`, padding: `.5rem`, borderRadius: `10px`, border: `1px solid var(--gray-300)`}}>
             <VideoPlayer id={id} title={title} onEnded={() => {}} />
            </div>
          </>
        }
        
        {!id && file && <button style={{maxWidth: `200px`}} disabled={id} className={"upload"} onClick={handleSubmit}>Upload video</button> }

      <div className="form">
        <form>
          <label className="seperator" htmlFor="title">Video Title</label>
          <input placeholder="This is my title..." autoComplete="off" type="text" id="title" onChange={(event) => {setTitle(event.target.value)}} />
        </form>
        <p className="seperator">Video tags</p>
        <div style={{gap: `.25rem`, display: "flex"}}>
          <input type="text" id="title" placeholder="tag..." autoComplete="off=" onChange={(event) => setTagInput(event.target.value)} />
          {tagInput && <button onClick={() => {if (tagInput) {handleTagAdd()}}}>Add</button> }
        </div>
        <div className="tag_container">
          {tags.map(tag => <span key={tag.id} className="tag" onClick={() => {handleRemoveTag(tag)}} >{tag}  </span>)}
        </div>

        <br />
        <p className="seperator">Publishing Settings</p>
        
        {!published && <>
          <button disabled={!canPublish()} onClick={handlePublish} className={"publish"}>Publish</button>

          {/* <button className="visability" ><img src="/icons/thick/circle.svg"></img>Public</button> */}
          
          </>}
        {published && <Link style={{color: `aquamarine`}} href={link}>{link}</Link>}
        {/* {id && link && <VideoPlayer onEnded={() => {}} id={id} />} */}
      </div>
    </div>
    </BaseLayout>


      <style jsx>{`

.visability {
  display: flex;
  align-items: center;
  justify-content: center;
          gap: 1rem;
        }

        .tag_container {
          display: grid;
          grid-template-columns: repeat(auto-fill, 140px);
          gap: .5rem;

        }
        .tag {
          text-align: center;
          border-radius: 1rem;
          background: var(--gray-300);
          padding: 5px 10px;
          font-size: 16px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-weight: 500;
          border: 2px solid transparent;
          transition: scale 100ms cubic-bezier(0,1.5,1,1.5);
          animation: show 100ms cubic-bezier(0,1.5,1,1.5)
        }
        .tag:hover {
          scale: 0.95;
          border: 2px solid var(--gray-400);
        }
        .tag:focus {
          sclale: 2;
        }
        .seperator {
          color: #777;
        }

        .upload {
          transition: all 0.1s;
          background: var(--gray-200);
          color: white;
          border: 1px solid var(--gray-500);
        }
        .upload:disabled {
          background: var(--gray-400);
          scale: 1.5;
        }
        .upload:hover:not(.upload:disabled) {
          background: #5448C8;
          border: 1px solid transparent;
        }
        .publish {
          border: none;
          border-radius: 10px;
          padding: 10px 50px;
          font-size: 16px;
          font-weight: 700;
          max-width: 200px;
          cursor: pointer;
          background: #5448C8;
          transition: all 100ms cubic-bezier(0,1,1,1);
          color: white;
        }
        .publish:disabled {
          background: transparent;
          scale: 2;
          color: var(--gray-500);
          font-weight: 100;
          opacity: 0.2
        }
        .main {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          background: black;
          padding: 1rem;
          min-width: 50%;
          height: 100vh;
          width: 100%;
          
        }
        input {
          width: auto;
        }
        .form  {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .preview {
          width: 200px
        }

        @keyframes show {
          0% {
            opacity: 0;
            scale: 0;
          }
          100% {
            opacity: 1;
            scale: 1;
          }
        }

      `}</style>

      </>
  );

  async function handleTagAdd () {

    console.log('attempting to add tag')

    if (tags.includes(tagInput)) { return; }

    console.log("tag is not added yet.")

    const max_tags = 5;
    if (tags.length > max_tags) { return; }

    const { data, error } = await supabase.from("video_tags")
    .select("text_id")
    .eq("text_id", tagInput.toLowerCase())

    console.log({data, error})
    
  
    if (error) { return; }

    if (!data) { return; }
    if (data.length == 0) { return; }
    
    setTags([...tags, tagInput.toLowerCase()])
  }
  async function handleRemoveTag (tag) {
    const filteredArray = tags.filter(str => str !== tag);
    console.log({filteredArray})
    setTags(filteredArray);
  }
}

export default VideoUpload;
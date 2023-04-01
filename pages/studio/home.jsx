import { getServerSession } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { getUserVideos } from "../../lib/catalog";
import styles from "../../styles/Videos.module.css"
import Image from "next/image";
import { shortTxt } from "../../lib/TextLib";
import { getTimeAgo } from "../../lib/TextLib";
import BaseLayout from "../../layouts/BaseLayout";
import VideoLink from "../../components/VideoLink";
import ToggleSlider from "../../components/ToggleSlider";
import { useState } from "react";
import supabase from "../../lib/Supabase";
import { useRouter } from 'next/router'
import Checkbox from "../../components/Checkbox";

export default function StudioPage ({videos}) {

    const [selected, setSelected] = useState([])
    const router = useRouter()

    const session = useSession({
        required: true,
    })

    return (
        <>
          <BaseLayout>
            <div className={"main"}>
              <div className="leftPad space">
                <h1>Studio</h1>
                <p>Manage all of your uploaded videos here.</p>
              </div>


              <div style={selected.length > 0 ?{height: `60px`} : {height: `0px`, opacity: `0`, pointerEvents: `none`, paddingBlock: `0px`}} className="quickactions seperators">
                
                <div>
                  <p>Selected: {selected.length}</p>
                </div>
                <div>
                  <select name="cars" id="cars" defaultValue={-1} onChange={(event) => {handleChangeVisibility(event)}}>
                    <option value={-1}></option>
                    <option value={0}>Hidden</option>
                    <option value={1}>Anonymous</option>
                    <option value={2}>Public</option>
                  </select>
                  </div>
                </div>
            <div className="table">
              <div className="videos">

                <div className="row">
                  <Checkbox defaultValue={false} onChange={(isChecked) => {handleSelectAll(isChecked)}} />
  
                </div>

                {videos.data.map((v) => {
                  return (
                    <div className="video row noAlign">
                      <Checkbox checked={selected.includes(v.id)} onChange={(event) => {handleSelect(event, v.id)}}/>
                      <Image className="thumbnail" src={`/api/thumbnail?id=${v.id}`} width={160/1.25} height={90/1.25}/>
                      <div>
                        <p className="title">
                          {v.title ? v.title : "..."}
                        </p>
                        <p>
                          {getTimeAgo(v.created_at)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="info">

                <div className="row">
                  Visibility
                </div>

                {videos.data.map((v) => {
                  return (
                    <div className="row">
                      {getVisibility(v.visibility)}
                    </div>
                  )
                })}
              </div>
            </div>



            </div>
          </BaseLayout>

          <style jsx>{`
                
                .space {
                    margin-block: 1rem;
                }
                .leftPad {
                    padding-left: 2rem;
                }

                .seperators > div {
                border-right: 1px solid var(--gray-300);
                padding-right: 1rem;
                display: flex;
                gap: .5rem;
                padding: 1rem;
                align-items: center
              }
              .quickactions {
                overflow: hidden;
                background: var(--gray-200);
                transition: all 1s ease-out;;
                display: flex;
                gap: 1rem;
                overflow: hidden;
              }
              .quickactions :nth-child(1) {
                width: 401px;
              }
              .quickactions :nth-child(2) {
                width: 201px;
                display: flex;
                flex-direction: row;
                align-items: center
              }
              
              .col {
                border-right: 1px solid var(--gray-300);
              }
              .table {
                display: flex;
                flex-direction: row;
                border-top: 1px solid var(--gray-300)
              }
              .video, .info {
                height: 100px;
              }
              .videos {
                display: flex;
                flex-direction: column;
                border-right: 1px solid var(--gray-300)
              }
              .info {
                display: flex;
                flex-direction: column;
              }
              .info .row:first-child {
                min-height: 40px;
              }
              .info .row {
                display: flex;
                gap: 10px;
                border-bottom: 1px solid var(--gray-300);
                padding-block: 1rem !important;
                padding-inline: 2rem !important;
                width: 400px;
                min-height: 100px;
              }
              .info
              .row {
                padding-inline: 2rem !important;
              }
              .video .title {
                font-weight: 500;
                color: white;
                width: auto;
              }
              .video .title:hover {
                text-decoration: underline;
              }
              .video p {
                color: var(--gray-600);
              }
              .video {
                display: flex;
                gap: 10px;
                border-bottom: 1px solid var(--gray-300);
                padding-block: 1rem !important;
                padding-inline: 2rem !important;
                width: 400px;
              }
              
              .main {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                background: var(--gray-100);
                overflow: scroll;
                padding-block: 2rem;
              }
              .row {
                display: flex;
                flex-direction: row;
                gap: .5rem;
                padding: .5rem;
                min-height: 40px;
                min-width: 100%;
                border-bottom: 1px solid var(--gray-300);
                padding-inline: 2rem !important;
              }
              .noAlign {
                align-items: flex-start;
              }

            `}</style>
        </>
      );
              
              function handleSelect(event, video) {

                const isChecked = event.target.checked;
                console.log(isChecked)
                const id = video;

                if (isChecked) {
                  setSelected([...selected, id])
                } else {
                  const temp = [...selected];

                  // removing the element using splice
                  temp.splice(temp.indexOf(id), 1);

                  // updating the list
                  setSelected(temp)
                }

              }
              function handleSelectAll (event) {

                const isChecked = event.target.checked;

                if (isChecked) {
                  const idList = videos.data.map((v) => v.id)
                  console.log(idList[0])
                  setSelected(idList)
                } else {
                  setSelected([])
                }

                console.log(selected)
              }
              async function handleChangeVisibility (event) {

                const value = event.target.value;

                const update = await supabase.from("videos")
                .update({visibility: value})
                .in("id", selected)
                .select()

                console.log({update})

                router.reload()


              }

              function getVisibility (vis) {
                          
                switch (vis) {
                  default: return <p>Hidden</p>
                  case 1: return <p style={{color: `#5448C8`}}>Anonymous</p>
                  case 2: return <p style={{color: 'cyan'}}>Public</p>
                }

              }

    }

export async function getServerSideProps (ctx) {
    const session = await getSession(ctx)
    if (!session) return { props: {} }
    const videos = await getUserVideos (session, 150);

    return {
        props: {
            videos: videos,
        }
    }

}
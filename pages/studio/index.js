import { getServerSession } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { getUserVideos } from "./../../lib/catalog";
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
            <h1>Studio</h1>
            <p>Manage all of your uploaded videos here.</p>
            <br />
            
            

              <div style={selected.length > 0 ?{height: `60px`} : {height: `0px`, opacity: `0`, pointerEvents: `none`, paddingBlock: `0px`}} className="row quickactions">
                <label>Visibility:</label>
                <select name="cars" id="cars" defaultValue={-1} onChange={(event) => {handleChangeVisibility(event)}}>
                  <option value={-1}></option>
                  <option value={0}>Hidden</option>
                  <option value={1}>Anonymous</option>
                  <option value={2}>Public</option>
                </select>
              </div>

            
            <div className="videos">
            <div className="row">
              <Checkbox defaultValue={false} onChange={(isChecked) => {handleSelectAll(isChecked)}} />
            </div>
              {videos && videos.data.map(vid => {
                return (
                  <div className="video" key={vid.id} id={vid.id}>
                            {/* {selected.includes(vid.id).valueOf()}  */}
                          <div>
                            {selected && console.log(selected.includes(vid.id) + ' ' + vid.id)}
                            <Checkbox checked={selected.includes(vid.id)} onChange={(event) => {handleSelect(event, vid.id)}} />
                          </div>
                        <div className="vid_info">
                          <div style={{cursor: `pointer`}} onClick={() => {router.push(`/studio/${vid.id}`)}}>
                            <Image alt={"Thumbnail"} src={`/api/thumbnail?id=${vid.id}`} width={160/1.2} height={90/1.2} />
                          </div>
                          <div style={{minWidth: `200px`}}>
                            <p className={styles.video_title}>{shortTxt(vid.title, 40)} </p>
                            <p className={styles.time}>{getTimeAgo(vid.created_at)}     </p>
                            {/* <button>Edit</button> */}
                          </div>
                          <div>
                            {getVisibility(vid.visibility)}
                          </div>
                        </div>
                  </div>
                )
              })}
              </div>

            </div>
          </BaseLayout>

          <style jsx>{`
              .quickactions {
                overflow: hidden;
                background: var(--gray-200);
                width: 100%;
                transition: all 1s ease-out;
                height: 0px;
                padding: 1rem;
              }
              .vid_info {
                display: flex;
                gap: 1rem;
                width: 100%;
                overflow-x: scroll;
                padding-bottom: 10px;
              }
              .main {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                background: var(--gray-100);
                padding: 1rem;
              }
              .row {
                display: flex;
                flex-direction: row;
                gap: .5rem;
                padding: .5rem;
              }
              .videos {
                display: flex;
                flex-direction: column;
                background: var(--gray-100);
              }
              .video {
                display: flex;
                flex-direction: row;
                gap: .5rem;
                padding: .5rem;
                border-bottom: 1px solid var(--gray-300)
                
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
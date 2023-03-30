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

export default function StudioPage ({videos}) {

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
            

            {videos && videos.data.map(vid => {
              return (
                <VideoLink key={vid.id} id={vid.id} link={"/studio/" + vid.id}>
                          
                          <p className={styles.video_title}>{shortTxt(vid.title, 40)} </p>
                          <p className={styles.time}>{getTimeAgo(vid.created_at)}     </p>
                          {/* <button>Edit</button> */}
                          {getVisibility(vid.visibility)}
                          
                        
                        </VideoLink>
              )
            })}
            </div>
          </BaseLayout>

          <style jsx>{`
              .main {
                width: 100%;
                height: 100%;
                padding-left: 1rem;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
              }
            `}</style>
        </>
      );

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
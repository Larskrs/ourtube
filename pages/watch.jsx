import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import VideoPlayer from "../components/VideoPlayer";
import supabase from "../lib/Supabase";
import { getRandomVideo, getRandomVideos, getVideoPaths } from "../lib/catalog"
import Image from "next/image";
import styles from "../styles/Videos.module.css"
import Head from "next/head";
import { useEffect, useState } from "react";
import { shortTxt, getTimeAgo } from "../lib/TextLib";
import BaseLayout from "../layouts/BaseLayout";
import VideoLink from "../components/VideoLink";

function VideoPage({ nextVideo, data, catalog, tags }) {

  const router = useRouter();

  const id= router.query.v;
  

  useEffect(() => {

    navigator.mediaSession.setActionHandler("nexttrack", (details) => {
      if (nextVideo) {
        router.push("/videos/" + nextVideo.id)
      }
    }
    )  
  }, [])
  console.log({ id });


  return <>


  <Head>
    <title>{data.title}</title>
    <meta name="twitter:title" content={data.title}/>
    <meta name="twitter:description" content={"Video posted on " + "clumsyturtle"}/>
    <meta name="twitter:image" content={`/api/thumbnail?id=${data.id}`}/>
    <meta name="twitter:card" content={`/api/thumbnail?id=${data.id}`}/>
    <meta name="theme-color" content="#5448C8"></meta>
    <meta name="twitter:player:width" content="320" />
    <meta name="twitter:player:height" content="180" />
    <meta name="twitter:player:stream" content={`/api/videos?id=${data.id}`} />
    <meta name="twitter:player:stream:content_type" content="video/mp4" />

  </Head>
  <BaseLayout>
    <div className={styles.container}>

        <main className={styles.main}>
                 <div className={styles.video}>
                  <VideoPlayer
                    key={id}
                    title={data.title}
                    id={id}
                    qualities={data.quality ? (data.quality) : []}
                    onEnded={() => {
                      if (nextVideo) {
                         router.push("/watch?v=" + nextVideo.id)
                      }
                    }}
                  />

                  <div className={styles.info}>
                  <h2 style={{textAlign: `left`}}>{shortTxt(data.title, 75)}</h2>
                  {tags && <div style={{gap: `.25rem`, display: `flex`}}>{tags.data.map((tag) => {
                    return (<Link href={"/tags/" + tag.text_id} key={tag.id} className={styles.tag}>{tag.name}</Link>)
                  })}</div>
                }
                </div>

                  </div>
                  <div className={styles.recommended}>

                  {catalog.data.map((vid) => {
                    return (
                      <VideoLink key={vid.id} id={vid.id} link={"/watch?v=" + vid.id}>
                          
                          <p className={styles.video_title}>{shortTxt(vid.title, 40)}</p>
                          <p className={styles.time}>{getTimeAgo(vid.created_at)}</p>
                          {/* <p>{vid.users_public.username}</p> */}
                        
                        </VideoLink>
                    )
                  })}
                  </div>
          </main>
    </div>
    </BaseLayout>
  </>
}


export const getServerSideProps = async (context) => {
  
  
  const id = context.query.v;
  const random = await (await getRandomVideo(id ? [id] : [])).data
  const data = (await supabase.from("videos").select("*").eq("id", id).single()).data
  
  const catalog = await getRandomVideos(25)
  
  if (!data) {
    return {
      redirect: {
        destination: "/watch?v=" + random.id,
        permanent: false
      }
    }
  }

  let tags = null;
  if (data.tags) {
    tags = await supabase.from('video_tags').select("*").in("text_id", data.tags)
    
  }
  return {
    props: {
        nextVideo: random,
        data,
        catalog,
        tags,
      },
  };
};

export default VideoPage;
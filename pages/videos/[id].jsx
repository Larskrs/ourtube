import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import VideoPlayer from "../../components/VideoPlayer";
import supabase from "../../lib/Supabase";
import { getRandomVideo, getRandomVideos } from "../../lib/catalog"
import Image from "next/image";
import styles from "../../styles/Videos.module.css"
import Head from "next/head";
import { useEffect } from "react";
import { shortTxt, getTimeAgo } from "../../lib/TextLib";

function VideoPage({ nextVideo, data, catalog, tags }) {
  const router = useRouter();

  const { id } = router.query;
  

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

  <div className={styles.container}>
        <nav className={styles.nav}>
                <Link href={"/"} >Home</Link>
                 {nextVideo && <Link href={"/videos/" + nextVideo.id} >Next Video</Link> }
        </nav>

        <main className={styles.main}>
                 <div className={styles.video}>
                  <VideoPlayer
                   title={data.title}
                   id={id}
                   onEnded={() => {
                    console.log(data.title);
                    if (nextVideo) {
                      router.push("/videos/" + nextVideo.id)
                    }
                  }}/>

                  <div className={styles.info}>
                  <h2 style={{textAlign: `left`}}>{shortTxt(data.title, 75)}</h2>
                  {tags && <div style={{gap: `.25rem`, display: `flex`}}>{tags.data.map((tag) => {
                    return (<Link key={tag.id} className={styles.tag} href={"/tags/" + tag.text_id}>{tag.name}</Link>)
                  })}</div>
                  }
                </div>

                  </div>
                  <div className={styles.recommended}>

                  {catalog.data.map((vid) => {
                    return (
                      <Link className={styles.videoComp} key={vid.id} href={"/videos/" + vid.id}>
                        <Image src={"/api/thumbnail?id=" + vid.id} alt={"Thumbnail"} width={240} height={135}/>
                        <div className={styles.info}>

                          <p className={styles.video_title}>{shortTxt(vid.title, 40)}</p>
                          <p className={styles.time}>{getTimeAgo(vid.created_at)}</p>
                          <p>Larskrs</p>
                        
                        </div>
                      </Link>
                    )
                  })}
                  </div>
          </main>
    </div>
  </>
}


export const getServerSideProps = async (context) => {

  
  const id = context.query.id;
  const random = await (await getRandomVideo([id])).data
  const data = (await supabase.from("videos").select("*").eq("id", id).single()).data
  
  const catalog = await getRandomVideos(25)
  
  if (!data) {
    return {
      redirect: {
        destination: "/videos/" + random.id,
        permanent: false
      }
    }
  }

  let tags = null;
  if (data.tags) {
    tags = await supabase.from('video_tags').select("*").in("text_id", data.tags)
    console.log({tags: tags.data})
    
  }
  return {
    props: {
        query: context.query,
        nextVideo: random,
        data,
        catalog,
        tags,
      },
  };
};

export default VideoPage;
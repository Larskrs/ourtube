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
import { shortTxt } from "../../lib/TextLib";

function VideoPage({ nextVideo, data, catalog }) {
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
                  <h2 style={{textAlign: `left`}}>{shortTxt(data.title, 75)}</h2>


                  </div>
                  <div className={styles.recommended}>

                  {catalog.data.map((vid) => {
                    return (
                      <Link className={styles.videoComp} key={vid.id} href={"/videos/" + vid.id}>
                        <Image src={"/api/thumbnail?id=" + vid.id} alt={"Thumbnail"} width={240} height={135}/>
                        <p>{shortTxt(vid.title, 60)}</p>
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

  return {
    props: {
        query: context.query,
        nextVideo: random,
        data,
        catalog,

      },
  };
};

export default VideoPage;
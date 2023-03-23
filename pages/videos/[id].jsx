import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import VideoPlayer from "../../components/VideoPlayer";
import supabase from "../../lib/Supabase";
import { getRandomVideo, getRandomVideos } from "../../lib/catalog"
import Image from "next/image";
import styles from "../../styles/Videos.module.css"
import Head from "next/head";

function VideoPage({ nextVideo, data, catalog }) {
  const router = useRouter();

  const { id } = router.query;
  


  
  console.log({ id });


  return <>

  
  <nav className={styles.nav}>
          <Link href={"/"} >Home</Link>
           {nextVideo && <Link href={"/videos/" + nextVideo.id} >Next Video</Link> }
  </nav>

  <main className={styles.main}>


    <div className={styles.video}>
            <VideoPlayer id={id} onEnded={() => {
              console.log(data.title);
              if (nextVideo) {
                router.push("/videos/" + nextVideo.id)
              }
            }}/>
            <h2 style={{textAlign: `left`}}>{data.title}</h2>


            </div>
            <div className={styles.recommended}>
              
            {catalog.data.map((vid) => {
              return (
                <Link className={styles.videoComp} key={vid.id} href={"/videos/" + vid.id}>
                  <Image src={"/api/thumbnail?id=" + vid.id} alt={"Thumbnail"} width={240} height={135}/>
                  <p>{vid.title}</p>
                </Link>
              )
            })}
            </div>
    </main>
  </>
}
export const getServerSideProps = async (context) => {

  
  const id = context.query.id;
  const random = await (await getRandomVideo([])).data
  const data = (await supabase.from("videos").select("*").eq("id", id).single()).data

    const catalog = await getRandomVideos(25)

    console.log({ data, random})

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
        catalog
      },
  };
};

export default VideoPage;
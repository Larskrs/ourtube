import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import VideoPlayer from "../../components/VideoPlayer";
import supabase from "../../lib/Supabase";
import { getRandomVideo, getRandomVideos } from "../../lib/catalog"
import Image from "next/image";


function VideoPage({ nextVideo, data, catalog }) {
  const router = useRouter();

  const { id } = router.query;
  


  
  console.log({ id });


  return <>
  <Link href={"/"} > | Home | </Link>
           {nextVideo && <Link href={"/videos/" + nextVideo.id} >Next Video</Link> }
            <h2>{data.title}</h2>
            <VideoPlayer id={id} onEnded={() => {
              console.log(data.title);
              if (nextVideo) {
                router.push("/videos/" + nextVideo.id)
              }
            }}/>

            {catalog.data.map((vid) => {
              return (
                <Link key={vid.id} href={"/videos/" + vid.id}>
                  <Image src={"/api/thumbnail?id=" + vid.id} alt={"Thumbnail"} width={240} height={135}/>
                  <p>{vid.title}</p>
                </Link>
              )
            })}

            <style jsx>{`
              
            `}</style>
  </>
}
export const getServerSideProps = async (context) => {

  
  const id = context.query.id;
    const random = await (await getRandomVideo([])).data
    const data = (await supabase.from("videos").select("*").eq("id", id).single()).data

    const catalog = await getRandomVideos(25)

    console.log({ data, random})

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
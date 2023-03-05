import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import VideoPlayer from "../../components/VideoPlayer";
import supabase from "../../lib/Supabase";

function VideoPage({ nextVideo, data }) {
  const router = useRouter();

  const { id } = router.query;


  
  console.log({ id });


  return <>
  <Link href={"/"} > | Home | </Link>
           {nextVideo && <Link href={"/videos/" + nextVideo} >Next Video</Link> }
            <h2>{data.title}</h2>
            <VideoPlayer id={id} onEnded={() => {
              console.log(data.title);
              router.push("/videos/" + nextVideo)
            }}/>;


            <style jsx>{`
              
            `}</style>
  </>
}
export const getServerSideProps = async (context) => {

  
  const id = context.query.id;
  const random = await (await fetch("http://localhost/api/catalog?exclude=" + id)).json();
    const data = (await supabase.from("videos").select("*").eq("id", id).single()).data

    console.log({ data})

  return {
    props: {
        query: context.query,
        nextVideo: random.id,
        data,
      },
  };
};

export default VideoPage;
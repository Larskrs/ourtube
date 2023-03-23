import { getRandomVideo } from "../../lib/catalog";


export async function getServerSideProps (ctx) {
    
    const random = await getRandomVideo([])
    console.log({error: random.error})

    return {
        redirect: {
            permanent: false,
            destination: "/videos/" + random.data.id,
          },
    }

}


export default function Home () {
    return (
        <div>
            
        </div>
    );
}
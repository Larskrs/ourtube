import { getRandomVideo } from "../../lib/catalog";


export async function getServerSideProps (ctx) {
    
    const random = await getRandomVideo([])

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

import Link from "next/link";
import Image from "next/image";

export default function VideoLink ({ children, id, link}) {


    return (
        <>
            <Link className={"main"} key={id} href={link}>
                        <Image className="thumb" src={"/api/thumbnail?id=" + id} alt={"Thumbnail"} width={240} height={135}/>
                        <div className={"info"}>

                          { children }
                        
                        </div>
                      </Link>

                  <style jsx global>{`

                      .main {
                        display: flex;
                        flex-direction: row;
                        width: 100%;
                        max-height: auto;

                        align-items: flex-start;
                        padding: .25rem;
                        gap: 1rem;
                      }
                      .info {
                        display: flex;
                        flex-direction: column;
                        gap: 1px;
                        height: 100%;
                        width: auto;
                        justify-content: space-between;
                      }
                      .info p {
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                      }
                      .info button {
                        width: 75px;
                        border: 1px solid white;
                        background: transparent;
                      }
                      .thumb {
                        border-radius: 10px;
                        width: 150px;
                        height: auto;
                        aspect-ratio: 16/9;
                        object-fit: cover;
                        background-color: var(--gray-300);
                        text-align: center;
                        display: grid;
                        align-items: center;
                        justify-content: center;
                      }


                    `}</style>    
        </>
    );
}
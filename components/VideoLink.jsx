
import Link from "next/link";
import Image from "next/image";


export default function VideoLink ({ children, id, link}) {



    return (
        <>
            <div className={"container"} key={id}>
                      <Link href={link + ""}>
                        <Image className="thumb" src={"/api/thumbnail?id=" + id} alt={"Thumbnail"} width={160} height={90}/>
                      </Link>
                        <div className={"info"}>
                          { children }
                        
                        </div>
                  </div>
                  <style jsx>{`
                    .container {
                      display: flex;
                      flex-direction: row;
                      width: 100%;
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
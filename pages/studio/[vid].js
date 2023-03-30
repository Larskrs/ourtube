import BaseLayout from "../../layouts/BaseLayout";
import { getSpecificVideo } from "../../lib/catalog";
import Image from "next/image";
import VideoPlayer from "../../components/VideoPlayer"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import supabase from "../../lib/Supabase";
import { useRouter } from "next/router";
import Link from "next/link"

export default function StudioPage ({data}) {


    const router = useRouter()

    const [modal, setModal] = useState("")
    const [visibility, setVisibility] = useState(data.visibility)

    const session = useSession({
        required: true
    })
    if (session.data?.user.id == data.user_id) {
        console.log("We own this")
    }


    const visibilities = [
        {id: 0, name: "Private"},
        {id: 1, name: "Anonymous"},
        {id: 2, name: "Public"},
        
    ]


    return (
        <>
            <BaseLayout>
                {modal != "" && <div className="modal_container" onClick={() => {setModal("")}} id="model">
                    <div className="modal">
                        {readModal()}
                    </div>

                </div> }
                {/* {data && <h1>{data.title}</h1> } */}
                <main className="main">
                    <VideoPlayer  style={{maxWidth: "500px"}} id={data.id} title={data.title} qualities={data.quality ? data.quality : []} onEnded={() => {}} />
                    <Link href={`/watch?id=${data.id}`} >Watch here</Link>
                    <div className="form">

                        <p>Select visibility</p>
                        <div className="row">
                            {visibilities.map((v) => {
                                return (
                                    <button  key={v.id} onClick={() => {setVisibility(v.id)}} style={visibility == v.id ? {outline: `2px solid #5448C8`} : (data.visibility == v.id ? { outline: `2px solid var(--gray-600)`} : {})} >{v.name}</button>
                                )
                            })}
                    </div>
                    </div>
                    <div className="form">

                        <p>Deletion:</p>
                        <button onClick={() => { setModal("delete_confirm");  }} className="delete">Delete</button>

                    </div>

                    <div className="form">
                        <p>Save Changes</p>
                        <button disabled={!isChanged()} onClick={() => {handleSaveChanges()}} className="save">Save</button>
                    </div>
                </main>
            </BaseLayout>

            <style jsx>{`
                .modal_container {
                    position: fixed;
                    width: 100vw;
                    padding: 1rem;
                    height: 100vh;
                    z-index: 100;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(5px);
                    z-index: 999;
                    
                }
                .modal {
                    max-width: 300px;
                    max-height: 500px;
                    background: var(--gray-200);
                    border-radius: 20px;
                    padding: 1rem;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    pointer-events: all;
                    border: 1px solid var(--gray-200);
                    animation: show 300ms cubic-bezier(0,1.5,1,1.5);
                }
                @keyframes show {
                    0% {
                        scale: 0;
                        opacity: 0;
                    }
                }
                
                .delete {
                    outline: 1px solid red;
                    color: white;
                    width: 100px;
                    transition: all 100ms cubic-bezier(0,1.5,1,1.5);
                    rotate: 0deg;
                }
                .delete:hover {
                    outline: 2px solid red;
                    color: red;
                }
                .save {
                    background: #5448C8;
                    max-width: 200px;
                    outline: 2px solid #5448C8;
                    scale: 1;
                    transition: all 100ms cubic-bezier(0,1,1,1);
                    font-weight: 700;
                    font-size: 18px;
                }
                .save:disabled {
                    background: transparent;
                    max-width: 200px;
                    outline: none;
                    scale: 3;
                    color: transparent;
                    cursor: default;
                    opacity: 0;
                }
                .save:disabled:after {
                    content: 
                }
                .row {
                    display: flex;
                    gap: .5rem;
                }
                .form {
                    background: var(--gray-100);
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .main {
                    display: flex;
                    gap: 1rem;
                    flex-direction: column;
                    min-width: 100%;
                    min-height: 100%;
                    width: 100%;
                    height: 100%;
                    padding: 1rem;
                }

            `}</style>

        </>
    );

    function isChanged() {

        if (visibility == data.visibility) { return; }

        return true;

    }

    function readModal () {
        switch (modal) {
            case "delete_confirm": {
                return deletionModal()
            }
            default: {

            }
        }
    }

    function deletionModal () {

        return (
            <>
                <p>Are you sure you want to delete this video?</p>
                <button className="delete" onClick={async () => await handleDelete()}>Yes</button>

                <style jsx>{`
                .delete {
                    outline: 1px solid red;
                    color: white;
                    width: 100px;
                    transition: all 100ms cubic-bezier(0,1.5,1,1.5);
                    rotate: 0deg;
                }
                .delete:hover {
                    outline: 2px solid red;
                    color: red;
                    scale: 1.1;
                    rotate: 2deg;
                }
                `}</style>
            </>

        )

    }

    async function handleSaveChanges() {


        if (visibility != data.visibility) {
            await supabase.from("videos")
            .update({visibility: visibility})
            .eq("id", data.id)
        }


        
        router.reload()
    }
    async function handleDelete () {
        console.log("deleting")

        const result = await supabase
        .from("videos")
        .delete({count: 1})
        .eq("id", data.id)
        .select("*")

        console.log({result})

        router.push("/studio/")


    }
}

export async function getServerSideProps (ctx) {

    const { vid } = ctx.query
    const {data, error} = await getSpecificVideo(vid)

    if (error) { return { props: {}}}

    return {
        props: {
            data,
        }
    }
}
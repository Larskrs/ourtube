import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import LoginButton from "../components/LoginButton"
import Image from "next/image";

export default function BaseLayout ({children}) {

    const [sidebar, setSidebar] = useState()
    const session = useSession()

    return (
        <>
        <div className="container">
            <div  className={sidebar ? "sidebar shown" : "sidebar"} >
                <div className="row">
                    {HamburgerMenu(false)}
                    <Link href={"/"}>Clumsyturtle</Link>
                </div>
                <br />
                <p>Navigation:</p>
                <Link href="/" legacyBehavior ><a  className={"link"}> Home </a></Link>
                <Link href="/watch/" legacyBehavior ><a  className={"link"}> Watch </a></Link>
                <Link href="/upload/" legacyBehavior ><a  className={"link"}> Upload </a></Link>
                {session.status == "authenticated" && <Link href="/studio/" legacyBehavior ><a  className={"link"}> Studio </a></Link>}
                <br />
                <p>User:</p>
                <LoginButton />
            </div> 
            <nav>
                <div className="row">
                    {HamburgerMenu(false)}
                    <p>Clumsyturtle</p>
                </div>
                <Link href={"/"} className={"link"} >Home</Link>
            </nav>

            <main> 
                <div onClick={() => setSidebar(false)} className="content">
                    { children }
                </div>
                 </main>
        </div>

        <style jsx>{`
            .avatar {
                border: none;
                border-radius: 50%;
            }
            .link {
                background: var(--gray-200);
                padding: .5rem 1rem;
                border-radius: 5px;
            }
            .container {
                display: flex;
                flex-direction: column;
                background-color: var(--gray-000);
            }
            .container main {
                margin-top: 70px;
                display: flex;
                width: 100%;
                min-height: 100vh;
                flex-direction: row;   
            }
            .container nav {
                display: flex;
                position: fixed;
                gap: 1rem;
                padding: 1rem;
                align-items: center;
                font-size: 20px;
                height: 70px;
                background: black;
                width: 100%;
                border-bottom: var(--gray-300) 1px solid;
                z-index: 100;
            }
            .row {
                display: flex;
                align-items: center;
                font-size: 20px;
                gap: 1rem;
            }
            .sidebar .row {
                height: 70px;
            }
            
            .sidebar {
                padding-inline: 1rem;
                display: flex;
                flex-direction: column;
                pointer-events: none;
                position: fixed;
                left: 0px;
                top: 0px;
                width: 250px;
                height: 100vh;
                background: var(--gray-100);
                overflow-y: scroll;
                animation: slideOut 500ms cubic-bezier(0,1,1,1) forwards;
                z-index: 999;
                gap: .5rem;
                box-shadow: 5px 0px 10px var(--gray-100)
            }
            .shown {
                animation: slide 250ms cubic-bezier(0,1,1,1);
                pointer-events: all;
            }
            .content {
                width: 100%;
            }
            @keyframes slide {
                0% {
                    opacity: 0;
                    translate: -200px;
                }
                100% {
                    translate: 0px;
                }
            }
            @keyframes slideOut {
                100% {
                    opacity: 0;
                    translate: -200px;
                }
                0% {
                    translate: 0px;
                }
            }
        `}</style>

        </>
    );

    function HamburgerMenu(state) {


        return (
            <>
            <button style={{}} className={session.status === "authenticated" ? "avatar" : "button"} type="button" disabled={state} onClick={() => setSidebar(!sidebar)}>
                {session.status === "authenticated" &&
                    <Image src={session.data.user.image} alt={"user avatar"} width={35} height={35} />
                }
                {session.status !== "authenticated" &&
                    <div className="hamburger">
                        <span className="hamb" />
                        <span className="hamb" />
                        <span className="hamb" />
                    </div>
                }
            </button>

            <style jsx>{`
                .avatar {
                    border-radius: 50%;
                    overflow: hidden;
                    padding: 0;
                    height: 35px;
                    width: 35px;
                }
                .button {
                    padding: 10px;
                    background: var(--gray-200);
                    z-index: 0;
                    overflow: hidden;
                }
                
                .hamburger {
                    position: relative;
                    min-width: 25px;
                    min-height: 15px;
                    padding: 0;
                    z-index: 0;
                    pointer-events: none;
                }
                .hamb {
                    position: absolute;
                    width: 100%;
                    height: 1px;
                    background: white;
                    left: 0px;
                    top: 50%;
                    z-index: 0;
                    transition: all 350ms cubic-bezier(0,1,1,1);
                    pointer-events: none;
                }
                .hamb:nth-child(1) {
                    top: 100%;
                }
                .hamb:nth-child(2) {
                    top: 0%;
                }
                
            `}</style>

            </>
        )

    }
}
import Link from "next/link";
import { useState } from "react";

export default function BaseLayout ({children}) {

    const [sidebar, setSidebar] = useState()

    return (
        <>
        <div className="container">
            <div  className={sidebar ? "sidebar shown" : "sidebar"} >
                <div className="row">
                    {HamburgerMenu(false)}
                    <Link href={"/"}>Clumsyturtle</Link>
                </div>
                <Link href="/" legacyBehavior ><a  className={"link"}> Home </a></Link>
                <Link href="/videos/" legacyBehavior ><a  className={"link"}> Videos </a></Link>
                <Link href="/upload/" legacyBehavior ><a  className={"link"}> Upload </a></Link>
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
                display: flex;
                flex-direction: row;   
            }
            .container nav {
                display: flex;
                gap: 1rem;
                padding: 1rem;
                align-items: center;
                font-size: 20px;
            }
            .row {
                display: flex;
                align-items: center;
                font-size: 20px;
                gap: 1rem;
            }
            
            .sidebar {
                display: flex;
                flex-direction: column;
                padding: 10px;
                position: fixed;
                left: 0px;
                top: 0px;
                width: 200px;
                height: 100vh;
                background: var(--gray-100);
                overflow-y: scroll;
                animation: slideOut 500ms cubic-bezier(0,1,1,1) forwards;
                z-index: 10;
                gap: .5rem;
                box-shadow: 5px 0px 10px var(--gray-100)
            }
            .shown {
                animation: slide 250ms cubic-bezier(0,1,1,1);
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
            <button className="button" type="button" disabled={state} onClick={() => setSidebar(!sidebar)}>
                <div className="hamburger">
                    <span className="hamb" />
                    <span className="hamb" />
                    <span className="hamb" />
                </div>
            </button>

            <style jsx>{`
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
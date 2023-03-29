import { useSession, signIn, signOut } from "next-auth/react"
import Image from "next/image"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        <div className="row">
            <Image className="avatar" src={session.user.image} alt={"name"} width={35} height={35}  />
            {session.user.name} <br />
        </div>
            <button onClick={() => signOut()}>Sign out</button>
 
        <style jsx global>{`

            .avatar {
                border: none;
                border-radius: 50%;
                margin-right: 1rem;
            }
            .row {
                width: fit-content;
                display: flex;
                height: auto;
                flex-direction: row;
                align-items: center;
                justif
                gap: 0.5rem;
            }

        `}</style>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}
import Head from 'next/head'
import '../styles/globals.css'
import { SessionProvider } from "next-auth/react"

export default function MyApp({  Component,  pageProps: { session, ...pageProps },}) {

  
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </Head>
      <SessionProvider session={session}>
          <Component {...pageProps} />
      </SessionProvider>
    </>
  )
}



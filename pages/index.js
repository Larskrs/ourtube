import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import Link from 'next/link'
import { getRandomVideo } from '../lib/catalog'
import BaseLayout from '../layouts/BaseLayout'
import LoginButton from '../components/LoginButton'

export default function Home() {
  return (
    <>
    <BaseLayout>
    <div className={styles.container}>
      <Head>
        <title>OurTube</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Clumsyturtle Videos <span style={{background: `red`, padding: `0px 10px`,fontSize: `20px`, borderRadius: `20px`}}>A026</span></h1>
        <p>We have moved the upload screen to its own page. Click on the link below to go there.</p>
        <div style={{gap: `1rem`, display: `flex`}}>
          <Link href={"/upload"} className={styles.link}>Uploader</Link>
          <Link className={styles.link} href={"/watch"} >Watch</Link>
        </div>
        <LoginButton />
      </main>
    </div>

    </BaseLayout>
    </>
  )
}

export const getServerSideProps = async (context) => {


  

return {
  props: {
      query: context.query,
    },
};
};

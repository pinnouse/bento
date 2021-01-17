import { applySession } from 'next-session'
import Link from 'next/link'
import { options } from '../sessionConfig'

export default function Home({ loggedIn }) {
    return (
        <div className="flex flex-col min-h-screen justify-center items-center max-w-prose mx-auto py-16">
            <div className="flex flex-row items-center justify-center">
                <img className="object-fit w-32 h-32 mr-4" width="48" height="48" src="./Logo.svg" alt="Bento Logo" />
                <h1 className="text-6xl" style={{color: '#5580ff'}}>BENTO</h1>
            </div>
            <h2 className="mt-8 text-lg">The classroom that has it all.</h2>
            <div className="mt-6">
                {loggedIn && <Link href="/build">
                    <a className="inline-block text-lg button primary">
                        Stage
                    </a>
                </Link>}
                {!loggedIn && <Link href="/login">
                    <a className="inline-block text-lg button primary">
                        Login
                    </a>
                </Link>}
                <Link href="mailto:contact@bento-website-placeholder.org">
                    <a className="inline-block button text-lg">
                        Contact
                    </a>
                </Link>
            </div>
        </div>
    )
}

export async function getServerSideProps({ req, res }) {
    await applySession(req, res, options)
    return {
        props: {
            loggedIn: !!req.session.loggedIn
        }
    }
}
import { applySession } from "next-session"
import { useRouter } from "next/router"
import { options } from "../sessionConfig"

export default function Logout() {
    const router = useRouter()

    const logout = async () => {
        await fetch('/api/logout', {
            method: 'POST'
        })
        router.push('/')
    }

    return (
        <div>
            Logging you out... If you aren't logged out click
            <a onClick={logout}>here</a>
        </div>
    )
}

export async function getServerSideProps({ req, res }) {
    await applySession(req, res, options)
    req.session.destroy()
    res.statusCode = 302
    res.setHeader('Location', '/')
    return { props: {} }
}

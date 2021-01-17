import { Router, useRouter } from 'next/router'
import { applySession } from "next-session";
import { options } from "../sessionConfig";
import { useEffect, useRef, useState } from 'react'

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

export default function Login({user, loggedIn}) {
    const router = useRouter()

    const autofocusElement = useRef(null)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState([])

    useEffect(() => {
        if (autofocusElement.current) {
            autofocusElement.current.focus()
        }
    }, [])

    const logout = async () => {
        await fetch('/api/logout', { method: 'POST' })
        router.reload()
    }

    const validate = () => {
        const errMsg = []
        if (username.length <= 0) {
            errMsg.push('Username must be longer than 0 characters')
        }
        if (password.length < 4) {
            errMsg.push('Password must be at least 4 characters')
        }
        if (arraysEqual(errMsg, errorMessage)) return errMsg.length === 0
        setErrorMessage(errMsg)
        return errMsg.length === 0
    }

    const login = async () => {
        if (!validate()) return
        const response = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({
                username, password,
            })
        })
        if (response.status === 200) {
            router.push('/build')
        } else {
            setErrorMessage([await response.text()])
        }
    }

    const signup = async () => {
        if (!validate()) return
        const response = await fetch('/api/signUp', {
            method: 'POST',
            body: JSON.stringify({
                username, password,
            })
        })
        if (response.status === 200) {
            router.push('/build')
        } else {
            setErrorMessage([await response.text()])
        }
    }

    const formClasses = "flex flex-col min-h-screen max-w-prose flex-1 items-stretch text-left mx-auto py-16"

    if (loggedIn) {
        return (
            <div className={formClasses}>
                <span>You are already logged in as {user}, you can <button onClick={logout}>log out</button></span>
            </div>
        )
    }
    return (
        <div className={formClasses}>
            <h1 className="text-4xl flex flex-row items-center">
                <img width="32" height="32" className="inline-block object-fit w-12 h-12 mr-3" src="/Lock.svg" />
                Log In To Bento
            </h1>
            <form className="flex flex-col" onSubmit={e => {e.preventDefault()}}>
                <label className="text-lg mt-6" htmlFor="username">Username</label>
                <input
                    className={`
                    border-4 border-indigo-100 mt-2 p-4 rounded-md bg-opacity-25 transition duration-300
                    focus:border-indigo-400 focus:bg-transparent
                    ${username.length === 0 ? 'bg-gray-200' : 'bg-transparent'}`}
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Username"
                    autoComplete="off"
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                    ref={autofocusElement} />
                <label className="text-lg mt-6" htmlFor="password">Password</label>
                <input
                    className={`
                    border-4 border-indigo-100 mt-2 p-4 rounded-md bg-opacity-25 transition duration-300
                    focus:border-indigo-400 focus:bg-transparent
                    ${password.length === 0 ? 'bg-gray-200' : 'bg-transparent'}`}
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    placeholder="Password" />
                {errorMessage.map((message, i) => {
                    return (
                        <span key={`error-${i}`} className="mt-2 text-pink-600">
                            {message}
                        </span>
                    )
                })}
                <button
                    className="rounded-md bg-indigo-400 text-white p-4 mt-8 hover:bg-indigo-500 transition duration-300"
                    type="submit"
                    onClick={login}>
                    Login
                </button>
                <button
                    className="bg-white hover:bg-gray-100 p-4 mt-4 transition duration-300"
                    onClick={signup}>
                    Sign Up
                </button>
            </form>
        </div>
    )
}

export async function getServerSideProps({ req, res }) {
    await applySession(req, res, options)
    return {
        props: {
            user: req.session.user || '',
            loggedIn: !!req.session.loggedIn
        }
    }
}
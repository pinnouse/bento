import { applySession } from "next-session"
import React, { useEffect, useState } from "react"
import { options } from "../sessionConfig"
import PollView from '../components/dataViews/pollView'
import EventView from '../components/dataViews/eventView'
import Link from 'next/link'

enum DashboardView {
    Events,
    Polls,
}

export default function Dashboard({ user }) {
    const [logs, setLogs] = useState(new Map())
    const [curSession, setSession] = useState('')
    const [dashboardView, setDashboardView] = useState(DashboardView.Events)

    useEffect(() => {
        fetch('/api/fetchLogs', {
            method: 'POST'
        }).then(
            res => res.status === 200 ? res.json() : Promise.resolve({})
        ).then(res => {
            let logs = new Map()
            res.forEach(r => {
                logs.set(r.id, {...r})
            })
            setLogs(logs)
            if (res.length > 0) {
                setSession(res[0].id)
            }
        })
    }, [])

    const Sidebar = () => {
        return (
            <div className="flex flex-col p-8 shadow-lg bg-white rounded-md max-w-prose">
                <h1 className="text-4xl"><span className="text-indigo-400">Bento</span> Dashboard</h1>
                <h2 className="text-lg mt-2">Welcome back {user}!</h2>
                <label htmlFor="session" className="mt-8 text-md">Select a session</label>
                <select className="border-2 rounded-sm p-3 mt-2" id="session" value={curSession} onChange={e=>{setSession(e.target.value)}}>
                    {Array.from(logs.keys()).map(log => (
                        <option key={log} value={log}>{log}</option>
                    ))}
                </select>
                {!!logs.get(curSession) && (
                    <div className="flex flex-col mt-6">
                        <span>Session ID: {curSession}</span>
                        <span>Started: {logs.get(curSession).start_date}</span>
                    </div>
                )}
                <span className="flex-1" />
                <Link href="/build">
                    <a className="button my-2">
                        Stage
                    </a>
                </Link>
                <Link href="/logout">
                    <a className="button my-2">
                        Logout
                    </a>
                </Link>
            </div>
        )
    }

    const DashView = (props) => {
        const logsProp = logs.get(curSession)
        if (!logsProp) {
            return (
                <div {...props}>Nothing to Show</div>
            )
        }
        switch(dashboardView) {
            case DashboardView.Polls:
                return <PollView props={props} logs={logsProp} />
            case DashboardView.Events:
            default:
                return <EventView props={props} logs={logsProp} />
        }
    }

    const tabClasses = "px-3 py-2 mr-2 rounded-t-md shadow-md"

    return (
        <div className="flex flex-row min-h-screen p-12 bg-indigo-100 max-w-screen max-h-screen">
            <Sidebar />
            <div className="flex flex-col flex-1 px-12">
                <div>
                    <button onClick={()=>{setDashboardView(DashboardView.Events)}} className={`${tabClasses} ${dashboardView === DashboardView.Events ? 'bg-white' : 'bg-gray-100'}`}>Events</button>
                    <button onClick={()=>{setDashboardView(DashboardView.Polls)}} className={`${tabClasses} ${dashboardView === DashboardView.Polls ? 'bg-white' : 'bg-gray-100'}`}>Polls</button>
                </div>
                <DashView className="shadow-md flex-1 bg-white rounded-b-md p-8 max-w-full max-h-full" />
            </div>
        </div>
    )
}

export async function getServerSideProps({ req, res }) {
    await applySession(req, res, options)
    if (!req.session.loggedIn) {
        res.statusCode = 302
        res.setHeader('Location', '/')
        return { props: {} }
    }
    return {
        props: {
            user: req.session.user,
            userId: req.session.user_id,
        }
    }
}
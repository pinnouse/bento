import { useState } from "react"

export default function Logger() {

    const [session, setSession] = useState('')
    const [eventType, setEventType] = useState('')
    const [eventData, setEventData] = useState('')

    const log = async () => {
        await fetch('/api/addLog', {
            method: 'POST',
            body: JSON.stringify({
                session_id: session,
                event_type: eventType,
                event_data: eventData
            })
        })
        setEventData('')
    }

    return (
        <form className="flex flex-col mx-auto max-w-prose py-12" onSubmit={e=>e.preventDefault()}>
            <label htmlFor="session">Session</label>
            <input className="border-2 border-gray-100 my-2 p-4" type="text" name="session" id="session" value={session} onChange={e=>setSession(e.target.value)} />
            <label htmlFor="eventType">Event Type</label>
            <input className="border-2 border-gray-100 my-2 p-4" type="text" name="eventType" id="eventType" value={eventType} onChange={e=>setEventType(e.target.value)} />
            <label htmlFor="eventData">Event Data</label>
            <input className="border-2 border-gray-100 my-2 p-4" type="text" name="eventData" id="eventData" value={eventData} onChange={e=>setEventData(e.target.value)} />
            <button className="mt-4 p-4 bg-indigo-400 text-white" type="submit" onClick={log}>Log</button>
        </form>
    )
}
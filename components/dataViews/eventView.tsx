import { useState } from 'react'
import styles from '../../styles/table.module.css'
import _ from 'lodash'

export default function EventView({ props, logs }) {
    const [search, setSearch] = useState('')

    return (
        <div {...props}>
            <div className="flex flex-row items-center">
                <label className="mr-3" htmlFor="search">Search:</label>
                <input
                    className="p-3 border-2 border-gray-200 rounded-md flex-1"
                    value={search}
                    onChange={e=>setSearch(e.target.value)}
                    type="text" name="search" id="search" placeholder="Search 🔍" />
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Type</th>
                        <th>Event Log</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.events.map(l => {
                        if (search.trim().length > 0) {
                            const stringified = JSON.stringify(l)
                            if (!stringified.includes(search)) return
                        }
                        return (
                            <tr key={l.event_id} className="">
                                <td className="text-center">{l.username}</td>
                                <td>
                                    {l.event_type}
                                </td>
                                <td>
                                    {JSON.stringify(l.event_data)}
                                </td>
                                <td className="text-center">
                                    {l.log_time}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
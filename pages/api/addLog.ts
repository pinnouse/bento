import { applySession } from "next-session";
import { query } from "../../dbDriver";
import { options } from "../../sessionConfig";

export default async function AddLog(req, res) {
    await applySession(req, res, options)
    if (!req.session.loggedIn) {
        res.status(400)
        res.end('You are not logged in')
        return
    }
    const body = JSON.parse(req.body)
    await query(`
    INSERT INTO event_log (user_id, session_id, event_type, event_data, log_time) VALUES ($1, $2, $3, $4, NOW());
    `, [req.session.user_id, body.session_id, body.event_type, body.event_data])
    res.status(200)
    res.end()
}
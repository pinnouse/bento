import { NextApiRequest, NextApiResponse } from "next";
import { applySession } from "next-session";
import { options } from "../../sessionConfig";
import { query } from '../../dbDriver'
import { Session } from "next-session/dist/types";

interface ISessionUser extends Session {
    user?: string,
    user_id?: number,
    loggedIn?: boolean,
}

export default async function FetchLogs(req: NextApiRequest & { session?: Session & ISessionUser }, res: NextApiResponse) {
    await applySession(req as any, res, options)
    if (!req.session.loggedIn) {
        res.status(400)
        res.end('You must be logged in and an instructor to get logs')
        return
    }
    const logsQuery = await query(`
    SELECT s.id, s.start_date, json_agg(
        json_build_object(
            'event_id', e.id,
            'event_type', e.event_type,
            'event_data', e.event_data,
            'log_time', e.log_time,
            'username', u.username,
            'user_id', e.user_id
        )
    ) AS events,
    COALESCE(json_agg(
        DISTINCT to_json(p.*)
    ) FILTER (WHERE p.id IS NOT NULL), '[]') AS polls
    FROM sessions s
    LEFT JOIN polls p
    ON s.id=p.session_id
    JOIN event_log e
    ON s.id=e.session_id
    JOIN users u
    ON u.id=e.user_id AND s.host_id=$1
    GROUP BY s.id;`, [req.session.user_id])
    res.status(200)
    res.json(logsQuery.rows)
}
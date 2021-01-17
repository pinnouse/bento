import { NextApiRequest, NextApiResponse } from "next";
import { applySession } from "next-session";
import { Session } from "next-session/dist/types";
import { options } from "../../sessionConfig";
import { query } from '../../dbDriver'

export default async function GetLayout(req: NextApiRequest & { session?: Session }, res: NextApiResponse) {
    await applySession(req, res, options)
    if (!req.session.loggedIn) {
        res.status(400)
        res.end('You must be logged in to access this site')
        return
    }
    const queryResult = await query('SELECT saved_layout FROM users WHERE username = $1;',
        [req.session.user])

    let result = [[]]
    if (queryResult.rowCount > 0) {
        result = queryResult.rows[0].saved_layout || [[]]
    }
    
    res.status(200)
    res.json(result)
}
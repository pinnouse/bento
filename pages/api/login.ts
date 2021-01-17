import { NextApiRequest, NextApiResponse } from "next";
import { applySession } from "next-session";
import { Session } from "next-session/dist/types";
import { options } from "../../sessionConfig";
import { query } from '../../dbDriver'

import { createHash } from 'crypto'

export default async function Login(req: NextApiRequest & { session?: Session }, res: NextApiResponse) {
    await applySession(req, res, options)
    const body = JSON.parse(req.body)
    const hashedPass = createHash('md5').update(body.password).digest('hex')
    const queryResult = await query('SELECT * FROM users WHERE username = $1 AND password = $2;',
        [body.username, hashedPass])
    if (queryResult.rowCount <= 0) {
        res.status(400)
        res.end('Account not found')
        return
    }
    const row = queryResult.rows[0]
    req.session.user = row.username
    req.session.user_id = row.id
    req.session.loggedIn = true
    res.status(200)
    res.end()
}
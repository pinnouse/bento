import { NextApiRequest, NextApiResponse } from 'next'
import { applySession } from 'next-session'
import { Session } from 'next-session/dist/types'
import { query } from '../../dbDriver'
import { options } from '../../sessionConfig'

export default async function SaveLayout(req: NextApiRequest & { session?: Session }, res: NextApiResponse) {
    await applySession(req, res, options)
    if (!req.session.loggedIn) {
        res.status(400)
        res.end('You must be logged in to save a layout')
        return
    }
    const queryResult = await query('UPDATE users SET saved_layout=$1 WHERE users.id=$2;',
        [req.body, req.session.user_id])
    if (queryResult.rowCount <= 0) {
        res.status(400)
        res.end('Nothing was saved')
        return
    }
    res.status(200)
    res.end('Successfully updated saved layout')
}
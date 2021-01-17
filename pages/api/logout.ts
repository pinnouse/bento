import { NextApiRequest, NextApiResponse } from "next";
import { applySession } from "next-session";
import { Session } from "next-session/dist/types";
import { options } from "../../sessionConfig";

export default async function Logout(req: NextApiRequest & { session?: Session }, res: NextApiResponse) {
    await applySession(req, res, options)
    req.session.destroy()
    res.status(200)
    res.end()
}
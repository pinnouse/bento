import { Options } from "next-session/dist/types";
import * as signature from 'cookie-signature'

const SECRET = process.env.COOKIE_SECRET || 'keyboardcat123'

export const options: Options = {
    decode: (raw) => signature.unsign(raw.slice(2), SECRET) || '',
    encode: (sid) => (sid ? 's:' + signature.sign(sid, SECRET) : null),
    cookie: {
        secure: true,
    }
}
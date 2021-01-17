import fs from 'fs'
import { Pool, PoolClient, PoolConfig, QueryConfig } from 'pg'
import { waterfall } from 'async'

const poolConfig: PoolConfig = {
    user: process.env.PGUSER || '',
    password: process.env.PGPASSWORD || '',
    database: process.env.PGDATABASE || 'defaultdb',
    host: process.env.PGHOSTADDR || 'localhost',
    port: parseInt(process.env.PGPORT) || 26257,
    ssl: {
        ca: fs.readFileSync(process.env.PGCA)
            .toString()
    }
}

const pool = new Pool(poolConfig)

pool.connect((err, client, done) => {
    if (err) {
        console.error('Failed to connect to db', err)
        done()
        return
    }
    waterfall([
        function(next) {
            client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(256) NOT NULL,
                password VARCHAR(256) NOT NULL,
                instructor BOOLEAN DEFAULT TRUE NOT NULL,
                saved_layout TEXT,
                last_logged_in TIMESTAMP
            );`, next)
        },
        function (_, next) {
            client.query(`
            CREATE TABLE IF NOT EXISTS sessions (
                id SERIAL PRIMARY KEY,
                host_id INT NOT NULL,
                start_date TIMESTAMP,
                FOREIGN KEY (host_id) REFERENCES users(id) ON UPDATE CASCADE
            );`, next)
        },
        function (_, next) {
            client.query(`
            CREATE TABLE IF NOT EXISTS polls (
                id SERIAL PRIMARY KEY,
                session_id INT NOT NULL,
                question VARCHAR(512) NOT NULL,
                options VARCHAR(256)[] NOT NULL,
                results INT[] NOT NULL,
                allow_multiple BOOLEAN DEFAULT FALSE NOT NULL,
                start_time TIMESTAMP,
                FOREIGN KEY (session_id) REFERENCES sessions(id) ON UPDATE CASCADE
            );`, next)
        },
        function (_, next) {
            client.query(`
            CREATE TABLE IF NOT EXISTS user_connections (
                user_id INT NOT NULL,
                session_id INT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE,
                FOREIGN KEY (session_id) REFERENCES sessions(id) ON UPDATE CASCADE,
                PRIMARY KEY(user_id, session_id)
            );`, next)
        },
        function(_, next) {
            client.query(`
            CREATE TABLE IF NOT EXISTS event_log (
                id SERIAL PRIMARY KEY,
                event_type TEXT NOT NULL,
                event_data JSON NOT NULL,
                session_id INT NOT NULL,
                user_id INT NOT NULL,
                log_time TIMESTAMP,
                FOREIGN KEY (session_id) REFERENCES sessions(id) ON UPDATE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE
            );`, next)
        }
    ], (err, _) => {
        if (err) {
            console.error('Error creating schema for database', err)
        }
        done()
    })
})

export async function query(q: string | QueryConfig<any>, values?: any) {
    const start = Date.now()
    const res = await pool.query(q, values)
    const duration = Date.now() - start
    console.log('executed query', { query: q, duration, rows: res.rowCount })
    return res
}

export async function getClient() {
    const client: PoolClient & { lastQuery?: any } = await pool.connect()
    const query = client.query
    const release = client.release
    const timeout = setTimeout(() => {
        console.error('A client has been checked out for more than 5 seconds!')
        console.error(`The last executed query on this client was: ${client.lastQuery}`)
    }, 5000)
    client.query = (...args) => {
        client.lastQuery = args
        return query.apply(client, args)
    }
    client.release = () => {
        clearTimeout(timeout)
        client.query = query
        client.release = release
        return release.apply(client)
    }
    return client
}
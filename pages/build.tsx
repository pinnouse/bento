import Layout from '../components/modules/layout'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ModuleType } from '../components/modules/module'
import DraggableModule from '../components/modules/draggableModule'
import { applySession } from 'next-session'
import { options } from '../sessionConfig'
import Link from 'next/link'

export default function Build({ user }) {
    const Sidebar = () => {
        const moduleList = Object.values(ModuleType).map((modType, i) => {
            return (
                <DraggableModule modType={modType} key={modType + '-' + i} />
            )
        })
        return (
            <div className="flex flex-col min-h-screen p-4" style={{flexBasis: 400, minWidth: 400}}>
                <strong className="text-lg">Modules</strong>
                <span className="text-sm">Drag a module to the stage get started</span>
                {moduleList}
                <span className="flex-1" />
                <span className="bottom-0 left-0 p-4">Hi {user}! Don't forget you can:</span>
                <Link href="/dashboard">
                    <a className="button my-2">
                        Dashboard
                    </a>
                </Link>
                <Link href="/logout">
                    <a className="button my-2">
                        Logout
                    </a>
                </Link>
            </div>
        )
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-row">
                <Sidebar />
                <Layout />
            </div>
        </DndProvider>
    )
}

export async function getServerSideProps({ req, res }) {
    await applySession(req, res, options)
    return {
        props: {
            user: req.session.user || '',
            loggedIn: !!req.session.loggedIn
        }
    }
}
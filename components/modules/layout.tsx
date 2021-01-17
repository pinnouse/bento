import React, { useState, useEffect, ReactNode } from 'react'
import { useDrop } from 'react-dnd'
import { ItemTypes } from '../draggableTypes'
import { CodeModule, DocumentModule, Module, moduleFromModType, VideoModule, WhiteboardModule } from './module'

export type LayoutPosition = {
    row: number
    col: number
}

const ROW_LENGTH: number = 12

export default function Layout() {
    const starterVideo = new VideoModule()
    starterVideo.layoutPosition = {
        row: 0, col: 0
    }
    const [rows, setRows] = useState<Module[][]>([[starterVideo]])
    const [insertLocation, setInsertLocation] = useState([-1, -1])

    useEffect(() => {
        fetch('/api/getLayout').then(res => res.json()).then(res => {
            if (res.length === 0 || res.length === 1 && res[0].length === 0) {
                return
            }
            setRows(
                assignPositions(
                    res.map(row => row.map(col => moduleFromModType(col)))
                )
            )
        })
    }, [])

    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.MODULE,
        drop: (item: any) => {if (insertLocation[0] >= 0 && insertLocation[1] >= 0) addModule(moduleFromModType(item.modType), insertLocation[0], insertLocation[1])},
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        })
    })

    const assignPositions = (rows: Module[][]): Module[][] => {
        const rowsSlice = rows.slice()
        rowsSlice.forEach((cols, i) => {
            cols.forEach((module, j) => {
                module.layoutPosition = {
                    row: i, col: j
                }
            })
        })
        return rowsSlice
    }

    /**
     * Adds a module at row and index i provided, if no row or i specified,
     * will add to the last
     */
    const addModule = (module: Module, row?: number, i?: number) => {
        let addRow = rows.length - 1
        if (row !== null && row >= 0 && row < rows.length) {
            addRow = row
        }

        //Row is full
        let checkRow = rows[addRow]
        let rowSize = checkRow.reduce((prev, currModule) => prev + currModule.layoutNodes, 0)
        while (rowSize + module.layoutNodes > ROW_LENGTH) {
            addRow++
            if (addRow >= rows.length) break
            rowSize = checkRow.reduce((prev, currModule) => prev + currModule.layoutNodes, 0)
        }
        
        while (addRow >= rows.length) {
            rows.push([])
        }

        let currRow = rows[addRow]
        let addInd = currRow.length - 1
        if (i !== null && i >= 0) {
            addInd = i
        }
        if (i > currRow.length) {
            addInd = currRow.length
        }
        currRow.splice(addInd, 0, module)
        setRows(assignPositions(rows))
    }

    const removeModule = (module: Module) => {
        const {row, col} = module.layoutPosition
        const newRows = rows.slice()
        const currRow = newRows[row]
        currRow.splice(col, 1)
        if (currRow.length == 0 && newRows.length > 1)
            newRows.splice(row, 1)
        setRows(assignPositions(newRows))
    }

    const droppableSpace = (row: number, col: number) => {
        return (
            <div
                key={`droppable-${row}-${col}`}
                className={`flex justify-center items-center h-full flex-auto border-2 border-dashed p-2 font-bold text-gray-400 rounded-md border-gray-200 ${isOver && insertLocation[0] == row && insertLocation[1] == col ? 'border-blue-100 text-blue-100' : ''}`}
                onDragEnter={() => {setInsertLocation([row, col])}}
                onDragLeave={() => {setInsertLocation([-1, -1])}}>
                +
            </div>
        )
    }

    const renderModule = (module: Module, row: number, col: number, ) => {
        return (
            <div
                key={`layout-${row}-${col}-${module.moduleType}`}
                className="flex relative flex-1"
                style={{flexGrow: module.layoutNodes * 4}}>
                {module.component({
                    className: "flex flex-col flex-1 items-center justify-center border-2 rounded-md border-gray-300 text-blue-600 bg-indigo-300 bg-opacity-5 mx-6",
                })}
                <span
                    className="cursor-pointer absolute p-3 top-0 w-12 h-12 right-0 bg-white rounded-full shadow-lg opacity-30 hover:opacity-100 transition duration-300"
                    onClick={() => {removeModule(module)}}>
                    ✖
                </span>
            </div>
        )
    }

    const renderRow = (i: number): ReactNode => {
        if (i < 0 || i >= rows.length) return

        const rowNodes = rows[i].map((m, j) => {
            return [renderModule(m, i, j), droppableSpace(i, j+1)]
        })
        return (
            <div key={`layout-row-${i}`} className="flex flex-row flex-1 py-4">
                {droppableSpace(i, 0)}
                {rowNodes}
            </div>
        )
    }

    const loadLayout = (layoutNum: string) => {
        let rows = []
        switch(layoutNum.toLowerCase()) {
            case 'math':
                rows = [[new WhiteboardModule()], [new VideoModule()]]
                break
            case 'cs':
                rows = [[new VideoModule(), new CodeModule()]]
                break
            case 'tutorial':
                rows = [[new DocumentModule(), new WhiteboardModule()]]
                break
            case 'power':
                rows = [[new VideoModule(), new DocumentModule()], [new WhiteboardModule()]]
                break
        }
        setRows(assignPositions(rows))
    }

    const saveLayout = async () => {
        await fetch('/api/saveLayout', {
            method: 'POST',
            body: JSON.stringify(rows.map(row => row.map(col => col.moduleType)))
        })
        alert('Layout saved!')
    }

    return (
        <div
            ref={drop}
            className="flex flex-col flex-1 h-screen p-4 pr-8 text-center bg-gray-50">
            <strong className="text-lg">Stage</strong>
            <span className="text-sm">Stage your session here</span>
            {rows.map((_, i) => renderRow(i))}
            <div className="flex flex-row justify-end my-4">
                <button className="button"
                    onClick={() => {setRows([[]])}}>
                    Reset
                </button>
                <button className="button"
                    onClick={() => {loadLayout('power')}}>
                    Power User Layout
                </button>
                <button className="button"
                    onClick={() => {loadLayout('math')}}>
                    Math Layout
                </button>
                <button className="button"
                    onClick={() => {loadLayout('cs')}}>
                    CS Layout
                </button>
                <button className="button"
                    onClick={() => {loadLayout('tutorial')}}>
                    Tutorial Layout
                </button>
                <button
                    className="button primary"
                    type="submit"
                    onClick={async () => {await saveLayout()}}>
                    Save Layout
                </button>
            </div>
        </div>
    )
}
import { ModuleType } from './module'
import { useDrag } from 'react-dnd'
import { ItemTypes } from '../draggableTypes'

export default function DraggableModule({modType}: { modType: ModuleType }) {

    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.MODULE, modType },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        })
    })

    return (
        <div
            ref={drag}
            style={{
                opacity: isDragging ? 0.5 : 1
            }}
            className="block w-full px-4 py-3 my-3 text-left cursor-move bg-gray-100 rounded-sm hover:bg-gray-300">
            {modType}
        </div>
    )
}
import { ReactNode } from "react"
import { LayoutPosition } from "./layout"

export enum ModuleType {
    Video = 'VIDEO',
    Code = 'CODE',
    Whiteboard = 'WHITEBOARD',
    Document = 'DOCUMENT',
}

export type ModuleProps = {
    visible: Boolean
}

export interface IModule {
    minWidth: number
    minHeight: number
    preferredWidth: number
    preferredHeight: number
    moduleType: ModuleType
    layoutNodes: number
    layoutPosition?: LayoutPosition
}

/**
 * Abstract classes for modules that can be positioned on the screen
 */
export abstract class Module implements IModule {
    minWidth: number;
    minHeight: number;
    preferredWidth: number;
    preferredHeight: number;
    moduleType: ModuleType;
    layoutNodes: number;
    layoutPosition?: LayoutPosition;

    public abstract component(props): ReactNode;
}

export function moduleFromModType(modType: ModuleType): Module {
    switch(modType) {
        case ModuleType.Code:
            return new CodeModule()
        case ModuleType.Whiteboard:
            return new WhiteboardModule()
        case ModuleType.Document:
            return new DocumentModule()
        case ModuleType.Video:
        default:
            return new VideoModule()
    }
}

export class VideoModule extends Module {
    moduleType = ModuleType.Video
    layoutNodes = 6

    public component(props): ReactNode {
        return (
            <div {...props}>
                <span className="text-2xl mb-6">Video Module</span>
                <img className="object-contain w-14 h-14" width="50" height="50" src="/Video.svg" alt="Video Module" />
            </div>
        )
    }
}

export class CodeModule extends Module {
    moduleType = ModuleType.Code
    layoutNodes = 4

    public component(props): ReactNode {
        return (
            <div {...props}>
                <span className="text-2xl mb-6">Code Module</span>
                <img className="object-contain w-14 h-14" width="50" height="50" src="/Code.svg" alt="Code Module" />
            </div>
        )
    }
}

export class WhiteboardModule extends Module {
    moduleType = ModuleType.Whiteboard
    layoutNodes = 4

    public component(props): ReactNode {
        return (
            <div {...props}>
                <span className="text-2xl mb-6">Whiteboard Module</span>
                <img className="object-contain w-14 h-14" width="50" height="50" src="/Whiteboard.svg" alt="Whiteboard Module" />
            </div>
        )
    }
}

export class DocumentModule extends Module {
    moduleType = ModuleType.Document
    layoutNodes = 2

    public component(props): ReactNode {
        return (
            <div {...props}>
                <span className="text-2xl mb-6">Document Module</span>
                <img className="object-contain w-14 h-14" width="50" height="50" src="/Document.svg" alt="Document Module" />
            </div>
        )
    }
}

import { COLOR_LINE, WIDTH_LINE } from "../default-options";
import { IbuildStyle } from "./models";

const defaultOptions: any = {
    position: "absolute",
    width: 0,
    height: WIDTH_LINE,
    backgroundColor: COLOR_LINE,
    left: 0,
    top: 0,
}

export default function buildStyle({ type, childRect, fatherRect }: IbuildStyle) {
    switch (type) {
        case 'left': {
            return {
                ...defaultOptions,
                width: childRect.left - fatherRect.left,
                height: WIDTH_LINE,
                backgroundColor: COLOR_LINE,
                left: fatherRect.left,
                top: childRect.top + (childRect.height / 2)
            }
        }
        case 'top': {
            return {
                ...defaultOptions,
                width: WIDTH_LINE,
                height: childRect.top - fatherRect.top,
                backgroundColor: COLOR_LINE,
                left: childRect?.left + (childRect.width / 2),
                top: fatherRect.top,
            }
        }
        case 'right': {
            return {
                ...defaultOptions,
                position: "absolute",
                width: fatherRect.right - childRect.right,
                height: WIDTH_LINE,
                backgroundColor: COLOR_LINE,
                left: childRect?.right,
                top: childRect.top + (childRect.height / 2),
            }
        }
        case 'bottom': {
            return {
                ...defaultOptions,
                width: WIDTH_LINE,
                height: fatherRect.bottom - childRect.bottom,
                backgroundColor: COLOR_LINE,
                left: childRect?.left + (childRect.width / 2),
                top: childRect.bottom,
            }
        }
        default: throw Error('type not found')
    }
}
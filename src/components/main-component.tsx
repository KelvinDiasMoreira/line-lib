import React, { useEffect, useRef, useState } from "react";
import { ChildrenProps, MainComponentProps } from "./models";
import buildStyle from "../utils/build-style";

export function MainComponent({ children }: MainComponentProps) {
  const [boundFirstElement, setBoundFirstElement] = useState<DOMRect>()
  const [boundChildrens, setBoundChildrens] = useState<DOMRect[]>([])
  const firstElement = React.Children.toArray(children)[0] as ChildrenProps
  if (firstElement.type !== 'div') {
    return <p>first element must be a div</p>
  }
  const firstElementRef = useRef<HTMLElement>(null)
  const childrensRefs = useRef<HTMLElement[]>([])
  const { props: { children: childrens } } = firstElement
  if (!Array.isArray(childrens)) {
    return 'todo'
  }
  const clonedChildrens = childrens.map((child, idx) => {
    return React.cloneElement(child, {
      //@ts-ignore
      ref: (el: HTMLElement) => {
        childrensRefs.current[idx] = el
      },
      key: idx
    })
  })
  useEffect(() => {
    if (firstElementRef.current) {
      setBoundFirstElement(firstElementRef.current.getBoundingClientRect())
    }
    if (childrensRefs.current) {
      for (let i = 0; i < childrensRefs.current.length; i++) {
        setBoundChildrens((prev) => [...prev, childrensRefs.current[i].getBoundingClientRect()])
      }
    }
  }, [childrens.length])
  const mustRender = childrens.length > 0 && boundChildrens.length > 0 && childrensRefs.current && boundFirstElement
  const lines: React.JSX.Element[] = []
  const tooltips: React.JSX.Element[] = []
  if (mustRender) {
    for (let i = 0; i < childrensRefs.current.length; i++) {
      const childRect = childrensRefs.current[i].getBoundingClientRect()
      /* Left side */
      lines.push(
        <div
          style={{
            ...buildStyle({ type: 'left', childRect, fatherRect: boundFirstElement })
          }}
          key={`line-left-${i}`}
        />)
      /* Tooltip left side */
      tooltips.push(
        <p
          style={{
            position: 'absolute',
            color: 'black',
            fontSize: 12,
            left: boundFirstElement.left,
            width: childRect.left - boundFirstElement.left,
            top: childRect.top - 35 + (childRect.height / 2),
            whiteSpace: 'nowrap'
          }}
          key={`tooltip-left-${i}`}
        >{childRect.left - boundFirstElement.left}px</p>
      )
      /* Top side */
      lines.push(
        <div
          style={{
            ...buildStyle({ type: 'top', childRect, fatherRect: boundFirstElement })
          }}
          key={`line-top-${i}`}
        />)
      /* Tooltip top side */
      tooltips.push(
        <p
          style={{
            position: 'absolute',
            color: 'black',
            fontSize: 12,
            left: childRect.left + 10 + (childRect.width / 2),
            top: childRect.top - 40,
            whiteSpace: 'nowrap'
          }}
          key={`tooltip-top-${i}`}
        >{childRect.top - boundFirstElement.top}px</p>
      )
      /* Right side */
      lines.push(
        <div
          style={{
            ...buildStyle({ type: 'right', childRect, fatherRect: boundFirstElement })
          }}
          key={`line-right-${i}`}
        />)
      /* Tooltip right side */
      tooltips.push(
        <p
          style={{
            position: 'absolute',
            color: 'black',
            fontSize: 12,
            width: boundFirstElement.right - childRect.right,
            left: childRect.right,
            top: childRect.top - 35 + (childRect.height / 2),
            whiteSpace: 'nowrap'
          }}
          key={`tooltip-right-${i}`}
        >{boundFirstElement.right - childRect.right}px</p>
      )
      /* Bottom side */
      lines.push(
        <div
          style={{
            ...buildStyle({ type: 'bottom', childRect, fatherRect: boundFirstElement })
          }}
          key={`line-bottom-${i}`}
        />)
      /* Tooltip bottom side */
      tooltips.push(
        <p
          style={{
            position: 'absolute',
            color: 'black',
            fontSize: 12,
            left: childRect.left + 10 + (childRect.width / 2),
            top: childRect.bottom,
            whiteSpace: 'nowrap'
          }}
          key={`tooltip-bottom-${i}`}
        >{boundFirstElement.bottom - childRect.bottom}px</p>
      )
    }
  }
  return React.cloneElement(firstElement, {
    //@ts-ignore
    ref: firstElementRef,
    //@ts-ignore
    children: [...clonedChildrens, lines, tooltips]
  })
}

import React, { useEffect, useRef, useState } from "react";
import { ChildrenProps, MainComponentProps } from "./models";

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
  }, [])
  return React.cloneElement(firstElement, {
    //@ts-ignore
    ref: firstElementRef,
    //@ts-ignore
    children: clonedChildrens
  })
}

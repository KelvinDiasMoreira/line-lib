import React, { useEffect, useRef } from "react";

interface MainComponentProps {
  children: React.ReactNode;
}

interface StyleProps extends React.CSSProperties { }

interface IProps {
  style: StyleProps;
  children: ChildrenProps[];
}

interface ChildrenProps extends React.CSSProperties {
  type: string;
  key: string | null;
  props: IProps;
  ref?: React.RefObject<HTMLElement | null>;
}

export function MainComponent({ children }: MainComponentProps) {
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
      /* TODO */
    }
    if (childrensRefs.current) {
      /* TODO */
    }
  }, [])

  return React.cloneElement(firstElement, {
    //@ts-ignore
    ref: firstElementRef,
    //@ts-ignore
    children: clonedChildrens
  })
}

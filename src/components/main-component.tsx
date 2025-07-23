import React, { ReactNode, useEffect, useRef, useState } from "react";

interface MainComponentProps {
  children: React.ReactNode;
}

interface StyleProps extends React.CSSProperties {}

interface IProps {
  style: StyleProps;
  children: ChildrenProps[];
}

interface ChildrenProps {
  type: string;
  key: string | null;
  props: IProps;
}

export function MainComponent({ children }: MainComponentProps) {
  const firstChild = React.Children.toArray(children)[0] as any;

  const [boundRect, setBoundRect] = useState<DOMRect>();

  const childRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (childRef.current) {
      const rect = childRef.current.getBoundingClientRect();
      setBoundRect(rect);
    }
  }, []);

  const { type, props } = firstChild;
  const { style, children: childrenInside } = props;

  if (type !== "div") {
    return "must be a div";
  }
  const lines: React.JSX.Element[] = [];

  const widthChild = style?.width ?? 0;
  const heightChild = style?.height ?? 0;

  if (childrenInside && childrenInside.length > 0) {
    for (let i = 0; i < childrenInside.length; i++) {
      const child = childrenInside[i];
      const { style } = child.props;
      const { width, height, left, top, right, bottom } = style;
      if (!width || !height || !left) continue;
      if (!boundRect) continue;
      console.log(boundRect);
      lines.push(
        <div
          style={{
            position: "absolute",
            width,
            height: 1,
            backgroundColor: "red",
            left: boundRect?.x,
            top: boundRect?.y + top,
          }}
          key={`line-${i}`}
        />
      );
    }
  }

  const cloned = React.cloneElement(firstChild, {
    children: [...childrenInside, ...lines],
    ref: childRef,
  });

  return cloned;
}

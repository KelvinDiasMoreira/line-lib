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
  ref?: React.RefObject<HTMLElement | null>; // crap hack
}

export function MainComponent({ children }: MainComponentProps) {
  const firstChild = React.Children.toArray(children)[0] as ChildrenProps;

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
      if (!width || !height || !left || !top) continue;
      if (
        typeof top === "string" ||
        typeof height === "string" ||
        typeof width === "string" ||
        typeof left === "string"
      ) {
        continue;
      }
      if (!boundRect) continue;

      const middle = boundRect.y + top + height * i + height / 2;

      const maxWithLineLeft = width + left - width * (i === 0 ? 1 : i);
      const lineLeftSize = maxWithLineLeft;
      console.log("lineLeftSize", lineLeftSize);

      lines.push(
        <div
          style={{
            position: "absolute",
            width: maxWithLineLeft,
            height: 1,
            backgroundColor: "red",
            left: boundRect.x,

            top: middle,
          }}
          key={`line-${i}`}
        />
      );
    }
  }

  const cloned = React.cloneElement(firstChild, {
    children: [...childrenInside, ...lines],
    //@ts-ignore
    ref: childRef,
  });

  return cloned;
}

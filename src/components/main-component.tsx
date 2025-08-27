import React, { ReactNode, useEffect, useRef, useState } from "react";

interface MainComponentProps {
  children: React.ReactNode;
}

interface StyleProps extends React.CSSProperties {}

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
  const [boundRect, setBoundRect] = useState<DOMRect>();

  const firstChild = React.Children.toArray(children)[0] as ChildrenProps;
  let childInsideIsArr = true;
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

  if (!childrenInside) return children;

  const lines: React.JSX.Element[] = [];

  /**
   * TODO: ruler
   */
  const widthChild = style?.width ?? 0;
  const heightChild = style?.height ?? 0;

  if (childrenInside) {
    if (!boundRect) {
      childInsideIsArr = false;
    } else {
      if (!Array.isArray(childrenInside)) {
        childInsideIsArr = false;
        buildLinesWithOneChildren(childrenInside, boundRect, lines);
      } else {
        /**
         * TODO: fix when elements has diferent height
         */
        buildLinesWithMultipleChildren(childrenInside, boundRect, lines);
      }
    }
  }

  const cloned = React.cloneElement(firstChild, {
    //@ts-ignore
    children: childInsideIsArr
      ? [...childrenInside, ...lines]
      : [childrenInside, ...lines],
    ref: childRef,
  });

  return cloned;
}

function buildLinesWithOneChildren(
  childrenInside: ChildrenProps,
  boundRect: DOMRect,
  linesRef: React.JSX.Element[]
) {
  const child = childrenInside;
  const { style } = child.props;
  const { width, height, left, top, right, bottom } = style;
  if (!width || !height || !left || !top) return;
  if (
    typeof top === "string" ||
    typeof height === "string" ||
    typeof width === "string" ||
    typeof left === "string"
  ) {
    return;
  }
  let i = 0;

  const middle = boundRect.y + top + height * 0 + height / 2;

  const maxWidthLineLeft = width + left - width * (0 === 0 ? 1 : i);
  const maxHeightTopSide = top + (i === 0 ? 0 : height) * (i === 0 ? 1 : i);
  const maxWidthLineRight = boundRect.width - maxWidthLineLeft - width;
  const maxHeightBottomSide = boundRect.bottom - (middle + height / 2);

  /**
   * Left side
   */
  linesRef.push(
    <div
      style={{
        position: "absolute",
        width: maxWidthLineLeft,
        height: 1,
        backgroundColor: "red",
        left: boundRect.x,
        top: middle,
      }}
      key={`line-left-${i}`}
    />
  );

  /**
   * Top side
   */
  linesRef.push(
    <div
      style={{
        position: "absolute",
        width: 1,
        height: maxHeightTopSide,
        backgroundColor: "red",
        left: boundRect.x + maxWidthLineLeft + width / 2,
        top: boundRect.y,
      }}
      key={`line-top-${i}`}
    />
  );

  /**
   * Right side
   */
  linesRef.push(
    <div
      style={{
        position: "absolute",
        width: maxWidthLineRight,
        height: 1,
        backgroundColor: "red",
        left: boundRect.x + maxWidthLineLeft + width,
        top: middle,
      }}
      key={`line-right`}
    />
  );

  /**
   * Bottom side
   */
  linesRef.push(
    <div
      style={{
        position: "absolute",
        width: 1,
        height: maxHeightBottomSide,
        backgroundColor: "red",
        left: boundRect.x + maxWidthLineLeft + width / 2,
        top: middle + height / 2,
      }}
      key={`line-bottom-`}
    />
  );
}

function buildLinesWithMultipleChildren(
  childrenInside: ChildrenProps[],
  boundRect: DOMRect,
  linesRef: React.JSX.Element[]
) {
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

    const middle = boundRect.y + top + height * i + height / 2;

    const maxWidthLineLeft = width + left - width * (i === 0 ? 1 : i);
    const maxHeightTopSide = top + (i === 0 ? 0 : height) * (i === 0 ? 1 : i);
    const maxWidthLineRight = boundRect.width - maxWidthLineLeft - width;
    const maxHeightBottomSide = boundRect.bottom - (middle + height / 2);

    /**
     * Left side
     */
    linesRef.push(
      <div
        style={{
          position: "absolute",
          width: maxWidthLineLeft,
          height: 1,
          backgroundColor: "red",
          left: boundRect.x,
          top: middle,
        }}
        key={`line-left-${i}`}
      />
    );

    /**
     * Top side
     */
    linesRef.push(
      <div
        style={{
          position: "absolute",
          width: 1,
          height: maxHeightTopSide,
          backgroundColor: "red",
          left: boundRect.x + maxWidthLineLeft + width / 2,
          top: boundRect.y,
        }}
        key={`line-top-${i}`}
      />
    );

    /**
     * Right side
     */
    linesRef.push(
      <div
        style={{
          position: "absolute",
          width: maxWidthLineRight,
          height: 1,
          backgroundColor: "red",
          left: boundRect.x + maxWidthLineLeft + width,
          top: middle,
        }}
        key={`line-right-${i}`}
      />
    );

    /**
     * Bottom side
     */
    linesRef.push(
      <div
        style={{
          position: "absolute",
          width: 1,
          height: maxHeightBottomSide,
          backgroundColor: "red",
          left: boundRect.x + maxWidthLineLeft + width / 2,
          top: middle + height / 2,
        }}
        key={`line-bottom-${i}`}
      />
    );
  }
}

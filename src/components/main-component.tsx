import React, { ReactNode } from "react";

interface MainComponentProps {
  children: React.ReactNode;
}

interface StyleProps extends React.CSSProperties {}

interface IProps {
  style: StyleProps;
}

interface ChildrenProps {
  type: string;
  key: string;
  props: IProps;
}
export function MainComponent({ children }: MainComponentProps) {
  const firstChild = React.Children.toArray(children)[0] as ChildrenProps;

  const { type, props } = firstChild;
  const { style } = props;
  
  if (type !== "div") {
    return "must be a div";
  }

  const width = style?.width ?? 0;
  const height = style?.height ?? 0;

  console.log(width);
  console.log(height);

  console.log(firstChild);
  return children;
}

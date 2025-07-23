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
  if (type !== "div") {
    return "must be a div";
  }

  const width = props.style.width;
  const height = props.style.height;

  console.log(width);
  console.log(height);

  console.log(firstChild);
  return children;
}

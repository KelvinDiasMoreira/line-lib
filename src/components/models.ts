export interface ReactGuideLinesProps {
  children: React.ReactNode;
}

interface StyleProps extends React.CSSProperties { }

interface IProps {
  style: StyleProps;
  children: ChildrenProps[];
}

export interface ChildrenProps extends React.CSSProperties {
  type: string;
  key: string | null;
  props: IProps;
  ref?: React.RefObject<HTMLElement | null>;
}
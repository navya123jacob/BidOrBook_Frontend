declare module 'react-rating-stars-component' {
    import { Component } from 'react';
  
    interface ReactStarsProps {
      count?: number;
      value?: number;
      onChange?: (newRating: number) => void;
      size?: number;
      isHalf?: boolean;
      emptyIcon?: JSX.Element;
      halfIcon?: JSX.Element;
      fullIcon?: JSX.Element;
      activeColor?: string;
      color?: string;
      edit?: boolean;
      char?: string;
      classNames?: string;
    }
  
    class ReactStars extends Component<ReactStarsProps> {}
  
    export default ReactStars;
  }
  
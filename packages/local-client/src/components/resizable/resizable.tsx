import React, { useState } from 'react';
import { useEffect } from 'react';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import './resizable.css';

type ResizeDirection = 'horizontal' | 'vertical';
interface ResizableProps {
  direction: ResizeDirection;
}

export const Resizable: React.FC<ResizableProps> = ({
  direction,
  children,
}) => {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth * 0.75);

  useEffect(() => {
    let timer: any;
    const listener = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      timer = setTimeout(() => {
        setInnerWidth(window.innerWidth);
        setInnerHeight(window.innerHeight);
        if (window.innerWidth * 0.75 < width) {
          setWidth(window.innerWidth * 0.75);
        }
      }, 100);
    };
    window.addEventListener('resize', listener);

    return () => window.removeEventListener('resize', listener);
  }, [width]);

  const propsByDirection: Record<ResizeDirection, ResizableBoxProps> = {
    vertical: {
      width: Infinity,
      height: 300,
      resizeHandles: ['s'],
      minConstraints: [Infinity, 32],
      maxConstraints: [Infinity, innerHeight * 0.9],
    },
    horizontal: {
      width,
      height: Infinity,
      resizeHandles: ['e'],
      minConstraints: [innerWidth * 0.2, Infinity],
      maxConstraints: [innerWidth * 0.75, Infinity],
      className: 'resize-horizontal',
      onResizeStop: (_, { size }) => setWidth(size.width),
    },
  };

  return (
    <ResizableBox {...propsByDirection[direction]}>{children}</ResizableBox>
  );
};

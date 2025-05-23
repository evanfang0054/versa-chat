import React, { useRef, useEffect, useState } from 'react';
import { ProgressBar, ProgressCircle } from 'antd-mobile';
import { ProgressIndicatorProps, GradientConfig } from './interface';
import {
  getSemiCirclePath,
  getPathTotalLength,
  clampPercent,
  createGradientId,
  createGradientElement,
  getGradientCSSValue,
} from './helpers';

/**
 * ProgressIndicator 组件
 * 支持直线、半圆、全圆三种形态的进度指示器
 */
const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  percent,
  shape = 'line',
  showText = true,
  strokeColor = '#1677ff',
  trailColor = '#eee',
  strokeWidth = shape === 'line' ? 8 : 4,
  width,
  size = 100,
  format,
  className = '',
  style,
  animated = true,
  animationDuration = 300,
  percentText = '%',
}) => {
  // 规范化percent值
  const normalizedPercent = clampPercent(percent);

  // SVG路径引用
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  // 渐变ID (仅用于半圆形SVG)
  const [gradientId] = useState(() => createGradientId());

  // 计算路径长度
  useEffect(() => {
    if (shape !== 'line' && pathRef.current) {
      setPathLength(getPathTotalLength(pathRef.current));
    }
  }, [shape, size, strokeWidth]);

  // 渲染文本
  const renderText = () => {
    if (!showText) return null;

    const text = format ? format(normalizedPercent) : `${normalizedPercent}${percentText || '%'}`;

    return (
      <div
        className={`text-xxs ${shape === 'line' ? 'ml-2' : 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'}`}
      >
        {text}
      </div>
    );
  };

  // 获取渐变或纯色
  const getFillColorValue = () => {
    if (typeof strokeColor === 'string') {
      return strokeColor;
    }

    // 对于渐变，使用CSS linear-gradient
    return getGradientCSSValue(strokeColor);
  };

  // 线性进度条
  if (shape === 'line') {
    // 定义自定义样式
    const customStyle = {
      '--fill-color': getFillColorValue(),
      '--track-color': trailColor,
      '--track-width': `${strokeWidth}px`,
    };

    return (
      <div className={`flex items-center ${className}`} style={style}>
        <div style={{ width: width || '100%', flex: width ? 'none' : 1 }}>
          {/* 使用antd-mobile的ProgressBar组件 */}
          <ProgressBar percent={normalizedPercent} style={customStyle} />
        </div>
        {showText && renderText()}
      </div>
    );
  }

  // 使用antd-mobile的ProgressCircle实现圆形进度
  if (shape === 'circle') {
    const customStyle = {
      '--size': `${size}px`,
      '--track-width': `${strokeWidth}px`,
      '--fill-color': getFillColorValue(),
      '--track-color': trailColor,
    };

    return (
      <div
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{ ...style }}
      >
        <ProgressCircle percent={normalizedPercent} style={customStyle}>
          {showText && renderText()}
        </ProgressCircle>
      </div>
    );
  }

  // 计算半圆形尺寸参数
  const radius = size / 2;
  const center = radius;
  const svgSize = size;

  // 计算半圆路径
  const path = getSemiCirclePath(radius, strokeWidth);

  // 计算stroke-dasharray和stroke-dashoffset
  const dashArray = pathLength;
  const dashOffset = pathLength - (pathLength * normalizedPercent) / 100;

  // 半圆形进度条的SVG样式
  const svgStyle = {
    transform: 'rotate(360deg)',
    transformOrigin: 'center',
  };

  // 创建transition样式
  const transitionStyle = animated
    ? { transition: `stroke-dashoffset ${animationDuration}ms ease-in-out` }
    : {};

  // 获取SVG路径的颜色
  const getPathColor = () => {
    if (typeof strokeColor === 'string') {
      return strokeColor;
    }

    return `url(#${gradientId})`;
  };

  // 半圆形进度条
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: svgSize, height: radius, ...style }}
    >
      <svg
        width={svgSize}
        height={radius}
        viewBox={`0 0 ${svgSize} ${radius}`}
        style={svgStyle}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 渐变定义 */}
        {typeof strokeColor !== 'string' && (
          <defs>{createGradientElement(gradientId, strokeColor as GradientConfig)}</defs>
        )}

        {/* 背景轨道 */}
        <path
          d={path}
          stroke={trailColor}
          strokeWidth={strokeWidth}
          fill="none"
          transform={`translate(${center}, ${radius})`}
        />

        {/* 进度路径 */}
        <path
          ref={pathRef}
          d={path}
          stroke={getPathColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
          transform={`translate(${center}, ${radius})`}
          style={transitionStyle}
        />
      </svg>
      {renderText()}
    </div>
  );
};

export default ProgressIndicator;

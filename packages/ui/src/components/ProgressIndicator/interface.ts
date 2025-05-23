import { ReactNode } from 'react';

/**
 * 进度指示器的形态类型
 * line: 直线
 * semi-circle: 半圆
 * circle: 圆形
 */
export type ProgressShape = 'line' | 'semi-circle' | 'circle';

/**
 * 进度指示器的渐变色配置
 */
export interface GradientConfig {
  /**
   * 渐变起始颜色
   */
  from: string;

  /**
   * 渐变结束颜色
   */
  to: string;

  /**
   * 渐变方向（角度）
   * @default '90deg'
   */
  direction?: string;
}

/**
 * 进度指示器的属性定义
 */
export interface ProgressIndicatorProps {
  /**
   * 进度百分比，范围 0-100
   */
  percent: number;

  /**
   * 形态类型：直线、半圆、圆形
   * @default 'line'
   */
  shape?: ProgressShape;

  /**
   * 是否显示进度文本
   * @default true
   */
  showText?: boolean;

  /**
   * 进度条/进度圈的颜色
   * 可以是字符串或渐变配置对象
   * 全圆时，strokeColor 不支持渐变配置对象
   * @default '#1677ff'
   */
  strokeColor?: string | GradientConfig;

  /**
   * 进度条/进度圈的背景色
   * @default '#eee'
   */
  trailColor?: string;

  /**
   * 线条宽度
   * @default 4 (直线形态为8)
   */
  strokeWidth?: number;

  /**
   * 进度条宽度（仅对line形态有效）
   */
  width?: number;

  /**
   * 进度圈/半圈的尺寸（直径）
   * @default 100
   */
  size?: number;

  /**
   * 自定义进度文本内容
   */
  format?: (percent: number) => ReactNode;

  /**
   * 附加的类名
   */
  className?: string;

  /**
   * 附加的样式
   */
  style?: React.CSSProperties;

  /**
   * 是否启用过渡动画
   * @default true
   */
  animated?: boolean;

  /**
   * 过渡动画持续时间（毫秒）
   * @default 300
   */
  animationDuration?: number;

  /**
   * 百分比文本，默认 '%'
   */
  percentText?: string;
}

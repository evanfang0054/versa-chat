import { GradientConfig } from './interface';

/**
 * 获取渐变CSS值
 * @param config 渐变配置
 * @returns 渐变CSS值
 */
export function getGradientCSSValue(config: GradientConfig): string {
  const { from, to, direction = '90deg' } = config;
  return `linear-gradient(${direction}, ${from}, ${to})`;
}

/**
 * 计算半圆弧形的SVG路径
 * @param radius 半径
 * @param strokeWidth 线宽
 * @returns SVG路径字符串
 */
export function getSemiCirclePath(radius: number, strokeWidth: number = 4): string {
  // 考虑到stroke宽度，实际半径需要减去strokeWidth/2
  const actualRadius = radius - strokeWidth / 2;
  // 半圆弧从左到右，以中心为原点
  return `M -${actualRadius},0 a ${actualRadius},${actualRadius} 0 1,1 ${actualRadius * 2},0`;
}

/**
 * 计算圆形的SVG路径
 * @param radius 半径
 * @param strokeWidth 线宽
 * @returns SVG路径字符串
 */
export function getCirclePath(radius: number, strokeWidth: number = 4): string {
  // 考虑到stroke宽度，实际半径需要减去strokeWidth/2
  const actualRadius = radius - strokeWidth / 2;
  // 完整圆形路径
  return `M 0,-${actualRadius} a ${actualRadius},${actualRadius} 0 1,1 -${actualRadius * 2},0 a ${actualRadius},${actualRadius} 0 1,1 ${actualRadius * 2},0`;
}

/**
 * 计算SVG路径的总长度
 * @param pathRef SVG路径元素的引用
 * @returns 路径总长度
 */
export function getPathTotalLength(pathRef: SVGPathElement | null): number {
  if (!pathRef) return 0;
  return pathRef.getTotalLength();
}

/**
 * 限制百分比在0-100范围内
 * @param percent 百分比值
 * @returns 规范化后的百分比值
 */
export function clampPercent(percent: number): number {
  return Math.max(0, Math.min(100, percent));
}

/**
 * 创建线性渐变ID
 * @returns 唯一的渐变ID
 */
export function createGradientId(): string {
  return `progress-gradient-${Math.random().toString(36).substring(2, 10)}`;
}

/**
 * 创建渐变定义元素
 * @param id 渐变ID
 * @param config 渐变配置
 * @returns 渐变定义SVG元素
 */
export function createGradientElement(id: string, config: GradientConfig): JSX.Element {
  const { from, to, direction = '90deg' } = config;

  // 解析角度，转换为x1, y1, x2, y2坐标
  let x1 = '0%',
    y1 = '0%',
    x2 = '100%',
    y2 = '0%';

  // 解析direction中的度数值
  let angle = 90; // 默认90度
  if (direction) {
    // 处理如"45deg"的格式
    const match = direction.match(/^(\d+)deg$/);
    if (match && match[1]) {
      angle = parseInt(match[1], 10);
    } else {
      // 尝试直接解析数字
      const parsed = parseInt(direction, 10);
      if (!isNaN(parsed)) {
        angle = parsed;
      }
    }
  }

  // 规范化角度到0-359范围
  angle = angle % 360;
  if (angle < 0) angle += 360;

  // 根据角度设置渐变方向
  switch (angle) {
    case 0: {
      x1 = '0%';
      y1 = '0%';
      x2 = '0%';
      y2 = '100%';
      break;
    }
    case 45: {
      x1 = '0%';
      y1 = '100%';
      x2 = '100%';
      y2 = '0%';
      break;
    }
    case 90: {
      x1 = '0%';
      y1 = '0%';
      x2 = '100%';
      y2 = '0%';
      break;
    }
    case 135: {
      x1 = '0%';
      y1 = '0%';
      x2 = '100%';
      y2 = '100%';
      break;
    }
    case 180: {
      x1 = '100%';
      y1 = '0%';
      x2 = '0%';
      y2 = '0%';
      break;
    }
    case 225: {
      x1 = '100%';
      y1 = '0%';
      x2 = '0%';
      y2 = '100%';
      break;
    }
    case 270: {
      x1 = '0%';
      y1 = '100%';
      x2 = '0%';
      y2 = '0%';
      break;
    }
    case 315: {
      x1 = '0%';
      y1 = '0%';
      x2 = '100%';
      y2 = '100%';
      break;
    }
    default: {
      // 对于非45度倍数的角度，计算渐变坐标
      const radians = (angle * Math.PI) / 180;
      const cos = Math.cos(radians);
      const sin = Math.sin(radians);

      if (Math.abs(cos) < Math.abs(sin)) {
        // 垂直方向为主
        const ratio = cos / sin;
        if (sin > 0) {
          x1 = `${50 + 50 * ratio}%`;
          y1 = '0%';
          x2 = `${50 - 50 * ratio}%`;
          y2 = '100%';
        } else {
          x1 = `${50 - 50 * ratio}%`;
          y1 = '100%';
          x2 = `${50 + 50 * ratio}%`;
          y2 = '0%';
        }
      } else {
        // 水平方向为主
        const ratio = sin / cos;
        if (cos > 0) {
          x1 = '0%';
          y1 = `${50 - 50 * ratio}%`;
          x2 = '100%';
          y2 = `${50 + 50 * ratio}%`;
        } else {
          x1 = '100%';
          y1 = `${50 + 50 * ratio}%`;
          x2 = '0%';
          y2 = `${50 - 50 * ratio}%`;
        }
      }
      break;
    }
  }

  return (
    <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2}>
      <stop offset="0%" stopColor={from} />
      <stop offset="100%" stopColor={to} />
    </linearGradient>
  );
}

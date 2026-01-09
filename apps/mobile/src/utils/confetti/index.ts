import { ConfettiShape, ConfettiColor, ConfettiLaunchOptions } from './interface';

// 预定义的彩色调色板
export const COLOR_PALETTES = {
  rainbow: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
  pastel: ['#FFB6C1', '#FFC0CB', '#DDA0DD', '#E6E6FA', '#B0E0E6', '#87CEEB', '#98FB98'],
  warm: ['#FF6B6B', '#FF8E53', '#FFD93D', '#FCF6BD', '#D4F1D4', '#95E1D3'],
  cool: ['#6C5CE7', '#A29BFE', '#74B9FF', '#0984E3', '#00CEC9', '#55EFC4'],
  neon: ['#FF073A', '#FF6B6B', '#4ECDC4', '#45B7D1', '#F7DC6F', '#BB8FCE'],
  gold: ['#FFD700', '#FFA500', '#FF8C00', '#FF6347', '#FF4500', '#FF1493'],
  ocean: ['#0077BE', '#0099CC', '#00BFFF', '#87CEEB', '#B0E0E6', '#E0F6FF'],
  forest: ['#228B22', '#32CD32', '#90EE90', '#98FB98', '#00FF7F', '#00FA9A'],
  sunset: ['#FF4500', '#FF6347', '#FF7F50', '#FFA500', '#FFD700', '#FFFF00'],
  galaxy: ['#4B0082', '#8A2BE2', '#9400D3', '#9932CC', '#BA55D3', '#DA70D6'],
};

// 预定义的SVG路径
export const SHAPE_PATHS: Record<string, string> = {
  circle: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z',
  square: 'M2 2h20v20H2z',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  heart:
    'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  diamond: 'M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z',
  triangle: 'M12 2L2 20h20L12 2z',
  hexagon: 'M12 2L2 7v10l10 5 10-5V7L12 2z',
  pentagon: 'M12 2L2 9l4 12h12l4-12-10-7z',
};

// 默认的纸屑配置
export const DEFAULT_LAUNCH_OPTIONS: ConfettiLaunchOptions = {
  particleCount: 150,
  angle: 90,
  spread: 45,
  startVelocity: 45,
  decay: 0.9,
  gravity: 1,
  drift: 0,
  flat: false,
  ticks: 200,
  origin: { x: 0.5, y: 0.3 },
  scalar: 1,
  zIndex: 1000,
};

/**
 * 生成随机颜色
 */
export function getRandomColor(palette: keyof typeof COLOR_PALETTES = 'rainbow'): string {
  const colors = COLOR_PALETTES[palette];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * 生成颜色数组
 */
export function generateColors(colorConfig: ConfettiColor, count: number = 10): string[] {
  if (colorConfig.type === 'solid' && colorConfig.colors) {
    return colorConfig.colors;
  }

  if (colorConfig.type === 'gradient' && colorConfig.gradient) {
    // 简单的渐变颜色生成
    const colors = [];
    const { start, end } = colorConfig.gradient;
    for (let i = 0; i < count; i++) {
      const ratio = i / (count - 1);
      colors.push(interpolateColor(start, end, ratio));
    }
    return colors;
  }

  // 随机颜色
  return Array.from({ length: count }, () => getRandomColor('rainbow'));
}

/**
 * 颜色插值
 */
export function interpolateColor(color1: string, color2: string, ratio: number): string {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');

  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);

  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);

  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * 获取形状路径
 */
export function getShapePath(shape: ConfettiShape): string | null {
  if (shape.path) {
    return shape.path;
  }

  return SHAPE_PATHS[shape.type] || null;
}

/**
 * 创建形状对象
 */
export function createShapeObject(shape: ConfettiShape) {
  if (shape.text) {
    return { text: shape.text, scalar: shape.scalar || 1 };
  }

  const path = getShapePath(shape);
  if (path) {
    return { path, scalar: shape.scalar || 1 };
  }

  return null;
}

/**
 * 合并配置选项
 */
export function mergeLaunchOptions(
  defaults: ConfettiLaunchOptions,
  options: ConfettiLaunchOptions
): ConfettiLaunchOptions {
  return {
    ...defaults,
    ...options,
    origin: {
      ...defaults.origin,
      ...options.origin,
    },
  };
}

// 动态导入canvas-confetti
let confettiInstance: any = null;
export async function loadConfetti() {
  if (!confettiInstance) {
    const module = await import('canvas-confetti');
    confettiInstance = module.default;
  }
  return confettiInstance;
}

/**
 * 创建连续发射效果
 */
export async function createContinuousEffect(
  duration: number = 5000,
  particleCount: number = 50,
  confettiInstance?: any
): Promise<() => void> {
  const confetti = confettiInstance || (await loadConfetti());
  const startTime = Date.now();
  let animationId: number;

  const animate = () => {
    const elapsed = Date.now() - startTime;
    if (elapsed < duration) {
      // 从左侧发射
      confetti({
        particleCount: particleCount / 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: [getRandomColor(), getRandomColor()],
      });

      // 从右侧发射
      confetti({
        particleCount: particleCount / 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: [getRandomColor(), getRandomColor()],
      });

      animationId = requestAnimationFrame(animate);
    }
  };

  animate();

  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
}

/**
 * 创建烟花效果
 */
export async function createFireworkEffect(
  x: number = 0.5,
  y: number = 0.5,
  colors: string[] = [],
  confettiInstance?: any
): Promise<void> {
  const confetti = confettiInstance || (await loadConfetti());
  const count = 200;
  const defaults = {
    origin: { x, y },
    colors: colors.length > 0 ? colors : [getRandomColor(), getRandomColor()],
  };

  function fire(particleRatio: number, opts: any) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

/**
 * 创建心形效果
 */
export async function createHeartEffect(
  x: number = 0.5,
  y: number = 0.5,
  confettiInstance?: any
): Promise<void> {
  const confetti = confettiInstance || (await loadConfetti());
  const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ['#FF0000', '#FF69B4', '#FF1493', '#DC143C', '#B22222'],
    origin: { x, y },
  };

  function shoot() {
    confetti({
      ...defaults,
      particleCount: 30,
      scalar: 1.2,
      shapes: ['heart'],
    });

    if (Date.now() < Date.now() + 1000) {
      requestAnimationFrame(shoot);
    }
  }

  shoot();
}

// ==============================
// 直接调用的便捷方法
// ==============================

/**
 * 直接触发基础纸屑效果
 * @param options 发射配置
 */
export async function launchConfetti(options?: Partial<ConfettiLaunchOptions>): Promise<void> {
  const confetti = await loadConfetti();
  const finalOptions = {
    ...DEFAULT_LAUNCH_OPTIONS,
    ...options,
    origin: {
      ...DEFAULT_LAUNCH_OPTIONS.origin,
      ...options?.origin,
    },
  };

  confetti(finalOptions);
}

/**
 * 直接触发烟花效果
 * @param x 发射位置x坐标 (0-1)
 * @param y 发射位置y坐标 (0-1)
 * @param colors 自定义颜色数组
 */
export async function launchFirework(
  x: number = 0.5,
  y: number = 0.5,
  colors: string[] = []
): Promise<void> {
  await createFireworkEffect(x, y, colors);
}

/**
 * 直接触发心形效果
 * @param x 发射位置x坐标 (0-1)
 * @param y 发射位置y坐标 (0-1)
 */
export async function launchHeart(x: number = 0.5, y: number = 0.5): Promise<void> {
  await createHeartEffect(x, y);
}

/**
 * 直接触发连续发射效果
 * @param duration 持续时间（毫秒）
 * @param particleCount 每次发射的粒子数量
 * @returns 停止函数
 */
export async function launchContinuous(
  duration: number = 5000,
  particleCount: number = 50
): Promise<() => void> {
  return await createContinuousEffect(duration, particleCount);
}

/**
 * 触发自定义纸屑效果
 * @param customColors 自定义颜色配置
 * @param customShapes 自定义形状配置
 * @param options 发射配置
 */
export async function launchCustom(
  customColors?: ConfettiColor,
  customShapes?: ConfettiShape[],
  options?: Partial<ConfettiLaunchOptions>
): Promise<void> {
  const confetti = await loadConfetti();
  const finalOptions = mergeLaunchOptions(DEFAULT_LAUNCH_OPTIONS, options || {});

  // 生成颜色
  let colors = finalOptions.colors;
  if (customColors) {
    colors = generateColors(customColors, 10);
  }

  // 处理形状
  let shapes: any[] = [];
  if (customShapes && customShapes.length > 0) {
    shapes = customShapes
      .map(createShapeObject)
      .filter((shape): shape is NonNullable<typeof shape> => shape !== null);
  }

  // 准备发射配置
  const launchConfig: any = {
    ...finalOptions,
    colors,
  };

  if (shapes.length > 0) {
    launchConfig.shapes = shapes;
  }

  confetti(launchConfig);
}

/**
 * 触发彩虹色纸屑效果
 * @param options 发射配置
 */
export async function launchRainbow(options?: Partial<ConfettiLaunchOptions>): Promise<void> {
  await launchCustom({ type: 'solid', colors: COLOR_PALETTES.rainbow }, undefined, options);
}

/**
 * 触发柔和色调纸屑效果
 * @param options 发射配置
 */
export async function launchPastel(options?: Partial<ConfettiLaunchOptions>): Promise<void> {
  await launchCustom({ type: 'solid', colors: COLOR_PALETTES.pastel }, undefined, options);
}

/**
 * 触发暖色调纸屑效果
 * @param options 发射配置
 */
export async function launchWarm(options?: Partial<ConfettiLaunchOptions>): Promise<void> {
  await launchCustom({ type: 'solid', colors: COLOR_PALETTES.warm }, undefined, options);
}

/**
 * 触发冷色调纸屑效果
 * @param options 发射配置
 */
export async function launchCool(options?: Partial<ConfettiLaunchOptions>): Promise<void> {
  await launchCustom({ type: 'solid', colors: COLOR_PALETTES.cool }, undefined, options);
}

/**
 * 触发渐变色纸屑效果
 * @param startColor 渐变起始颜色
 * @param endColor 渐变结束颜色
 * @param options 发射配置
 */
export async function launchGradient(
  startColor: string,
  endColor: string,
  options?: Partial<ConfettiLaunchOptions>
): Promise<void> {
  await launchCustom(
    { type: 'gradient', gradient: { start: startColor, end: endColor } },
    undefined,
    options
  );
}

/**
 * 触发emoji纸屑效果
 * @param emoji emoji字符
 * @param scalar 缩放系数
 * @param options 发射配置
 */
export async function launchEmoji(
  emoji: string,
  scalar: number = 2,
  options?: Partial<ConfettiLaunchOptions>
): Promise<void> {
  await launchCustom(undefined, [{ type: 'custom', text: emoji, scalar }], options);
}

/**
 * 触发从左侧发射的纸屑效果
 * @param options 发射配置
 */
export async function launchFromLeft(options?: Partial<ConfettiLaunchOptions>): Promise<void> {
  await launchConfetti({
    ...options,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.5 },
  });
}

/**
 * 触发从右侧发射的纸屑效果
 * @param options 发射配置
 */
export async function launchFromRight(options?: Partial<ConfettiLaunchOptions>): Promise<void> {
  await launchConfetti({
    ...options,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.5 },
  });
}

/**
 * 触发从顶部发射的纸屑效果
 * @param options 发射配置
 */
export async function launchFromTop(options?: Partial<ConfettiLaunchOptions>): Promise<void> {
  await launchConfetti({
    ...options,
    angle: 90,
    spread: 90,
    origin: { x: 0.5, y: 0 },
  });
}

/**
 * 触发从底部发射的纸屑效果
 * @param options 发射配置
 */
export async function launchFromBottom(options?: Partial<ConfettiLaunchOptions>): Promise<void> {
  await launchConfetti({
    ...options,
    angle: 270,
    spread: 90,
    origin: { x: 0.5, y: 1 },
  });
}

/**
 * 触发随机位置纸屑效果
 * @param options 发射配置
 */
export async function launchFromRandom(options?: Partial<ConfettiLaunchOptions>): Promise<void> {
  await launchConfetti({
    ...options,
    origin: {
      x: Math.random(),
      y: Math.random() * 0.8,
    },
  });
}

/**
 * 批量触发纸屑效果（多个位置同时发射）
 * @param positions 位置数组
 * @param options 发射配置
 */
export async function launchMultiple(
  positions: Array<{ x: number; y: number }>,
  options?: Partial<ConfettiLaunchOptions>
): Promise<void> {
  const confetti = await loadConfetti();
  const baseOptions = {
    ...DEFAULT_LAUNCH_OPTIONS,
    ...options,
  };

  positions.forEach((position, index) => {
    setTimeout(() => {
      confetti({
        ...baseOptions,
        origin: position,
        particleCount: Math.floor((baseOptions.particleCount || 150) / positions.length),
      });
    }, index * 100); // 每个位置间隔100ms发射
  });
}

/**
 * 停止所有纸屑动画
 */
export function stopAllConfetti(): void {
  if (typeof window !== 'undefined' && (window as any).confetti) {
    (window as any).confetti.reset();
  }
}

/**
 * 重置所有纸屑状态
 */
export function resetAllConfetti(): void {
  stopAllConfetti();
}

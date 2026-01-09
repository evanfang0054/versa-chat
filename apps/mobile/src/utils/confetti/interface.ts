export interface ConfettiShape {
  type: 'circle' | 'square' | 'triangle' | 'star' | 'heart' | 'custom';
  path?: string;
  text?: string;
  scalar?: number;
}

export interface ConfettiColor {
  type: 'solid' | 'gradient' | 'random';
  colors?: string[];
  gradient?: {
    start: string;
    end: string;
  };
}

export interface ConfettiAnimation {
  duration?: number;
  delay?: number;
  repeat?: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export interface ConfettiPosition {
  x?: number;
  y?: number;
}

export interface ConfettiLaunchOptions {
  particleCount?: number;
  angle?: number;
  spread?: number;
  startVelocity?: number;
  decay?: number;
  gravity?: number;
  drift?: number;
  flat?: boolean;
  ticks?: number;
  origin?: ConfettiPosition;
  colors?: string[];
  shapes?: ConfettiShape[];
  scalar?: number;
  zIndex?: number;
}

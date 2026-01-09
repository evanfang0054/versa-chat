import { Node as FigmaNode } from '@figma/rest-api-spec';
import { cloneDeep } from 'lodash-es';
import { type SimplifiedDesign } from '../api/simplify-node-response.js';
export interface ProcessedNode {
  id: string;
  name: string;
  type: string;
  componentType?: string; // 映射到组件类型：Frame => Layout, Text => Typography 等
  style?: {
    width?: number | string;
    height?: number | string;
    padding?: string;
    margin?: string;
    backgroundColor?: string;
    color?: string;
    fontSize?: number;
    fontWeight?: number | string;
    borderRadius?: string;
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    opacity?: number;
    position?: string;
    [key: string]: any;
  };
  layout?: {
    isFlexible?: boolean;
    direction?: 'row' | 'column';
    spacing?: number;
    wrap?: boolean;
    justifyContent?: string;
    alignItems?: string;
  };
  content?: string; // 文本内容
  children?: ProcessedNode[];
  props?: Record<string, any>; // 组件属性
  [key: string]: any;
}

/**
 * 处理Figma颜色值
 * @param color Figma颜色对象
 * @returns CSS颜色值
 */
const processColor = (color: { r: number; g: number; b: number; a?: number }): string => {
  const { r, g, b, a = 1 } = color;
  const rgba = [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a];

  if (a === 1) {
    return `rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]})`;
  }

  return `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`;
};

/**
 * 处理Figma布局属性
 * @param node Figma节点
 * @returns 处理后的布局属性
 */
const processLayout = (node: FigmaNode): any => {
  const layout: any = {};

  if ('layoutMode' in node) {
    layout.direction =
      (node.layoutMode as string).toLowerCase() === 'HORIZONTAL' ? 'row' : 'column';
    layout.spacing = 'itemSpacing' in node ? (node.itemSpacing as number) : 0;
    layout.isFlexible = true;

    if ('primaryAxisAlignItems' in node) {
      const alignItems = node.primaryAxisAlignItems as string;
      switch (alignItems.toLowerCase()) {
        case 'MIN':
          layout.justifyContent = 'flex-start';
          break;
        case 'CENTER':
          layout.justifyContent = 'center';
          break;
        case 'MAX':
          layout.justifyContent = 'flex-end';
          break;
        case 'SPACE_BETWEEN':
          layout.justifyContent = 'space-between';
          break;
      }
    }

    if ('counterAxisAlignItems' in node) {
      const alignItems = node.counterAxisAlignItems as string;
      switch (alignItems.toLowerCase()) {
        case 'MIN':
          layout.alignItems = 'flex-start';
          break;
        case 'CENTER':
          layout.alignItems = 'center';
          break;
        case 'MAX':
          layout.alignItems = 'flex-end';
          break;
      }
    }
  }

  return layout;
};

/**
 * 处理Figma样式属性
 * @param node Figma节点
 * @returns 处理后的样式属性
 */
const processStyle = (node: FigmaNode): any => {
  const style: any = {};

  // 尺寸
  if ('absoluteBoundingBox' in node) {
    const box = node.absoluteBoundingBox as { width: number; height: number };
    style.width = box.width;
    style.height = box.height;
  }

  // 填充颜色
  if (
    'fills' in node &&
    Array.isArray(node.fills) &&
    node.fills.length > 0 &&
    node.fills[0].type === 'SOLID'
  ) {
    const fill = node.fills[0] as { type: string; color: any; opacity?: number };
    style.backgroundColor = processColor(fill.color);

    if (fill.opacity !== undefined) {
      style.opacity = fill.opacity;
    }
  }

  // 文字样式
  if ('style' in node) {
    const textStyle = node.style as any;
    if (textStyle.fontSize) {
      style.fontSize = textStyle.fontSize;
    }

    if (textStyle.fontWeight) {
      style.fontWeight = textStyle.fontWeight;
    }

    // 文字颜色，检查fills是否存在
    if (
      'fills' in node &&
      Array.isArray(node.fills) &&
      node.fills.length > 0 &&
      node.fills[0].type === 'SOLID'
    ) {
      const fill = node.fills[0] as { type: string; color: any; opacity?: number };
      style.color = processColor(fill.color);
    }
  }

  // 边框圆角
  if ('cornerRadius' in node) {
    style.borderRadius = `${node.cornerRadius}px`;
  } else if ('rectangleCornerRadii' in node && Array.isArray(node.rectangleCornerRadii)) {
    const [topLeft, topRight, bottomRight, bottomLeft] = node.rectangleCornerRadii as number[];
    style.borderRadius = `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`;
  }

  // 内边距
  const padding = {
    top: 'paddingTop' in node ? node.paddingTop : 0,
    right: 'paddingRight' in node ? node.paddingRight : 0,
    bottom: 'paddingBottom' in node ? node.paddingBottom : 0,
    left: 'paddingLeft' in node ? node.paddingLeft : 0,
  };

  if (padding.top || padding.right || padding.bottom || padding.left) {
    style.padding = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;
  }

  return style;
};

/**
 * 处理节点的组件类型
 * @param node Figma节点
 * @returns 组件类型
 */
const getComponentType = (node: FigmaNode): string => {
  switch (node.type) {
    case 'FRAME':
    case 'GROUP':
    case 'INSTANCE':
      return 'Layout';
    case 'TEXT':
      return 'Typography';
    case 'RECTANGLE':
      return 'Block';
    case 'VECTOR':
      return 'Icon';
    case 'ELLIPSE':
      return 'Circle';
    case 'LINE':
      return 'Divider';
    default:
      return 'Unknown';
  }
};

/**
 * 递归处理Figma节点
 * @param node Figma节点
 * @returns 处理后的节点
 */
const processNode = (node: FigmaNode): ProcessedNode => {
  const processed: ProcessedNode = {
    id: node.id,
    name: node.name,
    type: node.type,
    componentType: getComponentType(node),
    style: processStyle(node),
  };

  // 处理布局
  if (['FRAME', 'GROUP', 'INSTANCE'].includes(node.type)) {
    processed.layout = processLayout(node);
  }

  // 处理文本内容
  if (node.type === 'TEXT' && 'characters' in node) {
    processed.content = node.characters as string;
  }

  // 递归处理子节点
  if ('children' in node && Array.isArray(node.children)) {
    processed.children = (node.children as FigmaNode[]).map((child) => processNode(child));
  }

  return processed;
};

/**
 * 处理Figma文件数据
 * @param figmaData Figma文件数据
 * @returns 处理后的结构化数据
 */
export const processFigmaData = (figmaData: SimplifiedDesign): ProcessedNode[] => {
  try {
    // 复制数据，避免修改原始数据
    const clonedData = cloneDeep(figmaData);

    // 从 SimplifiedDesign 中获取节点
    const nodes = clonedData?.nodes || [];
    const processedNodes: ProcessedNode[] = [];

    // 处理每个节点
    for (const node of nodes) {
      // 将 SimplifiedNode 转换为 FigmaNode 进行处理
      const processedNode = processSimplifiedNode(node);
      processedNodes.push(processedNode);
    }

    return processedNodes;
  } catch (error) {
    console.error('处理Figma数据时出错:', error);
    throw new Error('处理Figma数据失败');
  }
};

/**
 * 处理简化后的节点
 * @param node SimplifiedNode
 * @returns 处理后的节点
 */
const processSimplifiedNode = (node: any): ProcessedNode => {
  const processed: ProcessedNode = {
    id: node.id,
    name: node.name,
    type: node.type,
    componentType: getComponentTypeFromSimplified(node),
    style: processSimplifiedStyle(node),
  };

  // 处理文本内容
  if (node.text) {
    processed.content = node.text;
  }

  // 处理布局
  if (['FRAME', 'GROUP', 'INSTANCE'].includes(node.type) || node.layout) {
    processed.layout = processSimplifiedLayout(node);
  }

  // 递归处理子节点
  if (node.children && Array.isArray(node.children)) {
    processed.children = node.children.map((child: any) => processSimplifiedNode(child));
  }

  return processed;
};

/**
 * 从简化节点中获取组件类型
 * @param node 简化节点
 * @returns 组件类型
 */
const getComponentTypeFromSimplified = (node: any): string => {
  switch (node.type) {
    case 'FRAME':
    case 'GROUP':
    case 'INSTANCE':
      return 'Layout';
    case 'TEXT':
      return 'Typography';
    case 'RECTANGLE':
      return 'Block';
    case 'VECTOR':
    case 'IMAGE-SVG':
      return 'Icon';
    case 'ELLIPSE':
      return 'Circle';
    case 'LINE':
      return 'Divider';
    default:
      return 'Unknown';
  }
};

/**
 * 处理简化节点的样式
 * @param node 简化节点
 * @returns 处理后的样式
 */
const processSimplifiedStyle = (node: any): any => {
  const style: any = {};

  // 处理边界框
  if (node.boundingBox) {
    style.width = node.boundingBox.width;
    style.height = node.boundingBox.height;
  }

  // 处理填充颜色 (从全局变量获取)
  if (node.fills) {
    // 假设填充已经在 globalVars 中简化为颜色值
    style.backgroundColor = node.fills;
  }

  // 处理文本样式
  if (node.textStyle) {
    // 假设文本样式已经在 globalVars 中简化
    Object.assign(style, { color: node.textStyle });
  }

  // 处理边框圆角
  if (node.borderRadius) {
    style.borderRadius = node.borderRadius;
  }

  // 处理透明度
  if (typeof node.opacity === 'number') {
    style.opacity = node.opacity;
  }

  return style;
};

/**
 * 处理简化节点的布局
 * @param node 简化节点
 * @returns 处理后的布局
 */
const processSimplifiedLayout = (node: any): any => {
  // 如果节点有 layout 属性引用，则处理为布局对象
  if (node.layout) {
    // 假设布局已经在 globalVars 中简化
    return {
      isFlexible: true,
      direction: node.layout.includes('row') ? 'row' : 'column',
      spacing: 0,
      justifyContent: node.layout.includes('justify-center')
        ? 'center'
        : node.layout.includes('justify-end')
          ? 'flex-end'
          : node.layout.includes('justify-between')
            ? 'space-between'
            : 'flex-start',
      alignItems: node.layout.includes('align-center')
        ? 'center'
        : node.layout.includes('align-end')
          ? 'flex-end'
          : 'flex-start',
    };
  }

  return {};
};

/**
 * 查找特定ID的节点
 * @param nodes 节点数组
 * @param nodeId 要查找的节点ID
 * @returns 找到的节点或undefined
 */
export const findNodeById = (nodes: ProcessedNode[], nodeId: string): ProcessedNode | undefined => {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return node;
    }

    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, nodeId);
      if (found) {
        return found;
      }
    }
  }

  return undefined;
};

/**
 * 过滤出指定类型的节点
 * @param nodes 节点数组
 * @param type 节点类型
 * @returns 过滤后的节点数组
 */
export const filterNodesByType = (nodes: ProcessedNode[], type: string): ProcessedNode[] => {
  const result: ProcessedNode[] = [];

  const traverse = (node: ProcessedNode) => {
    if (node.type === type) {
      result.push(node);
    }

    if (node.children && node.children.length > 0) {
      node.children.forEach(traverse);
    }
  };

  nodes.forEach(traverse);

  return result;
};

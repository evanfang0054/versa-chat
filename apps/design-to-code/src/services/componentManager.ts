import { v4 as uuidv4 } from 'uuid';
import { GeneratedComponent } from './codeGenerator';

// 保存的组件记录
export interface ComponentRecord {
  id: string;
  name: string;
  figmaFileId?: string;
  generatedAt: number;
  component: GeneratedComponent;
}

// 本地存储键名
const STORAGE_KEY = 'design-to-code-components';

/**
 * 获取所有保存的组件
 * @returns 组件记录数组
 */
export const getComponents = (): ComponentRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }

    return JSON.parse(data) as ComponentRecord[];
  } catch (error) {
    console.error('读取组件数据失败:', error);
    return [];
  }
};

/**
 * 保存组件
 * @param component 生成的组件
 * @param figmaFileId Figma文件ID（可选）
 * @returns 保存的组件记录
 */
export const saveComponent = (
  component: GeneratedComponent,
  figmaFileId?: string
): ComponentRecord => {
  try {
    const components = getComponents();

    // 创建新的组件记录
    const record: ComponentRecord = {
      id: uuidv4(),
      name: component.componentName,
      figmaFileId,
      generatedAt: Date.now(),
      component,
    };

    // 添加到数组并保存
    components.push(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(components));

    return record;
  } catch (error) {
    console.error('保存组件失败:', error);
    throw new Error('保存组件失败');
  }
};

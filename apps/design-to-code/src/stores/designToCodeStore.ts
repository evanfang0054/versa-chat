import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { type SimplifiedDesign } from '../api/simplify-node-response.js';
import { ProcessedNode } from '../services/figmaProcessor';
import { GeneratedComponent } from '../services/codeGenerator';
import { ComponentRecord } from '../services/componentManager';

// 应用状态
interface DesignToCodeState {
  // Figma相关状态
  figmaToken: string | null;
  figmaFileId: string | null;
  figmaData: SimplifiedDesign | null;
  selectedNodeId: string | null;
  processedNodes: ProcessedNode[];
  isLoadingFigmaData: boolean;
  figmaError: string | null;

  // 代码生成相关状态
  generatedComponent: GeneratedComponent | null;
  isGeneratingCode: boolean;
  codeGenerationError: string | null;
  rawAiResponse: string | null; // AI原始响应内容

  // 组件管理相关状态
  savedComponents: ComponentRecord[];
  selectedComponentId: string | null;

  // 预览相关状态
  previewMode: boolean;

  // 系统临时消息
  systemMessage: string | null;

  // 动作
  setFigmaToken: (token: string) => void;
  setFigmaFileId: (fileId: string) => void;
  setFigmaData: (data: SimplifiedDesign | null) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  setProcessedNodes: (nodes: ProcessedNode[]) => void;
  setIsLoadingFigmaData: (loading: boolean) => void;
  setFigmaError: (error: string | null) => void;

  setGeneratedComponent: (component: GeneratedComponent | null) => void;
  setIsGeneratingCode: (generating: boolean) => void;
  setCodeGenerationError: (error: string | null) => void;
  setRawAiResponse: (response: string | null) => void; // 设置AI原始响应

  setSavedComponents: (components: ComponentRecord[]) => void;
  setSelectedComponentId: (componentId: string | null) => void;

  setPreviewMode: (preview: boolean) => void;

  setSystemMessage: (message: string | null) => void;
  clearSystemMessage: () => void;

  // 重置状态
  resetFigmaState: () => void;
  resetCodeGenerationState: () => void;
  resetAll: () => void;
}

// 创建状态存储
export const useDesignToCodeStore = create<DesignToCodeState>()(
  devtools(
    (set) => ({
      // 初始状态
      figmaToken: localStorage.getItem('figma-token'),
      figmaFileId: localStorage.getItem('figma-file-id'),
      figmaData: null,
      selectedNodeId: null,
      processedNodes: [],
      isLoadingFigmaData: false,
      figmaError: null,

      generatedComponent: null,
      isGeneratingCode: false,
      codeGenerationError: null,
      rawAiResponse: null, // AI原始响应内容初始值

      savedComponents: [],
      selectedComponentId: null,

      previewMode: false,

      systemMessage: null,

      // 动作实现
      setFigmaToken: (token: string) => {
        localStorage.setItem('figma-token', token);
        set({ figmaToken: token });
      },

      setFigmaFileId: (fileId: string) => {
        localStorage.setItem('figma-file-id', fileId);
        set({ figmaFileId: fileId });
      },

      setFigmaData: (data: SimplifiedDesign | null) => set({ figmaData: data }),

      setSelectedNodeId: (nodeId: string | null) => set({ selectedNodeId: nodeId }),

      setProcessedNodes: (nodes: ProcessedNode[]) => set({ processedNodes: nodes }),

      setIsLoadingFigmaData: (loading: boolean) => set({ isLoadingFigmaData: loading }),

      setFigmaError: (error: string | null) => set({ figmaError: error }),

      setGeneratedComponent: (component: GeneratedComponent | null) =>
        set({ generatedComponent: component }),

      setIsGeneratingCode: (generating: boolean) => set({ isGeneratingCode: generating }),

      setCodeGenerationError: (error: string | null) => set({ codeGenerationError: error }),

      setRawAiResponse: (response: string | null) => set({ rawAiResponse: response }), // 设置AI原始响应

      setSavedComponents: (components: ComponentRecord[]) => set({ savedComponents: components }),

      setSelectedComponentId: (componentId: string | null) =>
        set({ selectedComponentId: componentId }),

      setPreviewMode: (preview: boolean) => set({ previewMode: preview }),

      setSystemMessage: (message: string | null) => set({ systemMessage: message }),

      clearSystemMessage: () => set({ systemMessage: null }),

      // 重置状态
      resetFigmaState: () =>
        set({
          figmaData: null,
          selectedNodeId: null,
          processedNodes: [],
          isLoadingFigmaData: false,
          figmaError: null,
        }),

      resetCodeGenerationState: () =>
        set({
          generatedComponent: null,
          isGeneratingCode: false,
          codeGenerationError: null,
          rawAiResponse: null, // 重置AI原始响应
        }),

      resetAll: () =>
        set({
          figmaData: null,
          selectedNodeId: null,
          processedNodes: [],
          isLoadingFigmaData: false,
          figmaError: null,
          generatedComponent: null,
          isGeneratingCode: false,
          codeGenerationError: null,
          rawAiResponse: null, // 重置AI原始响应
          selectedComponentId: null,
          previewMode: false,
          systemMessage: null,
        }),
    }),
    { name: 'design-to-code-store' }
  )
);

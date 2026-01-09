import { http } from '@/utils/request';
import {
  GetFileResponse,
  GetFileNodesResponse,
  GetImagesResponse,
  // Node as FigmaNode
} from '@figma/rest-api-spec';

// 导出官方类型，方便其他模块使用
export type {
  GetFileResponse,
  GetFileNodesResponse,
  GetImagesResponse,
  Node as FigmaNode,
  Component,
  Style,
} from '@figma/rest-api-spec';

import { parseFigmaResponse, type SimplifiedDesign } from '../api/simplify-node-response.js';

/**
 * 获取Figma文件数据
 * @param fileId Figma文件ID
 * @param token Figma访问令牌
 */
export const getFigmaFile = async (fileId: string, token?: string): Promise<SimplifiedDesign> => {
  const apiToken = token || import.meta.env.VITE_FIGMA_TOKEN;

  if (!apiToken) {
    throw new Error('Figma API令牌未提供，请检查环境变量VITE_FIGMA_TOKEN或手动传入token');
  }

  try {
    const response = await http.get<GetFileResponse>(
      `/figma/v1/files/${fileId}`,
      {
        depth: 3,
      },
      {
        headers: {
          'X-Figma-Token': apiToken,
        },
        errorHandling: {
          showErrorMessage: true,
          ignoreBusinessError: true,
        },
      }
    );

    console.log('response', response);
    const simplifiedResponse = parseFigmaResponse(response);
    return simplifiedResponse;
  } catch (error) {
    // 处理具体错误类型
    const err = error as Error;
    if (err.message?.includes('404')) {
      throw new Error('找不到指定的Figma文件，请检查文件ID是否正确');
    } else if (err.message?.includes('403')) {
      throw new Error('无访问权限，请检查Figma令牌是否有效');
    } else {
      throw new Error(`Figma API请求失败: ${err.message}`);
    }
  }
};

/**
 * 获取Figma节点数据
 * @param fileId Figma文件ID
 * @param nodeIds 需要获取的节点ID数组
 * @param token Figma访问令牌
 */
export const getFigmaNodes = async (
  fileId: string,
  nodeIds: string[],
  token?: string
): Promise<SimplifiedDesign> => {
  const apiToken = token || import.meta.env.VITE_FIGMA_TOKEN;

  if (!apiToken) {
    throw new Error('Figma API令牌未提供');
  }

  try {
    const nodeIdsParam = nodeIds.join(',');
    const response = await http.get<GetFileNodesResponse>(
      `https://api.figma.com/v1/files/${fileId}/nodes?ids=${nodeIdsParam}`,
      {},
      {
        headers: {
          'X-Figma-Token': apiToken,
        },
      }
    );

    const simplifiedResponse = parseFigmaResponse(response);
    return simplifiedResponse;
  } catch (error) {
    const err = error as Error;
    throw new Error(`获取Figma节点数据失败: ${err.message}`);
  }
};

/**
 * 获取Figma图像资源
 * @param fileId Figma文件ID
 * @param nodeIds 需要获取图像的节点ID数组
 * @param format 图像格式 (png, jpg, svg, pdf)
 * @param scale 图像缩放比例
 * @param token Figma访问令牌
 */
export const getFigmaImages = async (
  fileId: string,
  nodeIds: string[],
  format: 'png' | 'jpg' | 'svg' | 'pdf' = 'png',
  scale: number = 1,
  token?: string
): Promise<GetImagesResponse> => {
  const apiToken = token || import.meta.env.VITE_FIGMA_TOKEN;

  if (!apiToken) {
    throw new Error('Figma API令牌未提供');
  }

  try {
    const nodeIdsParam = nodeIds.join(',');
    const response = await http.get<GetImagesResponse>(
      `https://api.figma.com/v1/images/${fileId}`,
      { ids: nodeIdsParam, format, scale },
      {
        headers: {
          'X-Figma-Token': apiToken,
        },
      }
    );

    return response;
  } catch (error) {
    const err = error as Error;
    throw new Error(`获取Figma图像资源失败: ${err.message}`);
  }
};

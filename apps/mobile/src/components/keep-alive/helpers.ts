import { CachingNode } from 'react-activation';
import { getAllTracker } from '@/utils/tracker';

interface AliveController {
  drop: (cacheId: string) => void;
  clear: () => void;
  getCachingNodes: () => CachingNode[];
  refresh: (cacheId: string) => void;
}

/**
 * 清除指定页面的缓存
 * @param cacheId - 要清除的缓存ID
 * @param controller - KeepAlive controller 对象（从 useAliveController 获取）
 */
export const clearCache = (cacheId: string, controller: AliveController) => {
  try {
    controller.drop(cacheId);
    console.log(`Cache cleared for page: ${cacheId}`);
  } catch (error) {
    getAllTracker()
      .getInstanaTracker()
      .sendErr({
        type: 'KeepAlive',
        message: `Failed to clear cache for page: ${cacheId}`,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        action: 'clearCache',
        pageId: cacheId,
      });
  }
};

/**
 * 清除所有缓存
 * @param controller - KeepAlive controller 对象（从 useAliveController 获取）
 */
export const clearAllCache = (controller: AliveController) => {
  try {
    controller.clear();
    console.log('All cache cleared');
  } catch (error) {
    getAllTracker()
      .getInstanaTracker()
      .sendErr({
        type: 'KeepAlive',
        message: 'Failed to clear all cache',
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        action: 'clearAllCache',
      });
  }
};

/**
 * 获取当前缓存状态
 * @param cacheId - 要查询的缓存ID
 * @param controller - KeepAlive controller 对象（从 useAliveController 获取）
 * @returns 是否缓存了指定页面
 */
export const getCacheStatus = (cacheId: string, controller: AliveController): boolean => {
  try {
    const nodes = controller.getCachingNodes();
    const isCached = nodes.some((node: CachingNode) => node.id === cacheId);
    console.log(`Cache status for ${cacheId}: ${isCached}`);
    return isCached;
  } catch (error) {
    getAllTracker()
      .getInstanaTracker()
      .sendErr({
        type: 'KeepAlive',
        message: `Failed to get cache status for page: ${cacheId}`,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        action: 'getCacheStatus',
        pageId: cacheId,
      });
    return false;
  }
};

/**
 * 手动刷新指定页面
 * @param cacheId - 要刷新的缓存ID
 * @param controller - KeepAlive controller 对象（从 useAliveController 获取）
 */
export const refreshCache = (cacheId: string, controller: AliveController) => {
  try {
    controller.refresh(cacheId);
    console.log(`Cache refreshed for page: ${cacheId}`);
  } catch (error) {
    getAllTracker()
      .getInstanaTracker()
      .sendErr({
        type: 'KeepAlive',
        message: `Failed to refresh cache for page: ${cacheId}`,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        action: 'refreshCache',
        pageId: cacheId,
      });
  }
};

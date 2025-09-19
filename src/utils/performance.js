import { useCallback, useMemo, useRef } from 'react';
import { InteractionManager } from 'react-native';
import logger from './logger';

/**
 * Performance optimization utilities for React Native
 */

/**
 * Debounce function to limit how often a function can be called
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function to limit function execution frequency
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Hook for optimized FlatList performance
 */
export const useFlatListOptimization = (data, itemHeight = 64) => {
  const getItemLayout = useCallback((data, index) => ({
    length: itemHeight,
    offset: itemHeight * index,
    index,
  }), [itemHeight]);

  const keyExtractor = useCallback((item, index) => {
    return item?.id?.toString() || index.toString();
  }, []);

  const renderItemOptimization = useMemo(() => ({
    removeClippedSubviews: true,
    maxToRenderPerBatch: 10,
    windowSize: 10,
    initialNumToRender: 20,
    updateCellsBatchingPeriod: 50,
    onEndReachedThreshold: 0.5,
  }), []);

  return {
    getItemLayout,
    keyExtractor,
    renderItemOptimization,
  };
};

/**
 * Hook for optimized image loading
 */
export const useImageOptimization = () => {
  const imageCache = useRef(new Map());

  const preloadImage = useCallback((url) => {
    if (!imageCache.current.has(url)) {
      // Preload image logic here
      imageCache.current.set(url, true);
    }
  }, []);

  const clearImageCache = useCallback(() => {
    imageCache.current.clear();
  }, []);

  return {
    preloadImage,
    clearImageCache,
  };
};

/**
 * Hook for optimized Redux selectors
 */
export const useOptimizedSelector = (selector, equalityFn) => {
  return useMemo(() => selector, [selector]);
};

/**
 * Hook for delayed execution after interactions
 */
export const useInteractionCallback = (callback, dependencies = []) => {
  return useCallback((...args) => {
    InteractionManager.runAfterInteractions(() => {
      callback(...args);
    });
  }, [callback, ...dependencies]);
};

/**
 * Performance monitoring hook
 */
export const usePerformanceMonitor = (componentName) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());

  renderCount.current += 1;
  const currentTime = Date.now();
  const renderTime = currentTime - lastRenderTime.current;
  lastRenderTime.current = currentTime;

  // if (__DEV__) {
  //   logger.performance(`${componentName} render #${renderCount.current}`, renderTime);
  // }

  return {
    renderCount: renderCount.current,
    renderTime,
  };
};

/**
 * Hook for memory leak prevention
 */
export const useCleanup = () => {
  const cleanupRefs = useRef([]);

  const addCleanup = useCallback((cleanupFn) => {
    cleanupRefs.current.push(cleanupFn);
  }, []);

  const runCleanup = useCallback(() => {
    cleanupRefs.current.forEach(cleanup => cleanup());
    cleanupRefs.current = [];
  }, []);

  return {
    addCleanup,
    runCleanup,
  };
};

/**
 * Optimized scroll handler
 */
export const useOptimizedScrollHandler = (handler, dependencies = []) => {
  return useCallback(
    throttle((event) => {
      handler(event);
    }, 16), // ~60fps
    [handler, ...dependencies]
  );
};

/**
 * Hook for conditional rendering optimization
 */
export const useConditionalRender = (condition, component, fallback = null) => {
  return useMemo(() => {
    return condition ? component : fallback;
  }, [condition, component, fallback]);
};

/**
 * Performance constants
 */
export const PERFORMANCE_CONSTANTS = {
  FLATLIST: {
    MAX_TO_RENDER_PER_BATCH: 10,
    WINDOW_SIZE: 10,
    INITIAL_NUM_TO_RENDER: 20,
    UPDATE_CELLS_BATCHING_PERIOD: 50,
    ON_END_REACHED_THRESHOLD: 0.5,
  },
  ANIMATION: {
    USE_NATIVE_DRIVER: true,
    DEFAULT_DURATION: 300,
  },
  DEBOUNCE: {
    SEARCH: 300,
    SCROLL: 16,
    BUTTON_PRESS: 300,
  },
}; 
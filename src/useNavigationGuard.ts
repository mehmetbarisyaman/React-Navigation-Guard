import { useEffect, useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface NavigationGuardOptions {
  shouldBlock: () => boolean;
  onNavigationAttempt: (targetUrl: string, isReload: boolean) => void;
}

export interface NavigationGuardReturn {
  allowPendingNavigation: () => void;
  cancelPendingNavigation: () => void;
}

let globalGuardFunction: ((path: string) => boolean) | null = null;

export const setGlobalNavigationGuard = (guardFn: ((path: string) => boolean) | null) => {
  globalGuardFunction = guardFn;
};

export const guardedNavigateGlobal = (navigateFn: (path: string) => void, path: string) => {
  if (globalGuardFunction) {
    const shouldProceed = globalGuardFunction(path);
    if (shouldProceed) {
      navigateFn(path);
    }
  } else {
    navigateFn(path);
  }
};

export const useNavigationGuard = ({
  shouldBlock,
  onNavigationAttempt
}: NavigationGuardOptions): NavigationGuardReturn => {
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [isPageReload, setIsPageReload] = useState<boolean>(false);
  const isHandlingNavigation = useRef<boolean>(false);
  const isReloadingRef = useRef<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const guardFunction = (path: string): boolean => {
      if (shouldBlock() && !isHandlingNavigation.current) {
        setPendingNavigation(path);
        setIsPageReload(false);
        isHandlingNavigation.current = true;
        onNavigationAttempt(path, false);
        return false;
      }
      return true;
    };

    setGlobalNavigationGuard(guardFunction);

    return () => {
      setGlobalNavigationGuard(null);
    };
  }, [shouldBlock, onNavigationAttempt]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (shouldBlock() && !isHandlingNavigation.current && !isReloadingRef.current) {
        event.preventDefault();
        return 'Unsaved Changes';
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (shouldBlock() && !isHandlingNavigation.current && !isReloadingRef.current) {
        if (event.key === 'F5' || (event.ctrlKey && (event.key === 'r' || event.key === 'R'))) {
          event.preventDefault();
          setPendingNavigation(null);
          setIsPageReload(true);
          isHandlingNavigation.current = true;
          onNavigationAttempt('', true);
          return false;
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [shouldBlock, onNavigationAttempt]);

  const allowPendingNavigation = useCallback(() => {
    const path = pendingNavigation;
    setPendingNavigation(null);
    setIsPageReload(false);
    isHandlingNavigation.current = false;
    
    if (isPageReload) {
      isReloadingRef.current = true;
      isHandlingNavigation.current = false;
    } else if (path) {
      navigate(path);
    }
  }, [pendingNavigation, isPageReload, navigate]);

  const cancelPendingNavigation = useCallback(() => {
    setPendingNavigation(null);
    setIsPageReload(false);
    isHandlingNavigation.current = false;
    isReloadingRef.current = false;
  }, []);

  return {
    allowPendingNavigation,
    cancelPendingNavigation
  };
};
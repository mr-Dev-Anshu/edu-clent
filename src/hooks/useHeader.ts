import { useEffect } from 'react';
import { useAppDispatch } from './useStore';
import { setHeaderConfig, clearHeaderConfig } from '@/common/components/slice/DashBoardHeaderSlice';

export const useHeader = (config: any, onAction: (eventName: string) => void) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setHeaderConfig(config));

    const handleGlobalEvent = (e: any) => {
      onAction(e.detail.eventName);
    };

    window.addEventListener('header-action-trigger', handleGlobalEvent);
    
    return () => {
      window.removeEventListener('header-action-trigger', handleGlobalEvent);
      dispatch(clearHeaderConfig());
    };
  }, [config, dispatch]); 
};
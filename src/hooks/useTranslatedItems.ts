import { useEffect } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { setI18nContext } from '@/utils/gameLogic';

export const useTranslatedItems = () => {
  const i18nContext = useI18n();
  
  useEffect(() => {
    // Set the global i18n context for item generation
    setI18nContext(i18nContext);
  }, [i18nContext]);
  
  return i18nContext;
};
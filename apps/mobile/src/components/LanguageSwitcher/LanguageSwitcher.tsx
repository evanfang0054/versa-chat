import React from 'react';
import { Button, Toast } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage } from '../../utils/i18n';

/**
 * 语言切换组件
 * 支持切换中文和英文
 */
export const LanguageSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const currentLang = getCurrentLanguage();

  const toggleLanguage = () => {
    // 如果当前是中文，则切换到英文，否则切换到中文
    const newLang = currentLang.startsWith('zh') ? 'en' : 'zh-CN';
    changeLanguage(newLang)
      .then(() => {
        Toast.show({
          content: newLang === 'zh-CN' ? t('language.switchedToZh') : t('language.switchedToEn'),
          position: 'top',
        });
      })
      .catch((error) => {
        console.error('Failed to change language:', error);
      });
  };

  return (
    <Button size="small" onClick={toggleLanguage} className="mx-2 text-xs">
      {currentLang.startsWith('zh') ? t('language.en') : t('language.zh')}
    </Button>
  );
};

export default LanguageSwitcher;

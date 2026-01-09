import React, { useMemo } from 'react';
import Editor, { OnMount, EditorProps } from '@monaco-editor/react';
import { useTranslation } from 'react-i18next';
import { CodeEditorProps } from './interface';
import { editor } from 'monaco-editor';

/**
 * 代码编辑器组件
 * 使用Monaco Editor提供高级代码编辑和预览功能
 */
const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  language = 'typescript',
  height = '300px',
  width = '100%',
  showLineNumbers = true,
  theme = 'vs-dark',
  fontSize = 14,
  className = '',
  highlightedLines = [],
  editorOptions,
  disableAutocompletion = false,
  minimap = true,
}) => {
  const { t } = useTranslation();

  // 计算编辑器选项
  const computedEditorOptions: editor.IStandaloneEditorConstructionOptions = useMemo(() => {
    const baseOptions: editor.IStandaloneEditorConstructionOptions = {
      readOnly,
      fontSize,
      lineNumbers: showLineNumbers ? ('on' as const) : ('off' as const),
      minimap: { enabled: minimap },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      scrollbar: {
        vertical: 'visible',
        horizontal: 'visible',
      },
      lineDecorationsWidth: 10,
      lineNumbersMinChars: 3,
      wordWrap: 'on',
      renderLineHighlight: 'all',
      glyphMargin: true,
      folding: true,
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      matchBrackets: 'always',
      // 根据配置禁用自动完成
      quickSuggestions: !disableAutocompletion,
      suggestOnTriggerCharacters: !disableAutocompletion,
      acceptSuggestionOnEnter: !disableAutocompletion ? 'on' : 'off',
      tabCompletion: !disableAutocompletion ? 'on' : 'off',
    };

    // 合并自定义选项
    return { ...baseOptions, ...editorOptions };
  }, [readOnly, fontSize, showLineNumbers, minimap, disableAutocompletion, editorOptions]);

  // 处理编辑器加载完成后的事件
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // 设置高亮行
    if (highlightedLines && highlightedLines.length > 0) {
      const decorations = highlightedLines.map((lineNumber) => ({
        range: new monaco.Range(lineNumber, 1, lineNumber, 1),
        options: {
          isWholeLine: true,
          className: 'monaco-highlighted-line',
          glyphMarginClassName: 'monaco-highlighted-glyph',
        },
      }));

      editor.createDecorationsCollection(decorations);
    }

    // 添加自定义CSS
    const styleId = 'monaco-editor-custom-styles';
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = `
        .monaco-highlighted-line {
          background-color: rgba(255, 255, 0, 0.2);
        }
        .monaco-highlighted-glyph {
          background-color: gold;
          width: 4px !important;
          margin-left: 3px;
        }
        .monaco-editor-container {
          position: relative;
          border-radius: 0.375rem;
          overflow: hidden;
        }
      `;
      document.head.appendChild(styleElement);
    }

    // 聚焦编辑器（如果不是只读模式）
    if (!readOnly) {
      editor.focus();
    }
  };

  // 处理编辑器内容变更
  const handleEditorChange: EditorProps['onChange'] = (value) => {
    if (onChange && value !== undefined) {
      onChange(value);
    }
  };

  // 确定要使用的主题
  const editorTheme = useMemo(() => {
    if (theme === 'dark') return 'vs-dark';
    if (theme === 'light') return 'vs-light';
    return theme;
  }, [theme]);

  return (
    <div className={`monaco-editor-container ${className}`} style={{ width, height }}>
      <Editor
        height="100%"
        width="100%"
        language={language}
        value={value}
        onChange={handleEditorChange}
        theme={editorTheme}
        options={computedEditorOptions}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full text-gray-400">
            {t('加载编辑器...')}
          </div>
        }
        className="rounded-md overflow-hidden"
      />
      {!value && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
          {t('无代码内容')}
        </div>
      )}
    </div>
  );
};

export default CodeEditor;

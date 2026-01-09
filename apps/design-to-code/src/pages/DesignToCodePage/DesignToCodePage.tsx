import React, { useState, useEffect, useMemo } from 'react';
import { Button, Form, Input, NavBar, Tabs, Toast, Space, Dialog } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import yaml from 'js-yaml';
import MarkdownIt from 'markdown-it';
import { useDesignToCodeStore } from '../../stores/designToCodeStore';
import { getFigmaFile, getFigmaNodes } from '../../api/figma';
import { processFigmaData } from '../../services/figmaProcessor';
import { CodeEditor } from '../../components/CodeEditor';
import { CodeGenerationOptions } from '../../services/codeGenerator';
import { generateAICode } from '../../services/aiCodeService';
import { saveComponent, getComponents } from '../../services/componentManager';

// 创建MarkdownIt实例
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const DesignToCodePage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('figma');
  const [componentName, setComponentName] = useState('');
  const [codeOptions, setCodeOptions] = useState<CodeGenerationOptions>({
    componentName: 'MyComponent',
    useAntd: true,
    isResponsive: true,
    useI18n: true,
    isTs: true,
    styleFramework: 'tailwind',
  });
  const [selectedFileContent, setSelectedFileContent] = useState<string>('');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [yamlContent, setYamlContent] = useState<string>('');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');

  // 全局状态
  const {
    figmaToken,
    figmaFileId,
    figmaData,
    processedNodes,
    isLoadingFigmaData,
    figmaError,
    generatedComponent,
    isGeneratingCode,
    codeGenerationError,
    rawAiResponse,
    savedComponents,
    setFigmaToken,
    setFigmaFileId,
    setFigmaData,
    setProcessedNodes,
    setIsLoadingFigmaData,
    setFigmaError,
    setGeneratedComponent,
    setIsGeneratingCode,
    setCodeGenerationError,
    setRawAiResponse,
    setSavedComponents,
    resetFigmaState,
    resetCodeGenerationState,
  } = useDesignToCodeStore();

  // 初始加载保存的组件
  useEffect(() => {
    setSavedComponents(getComponents());
  }, [setSavedComponents]);

  // 从Figma获取设计数据
  const fetchFigmaData = async () => {
    if (!figmaFileId || !figmaToken) {
      Toast.show({
        content: t('请输入Figma文件ID和访问令牌'),
        position: 'bottom',
      });
      return;
    }

    setIsLoadingFigmaData(true);
    setFigmaError(null);

    try {
      // 获取Figma文件数据（现在返回的是 SimplifiedDesign 数据结构）
      // 根据是否有选中节点ID决定获取特定节点还是整个文件
      const simplifiedData = selectedNodeId
        ? await getFigmaNodes(figmaFileId, [selectedNodeId], figmaToken)
        : await getFigmaFile(figmaFileId, figmaToken);

      console.log('SimplifiedData', simplifiedData);
      setFigmaData(simplifiedData);

      // 处理Figma数据（processFigmaData 已更新为接收 SimplifiedDesign 类型）
      const processed = processFigmaData(simplifiedData);
      setProcessedNodes(processed);

      // 生成YAML格式
      const { nodes, globalVars, ...metadata } = simplifiedData;
      const yamlData = {
        metadata,
        nodes,
        globalVars,
      };
      const yamlString = yaml.dump(yamlData);
      setYamlContent(yamlString);

      Toast.show({
        icon: 'success',
        content: t('成功获取Figma设计数据'),
      });

      // 切换到代码生成标签页
      setActiveTab('code');
    } catch (error) {
      console.error('获取Figma数据失败:', error);
      setFigmaError(error instanceof Error ? error.message : String(error));

      Toast.show({
        icon: 'fail',
        content: t('获取Figma数据失败'),
      });
    } finally {
      setIsLoadingFigmaData(false);
    }
  };

  // 生成代码
  const generateCode = async () => {
    if (!componentName) {
      Toast.show({
        content: t('请输入组件名称'),
        position: 'bottom',
      });
      return;
    }

    if (processedNodes.length === 0) {
      Toast.show({
        content: t('没有可用的Figma设计数据'),
        position: 'bottom',
      });
      return;
    }

    setIsGeneratingCode(true);
    setCodeGenerationError(null);

    try {
      // 准备代码生成选项
      const options: CodeGenerationOptions = {
        ...codeOptions,
        componentName,
      };

      // 使用AI代码生成服务
      const component = await generateAICode({
        nodes: processedNodes,
        options,
        yamlData: yamlContent, // 添加YAML数据作为输入
      });

      setGeneratedComponent(component);
      // 保存AI原始响应
      setRawAiResponse(component.rawResponse || null);

      // 切换到预览标签页
      setActiveTab('preview');

      // 默认显示组件文件内容
      setSelectedFileContent(component.componentFile);
      setSelectedFileName(`${componentName}.tsx`);

      Toast.show({
        icon: 'success',
        content: t('代码生成成功'),
      });
    } catch (error) {
      console.error('代码生成失败:', error);
      setCodeGenerationError(error instanceof Error ? error.message : String(error));

      Toast.show({
        icon: 'fail',
        content: t('代码生成失败'),
      });
    } finally {
      setIsGeneratingCode(false);
    }
  };

  // 保存生成的组件
  const saveGeneratedComponent = () => {
    if (!generatedComponent) {
      Toast.show({
        content: t('没有可保存的组件'),
        position: 'bottom',
      });
      return;
    }

    // 直接调用保存组件的函数，不存储返回值
    saveComponent(generatedComponent, figmaFileId || undefined);

    // 更新保存的组件列表
    setSavedComponents(getComponents());

    Toast.show({
      icon: 'success',
      content: t('组件保存成功'),
    });

    // 切换到组件列表标签页
    setActiveTab('components');
  };

  // 显示文件内容
  const showFileContent = (fileName: string, content: string) => {
    setSelectedFileName(fileName);
    setSelectedFileContent(content);
  };

  // 导出YAML数据
  const exportYamlData = () => {
    if (!yamlContent) {
      Toast.show({
        content: t('没有可导出的YAML数据'),
        position: 'bottom',
      });
      return;
    }

    // 创建Blob对象
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `figma-data-${figmaFileId}.yaml`;
    document.body.appendChild(a);
    a.click();
    // 清理
    URL.revokeObjectURL(url);
    document.body.removeChild(a);

    Toast.show({
      icon: 'success',
      content: t('YAML数据导出成功'),
    });
  };

  // 重置
  const handleReset = () => {
    Dialog.confirm({
      content: t('确定要重置所有数据吗？'),
      onConfirm: () => {
        resetFigmaState();
        resetCodeGenerationState();
        setComponentName('');
        setActiveTab('figma');
        setSelectedFileContent('');
        setSelectedFileName('');
        setYamlContent('');
        setSelectedNodeId('');
        setRawAiResponse(null);

        Toast.show({
          content: t('已重置所有数据'),
        });
      },
    });
  };

  // 渲染Figma数据获取表单
  const renderFigmaForm = () => (
    <div className="p-4">
      <Form layout="vertical">
        <Form.Item label={t('Figma访问令牌')} help={t('在Figma账户设置中获取个人访问令牌')}>
          <Input
            placeholder={t('输入Figma访问令牌')}
            value={figmaToken || ''}
            onChange={(value) => setFigmaToken(value)}
          />
        </Form.Item>

        <Form.Item label={t('Figma文件ID')} help={t('从Figma文件URL中获取ID')}>
          <Input
            placeholder={t('例如: FmAvvwUDGqFsumzCG9rKyo')}
            value={figmaFileId || ''}
            onChange={(value) => setFigmaFileId(value)}
          />
        </Form.Item>

        <Form.Item label={t('节点ID（可选）')} help={t('留空获取整个文件，或输入特定节点ID')}>
          <Input
            placeholder={t('例如: 10:2')}
            value={selectedNodeId}
            onChange={(value) => setSelectedNodeId(value)}
          />
        </Form.Item>

        <Button
          color="primary"
          block
          onClick={fetchFigmaData}
          loading={isLoadingFigmaData}
          disabled={isLoadingFigmaData}
        >
          {isLoadingFigmaData ? t('正在获取数据') : t('获取设计数据')}
        </Button>

        {figmaError && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md">{figmaError}</div>
        )}
      </Form>

      {figmaData && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md">
          <div className="font-bold">{t('成功获取文件')}:</div>
          <div className="mt-1">{figmaData.name}</div>
          <div className="mt-1 text-sm text-gray-500">
            {t('共')} {processedNodes.length} {t('个设计节点')}
          </div>
        </div>
      )}
    </div>
  );

  // 渲染YAML数据查看器
  const renderYamlViewer = () => (
    <div className="p-4">
      <div className="mb-4 flex justify-end">
        <Button color="primary" size="small" onClick={exportYamlData} disabled={!yamlContent}>
          {t('导出YAML')}
        </Button>
      </div>

      {yamlContent ? (
        <div className="border rounded-md">
          <CodeEditor value={yamlContent} language="yaml" readOnly height="600px" />
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500">
          {t('没有可用的YAML数据，请先获取Figma设计数据')}
        </div>
      )}
    </div>
  );

  // 渲染代码生成表单
  const renderCodeGenerationForm = () => (
    <div className="p-4">
      <Form layout="vertical">
        <Form.Item label={t('组件名称')} help={t('使用大驼峰命名法')}>
          <Input
            placeholder={t('例如: UserProfile')}
            value={componentName}
            onChange={(value) => setComponentName(value)}
          />
        </Form.Item>

        <div className="mb-4">
          <div className="mb-2 font-medium">{t('代码生成选项')}</div>

          <Space direction="vertical" block>
            <div className="flex justify-between items-center">
              <span>{t('使用Ant Design Mobile')}</span>
              <div
                className={`w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${codeOptions.useAntd ? 'bg-blue-500' : 'bg-gray-300'}`}
                onClick={() => setCodeOptions({ ...codeOptions, useAntd: !codeOptions.useAntd })}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transform transition-transform duration-200 m-0.5 ${codeOptions.useAntd ? 'translate-x-6' : 'translate-x-0'}`}
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span>{t('响应式布局')}</span>
              <div
                className={`w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${codeOptions.isResponsive ? 'bg-blue-500' : 'bg-gray-300'}`}
                onClick={() =>
                  setCodeOptions({ ...codeOptions, isResponsive: !codeOptions.isResponsive })
                }
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transform transition-transform duration-200 m-0.5 ${codeOptions.isResponsive ? 'translate-x-6' : 'translate-x-0'}`}
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span>{t('国际化支持')}</span>
              <div
                className={`w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${codeOptions.useI18n ? 'bg-blue-500' : 'bg-gray-300'}`}
                onClick={() => setCodeOptions({ ...codeOptions, useI18n: !codeOptions.useI18n })}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transform transition-transform duration-200 m-0.5 ${codeOptions.useI18n ? 'translate-x-6' : 'translate-x-0'}`}
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span>{t('使用TypeScript')}</span>
              <div
                className={`w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${codeOptions.isTs ? 'bg-blue-500' : 'bg-gray-300'}`}
                onClick={() => setCodeOptions({ ...codeOptions, isTs: !codeOptions.isTs })}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transform transition-transform duration-200 m-0.5 ${codeOptions.isTs ? 'translate-x-6' : 'translate-x-0'}`}
                />
              </div>
            </div>
          </Space>
        </div>

        <Button
          color="primary"
          block
          onClick={generateCode}
          loading={isGeneratingCode}
          disabled={isGeneratingCode || processedNodes.length === 0}
        >
          {isGeneratingCode
            ? `${t('正在生成')} ${componentName ? componentName : t('组件')}`
            : t('生成代码')}
        </Button>

        {codeGenerationError && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md">{codeGenerationError}</div>
        )}
      </Form>
    </div>
  );

  // 渲染预览内容
  const renderPreview = () => {
    if (!generatedComponent) {
      return <div className="p-8 text-center text-gray-500">{t('请先生成组件代码')}</div>;
    }

    return (
      <div className="p-4">
        <div className="mb-4">
          <div className="text-lg font-bold mb-2">{generatedComponent.componentName}</div>

          <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
            <Button
              color="primary"
              fill="outline"
              size="small"
              onClick={() =>
                showFileContent(
                  `${generatedComponent.componentName}.tsx`,
                  generatedComponent.componentFile
                )
              }
            >
              {generatedComponent.componentName}.tsx
            </Button>

            <Button
              color="primary"
              fill="outline"
              size="small"
              onClick={() => showFileContent('interface.ts', generatedComponent.interfaceFile)}
            >
              interface.ts
            </Button>

            <Button
              color="primary"
              fill="outline"
              size="small"
              onClick={() => showFileContent('index.ts', generatedComponent.indexFile)}
            >
              index.ts
            </Button>

            <Button
              color="primary"
              fill="outline"
              size="small"
              onClick={() => showFileContent('helpers.ts', generatedComponent.helpersFile)}
            >
              helpers.ts
            </Button>
          </div>

          <div className="mb-4">
            <div className="text-sm font-medium mb-1">{selectedFileName}</div>
            <CodeEditor
              value={selectedFileContent}
              language={selectedFileName.endsWith('.ts') ? 'typescript' : 'tsx'}
              readOnly
              height="400px"
            />
          </div>

          <Space block justify="center">
            <Button color="primary" onClick={saveGeneratedComponent}>
              {t('保存组件')}
            </Button>

            <Button onClick={() => setActiveTab('code')}>{t('返回编辑')}</Button>
          </Space>
        </div>
      </div>
    );
  };

  // 渲染AI响应内容
  const RenderAiResponse = () => {
    console.log('rawAiResponse', rawAiResponse);

    // 使用MarkdownIt渲染AI响应 - 必须在条件判断之前调用 Hook
    const renderedHtml = useMemo(() => {
      return rawAiResponse ? md.render(rawAiResponse) : '';
    }, [rawAiResponse]);

    if (!rawAiResponse) {
      return <div className="p-8 text-center text-gray-500">{t('暂无AI响应内容')}</div>;
    }

    return (
      <div className="p-4">
        <div className="mb-4 flex justify-between items-center">
          <div className="text-lg font-bold">{t('AI原始响应')}</div>
          <Space>
            <Button
              size="small"
              onClick={() => {
                if (!rawAiResponse) return;

                const blob = new Blob([rawAiResponse], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${componentName || 'ai-response'}-response.md`;
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(url);
                document.body.removeChild(a);

                Toast.show({
                  icon: 'success',
                  content: t('导出成功'),
                });
              }}
            >
              {t('导出Markdown')}
            </Button>

            <Button
              size="small"
              onClick={() => {
                if (!rawAiResponse) return;

                setSelectedFileContent(rawAiResponse);
                setSelectedFileName('ai-response.md');
                setActiveTab('preview');
              }}
            >
              {t('查看源码')}
            </Button>
          </Space>
        </div>

        <div className="border rounded-md p-4 bg-white overflow-auto max-h-[70vh]">
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        </div>
      </div>
    );
  };

  // 渲染组件列表
  const renderComponentsList = () => (
    <div className="p-4">
      {savedComponents.length === 0 ? (
        <div className="p-8 text-center text-gray-500">{t('没有保存的组件')}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {savedComponents.map((comp) => (
            <div key={comp.id} className="border rounded-md p-3">
              <div className="font-bold">{comp.name}</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(comp.generatedAt).toLocaleString()}
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  size="small"
                  color="primary"
                  fill="outline"
                  onClick={() => {
                    setGeneratedComponent(comp.component);
                    setActiveTab('preview');
                    setSelectedFileContent(comp.component.componentFile);
                    setSelectedFileName(`${comp.component.componentName}.tsx`);
                  }}
                >
                  {t('查看')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <NavBar
        back={null}
        right={
          <Button size="small" fill="none" onClick={handleReset}>
            {t('重置')}
          </Button>
        }
      >
        {t('Figma to Code')}
      </NavBar>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="flex-1 flex flex-col">
        <Tabs.Tab title={t('Figma数据')} key="figma">
          {renderFigmaForm()}
        </Tabs.Tab>

        <Tabs.Tab title={t('YAML查看')} key="yaml" disabled={!yamlContent}>
          {renderYamlViewer()}
        </Tabs.Tab>

        <Tabs.Tab title={t('代码生成')} key="code" disabled={processedNodes.length === 0}>
          {renderCodeGenerationForm()}
        </Tabs.Tab>

        <Tabs.Tab title={t('预览')} key="preview" disabled={!generatedComponent}>
          {renderPreview()}
        </Tabs.Tab>

        <Tabs.Tab title={t('AI响应')} key="ai-response" disabled={!rawAiResponse}>
          <RenderAiResponse />
        </Tabs.Tab>

        <Tabs.Tab title={t('已保存组件')} key="components">
          {renderComponentsList()}
        </Tabs.Tab>
      </Tabs>
    </div>
  );
};

export default DesignToCodePage;

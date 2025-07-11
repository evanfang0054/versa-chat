```ts
import { http } from '@/utils/request';

  http
      .post(
        '/api/chat/completions',
        {
          messages: [
            {
              content: TRAVEL_ASSISTANT_PROMPT,
              role: 'system',
            },
            ...messages
              // .filter((item: ChatMessage) => item.sender === 'user')
              .map((item: ChatMessage) => ({
                content:
                  item.type === 'text'
                    ? (item as TextMessage).content || ''
                    : (item as PluginMessage).data.content || '',
                role: item.sender,
              })),
            {
              content,
              role: 'user',
            },
          ],
          model: import.meta.env.VITE_MODEL,
          frequency_penalty: 0,
          max_tokens: 2048,
          presence_penalty: 0,
          response_format: {
            type: 'text',
          },
          stop: null,
          stream: false,
        },
        {
          requestId: requestSessionId,
          errorHandling: {
            showErrorMessage: true,
            ignoreBusinessError: true,
          },
        }
      )
      .then((res) => {
        const assistantMessage: PluginMessage = {
          id: (Date.now() + 1).toString(),
          type: 'richText',
          sender: 'assistant',
          data: {
            content: res.choices?.[0].message.content || '',
          },
          timestamp: new Date(),
        };
        addMessage(assistantMessage, requestSessionId); // 使用请求时的会话ID
        console.log('deepseek-chat res', res);
      })
      .catch((err) => {
        console.log('deepseek-chat err', err);
      })
      .finally(() => {
        setLoading(false, requestSessionId);
      });

    模拟回复
    setTimeout(() => {
      const assistantMessage: PluginMessage = {
        id: (Date.now() + 1).toString(),
        type: 'card',
        sender: 'assistant',
        data: {
          title: '推荐服务',
          content: '我们为您推荐以下礼宾车服务...',
        },
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setLoading(false);
    }, 5000);
```
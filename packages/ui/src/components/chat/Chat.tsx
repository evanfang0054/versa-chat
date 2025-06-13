import { useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { registerPlugins } from './plugins';
import { type ChatProps } from './interface';
import { useAutoScroll } from './hooks/useAutoScroll';
import { MessageItem } from './components/MessageItem';

export function Chat({
  messages,
  plugins = [],
  globalData = {},
  className = '',
  roles,
}: ChatProps) {
  const allPlugins = useMemo(() => registerPlugins(plugins), [plugins]);
  const virtuosoRef = useAutoScroll([messages], 'LAST');

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <Virtuoso
        className="flex-1 overflow-x-hidden"
        ref={virtuosoRef}
        totalCount={messages.length}
        itemContent={(index) => {
          const msg = messages[index];
          return (
            <MessageItem
              key={msg.id}
              message={msg}
              index={index}
              messages={messages}
              globalData={globalData}
              roles={roles}
              plugins={allPlugins}
            />
          );
        }}
      />
    </div>
  );
}

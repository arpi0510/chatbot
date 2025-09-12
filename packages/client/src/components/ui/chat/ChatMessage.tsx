import ReactMarkdown from 'react-markdown';
import { useEffect, useRef } from 'react';

type Props = {
  messages: Message[];
};

export type Message = {
  message: string;
  role: string;
};

const ChatMessage = ({ messages }: Props) => {
  const onCopyHandler = (e: React.ClipboardEvent) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', selection);
    }
  };

  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col gap-2">
      {messages.map((m, index) => (
        <div
          key={index}
          ref={index === messages.length - 1 ? lastMessageRef : null}
          onCopy={onCopyHandler}
          className={`px-3 py-1 rounded-xl ${m.role === 'user' ? 'bg-blue-800 text-white self-end' : 'bg-gray-400 text-black self-start'}`}
        >
          <ReactMarkdown>{m.message}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

export default ChatMessage;

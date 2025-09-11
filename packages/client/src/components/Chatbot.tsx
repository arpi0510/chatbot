import axios from 'axios';
import ReactMarkdown from 'react-markdown';

import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

type FormData = {
  prompt: string;
};

type Message = {
  message: string;
  role: string;
};

const Chatbot = () => {
  const conversationId = useRef(crypto.randomUUID());
  const { register, handleSubmit, reset, formState } = useForm<FormData>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string>('');

  const [isBotTyping, setIsBotTyping] = useState<Boolean>(false);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSubmit = async ({ prompt }: FormData) => {
    try {
      setIsBotTyping(true);
      setError('');
      setMessages([...messages, { message: prompt, role: 'user' }]);
      reset({ prompt: '' });
      const payload = {
        prompt: prompt,
        conversationId: conversationId.current,
      };
      const apiResp = await axios.post('/api/chat', payload);
      setMessages([
        ...messages,
        { message: prompt, role: 'user' },
        { message: apiResp.data.message, role: 'bot' },
      ]);
    } catch (error) {
      setError('Something went wrong. Please try again !');
      console.error(error);
    } finally {
      setIsBotTyping(false);
    }
  };

  const onKeyDownHandler = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key == 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const onCopyHandler = (e: React.ClipboardEvent) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', selection);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 gap-3 mb-4 h-full overflow-y-auto">
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
        {isBotTyping && (
          <div className="flex gap-1 bg-gray-200 px-3 py-3 rounded-3xl self-start">
            <div className="w-2 h-2 rounded-2xl bg-gray-800 animate-bounce"></div>
            <div className="w-2 h-2 rounded-2xl bg-gray-800 animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 rounded-2xl bg-gray-800 animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={onKeyDownHandler}
        className="flex flex-col gap-2 items-end border-2 p-3 rounded-3xl"
      >
        <textarea
          {...register('prompt', {
            required: true,
            validate: (message) => message.trim().length > 0,
          })}
          autoFocus
          className="w-full border-0 focus:outline-0 resize-none"
          placeholder="Ask anything"
          maxLength={1000}
        ></textarea>
        <Button disabled={!formState.isValid} className="w-9 h-9 rounded-3xl">
          <FaArrowUp />
        </Button>
      </form>
    </div>
  );
};

export default Chatbot;

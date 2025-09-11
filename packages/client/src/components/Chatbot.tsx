import axios from 'axios';
import ReactMarkdown from 'react-markdown';

import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { useRef, useState, type KeyboardEvent } from 'react';

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
  const [isBotTyping, setIsBotTyping] = useState<Boolean>(false);

  const onSubmit = async ({ prompt }: FormData) => {
    setIsBotTyping(true);
    setMessages([...messages, { message: prompt, role: 'user' }]);
    reset();
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
    setIsBotTyping(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key == 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 mb-4">
        {messages.map((m, index) => (
          <p
            key={index}
            className={`px-3 py-1 rounded-xl ${m.role === 'user' ? 'bg-blue-800 text-white self-end' : 'bg-gray-400 text-black self-start'}`}
          >
            <ReactMarkdown>{m.message}</ReactMarkdown>
          </p>
        ))}
        {isBotTyping && (
          <div className="flex gap-1 bg-gray-200 px-3 py-3 rounded-3xl self-start">
            <div className="w-2 h-2 rounded-2xl bg-gray-800 animate-bounce"></div>
            <div className="w-2 h-2 rounded-2xl bg-gray-800 animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 rounded-2xl bg-gray-800 animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={onKeyDown}
        className="flex flex-col gap-2 items-end border-2 p-3 rounded-3xl"
      >
        <textarea
          {...register('prompt', {
            required: true,
            validate: (message) => message.trim().length > 0,
          })}
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

import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import TypingIndicator from './TypingIndicator';
import ChatMessage, { type Message } from './ChatMessage';
import ChatForm, { type ChatFormData } from './ChatForm';

const Chatbot = () => {
  const conversationId = useRef(crypto.randomUUID());
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string>('');

  const [isBotTyping, setIsBotTyping] = useState<Boolean>(false);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSubmit = async ({ prompt }: ChatFormData) => {
    try {
      setIsBotTyping(true);
      setError('');
      setMessages([...messages, { message: prompt, role: 'user' }]);
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 gap-3 mb-4 h-full overflow-y-auto">
        <ChatMessage messages={messages} />
        {isBotTyping && <TypingIndicator />}
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <ChatForm onSubmitCallback={onSubmit} />
    </div>
  );
};

export default Chatbot;

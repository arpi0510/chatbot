import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa';
import type { KeyboardEvent } from 'react';

type FormData = {
  prompt: string;
};

const Chatbot = () => {
  const { register, handleSubmit, reset, formState } = useForm<FormData>();
  const onSubmit = (data: FormData) => {
    console.log(data);
    reset();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key == 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
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
  );
};

export default Chatbot;

import { type KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import { FaArrowUp } from 'react-icons/fa';
import { Button } from '../button';

export type ChatFormData = {
  prompt: string;
};

type Props = {
  onSubmitCallback: (chatFormData: ChatFormData) => void;
};

const ChatForm = ({ onSubmitCallback }: Props) => {
  const { register, handleSubmit, reset, formState } = useForm<ChatFormData>();

  const onKeyDownHandler = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key == 'Enter' && !e.shiftKey) {
      e.preventDefault();
      formSubmitHandler();
    }
  };

  const formSubmitHandler = handleSubmit((data) => {
    reset({ prompt: '' });
    onSubmitCallback(data);
  });

  return (
    <form
      onSubmit={formSubmitHandler}
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
  );
};

export default ChatForm;

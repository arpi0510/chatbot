const TypingIndicator = () => {
  return (
    <div className="flex gap-1 bg-gray-200 px-3 py-3 rounded-3xl self-start">
      <div className="w-2 h-2 rounded-2xl bg-gray-800 animate-bounce"></div>
      <div className="w-2 h-2 rounded-2xl bg-gray-800 animate-bounce [animation-delay:0.2s]"></div>
      <div className="w-2 h-2 rounded-2xl bg-gray-800 animate-bounce [animation-delay:0.4s]"></div>
    </div>
  );
};

export default TypingIndicator;

import { useState } from 'react';
import { useAddParticipants, useGetParticipants } from '../shared/api/rtkApi';
import { cn } from '../lib/utils';

const Button = ({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      className={cn(
        'size-10 border-[#F7F4FB] text-[#F7F4FB] border-2 rounded-full',
        disabled && 'opacity-50'
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const SettingPage = () => {
  const [addParticipants, { isLoading }] = useAddParticipants();
  const { data } = useGetParticipants();

  const [count, setCount] = useState(1);

  const handleAddParticipants = async (count: number) => {
    try {
      const result = await addParticipants({ count }).unwrap();
      console.log(result);
      setCount(1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleIncrement = (countNumber: number) => {
    setCount((prev) => prev + countNumber);
  };

  const handleDecrement = (countNumber: number) => {
    if (count <= 0) return;
    setCount((prev) => prev - countNumber);
  };

  return (
    <div className="flex flex-col gap-12 px-6 ">
      <div className="text-xl text-[#F7F4FB] text-center mt-6">
        Всего участников: {data?.length}
      </div>

      <div className="flex justify-between gap-2">
        <Button onClick={() => handleDecrement(100)} disabled={count <= 100}>
          -100
        </Button>
        <Button onClick={() => handleDecrement(10)} disabled={count <= 10}>
          -10
        </Button>
        <Button onClick={() => handleDecrement(1)} disabled={count <= 1}>
          -1
        </Button>
        <div className="text-3xl text-[#F7F4FB]">{count}</div>
        <Button onClick={() => handleIncrement(1)}>+1</Button>
        <Button onClick={() => handleIncrement(10)}>+10</Button>
        <Button onClick={() => handleIncrement(100)}>+100</Button>
      </div>

      <button
        className="bg-[#F7F4FB] text-black px-4 py-2 rounded-full"
        onClick={() => handleAddParticipants(count)}
      >
        Добавить {count}
      </button>
    </div>
  );
};

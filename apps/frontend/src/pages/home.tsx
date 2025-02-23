import { useContext, useState } from 'react';
import { cn } from '../lib/utils';
import {
  Participant,
  useGetParticipants,
  useToggleStatus,
} from '../shared/api/rtkApi';
import { motion } from 'framer-motion';
import { SearchContext } from '../provider/searchProvider';

const Spinner = () => {
  return (
    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black" />
  );
};

const Badge = ({
  children,
  onClick,
  isLoading,
}: {
  children: React.ReactNode;
  onClick: () => void;
  isLoading: boolean;
}) => {
  return (
    <button
      className={cn(
        'rounded-full px-1 w-[18%] py-3 border-[#F7F4FB] border-2 bg-[#F7F4FB] flex items-center justify-center'
      )}
      onClick={onClick}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

const ActiveScreen = ({
  activeParticipants,
  handleToggleStatus,
  isToggling,
  focusId,
}: {
  activeParticipants: Participant[];
  handleToggleStatus: (id: string) => void;
  isToggling: boolean;
  focusId: string | null;
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {activeParticipants.map((participant) => (
        <Badge
          key={participant.id}
          onClick={() => handleToggleStatus(participant.id)}
          isLoading={isToggling && focusId === participant.id}
        >
          {participant.id}
        </Badge>
      ))}
      {activeParticipants.length === 0 && (
        <span className="text-center w-full text-xl text-[#F7F4FB]">
          Ничего не найдено
        </span>
      )}
    </div>
  );
};

const DisabledScreen = ({
  disabledParticipants,
  handleToggleStatus,
  isToggling,
  focusId,
}: {
  disabledParticipants: Participant[];
  handleToggleStatus: (id: string) => void;
  isToggling: boolean;
  focusId: string | null;
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {disabledParticipants.map((participant) => (
        <Badge
          key={participant.id}
          onClick={() => handleToggleStatus(participant.id)}
          isLoading={isToggling && focusId === participant.id}
        >
          {participant.id}
        </Badge>
      ))}
      {disabledParticipants.length === 0 && (
        <span className="text-center w-full text-xl text-[#F7F4FB]">
          Ничего не найдено
        </span>
      )}
    </div>
  );
};

export const HomePage = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'disabled'>('active');

  const { data, isLoading, error } = useGetParticipants();
  const [focusId, setFocusId] = useState<string | null>(null);
  const [toggleStatus, { isLoading: isToggling }] = useToggleStatus();
  const { search } = useContext(SearchContext);

  const handleToggleStatus = async (id: string) => {
    if (!id) {
      console.error('No id');
      return;
    }
    if (isToggling) return;
    setFocusId(id);

    try {
      const response = await toggleStatus({ id }).unwrap();
      console.log(response);
    } catch (error) {
      console.error(error);
    }

    setFocusId(null);
  };

  const filteredData = data?.filter((participant) =>
    participant.id.toString().toLowerCase().includes(search.toLowerCase())
  );

  const activeParticipants =
    filteredData?.filter((participant) => participant.status === 'active') ??
    [];
  const disabledParticipants =
    filteredData?.filter((participant) => participant.status === 'disabled') ??
    [];

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="relative z-30 flex grow flex-col gap-6 pt-2">
        <div className="relative grow">
          <div className="absolute inset-0 flex flex-col gap-6 overflow-scroll px-6 pb-10">
            <div className="grid w-full grid-cols-2 gap-1 rounded-xl bg-[#00000066] p-1">
              <div
                className="relative grid place-items-center py-3"
                onClick={() => setActiveTab('active')}
              >
                {activeTab === 'active' && (
                  <motion.div
                    layoutId="active-tab-select"
                    className="absolute inset-0 rounded-xl bg-[#502c7e]"
                  />
                )}
                <span className="z-20 text-[#F7F4FB]">Участники</span>
              </div>
              <div
                className="relative grid place-items-center py-3"
                onClick={() => setActiveTab('disabled')}
              >
                {activeTab === 'disabled' && (
                  <motion.div
                    layoutId="disabled-tab-select"
                    className="absolute inset-0 rounded-xl bg-[#502c7e]"
                  />
                )}
                <span className="z-20 text-[#F7F4FB]">Выбывшие</span>
              </div>
            </div>
            {activeTab === 'active' ? (
              <ActiveScreen
                activeParticipants={activeParticipants}
                handleToggleStatus={handleToggleStatus}
                isToggling={isToggling}
                focusId={focusId}
              />
            ) : (
              <DisabledScreen
                disabledParticipants={disabledParticipants}
                handleToggleStatus={handleToggleStatus}
                isToggling={isToggling}
                focusId={focusId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

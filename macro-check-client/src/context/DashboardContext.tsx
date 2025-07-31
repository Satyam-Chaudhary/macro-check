import React, { createContext, useContext, useState, useRef } from 'react';
import { LogSheetRef } from '@/screens/main/LogScreen';
import { SetGoalSheetRef } from '@/screens/main/SetGoalScreen';

type DashboardContextType = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  logSheetRef: React.RefObject<LogSheetRef | null>;
  setGoalSheetRef: React.RefObject<SetGoalSheetRef | null>;
};

const DashboardContext = createContext<DashboardContextType>({
  selectedDate: new Date(),
  setSelectedDate: () => {},
  logSheetRef: { current: null },
  setGoalSheetRef: { current: null },
});

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const logSheetRef = useRef<LogSheetRef>(null);
  const setGoalSheetRef = useRef<SetGoalSheetRef>(null);

  return (
    <DashboardContext.Provider value={{ selectedDate, setSelectedDate, logSheetRef, setGoalSheetRef }}>
      {children}
    </DashboardContext.Provider>
  );
};
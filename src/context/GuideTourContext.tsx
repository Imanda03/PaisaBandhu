import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getItem, setItem } from '../assets/storage';

const TOUR_SEEN_KEY = 'GUIDE_TOUR_SEEN';

export type TourStep = 0 | 1 | 2 | 3;
export type TargetLayout = { x: number; y: number; width: number; height: number };

type GuideTourContextType = {
  tourStep: TourStep;
  tourComplete: boolean;
  targetLayout: TargetLayout | null;
  label: string;
  setTargetLayout: (layout: TargetLayout | null, label: string) => void;
  goNextStep: () => void;
  finishTour: () => void;
  startTour: () => void;
  skipTour: () => void;
};

const defaultContext: GuideTourContextType = {
  tourStep: 0,
  tourComplete: true,
  targetLayout: null,
  label: '',
  setTargetLayout: () => {},
  goNextStep: () => {},
  finishTour: () => {},
  startTour: () => {},
  skipTour: () => {},
};

const GuideTourContext = createContext<GuideTourContextType>(defaultContext);

const TOUR_LABELS: Record<TourStep, string> = {
  0: '',
  1: 'Tap here to open Books',
  2: 'Tap + to create your first book',
  3: 'Tap a book to open it, then add Income or Expense',
};

export function GuideTourProvider({ children }: { children: React.ReactNode }) {
  const [tourStep, setTourStep] = useState<TourStep>(0);
  const [tourComplete, setTourComplete] = useState(true);
  const [targetLayout, setTargetLayoutState] = useState<TargetLayout | null>(null);
  const [label, setLabel] = useState('');

  useEffect(() => {
    let mounted = true;
    getItem(TOUR_SEEN_KEY).then((seen) => {
      if (mounted) setTourComplete(seen === 'true');
    });
    return () => { mounted = false; };
  }, []);

  const setTargetLayout = useCallback((layout: TargetLayout | null, l: string) => {
    setTargetLayoutState(layout);
    if (layout !== null || l !== '') {
      setLabel(l || '');
    }
  }, []);

  const persistComplete = useCallback(async () => {
    setTourComplete(true);
    setTourStep(0);
    setTargetLayoutState(null);
    setLabel('');
    try {
      await setItem(TOUR_SEEN_KEY, 'true');
    } catch {}
  }, []);

  const goNextStep = useCallback(() => {
    setTourStep((s) => {
      const next = (s + 1) as TourStep;
      if (next > 3) {
        persistComplete();
        return 0;
      }
      setTargetLayoutState(null);
      setLabel(TOUR_LABELS[next] || '');
      return next;
    });
  }, [persistComplete]);

  const finishTour = useCallback(() => {
    persistComplete();
  }, [persistComplete]);

  const startTour = useCallback(() => {
    setTourComplete(false);
    setTourStep(1);
    setLabel(TOUR_LABELS[1]);
  }, []);

  const skipTour = useCallback(() => {
    persistComplete();
  }, [persistComplete]);

  const value: GuideTourContextType = {
    tourStep,
    tourComplete,
    targetLayout,
    label,
    setTargetLayout,
    goNextStep,
    finishTour,
    startTour,
    skipTour,
  };

  return (
    <GuideTourContext.Provider value={value}>
      {children}
    </GuideTourContext.Provider>
  );
}

export function useGuideTour() {
  const ctx = useContext(GuideTourContext);
  if (!ctx) throw new Error('useGuideTour must be used within GuideTourProvider');
  return ctx;
}

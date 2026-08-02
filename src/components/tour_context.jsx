import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";

const TourContext = createContext(null);

const STORAGE_KEY = "codemarket_tour_seen_v1";

export function TourProvider({ children }) {
  const [running, setRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);
  const registryRef = useRef({}); // key -> setter function exposed by each screen

  // Register a screen's local "go to page X" setter under a key.
  // Screens call this via useTourRegister on mount.
  const register = useCallback((key, fn) => {
    registryRef.current[key] = fn;
    return () => {
      if (registryRef.current[key] === fn) {
        delete registryRef.current[key];
      }
    };
  }, []);

  const startTour = useCallback((builtSteps) => {
    if (!builtSteps || builtSteps.length === 0) return;
    setSteps(builtSteps);
    setStepIndex(0);
    setRunning(true);
  }, []);

  const finishTour = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    setRunning(false);
  }, []);

  const nextStep = useCallback(() => {
    setStepIndex((i) => {
      if (i >= steps.length - 1) {
        finishTour();
        return i;
      }
      return i + 1;
    });
  }, [steps, finishTour]);

  const prevStep = useCallback(() => {
    setStepIndex((i) => Math.max(0, i - 1));
  }, []);

  const hasSeenTour = useCallback(() => {
    return !!localStorage.getItem(STORAGE_KEY);
  }, []);

  const resetTourSeen = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <TourContext.Provider
      value={{
        running,
        stepIndex,
        steps,
        registry: registryRef,
        register,
        startTour,
        finishTour,
        nextStep,
        prevStep,
        hasSeenTour,
        resetTourSeen,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return ctx;
}

// Lets any screen expose a "navigate to local page X" function so the
// tour can drive that screen from outside, e.g. useTourRegister('shell', setActiveNav)
export function useTourRegister(key, fn) {
  const { register } = useTour();
  useEffect(() => {
    if (!key || !fn) return;
    const unregister = register(key, fn);
    return unregister;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, fn]);
}

import React, { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import { useTour } from "./tour_context";
import { buildTourSteps } from "./tour_steps";

const SEEN_KEY_ROLE_CHECK_DELAY = 800;

export default function TourOverlay() {
  const {
    running,
    stepIndex,
    steps,
    registry,
    startTour,
    finishTour,
    nextStep,
    prevStep,
    hasSeenTour,
  } = useTour();

  const [rect, setRect] = useState(null);
  const attemptRef = useRef(0);

  // Kick off the tour once for brand-new users, after the shell has
  // had a moment to mount and register its navigators.
  useEffect(() => {
    if (hasSeenTour()) return;
    const t = setTimeout(() => {
      const role = localStorage.getItem("role") || "buyer";
      const built = buildTourSteps(role, registry);
      startTour(built);
    }, SEEN_KEY_ROLE_CHECK_DELAY);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // For each step: activate the right screen, then poll for the DOM
  // target (retrying activation, since a deeper screen may not have
  // registered its setter yet the first time we call it).
  useEffect(() => {
    if (!running || !steps.length) {
      setRect(null);
      return;
    }
    let cancelled = false;
    attemptRef.current = 0;
    const step = steps[stepIndex];

    const attempt = () => {
      if (cancelled) return;
      step.activate && step.activate();

      requestAnimationFrame(() => {
        if (cancelled) return;
        const el = document.querySelector(
          `[data-tour-id="${step.id}"]`
        );
        if (el) {
          setRect(el.getBoundingClientRect());
        } else if (attemptRef.current < 25) {
          attemptRef.current += 1;
          setTimeout(attempt, 90);
        } else {
          // couldn't find this target (e.g. empty list) — move on
          nextStep();
        }
      });
    };

    attempt();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, stepIndex, steps]);

  // Keep the highlight glued to the target on resize/scroll
  useEffect(() => {
    if (!running || !steps.length) return;
    const step = steps[stepIndex];
    const update = () => {
      const el = document.querySelector(`[data-tour-id="${step.id}"]`);
      if (el) setRect(el.getBoundingClientRect());
    };
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [running, stepIndex, steps]);

  if (!running || !steps.length || !rect) return null;

  const step = steps[stepIndex];
  const centerX = rect.left + rect.width / 2;

  const tooltipHeight = 128;
  const showAbove = rect.top - tooltipHeight - 24 > 0;
  const tooltipTop = showAbove
    ? rect.top - tooltipHeight - 24
    : rect.top + rect.height + 24;

  const tooltipWidth = 230;
  const tooltipLeft = Math.min(
    Math.max(centerX - tooltipWidth / 2, 12),
    window.innerWidth - tooltipWidth - 12
  );

  return (
    <div className="fixed inset-0 z-[999]" style={{ pointerEvents: "none" }}>
      <style>{`
        @keyframes tourHandBounce {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(-10px) rotate(-6deg); }
        }
        @keyframes tourPulseRing {
          0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.55); }
          100% { box-shadow: 0 0 0 14px rgba(59,130,246,0); }
        }
        .tour-hand { animation: tourHandBounce 1s ease-in-out infinite; }
        .tour-ring { animation: tourPulseRing 1.6s ease-out infinite; }
      `}</style>

      {/* Dimmed backdrop with a glowing cutout ring around the target */}
      <div
        className="absolute rounded-2xl tour-ring"
        style={{
          left: rect.left - 10,
          top: rect.top - 10,
          width: rect.width + 20,
          height: rect.height + 20,
          boxShadow: "0 0 0 9999px rgba(15,23,42,0.6)",
          border: "2px solid #3B82F6",
          transition: "left 0.25s ease, top 0.25s ease",
        }}
      />

      {/* Hand avatar pointing at the target */}
      <div
        className="absolute tour-hand"
        style={{
          left: centerX - 20,
          top: rect.top - 5,
          fontSize: 34,
          lineHeight: 1,
          transition: "left 0.25s ease, top 0.25s ease",
        }}
      >
        👆
      </div>

      {/* Tooltip bubble */}
      <div
        className="absolute bg-white rounded-2xl shadow-2xl p-4 pointer-events-auto"
        style={{
          left: tooltipLeft,
          top: tooltipTop,
          width: tooltipWidth,
          transition: "left 0.25s ease, top 0.25s ease",
        }}
      >
        <button
          onClick={finishTour}
          aria-label="Close guide"
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>

        <p className="text-sm font-semibold text-gray-800 pr-5">
          {step.title}
        </p>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          {step.description}
        </p>

        <div className="flex items-center justify-between mt-3">
          <button
            onClick={finishTour}
            className="text-xs text-gray-400 font-medium hover:text-gray-600"
          >
            Skip
          </button>

          <span className="text-[10px] text-gray-400">
            {stepIndex + 1}/{steps.length}
          </span>

          <button
            onClick={nextStep}
            className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-full font-medium"
          >
            {stepIndex < steps.length - 1 ? "Next" : "Got it"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/db/schema";

type TransitionPayload = {
  product: Pick<Product, "slug" | "colorFrom" | "colorTo" | "imageTopUrl" | "imageSideUrl">;
  rect: DOMRect;
};

type HeroTransitionContextValue = {
  startTransition: (payload: TransitionPayload) => void;
};

const HeroTransitionContext = createContext<HeroTransitionContextValue | null>(null);

export function useHeroTransition() {
  const ctx = useContext(HeroTransitionContext);
  if (!ctx) throw new Error("useHeroTransition must be used within HeroTransitionProvider");
  return ctx;
}

const ANIMATE_MS = 620;
const HOLD_MS = 260;

export function HeroTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [active, setActive] = useState<TransitionPayload | null>(null);
  const [phase, setPhase] = useState<"start" | "flying" | "settled" | "leaving">("start");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const startTransition = useCallback(
    ({ product, rect }: TransitionPayload) => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        router.push(`/product/${product.slug}`);
        return;
      }

      clearTimers();
      setActive({ product, rect });
      setPhase("start");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPhase("flying"));
      });

      timers.current.push(
        setTimeout(() => setPhase("settled"), ANIMATE_MS),
        setTimeout(() => {
          router.push(`/product/${product.slug}`);
        }, ANIMATE_MS + 40),
        setTimeout(() => setPhase("leaving"), ANIMATE_MS + HOLD_MS),
        setTimeout(() => setActive(null), ANIMATE_MS + HOLD_MS + 320)
      );
    },
    [router]
  );

  return (
    <HeroTransitionContext.Provider value={{ startTransition }}>
      {children}
      {active && <TransitionOverlay payload={active} phase={phase} />}
    </HeroTransitionContext.Provider>
  );
}

function TransitionOverlay({
  payload,
  phase,
}: {
  payload: TransitionPayload;
  phase: "start" | "flying" | "settled" | "leaving";
}) {
  const { product, rect } = payload;
  const flying = phase === "flying" || phase === "settled";

  const targetSize = Math.min(
    typeof window !== "undefined" ? window.innerWidth * 0.62 : 280,
    300
  );
  const targetTop =
    (typeof window !== "undefined" ? window.innerHeight : 800) / 2 - targetSize * 0.55;
  const targetLeft =
    (typeof window !== "undefined" ? window.innerWidth : 400) / 2 - targetSize / 2;

  const style: React.CSSProperties = flying
    ? {
        top: targetTop,
        left: targetLeft,
        width: targetSize,
        height: targetSize * 0.88,
      }
    : {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.width * 0.9,
      };

  const bgStyle: React.CSSProperties =
    phase === "start"
      ? { opacity: 0, transition: "none" }
      : phase === "flying"
        ? { opacity: 1, transition: `opacity 300ms ease ${ANIMATE_MS - 300}ms` }
        : phase === "settled"
          ? { opacity: 1, transition: "none" }
          : { opacity: 0, transition: "opacity 320ms ease" };

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none bg-cream" style={bgStyle}>
      <div
        className="absolute"
        style={{
          ...style,
          transition: `top ${ANIMATE_MS}ms cubic-bezier(.22,1,.36,1), left ${ANIMATE_MS}ms cubic-bezier(.22,1,.36,1), width ${ANIMATE_MS}ms cubic-bezier(.22,1,.36,1), height ${ANIMATE_MS}ms cubic-bezier(.22,1,.36,1)`,
        }}
      >
        {/* top-down layer: flattened, fades out as it "tips" into side view */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: "polygon(50% 3%, 4% 97%, 96% 97%)",
            background: product.imageTopUrl
              ? `url(${product.imageTopUrl}) center/cover`
              : `linear-gradient(160deg, ${product.colorFrom ?? "#E3A9B6"}, ${product.colorTo ?? "#7C4667"})`,
            transform: flying ? "scaleY(0.55) rotateX(55deg)" : "scaleY(1) rotateX(0deg)",
            opacity: flying ? 0 : 1,
            transformOrigin: "center bottom",
            transition: `transform ${ANIMATE_MS}ms cubic-bezier(.22,1,.36,1), opacity ${ANIMATE_MS * 0.7}ms ease`,
          }}
        />
        {/* side-profile layer: fades in as the tip completes */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: "polygon(50% 3%, 4% 97%, 96% 97%)",
            background: product.imageSideUrl
              ? `url(${product.imageSideUrl}) center/cover`
              : `linear-gradient(160deg, ${product.colorFrom ?? "#E3A9B6"}, ${product.colorTo ?? "#7C4667"})`,
            opacity: flying ? 1 : 0,
            transition: `opacity ${ANIMATE_MS * 0.6}ms ease ${ANIMATE_MS * 0.35}ms`,
          }}
        />
      </div>
    </div>
  );
}

import { useEffect, type RefObject } from "react";


export function useWillChange(
  ref: RefObject<HTMLElement | null>,
  properties: string[]
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.willChange = properties.join(", ");
    return () => {
      if (el) el.style.willChange = "auto";
    };
  }, [ref, properties]);
}

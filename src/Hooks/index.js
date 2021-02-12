import { useCallback, useEffect, useRef } from "react";
import { isEqual } from "lodash";

export const useFocusAndSet = (ref) => {
  ref = useCallback(
    (node) => {
      if (node !== null) {
        ref.current = node; // it is not done on it's own
        const len = node.unprivilegedEditor.getLength();
        const selection = { index: len, length: len };
        node.setEditorSelection(node.editor, selection);
      }
    },
    [ref]
  );
  return ref;
};

export function useDeepEffect(fn, deps) {
  const isFirst = useRef(true);
  const prevDeps = useRef(deps);

  useEffect(() => {
    const isFirstEffect = isFirst.current;
    const isSame = prevDeps.current.every((obj, index) =>
      isEqual(obj, deps[index])
    );

    isFirst.current = false;
    prevDeps.current = deps;

    if (isFirstEffect || !isSame) {
      return fn();
    }
  }, [deps, fn]);
}

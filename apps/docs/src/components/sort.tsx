import type { ReactElement, ReactNode } from "react";

export function stringifyElement(element: ReactNode): string {
  if (!element) return "";
  if (typeof element === "string") return element;
  if (typeof element === "number") return element.toString();
  if (typeof element === "bigint") return element.toString();
  if (typeof element === "boolean") return String(element);
  if (
    typeof (
      ((element as ReactElement).props as { children: unknown }) ?? {
        children: "",
      }
    ).children === "string"
  ) {
    return (
      ((element as ReactElement).props as { children: string }) ?? {
        children: "",
      }
    ).children;
  }

  return (
    ((element as ReactElement).props as { children: Array<ReactNode> }) ?? {
      children: [],
    }
  ).children
    .map((v) => stringifyElement(v))
    .join("");
}

export function AlphabeticalSort({ children }: { children: ReactNode }) {
  return (
    <ul>
      {((children as ReactElement).props as { children: Array<ReactNode> }).children
        .filter((v) => v !== "\n")
        .sort((a, b) => {
          if (stringifyElement(a) < stringifyElement(b)) {
            return -1;
          }
          if (stringifyElement(a) > stringifyElement(b)) {
            return 1;
          }
          return 0;
        })}
    </ul>
  );
}
("\n");

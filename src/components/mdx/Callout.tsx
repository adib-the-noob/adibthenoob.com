import type { ReactNode } from "react";

type CalloutProps = {
  title?: string;
  children: ReactNode;
};

export function Callout({ title = "Note", children }: CalloutProps) {
  return (
    <aside className="my-8 rounded-lg border border-line bg-raised px-5 py-4">
      <p className="mb-2 font-mono text-xs tracking-wide text-primary uppercase">
        {title}
      </p>
      <div className="text-base leading-relaxed text-muted [&_p]:m-0">
        {children}
      </div>
    </aside>
  );
}

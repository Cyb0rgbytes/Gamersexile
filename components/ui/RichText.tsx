import { Fragment, type ReactNode } from "react";

/* Fill a translated template whose placeholders are React nodes rather than
 * strings: richFill("Join the {discord} today", { discord: <a>…</a> }).
 * Lets a sentence keep its word order in every language while a link or
 * <code> sits inside it. Works in server and client components alike. */

export function richFill(template: string, nodes: Record<string, ReactNode>): ReactNode[] {
  return template.split(/(\{\w+\})/g).map((part, i) => {
    const m = /^\{(\w+)\}$/.exec(part);
    const node = m && m[1] in nodes ? nodes[m[1]] : part;
    return <Fragment key={i}>{node}</Fragment>;
  });
}

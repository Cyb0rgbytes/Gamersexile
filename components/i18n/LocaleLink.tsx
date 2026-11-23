"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useLocalePath } from "@/lib/i18n/client";

/* Drop-in for next/link. Internal absolute paths ("/teams", "/community#faq")
 * get the current locale prefixed; external URLs, "#hash" and "mailto:" pass
 * through untouched. Use this for every internal link so no component has to
 * know which language it is rendering in. */

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

export function LocaleLink({ href, ...rest }: Props) {
  const toLocale = useLocalePath();
  return <Link href={toLocale(href)} {...rest} />;
}

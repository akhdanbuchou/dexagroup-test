"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { TAttendanceFilterQuery, TAttendanceFilters } from "@/types/attendance";
import { isDateParam } from "@/utils/date";

function useAttendanceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");
  const filters: TAttendanceFilters = {
    from: isDateParam(fromParam) ? fromParam : null,
    to: isDateParam(toParam) ? toParam : null,
    page: Math.max(1, Number.parseInt(searchParams.get("page") ?? "", 10) || 1),
  };

  const setFilters = (query: TAttendanceFilterQuery) => {
    const next = new URLSearchParams();
    const from = query.from === undefined ? filters.from : query.from;
    const to = query.to === undefined ? filters.to : query.to;
    const page = query.page ?? 1;
    if (from) next.set("from", from);
    if (to) next.set("to", to);
    if (page > 1) next.set("page", String(page));
    const search = next.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  };

  return { filters, setFilters };
}

export { useAttendanceFilters };

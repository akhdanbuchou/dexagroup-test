import dayjs, { type Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const APP_TIMEZONE = "Asia/Jakarta";
const DATE_PARAM_FORMAT = "YYYY-MM-DD";

function inAppTimezone(value: string | Date): Dayjs {
  return dayjs(value).tz(APP_TIMEZONE);
}

function formatDate(value: string | Date): string {
  return inAppTimezone(value).format("D MMM YYYY");
}

function formatWeekday(value: string | Date): string {
  return inAppTimezone(value).format("dddd");
}

function formatTime(value: string | Date): string {
  return inAppTimezone(value).format("HH:mm");
}

function formatDateOnly(value: string): string {
  return dayjs(value, DATE_PARAM_FORMAT).format("D MMM YYYY");
}

function isDateParam(value: string | null | undefined): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    dayjs(value, DATE_PARAM_FORMAT).isValid()
  );
}

function startOfDayIso(date: string): string {
  return dayjs.tz(date, APP_TIMEZONE).startOf("day").toISOString();
}

function endOfDayIso(date: string): string {
  return dayjs.tz(date, APP_TIMEZONE).endOf("day").toISOString();
}

export {
  APP_TIMEZONE,
  DATE_PARAM_FORMAT,
  formatDate,
  formatWeekday,
  formatTime,
  formatDateOnly,
  isDateParam,
  startOfDayIso,
  endOfDayIso,
};

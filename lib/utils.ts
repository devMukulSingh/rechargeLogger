import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = ({
  url,
  args,
}: {
  url: string;
  args: { pageIndex: number; pageSize: number,mobile:string | null };
}) =>
  axios
    .get(url, {
      params: args,
    })
    .then((res) => res.data);

export const months = [
  "January",
  "Febuary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

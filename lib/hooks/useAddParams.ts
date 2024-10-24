"use client";
import { useRouter, useSearchParams } from "next/navigation";

const useAddParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const addSearchParams = (newParams: any) => {
    // Get the current search params and turn them into a URLSearchParams object
    const params = new URLSearchParams(searchParams);

    // Loop through the newParams object and append or update the query params
    Object.keys(newParams).forEach((key) => {
      if (newParams[key] === undefined) {
        params.delete(key); // Optionally remove params if value is undefined
      } else {
        params.set(key, newParams[key]);
      }
    });
    // Push the new URL with the updated search params
    router.push(`?${params.toString()}`);
  };

  return { addSearchParams };
};

export default useAddParams;

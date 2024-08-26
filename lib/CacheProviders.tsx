'use client'
import { ReactNode } from "react";
import useSWR, { SWRConfig } from "swr";
import { localStorageProvider } from "./localStorageProvider";

export default function CacheProviders({children}:{children:ReactNode}) {
  return (
    //@ts-ignore
    <SWRConfig value={{ provider: localStorageProvider }}>
        {children}
    </SWRConfig>
  );
}

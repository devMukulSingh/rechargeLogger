import { ReactNode } from "react";
import Navbar from "./components/Navbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className=" text-white bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% min-h-[calc(100vh-5rem)]">
        {children}
      </div>
    </>
  );
}

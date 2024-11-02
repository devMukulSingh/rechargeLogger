import { SignedOut, SignOutButton, UserButton } from "@clerk/nextjs";
import Navlinks from "./Navlinks";

const Navbar = () => {
  return (
    <div className="h-20 flex bg-slate-900 text-white items-center justify-between px-10 shadow-xl w-full ">
      <h1 className="text-4xl"></h1>
      <Navlinks />
      <UserButton />
    </div>
  );
};

export default Navbar;

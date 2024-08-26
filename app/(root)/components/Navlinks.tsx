'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navlinks = () => {
  const pathName = usePathname();
  const navlinks = [
    {
      title: "Dashboard",
      value: "/",
      isActive: pathName.endsWith("/"),
    },
    {
      title: "Entry",
      value: "entry",
      isActive: pathName.endsWith("/entry"),
    },
    {
      title: "Transactions",
      value: "transactions",
      isActive: pathName.endsWith("/transactions"),
    },
  ];
  return (
    <div className="flex gap-10 ">
      {navlinks.map((link, index) => (
        <Link 
            href={link.value} 
            key={index} 
            className={`text-lg hover:scale-110 transition-all ${link.isActive ? 'font-bold scale-110 underline' : ''}`}>
            {link.title}
        </Link>
      ))}
    </div>
  );
};

export default Navlinks;

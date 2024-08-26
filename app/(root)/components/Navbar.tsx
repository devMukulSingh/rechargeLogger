import Navlinks from "./Navlinks"

const Navbar = () => {
  return (
    <div className='h-20 grid grid-cols-3 bg-slate-900 text-white items-center px-5 shadow-xl'>
        <h1 className="text-4xl"></h1>
        <Navlinks/>
    </div>
  )
}

export default Navbar
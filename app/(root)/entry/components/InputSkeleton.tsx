import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const InputSkeleton = () => {
  return (
    <div className='className="grid grid-cols-2 gap-5 border py-5 px-10 rounded-md shadow-xl "'>
      <Skeleton className="w-[216px] bg-slate-200 h-[40px]" />
      <Skeleton className="w-[216px] bg-slate-200 h-[40px]" />
      <Skeleton className="w-[216px] bg-slate-200 h-[40px]" />
      <Skeleton className="w-[216px] bg-slate-200 h-[40px]" />
    </div>
  );
}

export default InputSkeleton
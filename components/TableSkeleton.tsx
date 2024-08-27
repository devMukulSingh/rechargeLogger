"use client";
import React, { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

const TableSkeleton = () => {

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  
  return (
    <>
      <Skeleton className="min-h-[200px] w-auto" />
    </>
  );
};

export default TableSkeleton;

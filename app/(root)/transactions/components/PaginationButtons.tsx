import { Button } from "@/components/ui/button";
import useAddParams from "@/lib/hooks/useAddParams";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useSWRConfig } from "swr";

type Props = {
  totalPages: number;
};

const PaginationButtons = ({ totalPages }: Props) => {
  const { addSearchParams } = useAddParams();
  const page = Number(useSearchParams().get("page")) || 1;
  const { mutate } = useSWRConfig();
  const handlePageNext = () => {
    addSearchParams({ page: page + 1 });
    mutate((key) => true, undefined, { revalidate: false });
  };
  const hanldePreviousPage = () => {
    addSearchParams({ page: page - 1 });
    mutate((key) => true, undefined, { revalidate: false });
  };
  return (
    <>
      <footer className="flex gap-5  mt-auto  self-center items-center text-black">
        <Button
          onClick={hanldePreviousPage}
          variant="outline"
          size="sm"
          disabled={page === 1}
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }).map((_: any, index: number) => (
          <div
            className={`cursor-pointer flex items-center justify-center ${index + 1 === page ? `bg-white h-8 w-8 rounded-full ` : ``} `}
            key={index}
            onClick={() => addSearchParams({ page: index + 1 })}
          >
            {index + 1}
          </div>
        ))}
        ...
        <Button
          onClick={handlePageNext}
          variant="default"
          size="sm"
          disabled={totalPages === page}
        >
          Next
        </Button>
      </footer>
    </>
  );
};

export default PaginationButtons;

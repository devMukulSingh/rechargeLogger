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
  const arr = Array
  .from({length:totalPages},(v,index) => index+1 )
  .slice( (page+2 > totalPages && page!=1 ) ? page-3 : page<2 ? page-1 : page-2 ,(page+2  < totalPages) ? page+2 : totalPages);

  console.log(arr,"arr");
  
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
        {arr.map((paginationPage: number, index: number) => (
          <div
            className={`cursor-pointer flex items-center justify-center ${paginationPage === page ? `bg-white h-8 w-8 rounded-full ` : ``} `}
            key={index}
            onClick={() => addSearchParams({ page: paginationPage })}
          >
            {paginationPage}
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

import { useState } from "react";

export const usePagination = (totalItems: number, initialPageSize = 5) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.ceil(totalItems / pageSize);

  const goToPage = (page: number) => {
    if (page < 1) setCurrentPage(1);
    else if (page > totalPages) setCurrentPage(totalPages);
    else setCurrentPage(page);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  const currentDataRange = (data: any[]) =>
    data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return {
    currentPage,
    pageSize,
    totalPages,
    setPageSize,
    goToPage,
    nextPage,
    prevPage,
    currentDataRange,
  };
};

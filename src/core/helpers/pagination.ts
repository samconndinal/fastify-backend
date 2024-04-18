export const getPagination = (
    total: number,
    page: number,
    limit: number
  ) => {
    const lastPage = Math.ceil(total / limit);
    return {
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < lastPage ? page + 1 : null,
      perPage: limit,
      currentPage: page,
    };
  };



export  const getTotalPage = (total_item: number, per_page: number) => {
    return Math.ceil(total_item / per_page);
}
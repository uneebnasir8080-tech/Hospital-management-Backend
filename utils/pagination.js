let MAX_LIMIT= 100;
let DEFAULT_LIMIT=20;


export const getPagination =(query={}, options={})=>{
    const {limit, page}=query;
    const parsedLimit= Number(limit?? DEFAULT_LIMIT );
    const parsedPage =Number(page??1)
    const maxLimit= options.maxLimit ?? MAX_LIMIT
    if(!Number.isFinite(parsedLimit) || parsedLimit<1 || parsedLimit>maxLimit){
        throw new Error(`Limit must be a number between 1 to ${maxLimit}`);
    }
    if(!Number.isInteger(parsedPage) || parsedPage<1){
         throw new Error('Page must be a number greater than 0.');
    }
    return{
        limit:parsedLimit,
        page:parsedPage,
        skip:(parsedPage-1)*parsedLimit
    }
}

export const getTotalPages=(totalCount, limit, currentPage)=>{

    const safeLimit= limit>0 ? limit : 1
    const totalPage= totalCount===0? 0 : Math.ceil(totalCount/safeLimit)
    return{
        limit:safeLimit,
        totalPage,
        page:currentPage,
        totalCount,
        hasMore: totalPage=== 0 ? false : currentPage < totalPage
    }
}
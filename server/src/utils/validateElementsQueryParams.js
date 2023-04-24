import { isValidArea } from "./area.js";

export const validateElementsQueryParams = (params, page, pageSize) => {
    if((page !== undefined && (isNaN(parseInt(page))) || page < 1) || 
        (pageSize !== undefined && (isNaN(parseInt(pageSize))) || pageSize < 1)) return false;

    params.forEach(el => {
        el.vals.forEach(val => {
            if(!isValidArea(val.area) || val === undefined) return false;
        })
    });

    return true;
}
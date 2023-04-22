import { isValidArea } from "./area.js";

export const validateElementsQueryParams = (params, page, pageSize) => {
    if ((page !== undefined & isNaN(parseInt(page))) || (pageSize !== undefined && isNaN(parseInt(pageSize)))) return false;

    params.forEach(el => {
        el.vals.forEach(val => {
            if(!isValidArea(val.area) || val === undefined) return false;
        })
    });

    return true;
}
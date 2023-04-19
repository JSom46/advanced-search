import { isValidArea } from "./area.js";

export const validateElementsQueryParams = (params) => {
    params.forEach(el => {
        el.vals.forEach(val => {
            if(!isValidArea(val.area) || val === undefined) return false;
        })
    });

    return true;
}
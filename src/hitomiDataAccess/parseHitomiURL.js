export const parseHitomiURL = url => {
    let tag, language, area;
    let page_number = 1;
    let filepath = url;
    filepath = filepath.replace(/.*hitomi\.la\//, ''); 

    // domyślna kwerenda
    if (!filepath) {
            tag = 'index';
            language = 'all';
            page_number = 1;
    // jedynie strona została podana
    } else if (/^\?page=\d+$/.test(filepath)) {
            tag = 'index';
            language = 'all';             
            page_number = parseInt(filepath.replace(/.*\?page=(\d+)$/, '$1'));
    // podano inne argumenty
    } else {
            if (/\?page=\d+$/.test(filepath)) {
                    page_number = parseInt(filepath.replace(/.*\?page=(\d+)$/, '$1'));
            }
            
            let elements = filepath.replace(/\.html(?:\?page=\d+)?$/, '').split('-');

            while (elements.length > 2) {
                elements[1] = elements[0] + '-' + elements[1];
                elements.shift();
            }

            tag = elements[0];

            if (/\//.test(tag)) {
                let area_elements = tag.split(/\//);

                if (area_elements[1] === 'popular') {
                    popular = area_elements[2];

                    area_elements.splice(1, 2); //delete elements 2 and 3

                } 
                else if (area_elements[0] === 'popular') {
                    popular = area_elements[1];

                }

                area = area_elements[0];
                tag = area_elements[1];
        }

        language = elements[1];
    }

    return {
        tag: tag,
        language: language,
        pageNumber: page_number,
        area: area
    };
}
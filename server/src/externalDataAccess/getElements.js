import Area from "../utils/area.js";

/*
{
    tag : string
    language : string
    area : string
}
*/
export const getElements = async (params) => {
  const url = `https://ltn.hitomi.la/${
    params.area === undefined ? "" : Area.areaToString(params.area) + "/"
  }${params.tag}-${params.language}.nozomi`;
  const ids = [];
  const res = await fetch(url);
  const view = new DataView(await res.arrayBuffer());

  for (let i = 0; i < view.byteLength / 4; i++) {
    ids.push(view.getInt32(i * 4, false));
  }

  return ids;
};

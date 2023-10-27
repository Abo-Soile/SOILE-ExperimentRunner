/**
 * Get a style string from a Json object of style entries
 * @param {*} styleObject
 * @returns
 */
export function getStyle(styleObject) {
  return Object.entries(styleObject)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
}

/**
 * Check, whether a given mimeType refers to a file that can be edited as text.
 * @param {String} mimeType the mimetype string
 * @returns
 */
export function isText(mimeType) {
  return mimeType
    ? mimeType.startsWith("text") ||
        mimeType === "application/json" ||
        mimeType === "application/javascript" ||
        mimeType === "application/x-javascript"
    : false;
}

/**
 * Check, whether a given mimeType refers to a file that contains video information
 * @param {String} mimeType the mimetype string
 * @returns
 */
export function isVideo(mimeType) {
  return mimeType.startsWith("video/");
}
/**
 * Check, whether a given mimeType refers to a file that contains image information
 * @param {String} mimeType the mimetype string
 * @returns
 */
export function isImage(mimeType) {
  return mimeType.startsWith("image/");
}

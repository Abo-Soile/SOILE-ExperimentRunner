/**
 * This function takes a file object, reads it, and returns a file object with modified content
 * @param {File} inputFile - The input File object to be processed.
 * @return {Promise<File>} A Promise that resolves with the output File object containing the modified content.
 */
export function processFile(inputFile, updateFunction) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const fileContent = event.target.result;
      // Code to parse and modify the 'fileContent' will be placed here

      // For example, converting to uppercase
      const modifiedContent = updateFunction(fileContent);

      // Get the filename and content type from the input file
      const { name, type } = inputFile;

      // Create a Blob from the modified content
      const blob = new Blob([modifiedContent], { type });

      // Create a modified File object with the same name and content type as the input file
      const outputFile = new File([blob], name, { type });

      // Resolve the Promise with the output File object
      resolve(outputFile);
    };

    reader.onerror = function (event) {
      // If there's an error during file reading, reject the Promise with the error message
      reject(new Error("Error reading the file: " + event.target.error));
    };

    //  Read the file content
    reader.readAsText(inputFile);
  });
}

/**
 * This function takes the index.html file from a psychojs task and extracts multiple pieces of information.
 * @param {File} inputFile - The file representing the index.html from a psychojs path.
 * @return {Promise<File>} A Promise that resolves with the output File object containing the modified content.
 */
export async function readCode(inputFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const fileContent = event.target.result;
      const taskInfo = extractTaskInfo(fileContent);
      taskInfo.code = fileContent;
      console.log(taskInfo);
      if (
        taskInfo.name == null ||
        taskInfo.version == null ||
        taskInfo.legacyscript == null ||
        taskInfo.script == null
      ) {
        reject(new Error("Error: Couldn't extract data from index.html"));
      } else {
        // Resolve the Promise with the output File object
        resolve(taskInfo);
      }
    };

    reader.onerror = function (event) {
      // If there's an error during file reading, reject the Promise with the error message
      reject(new Error("Error reading the file: " + event.target.error));
    };

    //  Read the file content
    reader.readAsText(inputFile);
  });
}

export function updatePsychoJSStart(content) {
  var result = content.replace(
    "psychoJS.start({",
    'psychoJS.start({\nconfigURL: "soileconfig.json",'
  );
  result = result.replace("dictionary: expInfo,", "dictionary: {},");
  result = result.replace(
    "new PsychoJS({",
    'new PsychoJS({\n  hosts: ["about:srcdoc"],'
  );
  return result;
}

export function extractTaskInfo(taskCode) {
  const codeTitle = extractTitleFromHTML(taskCode);
  const psychojsVersion = extractVersion(taskCode);
  const scripts = extractScriptNames(taskCode);
  return {
    name: codeTitle,
    version: psychojsVersion,
    legacyscript: scripts.legacy,
    script: scripts.normal,
  };
}

/**
 * Extract the Title from the index.html file.
 * @param {*} htmlString
 * @returns
 */
function extractTitleFromHTML(htmlString) {
  const titleRegex = /<title[^>]*>([^<]+?)(\[PsychoPy\])?<\/title>/i;
  const matches = htmlString.match(titleRegex);
  return matches && matches[1] ? matches[1].trim() : null;
}
/**
 * Extract the psychoJS version from the index.html file
 * @param {*} htmlString
 * @returns
 */
function extractVersion(htmlString) {
  const versionRegexp = /\.\/lib\/psychojs-(.+)\.css/i;
  const matches = htmlString.match(versionRegexp);
  return matches && matches[1] ? matches[1] : null;
}

/**
 * Extract the psychoJS version from the index.html file
 * @param {*} htmlString
 * @returns
 */
function extractScriptNames(htmlString) {
  const versionRegexp = /<script src="\.\/(.*-legacy-browsers\.js)"/i;
  const matches = htmlString.match(versionRegexp);
  const legacyName = matches && matches[1] ? matches[1] : null;
  var nonlegacy = null;
  if (legacyName) {
    nonlegacy = legacyName.replace("-legacy-browsers", "");
  }
  return { legacy: legacyName, normal: nonlegacy };
}

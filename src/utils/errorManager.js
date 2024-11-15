/**
 * @typedef {keyof typeof errorCodes} ErrorCode
 * 
 * @typedef {Object} ErrorObj
 * @property {Number} code
 * @property {String} message
 */

const errorCodes = {
    EXTERNAL_ERROR: -3,
    JSON_PARSE_ERROR: -2,
    UNKNOWN_ERROR: -1
};

/**
 * @type {Record<ErrorCode, string>}
 */
const errorMessages = {
    EXTERNAL_ERROR: "An external error occurred",
    JSON_PARSE_ERROR: "Error parsing JSON response",
    UNKNOWN_ERROR: "An unknown error occurred on our side"
};

/**
 * 
 * @param {keyof typeof errorCodes} code 
 */
export function getError(code) {
    return `${errorCodes[code]} | ${errorMessages[code]}`;
}

/**
 * 
 * @param {ErrorCode} error 
 * @param {Object} data
 * @param {Number} status
 */
export function buildHttpError(error, data, status = 200) {
    const errorCode = errorCodes[error];
    if (errorCode == 0)
        return [{
            code: 0,
            data
        }, status];
    else if (errorCode > 0)
        return [{
            code: errorCode,
            message: errorMessages[error]
        }, 400];
    else
        return [{
            code: -1,
            message: errorMessages[-1]
        }, 500];
}
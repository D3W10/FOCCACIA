/**
 * @typedef {object} ErrorObj
 * @property {number} status
 * @property {(...args) => string} message
 */

/**
 * @type {Record<string, ErrorObj>}
 */
const errors = {
    default: { status: 500, message: () => "Unknown error" },
    w1: { status: 400, message: () => "Group name missing" },
    w2: { status: 400, message: () => "No fields to update were specified" },
    w3: { status: 401, message: () => "Unauthorized" },
    w4: { status: 403, message: () => "Forbidden access" },
    d1: { status: 404, message: () => "User not found" },
    d2: { status: 404, message: () => "Group not found" }
}

export function getError(res, code, ...args) {
    if (!code || !(code in errors))
        return res.status(errors.default.status).json({ message: errors.default.message(args) });

    return res.status(errors[code].status).json({ message: errors[code].message(args) });
}
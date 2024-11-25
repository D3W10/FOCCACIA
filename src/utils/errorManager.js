/**
 * @typedef {object} ErrorObj
 * @property {number} status
 * @property {string} message
 */

/**
 * @type {Record<string, ErrorObj>}
 */
const errors = {
    default: { status: 500, message: "Unknown error" },
    w1: { status: 400, message: "Group name missing" },
    w2: { status: 400, message: "No fields to update were specified" },
    w3: { status: 401, message: "Unauthorized" },
    w4: { status: 403, message: "Forbidden access" },
    w5: { status: 400, message: "Invalid ID" },
    w6: { status: 400, message: "User name missing" },
    w7: { status: 400, message: "Club name missing" },
    w8: { status: 400, message: "Team name missing" },
    w9: { status: 400, message: "Invalid teams array" },
    w10: { status: 401, message: "Invalid authentication header" },
    d1: { status: 404, message: "User not found" },
    d2: { status: 404, message: "Group not found" },
    a1: { status: 502, message: "External API error" }
}

export function getError(res, code) {
    if (!code || !(code in errors))
        return res.status(errors.default.status).json({ message: errors.default.message });

    return res.status(errors[code].status).json({ message: errors[code].message });
}
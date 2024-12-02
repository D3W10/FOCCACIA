/**
 * @typedef {object} ErrorObj
 * @property {number} status
 * @property {string} message
 */

/**
 * @type {Record<string, ErrorObj>}
 */
export const errors = {
    "-1": { status: 500, message: "Unknown error" },
    w1: { status: 400, message: "Group name missing" },
    w2: { status: 400, message: "No fields to update were specified" },
    w3: { status: 401, message: "Unauthorized" },
    w4: { status: 403, message: "Forbidden access" },
    w5: { status: 400, message: "Invalid ID" },
    w6: { status: 400, message: "User name missing" },
    w7: { status: 400, message: "Club name missing" },
    w8: { status: 400, message: "Invalid teams array" },
    w9: { status: 401, message: "Invalid authentication header" },
    w10: { status: 400, message: "Invalid season" },
    s1: { status: 502, message: "External API error" },
    s2: { status: 404, message: "User not found" },
    s3: { status: 404, message: "Group not found" },
    d1: { status: 400, message: "No such team in this group" }
}

export function error(res, code) {
    if (!code || !(code in errors))
        return res.status(errors["-1"].status).json({ code: "-1", message: errors["-1"].message });

    return res.status(errors[code].status).json({ code, message: errors[code].message });
}

export function success(res, data, status = 200) {
    if (typeof data === "string")
        return res.status(status).json({
            code: "0",
            message: data
        });
    else
        return res.status(status).json({
            code: "0",
            message: "Success",
            data
        });
}
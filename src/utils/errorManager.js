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

    a0: { status: 404, message: "Unexistent page" },
    a1: { status: 400, message: "Team name missing" },
    a2: { status: 400, message: "Invalid team ID" },
    a3: { status: 400, message: "Group name missing" },
    a4: { status: 400, message: "Invalid teams data" },
    a5: { status: 400, message: "Invalid group ID" },
    a6: { status: 400, message: "No fields to update were specified" },
    a7: { status: 404, message: "Group not found" },
    a8: { status: 403, message: "Forbidden access" },
    a9: { status: 400, message: "Invalid league ID" },
    a10: { status: 400, message: "Invalid season" },
    a11: { status: 400, message: "No such team in this group" },
    a12: { status: 400, message: "User name missing" },
    a13: { status: 400, message: "All teams already exist in this group" },
    a14: { status: 400, message: "User password missing" },
    a15: { status: 401, message: "Could not authenticate" },
    a16: { status: 400, message: "A user with this username already exists" },

    h1: { status: 401, message: "Invalid authentication header" },

    s1: { status: 502, message: "External API error" },
    s2: { status: 404, message: "User not found" }
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
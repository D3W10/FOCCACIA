import { getError } from "../utils/errorManager.js";

/**
 * @typedef {import("express").Request & {json: () => Promise<any>}} Request
 * @typedef {import("express").Response} Response
 */

function success(res, data, status = 200){
    res.status(status).json({ data });
}

function getAuth(req) {
    const auth = req.headers.authorization.split(" ", 2);

    if (auth.length < 2)
        Promise.reject(new Error("w10"));
    else if (auth[0] !== "Bearer")
        Promise.reject(new Error("w10"));
    else
        return auth[1];
}

function handleError(res, tryFunc) {
    try {
        tryFunc();
    }
    catch (e) {
        if (e.code)
            getError(res, e.code);
        else {
            console.error(e);
            getError(res);
        }
    }
}

export default (service) => ({
    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    searchClubs: (req, res) => {
        handleError(res, async () => {
            const name = req.query.name;

            if (!name)
                getError(res, "w7");
            else
                success(res, await service.searchClubs(name), 200);
        });
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    searchLeagues: (req, res) => {
        handleError(res, async () => {
            const team = req.query.team;

            if (!team)
                getError(res, "w8");
            else
                success(res, await service.searchLeagues(team), 200);
        });
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    createGroup: (req, res) => {
        handleError(res, async () => {
            const body = await req.json();

            if (!body.name)
                getError(res, "w1");
            else if (!body.teams || !Array.isArray(body.teams))
                getError(res, "w9");
            else if (!req.headers.authorization)
                getError(res, "w3");
            else
                success(res, await service.createGroup(body.name, body.description, body.teams, getAuth(req)), 201);
        });
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    editGroup: (req, res) => {
        handleError(res, async () => {
            const body = await req.json();
            const id = +req.params.id;

            if (!body.name && !body.description)
                getError(res, "w2");
            else if (!req.headers.authorization)
                getError(res, "w3");
            else if (isNaN(id))
                getError(res, "w5");
            else
                success(res, await service.editGroup(req.params.id, {
                    name: body.name,
                    description: body.description
                }, getAuth(req)));
        });
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    listGroup: (req, res) => {
        handleError(res, async () => {
            if (!req.headers.authorization)
                getError(res, "w3");
            else
                success(res, await service.listGroup(getAuth(req)));
        });
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    deleteGroup: (req, res) => {
        handleError(res, async () => {
            const id = +req.params.id;

            if (!req.headers.authorization)
                getError(res, "w3");
            else if (isNaN(id))
                getError(res, "w5");
            else {
                await service.deleteGroup(id, getAuth(req));
                success(res, "Group deleted successfully");
            }
        });
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    getDetailsOfGroup: (req, res) => {
        handleError(res, async () => {
            const id = +req.params.id;

            if (!req.headers.authorization)
                getError(res, "w3");
            else if (isNaN(id))
                getError(res, "w5");
            else
                success(res, await service.getDetailsOfGroup(id, getAuth(req)));
        });
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    addTeamsToGroup: (req, res) => {
        handleError(res, async () => {
            const id = +req.params.id;
            const body = await req.json();

            if (!body.teams || !Array.isArray(body.teams))
                getError(res, "w9");
            else if (!req.headers.authorization)
                getError(res, "w3");
            else if (isNaN(id))
                getError(res, "w5");
            else {
                await service.addTeamsToGroup(id, body.teams, getAuth(req));
                success(res, "Teams added to group successfully", 200);
            }
        });
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    removeTeamsFromGroup: (req, res) => {
        handleError(res, async () => {
            const id = +req.params.id
            const idt = +req.params.idt

            if (!req.headers.authorization)
                getError(res, "w3");
            else if (isNaN(id) || isNaN(idt))
                getError(res, "w5");
            else {
                await service.removeTeamsFromGroup(id, idt, getAuth(req));
                success(res, "Team removed from group successfully");
            }
        });
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    createUser: (req, res) => {
        handleError(res, async () => {
            const body = await req.json();

            if (!body.name)
                getError(res, "w6");
            else {
                await service.createUser(body.name);
                success(res, "User created successfully", 201);
            }
        });
    }
});
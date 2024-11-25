import { error, success } from "../utils/errorManager.js";

/**
 * @typedef {import("express").Request & {json: () => Promise<any>}} Request
 * @typedef {import("express").Response} Response
 */

function getAuth(req) {
    const auth = req.headers.authorization.split(" ", 2);

    if (auth.length < 2)
        Promise.reject(new Error("w9"));
    else if (auth[0] !== "Bearer")
        Promise.reject(new Error("w9"));
    else
        return auth[1];
}

function handleError(res, tryFunc) {
    try {
        tryFunc();
    }
    catch (e) {
        if (e.code)
            error(res, e.code);
        else {
            console.error(e);
            error(res);
        }
    }
}

export default (service) => ({
    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    searchTeams: (req, res) => {
        handleError(res, async () => {
            const name = req.query.name;

            if (!name)
                error(res, "w7");
            else
                success(res, await service.searchTeams(name), 200);
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    searchLeagues: (req, res) => {
        handleError(res, async () => {
            const id = +req.query.team;

            if (isNaN(id))
                error(res, "w5");
            else
                success(res, await service.searchLeagues(id), 200);
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    createGroup: (req, res) => {
        handleError(res, async () => {
            if (!req.body.name)
                error(res, "w1");
            else if (req.body.teams && (!Array.isArray(req.body.teams) || !req.body.teams.every(t => typeof t.id === "number" && typeof t.leagueId === "number" && typeof t.season === "number")))
                error(res, "w8");
            else if (!req.headers.authorization)
                error(res, "w3");
            else
                success(res, await service.createGroup(req.body.name, req.body.description, req.body.teams, getAuth(req)), 201);
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    editGroup: (req, res) => {
        handleError(res, async () => {
            const id = +req.params.id;

            if (!req.body.name && !req.body.description)
                error(res, "w2");
            else if (!req.headers.authorization)
                error(res, "w3");
            else if (isNaN(id))
                error(res, "w5");
            else
                success(res, await service.editGroup(id, {
                    name: req.body.name,
                    description: req.body.description
                }, getAuth(req)));
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    listGroups: (req, res) => {
        handleError(res, async () => {
            if (!req.headers.authorization)
                error(res, "w3");
            else
                success(res, await service.listGroups(getAuth(req)));
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    deleteGroup: (req, res) => {
        handleError(res, async () => {
            const id = +req.params.id;

            if (!req.headers.authorization)
                error(res, "w3");
            else if (isNaN(id))
                error(res, "w5");
            else {
                await service.deleteGroup(id, getAuth(req));
                success(res, "Group deleted successfully");
            }
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    getGroupDetails: (req, res) => {
        handleError(res, async () => {
            const id = +req.params.id;

            if (!req.headers.authorization)
                error(res, "w3");
            else if (isNaN(id))
                error(res, "w5");
            else
                success(res, await service.getGroupDetails(id, getAuth(req)));
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    addTeamsToGroup: (req, res) => {
        handleError(res, async () => {
            const id = +req.params.id;

            if (!req.body.teams || !Array.isArray(req.body.teams))
                error(res, "w8");
            else if (!req.headers.authorization)
                error(res, "w3");
            else if (isNaN(id))
                error(res, "w5");
            else {
                await service.addTeamsToGroup(id, req.body.teams, getAuth(req));
                success(res, "Teams added to group successfully");
            }
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    removeTeamFromGroup: (req, res) => {
        handleError(res, async () => {
            const id = +req.params.id;
            const idt = +req.params.idt;
            const idl = +req.params.idl;
            const season = +req.params.season;

            if (!req.headers.authorization)
                error(res, "w3");
            else if (isNaN(id) || isNaN(idt) || isNaN(idl))
                error(res, "w5");
            else if (isNaN(season))
                error(res, "w10");
            else {
                await service.removeTeamFromGroup(id, idt, idl, season, getAuth(req));
                success(res, "Team removed from group successfully");
            }
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    createUser: (req, res) => {
        handleError(res, async () => {
            if (!req.body.name)
                error(res, "w6");
            else
                success(res, await service.createUser(req.body.name), 201);
        });
    }
});
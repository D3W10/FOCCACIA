import { getError } from "../utils/errorManager.js";

/**
 * @typedef {import("express").Request & {json: () => Promise<any>}} Request
 * @typedef {import("express").Response} Response
 */

function success(res, data, status = 200){
    res.status(status).json({ data });
}

export default (service) => ({
    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    searchClubs: async (req, res) => {
        try {
            const name = req.query.name;

            if (!name)
                getError(res, "w7");
            else
                success(res, await service.searchClubs(name), 200);
        } catch (e) {
            if (e.code)
                getError(res, e.code);
            else {
                console.error(e);
                getError(res);
            }
        }
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    searchLeagues: async (req, res) => {
        try {
            const team = req.query.team;

            if (!team)
                getError(res, "w8");
            else
                success(res, await service.searchLeagues(team), 200);
        } catch (e) {
            if (e.code)
                getError(res, e.code);
            else {
                console.error(e);
                getError(res);
            }
        }
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    createGroup: async (req, res) => {
        try {
            const body = await req.json();
            const auth = req.headers.authorization;

            if (!body.name)
                getError(res, "w1");
            else if (!body.teams || !Array.isArray(body.teams))
                getError(res, "w9");
            else if (!auth)
                getError(res, "w3");
            else
                success(res, await service.createGroup(body.name, body.description, body.teams, auth.replace("Bearer ", "")), 201);
        } catch (e) {
            if (e.code)
                getError(res, e.code);
            else {
                console.error(e);
                getError(res);
            }
        }
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    editGroup: async (req, res) => {
        try {
            const body = await req.json();
            const auth = req.headers.authorization;
            const id = +req.params.id;

            if (!body.name && !body.description)
                getError(res, "w2");
            else if (!auth)
                getError(res, "w3");
            else if (isNaN(id))
                getError(res, "w5");
            else
                success(res, await service.editGroup(req.params.id, {
                    name: body.name,
                    description: body.description
                }, auth.replace("Bearer ", "")));
        } catch (e) {
            if (e.code)
                getError(res, e.code);
            else {
                console.error(e);
                getError(res);
            }
        }
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    listGroup: async (req, res) => {
        try {
            const auth = req.headers.authorization;

            if (!auth)
                getError(res, "w3");
            else
                success(res, await service.listGroup(auth.replace("Bearer ", "")));
        } catch (e) {
            if (e.code)
                getError(res, e.code);
            else {
                console.error(e);
                getError(res);
            }
        }
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    deleteGroup: async (req, res) => {
        try {
            const auth = req.headers.authorization;
            const id = +req.params.id;

            if (!auth)
                getError(res, "w3");
            else if (isNaN(id))
                getError(res, "w5");
            else {
                await service.deleteGroup(id);
                success(res, "Group deleted successfully");
            }
        } catch (e) {
            if (e.code)
                getError(res, e.code);
            else {
                console.error(e);
                getError(res);
            }
        }
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    getDetailsOfGroup: async (req, res) => {
        try {
            const auth = req.headers.authorization;
            const id = +req.params.id;

            if (!auth)
                getError(res, "w3");
            else if (isNaN(id))
                getError(res, "w5");
            else
                success(res, await service.getDetailsOfGroup(auth.replace("Bearer ", "")));
        } catch (e) {
            if (e.code)
                getError(res, e.code);
            else {
                console.error(e);
                getError(res);
            }
        }
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    addTeamsToGroup: async (req, res) => {
        try {
            const auth = req.headers.authorization;
            const id = +req.params.id;
            const body = await req.json();

            if (!body.teams || !Array.isArray(body.teams))
                getError(res, "w9");
            else if (!auth)
                getError(res, "w3");
            else if (isNaN(id))
                getError(res, "w5");
            else {
                service.addTeamsToGroup(id, body.teams, auth.replace("Bearer ", ""));
                success(res, "Teams added to group successfully", 200);
            }
        } catch (e) {
            if (e.code)
                getError(res, e.code);
            else {
                console.error(e);
                getError(res);
            }
        }
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    removeTeamsFromGroup: async (req, res) => {
        try {
            const auth = req.headers.authorization;
            const id = +req.params.id
            const idt = +req.params.idt

            if (!auth)
                getError(res, "w3");
            else if (isNaN(id) || isNaN(idt))
                getError(res, "w5");
            else {
                await service.removeTeamsFromGroup(id, idt, auth.replace("Bearer ", ""));
                success(res, "Team removed from group successfully");
            }
        } catch (e) {
            if (e.code)
                getError(res, e.code);
            else {
                console.error(e);
                getError(res);
            }
        }
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    createUser: async (req, res) => {
        try {
            const body = await req.json();

            if (!body.name)
                getError(res, "w6");
            else {
                await service.createUser(body.name);
                success(res, "User created successfully", 201);
            }
        } catch (e) {
            if (e.code)
                getError(res, e.code);
            else {
                console.error(e);
                getError(res);
            }
        }
    }
});
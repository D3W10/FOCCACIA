import { error, success } from "../utils/errorManager.js";

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 */

async function handleError(res, tryFunc, code) {
    try {
        success(res, await tryFunc(), code);
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
        handleError(res, () => service.searchTeams(req.query.name));
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    searchLeagues: (req, res) => {
        handleError(res, () => service.searchLeagues(+req.query.team));
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    createGroup: (req, res) => {
        handleError(res, () => service.createGroup(req.body.name, req.body.description, req.body.teams, req.headers.authorization), 201);
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    editGroup: (req, res) => {
        handleError(res, () => service.editGroup(req.params.id, {
            name: req.body.name,
            description: req.body.description
        }, req.headers.authorization));
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    listGroups: (req, res) => {
        handleError(res, () => service.listGroups(req.headers.authorization));
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    deleteGroup: (req, res) => {
        handleError(res, async () => {
            await service.deleteGroup(req.params.id, req.headers.authorization);
            return "Group deleted successfully";
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    getGroupDetails: (req, res) => {
        handleError(res, () => service.getGroupDetails(req.params.id, req.headers.authorization));
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    addTeamsToGroup: (req, res) => {
        handleError(res, async () => {
            await service.addTeamsToGroup(req.params.id, req.body.teams, req.headers.authorization);
            return "Teams added to group successfully";
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    removeTeamFromGroup: (req, res) => {
        handleError(res, async () => {
            await service.removeTeamFromGroup(req.params.id, +req.params.idt, +req.params.idl, +req.params.season, req.headers.authorization);
            return "Team removed from group successfully";
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    createUser: (req, res) => {
        handleError(res, () => service.createUser(req.body.name), 201);
    }
});
import { errors } from "../utils/errorManager.js";

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 */

const TOKEN = "f37b4092-c404-4d21-9c79-acbaf879b23c";
const BEARER_TOKEN = "Bearer " + TOKEN;

async function handleError(res, tryFunc) {
    try {
        await tryFunc()
    }
    catch (e) {
        const status = e.code ? errors[e.code].status : 500;

        res.status(status).render("error", { status });
    }
}

export default (service) => ({
    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    home: (req, res) => {
        handleError(res, () => res.render("home"));
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    signup: (req, res) => {
        handleError(res, () => res.render("signup"));
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    login: (req, res) => {
        handleError(res, () => res.render("login"));
    },

    /**
    * @param {Request} req 
    * @param {Response} res 
    */
    listGroups: async (req, res) => {
        handleError(res, async () => {
            const groups = await Promise.all((await service.listGroups(BEARER_TOKEN)).map(async g =>
                await service.getGroupDetails(g, BEARER_TOKEN)
            ));

            res.render("groups", {
                created: req.query.success === "true",
                hasGroups: groups.length > 0,
                groups
            });
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    createGroupForm: (req, res) => {
        handleError(res, () => res.render("create"));
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    createGroup: (req, res) => {
        handleError(res, async () => {
            await service.createGroup(req.body.name, req.body.description, [], BEARER_TOKEN);
            res.redirect("/groups?success=true");
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    searchTeams: (req, res) => {
        handleError(res, async () => {
            if (!req.query.team)
                res.render("search");
            else
                res.render("results", {
                    teams: await service.searchTeams(req.query.team)
                });
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    getLeagues: (req, res) => {
        handleError(res, async () => res.render("leagues", {
            leagues: await service.searchLeagues(req.params.team)
        }));
    }
});
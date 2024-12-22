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

        console.error(e);
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
    getGroupDetails: (req, res) => {
        handleError(res, async () => {
            const group = await service.getGroupDetails(req.params.id, BEARER_TOKEN);

            res.render("group", {
                id: req.params.id,
                description: group.description,
                added: req.query.addSuccess === "true",
                removed: req.query.removeSuccess === "true",
                hasTeams: group.teams.length > 0,
                teams: group.teams
            });
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    editGroupForm: (req, res) => {
        handleError(res, async () => {
            const group = await service.getGroupDetails(req.params.id, BEARER_TOKEN);

            res.render("edit", {
                id: req.params.id,
                name: group.name,
                description: group.description
            });
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    editGroup: (req, res) => {
        handleError(res, async () => {
            await service.editGroup(req.params.id, {
                name: req.body.name,
                description: req.body.description
            }, BEARER_TOKEN);

            res.redirect("/groups/" + req.params.id);
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    deleteGroup: (req, res) => {
        handleError(res, async () => {
            await service.deleteGroup(req.params.id, BEARER_TOKEN);

            res.redirect("/");
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
        handleError(res, async () => {
            const leagues = await service.searchLeagues(req.params.team);

            leagues.forEach(l => l.seasons.reverse());

            res.render("leagues", {
                leagues
            });
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    addTeamToGroup: (req, res) => {
        handleError(res, async () => {
            await service.addTeamsToGroup(req.params.id, [{
                id: +req.params.team,
                leagueId: +req.body.id,
                season: +req.body.season
            }], BEARER_TOKEN);

            res.redirect(`/groups/${req.params.id}?addSuccess=true`);
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    removeTeamFromGroup: (req, res) => {
        handleError(res, async () => {
            await service.removeTeamFromGroup(req.params.id, +req.params.team, +req.params.league, +req.params.season, BEARER_TOKEN);

            res.redirect(`/groups/${req.params.id}?removeSuccess=true`);
        });
    }
});
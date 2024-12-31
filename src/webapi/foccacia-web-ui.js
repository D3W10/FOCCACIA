import { errors } from "../utils/errorManager.js";

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {import("../data/foccacia-data-mem").User} User
 */

/**
 * @param {Express.User} user
 * @returns {String}
 */
// @ts-ignore
const buildAuth = user => `Bearer ${user.token}`;

/**
 * @param {Request} req 
 * @param {Response} res 
 */
async function handleError(req, res, tryFunc) {
    try {
        await tryFunc()
    }
    catch (e) {
        return renderError(req, res, e);
    }
}

export function renderError(req, res, e) {
    const status = errors[e.code ?? "-1"].status;
    const message = errors[e.code ?? "-1"].message;

    console.error(message);

    res.status(status).render("error", {
        loggedIn: req.user != undefined,
        status,
        message
    });
}

export default (service) => ({
    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    home: (req, res) => {
        handleError(req, res, () => res.render("home", {
            loggedIn: req.user != undefined
        }));
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    signupForm: (req, res) => {
        handleError(req, res, () => res.render("signin/signup"));
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    signup: (req, res) => {
        handleError(req, res, async () => {
            try {
                const { username, password } = req.body;
                await service.createUser(username, password);
                res.redirect("/login");
            }
            catch {
                res.redirect("/signup");
            }
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    login: (req, res) => {
        handleError(req, res, () => res.render("signin/login"));
    },

    logout: (req, res) => {
        handleError(req, res, async () => {
            req.logout(() => res.redirect("/"));
        });
    },

    /**
    * @param {Request} req 
    * @param {Response} res 
    */
    listGroups: async (req, res) => {
        handleError(req, res, async () => {
            const groups = await Promise.all((await service.listGroups(buildAuth(req.user))).map(async g =>
                await service.getGroupDetails(g, buildAuth(req.user))
            ));

            res.render("groups/list", {
                loggedIn: req.user != undefined,
                hasGroups: groups.length > 0,
                groups,
                deleted: req.query.deleteSuccess === "true"
            });
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    createGroupForm: (req, res) => {
        handleError(req, res, () => res.render("groups/create", {
            loggedIn: req.user != undefined
        }));
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    createGroup: (req, res) => {
        handleError(req, res, async () => {
            let group = await service.createGroup(req.body.name, req.body.description, [], buildAuth(req.user));
            
            res.redirect("/groups/" + group.id + "?createdSuccess=true");
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    getGroupDetails: (req, res) => {
        handleError(req, res, async () => {
            const group = await service.getGroupDetails(req.params.id, buildAuth(req.user));

            res.render("groups/details", {
                loggedIn: req.user != undefined,
                id: req.params.id,
                name: group.name,
                description: group.description,
                logo: group.logo,
                created: req.query.createdSuccess === "true",
                edited: req.query.editedSuccess === "true",
                added: req.query.addSuccess === "true",
                removed: req.query.removeSuccess === "true",
                hasTeams: group.teams.length > 0,
                teams: group.teams,
                token: buildAuth(req.user)
            });
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    editGroupForm: (req, res) => {
        handleError(req, res, async () => {
            const group = await service.getGroupDetails(req.params.id, buildAuth(req.user));

            res.render("groups/edit", {
                loggedIn: req.user != undefined,
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
        handleError(req, res, async () => {
            await service.editGroup(req.params.id, {
                name: req.body.name,
                description: req.body.description
            }, buildAuth(req.user));

            res.redirect("/groups/" + req.params.id + "?editedSuccess=true");
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    searchTeams: (req, res) => {
        handleError(req, res, async () => {
            if (!req.query.team)
                res.render("search/bar");
            else {
                const teams = await service.searchTeams(req.query.team);

                if (teams.length == 0)
                    res.render("search/bar", {
                        loggedIn: req.user != undefined,
                        failSearch: true,
                        query: req.query.team
                    });
                else
                    res.render("search/teams", {
                        loggedIn: req.user != undefined,
                        query: req.query.team,
                        teams: teams
                    });
            }
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    getLeagues: (req, res) => {
        handleError(req, res, async () => {
            const leagues = await service.searchLeagues(req.params.team);

            leagues.forEach(l => l.seasons.reverse());

            res.render("search/leagues", {
                loggedIn: req.user != undefined,
                leagues
            });
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    addTeamToGroup: (req, res) => {
        handleError(req, res, async () => {
            await service.addTeamsToGroup(req.params.id, [{
                id: +req.params.team,
                leagueId: +req.body.id,
                season: +req.body.season
            }], buildAuth(req.user));

            res.redirect(`/groups/${req.params.id}?addSuccess=true`);
        });
    }
});
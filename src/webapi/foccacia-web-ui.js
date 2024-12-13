/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 */

export default (service) => ({
    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    home: (req, res) => {
        res.render("home");
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    searchTeams: (req, res) => {
        res.render("search", {
            title: "Search Teams",
            topic: "Teams"
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    searchLeagues: (req, res) => {
        res.render("search", {
            title: "Search Leagues",
            topic: "Leagues"
        });
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    signup: (req, res) => {
        res.render("signup");
    },

    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    login: (req, res) => {
        res.render("login");
    }
});
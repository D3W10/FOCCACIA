function home(_, res) {
    res.render("home");
}

function searchTeams(_, res) {
    res.render("search", {
        title: "Search Teams",
        topic: "Teams"
    });
}

function searchLeagues(_, res) {
    res.render("search", {
        title: "Search Leagues",
        topic: "Leagues"
    });
}

export default {
    home,
    searchTeams,
    searchLeagues
}
import express from "express";
import hbs from "hbs";
import session from "express-session";
import passport from "passport";
import webApiBuilder from "./foccacia-web-api.js";
import webUiBuilder from "./foccacia-web-ui.js";
import serviceBuilder from "../service/foccacia-services.js";
import passportBuilder from "../auth/passport-config.js";
import api from "../data/fapi-teams-data.js";
// import fakeApi from "../data/fapi-teams-data-fake.js";
import foccacia from "../data/foccacia-elastic.js";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "hbs");
app.set("views", "views/pages");

//#region Handlebars

hbs.registerPartials("./views/components");
hbs.registerPartials("./views/common");
hbs.registerPartials("./views/icons");
hbs.registerHelper("eq", (a, b) => a === b);
hbs.registerHelper("not", v => !v);
hbs.registerHelper("and", function () {
    return Array.prototype.slice.call(arguments, 0, -1).every(Boolean);
});
hbs.registerHelper("or", function () {
    return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
});
hbs.registerHelper("concat", function () {
    let outStr = "";

    for (let arg in arguments) {
        if (typeof arguments[arg] != "object")
            outStr += arguments[arg];
    }

    return outStr;
});

//#endregion

const service = serviceBuilder(api, foccacia);
const webApi = webApiBuilder(service);
const webUi = webUiBuilder(service);
passportBuilder(foccacia);

//#region Authentication

app.use(session({
    secret: "foccacia-secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//#endregion

//#region API Endpoints

app.get("/api/teams", webApi.searchTeams);
app.get("/api/leagues", webApi.searchLeagues);

app.post("/api/groups", webApi.createGroup);
app.put("/api/groups/:id", webApi.editGroup);
app.get("/api/groups", webApi.listGroups);
app.delete("/api/groups/:id", webApi.deleteGroup);
app.get("/api/groups/:id", webApi.getGroupDetails);
app.post("/api/groups/:id/teams", webApi.addTeamsToGroup);
app.delete("/api/groups/:id/teams/:idt/leagues/:idl/seasons/:season", webApi.removeTeamFromGroup);

app.post("/api/users", webApi.createUser);

//#endregion

//#region UI Endpoints

app.get("/", webUi.home);
app.get("/signup", webUi.signupForm);
app.post("/signup", webUi.signup);
app.get("/login", webUi.login);
app.post("/login", passport.authenticate("local", {
    successRedirect: "/groups",
    failureRedirect: "/login"
}));
app.post("/logout", webUi.logout);

app.get("/search", webUi.searchTeams);
app.get("/search/:team", webUi.getLeagues);

const priv = express.Router();

priv.get("/groups", webUi.listGroups);
priv.get("/groups/create", webUi.createGroupForm);
priv.post("/groups/create", webUi.createGroup);
priv.get("/groups/:id", webUi.getGroupDetails);
priv.get("/groups/:id/edit", webUi.editGroupForm);
priv.post("/groups/:id/edit", webUi.editGroup);
priv.post("/groups/:id/teams/:team/leagues", webUi.addTeamToGroup);

priv.use((req, res, next) => {
    if (req.isAuthenticated())
        return next();

    res.redirect("/login");
});

app.use("/", priv);

//#endregion

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
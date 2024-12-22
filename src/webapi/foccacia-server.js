import express from "express";
import hbs from "hbs";
import webApiBuilder from "./foccacia-web-api.js";
import webUiBuilder from "./foccacia-web-ui.js";
import serviceBuilder from "../service/foccacia-services.js";
import api from "../data/fapi-teams-data.js";
import foccacia from "../data/foccacia-elastic.js";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "hbs");
app.set("views", "views");

//#region Handlebars

hbs.registerPartials("./views/components");
hbs.registerPartials("./views/common");
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

//#region Website Endpoints

app.get("/", webUi.home);
app.get("/signup", webUi.signup);
app.get("/login", webUi.login);
app.get("/groups", webUi.listGroups);
app.get("/groups/create", webUi.createGroupForm);
app.post("/groups/create", webUi.createGroup);
app.get("/groups/:id", webUi.getGroupDetails);
app.get("/groups/:id/teams", webUi.searchTeams);
app.get("/groups/:id/teams/:team/leagues", webUi.getLeagues);
app.post("/groups/:id/teams/:team/leagues", webUi.addTeamsToGroup);
app.post("/groups/:id/teams/:team/leagues/:league/seasons/:season", webUi.addTeamsToGroup);

//#endregion

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
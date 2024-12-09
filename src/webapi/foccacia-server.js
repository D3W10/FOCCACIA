import express from "express";
import hbs from "hbs";
import webApiBuilder from "./foccacia-web-api.js";
import serviceBuilder from "../service/foccacia-services.js";
import api from "../data/fapi-teams-data.js";
import foccacia from "../data/foccacia-data-mem.js";
import webUi from "./foccacia-web-ui.js";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.set("view engine", "hbs");
app.set("views", "views");

hbs.registerPartials("./views/components");

const service = serviceBuilder(api, foccacia);
const webApi = webApiBuilder(service);

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

//#endregion

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
import express from "express";
import webApiBuilder from "./web-api.js";
import serviceBuilder from "../service/service.js";
import api from "../data/data-api.js";
import foccacia from "../data/data-foccacia.js";

const PORT = 8080;
const app = express();

app.use(express.json());

const service = serviceBuilder(api, foccacia);
const webApi = webApiBuilder(service);

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

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
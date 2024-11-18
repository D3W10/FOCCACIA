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

app.post("/groups", webApi.createGroup);
app.put("/groups/:id", webApi.editGroup);
app.get("/groups", webApi.listGroup);
app.delete("/groups/:id", webApi.deleteGroup);
app.get("/groups/:id", webApi.getDetailsOfGroup);
app.post("/groups/:id/teams", webApi.addTeamToGroup);
app.delete("/groups/:id/teams/:idt", webApi.removeTeamFromGroup);
app.post("/user", webApi.createUser);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
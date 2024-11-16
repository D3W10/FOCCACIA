import express from 'express'
import webApi from './web-api.js'

const app = express()

app.use(express.json())

/*
put update
get obter
post criar
delete apagar
*/
//app.get("/teams", webApi.searchClubByName)

app.post("/groups", webApi.createGroup)
app.put("/groups/:id", webApi.editGroup)
app.get("/groups", webApi.listGroup)
app.delete("/groups/:id", webApi.deleteGroup)
app.get("/groups/:id", webApi.getDetailsOfGroup)
app.post("/groups/:id/teams", webApi.addTeamToGroup)
app.delete("/groups/:id/teams/:idt", webApi.removeTeamFromGroup)

app.listen(8080, ()=>console.log("Listening..."))

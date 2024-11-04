import express from 'express'
import webApi from './web-api.js'

const app = express()

app.use(express.json())

app.get("/teams", webApi.searchClubByName)


app.listen(8080, ()=>console.log("Listening..."))

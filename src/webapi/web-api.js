import service from "./tasks-service.js"

function searchClubByName(req, resp){
    console.log(req.query)
    resp.json(service.searchClubByName())
}


export const webapi = {
    searchClubByName
}

export default webapi
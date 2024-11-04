import data from "./tasks-data.js"

function searchClubByName(limit){
    //verificar se limite é valido (e.g. positivo) 
    return data.searchClubByName()
}


export const service = {
    searchClubByName
}

export default service
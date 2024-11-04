import service from "../service/service.js";

const SERVER_ERROR = "Unknown Error";

function error(res, message, isServer = false){
    res.status(!isServer ? 400 : 500).json({
        message
    });
}

/*
function searchClubByName(req, res){
    console.log(req.query)
    res.json(service.searchClubByName())
}
*/

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function createGroup(req, res){
    try{
        const body = await req.json();
        if(body.name === undefined){
            error(res, "Group name missing");
        }
        else if(body.description === undefined){
            error(res, "Group description missing");
        }
        else {
            //TODO depende de service
        }

    }catch(e){
        console.error(e);
        error(res, SERVER_ERROR, true);
    }
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function editGroup(req, res){

}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function listGroup(req, res){

}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function deleteGroup(req, res){

}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function getDetailsOfGroup(req, res){

}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function addTeamToGroup(req, res){

}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function removeTeamFromGroup(req, res){

}




export const webapi = {
    //searchClubByName
    createGroup,
    editGroup,
    listGroup,
    deleteGroup,
    getDetailsOfGroup,
    addTeamToGroup,
    removeTeamFromGroup
}

export default webapi
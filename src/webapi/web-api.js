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
//json so em post e put

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
        else if(body.teams === undefined){
            error(res, "Team is missing")
        }
        else {
            service.createGroup
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
async function editGroup(req, res){
    try{
        const body = await req.json();

        if(body.name === undefined && body.description === undefined){
            error(res, "No fields were specified");
        }
        else {
            service.editGroup(req.params.id, {
                name: body.name,
                description: body.description
            })
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
function listGroup(req, res){
    try{
        //nao necessita validaçao pela parte do utilizador

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
function deleteGroup(req, res){
    try{
        if(isNaN(+req.params.id)){
            error(res, "Invalid Group ID")
        }
        else{
            service.deleteGroup
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
function getDetailsOfGroup(req, res){
    try{
        //TODO depende de service

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
async function addTeamToGroup(req, res){
    try{
        const body = await req.json();

        if(body.teamId === undefined){
            error(res, "Team Id is missing");
        }
        else if(body.leagueId  === undefined){
            error(res, "League Id is missing");
        }
        else if(body.season  === undefined){
            error(res, "Season is missing");
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
function removeTeamFromGroup(req, res){
    try{
        //TODO depende de service

    }catch(e){
        console.error(e);
        error(res, SERVER_ERROR, true);
    }
}

function createUser(req,res){
    try{
        //TODO depende de service

    }catch(e){
        console.error(e);
        error(res, SERVER_ERROR, true);
    }
}


export const webapi = {
    //searchClubByName
    createGroup,
    editGroup,
    listGroup,
    deleteGroup,
    getDetailsOfGroup,
    addTeamToGroup,
    removeTeamFromGroup,
    createUser
}

export default webapi
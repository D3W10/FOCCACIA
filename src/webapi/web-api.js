import service from "../service/service.js";

const SERVER_ERROR = "Unknown Error";

function error(res, message, status = 400){
    res.status(status).json({
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
            service.createGroup(body.name, body.description, body.teams)
        }

    }catch(e){
        console.error(e);
        error(res, SERVER_ERROR, 500);
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
        error(res, SERVER_ERROR, 500);
    }
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function listGroup(req, res){
    try{
        const auth = req.headers.get("Authorization")
        if(auth === null){
            error(res, "Unauthorized", 401);
        }
        else{
            service.listGroup(auth.replace("Bearer ", ""))
        }

    }catch(e){
        console.error(e);
        error(res, SERVER_ERROR, 500);
    }
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function deleteGroup(req, res){
    try{
        const id = +req.params.id;
        if(isNaN(id)){
            error(res, "Invalid Group ID")
        }
        else{
            service.deleteGroup(id)
        }
    }catch(e){
        console.error(e);
        error(res, SERVER_ERROR, 500);
    }
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function getDetailsOfGroup(req, res){
    try {
        const id = +req.params.id
        const auth = req.headers.get("Authorization")
        if(auth === null){
            error(res, "Unauthorized", 401);
        }
        else if(isNaN(id)){
            error(res, "Invalid Group ID")
        }
        else{
            service.getDetailsOfGroup(id, token)
        }
    } catch (e) {
        console.error(e);
        error(res, SERVER_ERROR, 500);
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
        const gid = +req.params.id
        
        if(isNaN(gid)){
            error(res, "Invalid Group ID")
        }
        else if(body.teamId === undefined){
            error(res, "Team Id is missing");
        }
        else if(body.leagueId  === undefined){
            error(res, "League Id is missing");
        }
        else if(body.season  === undefined){
            error(res, "Season is missing");
        }
        else {
            service.addTeamToGroup(gid, [body.teamId]);
        }


    }catch(e){
        console.error(e);
        error(res, SERVER_ERROR, 500);
    }
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function removeTeamFromGroup(req, res){
    try{
        const gid = +req.params.id
        const tid = +req.params.idt

        if(isNaN(id)){
            error(res, "Invalid Group ID")
        }
        else if(isNaN(tid)){
            error(res, "Invalid Team ID")
        }
        else{
            service.removeTeamFromGroup(id, [idt])
        }
    }catch(e){
        console.error(e);
        error(res, SERVER_ERROR, 500);
    }
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function createUser(req,res){
    try{
        const body = await req.json();

        if(body.name === undefined){
            error(res, "Name is missing");
        }
        else{
            service.createUser(body.name);
        }

    }catch(e){
        console.error(e);
        error(res, SERVER_ERROR, 500);
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
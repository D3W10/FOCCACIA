import { getError } from "../utils/errorManager.js";

/**
 * @typedef {import("express").Request & {json: () => Promise<any>}} Request
 * @typedef {import("express").Response} Response
 */

const SERVER_ERROR = "Unknown Error";

function success(res, data, status = 200){
    res.status(status).json({ data });
}

export default (service) => ({
    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    createGroup: async (req, res) => {
        try{
            const auth = req.headers.authorization;
            const body = await req.json();

            if (!body.name)
                getError(res, "w1");
            else if (!auth)
                getError(res, "w3");
            else
                success(res, await service.createGroup(body.name, body.description, body.teams, auth.replace("Bearer ", "")), 201);
        } catch (e) {
            console.error(e);
            getError(res);
        }
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    editGroup: async (req, res) => {
        try{
            const auth = req.headers.authorization;
            const body = await req.json();

            if (!body.name && !body.description)
                getError(res, "w2");
            else if (!auth)
                getError(res, "w3");
            else
                success(res, await service.editGroup(req.params.id, {
                    name: body.name,
                    description: body.description
                }, auth.replace("Bearer ", "")))
        } catch (e) {
            console.error(e);
            getError(res);
        }
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    listGroup: async (req, res) => {
        try{
            const auth = req.headers.authorization;

            if (!auth)
                getError(res, "w3");
            else
                success(res, await service.listGroup(auth.replace("Bearer ", "")))
        } catch (e) {
            console.error(e);
            getError(res);
        }
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    deleteGroup: async (req, res) => {
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
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    getDetailsOfGroup: async (req, res) => {
        try {
            const id = +req.params.id
            const auth = req.headers.authorization;
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
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    addTeamToGroup: async (req, res) => {
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
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    removeTeamFromGroup: async (req, res) => {
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
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    createUser: async (req, res) => {
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
});
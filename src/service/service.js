import { getTeamsByName } from "../data/data-api.js";
import { createGroup, createUser, deleteGroup, getGroupsByUser, updateGroup } from "../data/data-foccacia.js";

const service = {
    createGroup: (name, description, teams) => {
        const equipas = teams.map(e => getTeamsByName(e)[0]);

        createGroup(name, description, equipas);
    },
    editGroup: (id, updates) => updateGroup(id, updates),    
    listGroup: token => getGroupsByUser(token),
    deleteGroup: id => deleteGroup(id),
    getDetailsOfGroup: (id, token) => {
        getGroupsByUser(token)
            .then(g => {
                g.filter(group => group.id === id)
            })
    },
    addTeamToGroup: (gid, tid) =>addTeamsToGroup(gid, tid),
    removeTeamFromGroup: (id, idt) => removeTeamsFromGroup(id,idt),
    createUser: () => {

    }
}

export default service;
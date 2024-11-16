import { getTeamsByName } from "../data/data-api.js";
import { createGroup, createUser, deleteGroup, updateGroup } from "../data/data-foccacia.js";

const service = {
    createGroup: (name, description, teams) => {
        const equipas = teams.map(e => getTeamsByName(e)[0]);

        createGroup(name, description, equipas);
    },
    editGroup: (id, updates) => updateGroup(id, updates),    
    listGroup: () => {

    },
    deleteGroup: id => deleteGroup(id),
    getDetailsOfGroup: () => {

    },
    addTeamToGroup: () => {

    },
    removeTeamFromGroup: () => {

    }
    
}

export default service;
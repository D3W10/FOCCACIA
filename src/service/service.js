import { getTeamsByName } from "../data/data-api.js";
import { createGroup, deleteGroup } from "../data/data-foccacia.js";

const service = {
    createGroup: (name, description, teams) => {
        const equipas = teams.map(e => getTeamsByName(e)[0]);

        createGroup(name, description, equipas);
    },
    deleteGroup: id => deleteGroup(id)
}

export default service;
export default (api, foccacia) => ({
    createGroup: (name, description, teams) => {
        const equipas = teams.map(e => api.getTeamsByName(e)[0]);

        foccacia.createGroup(name, description, equipas);
    },
    editGroup: (id, updates) => foccacia.updateGroup(id, updates),    
    listGroup: token => foccacia.getGroupsByUser(token),
    deleteGroup: id => foccacia.deleteGroup(id),
    getDetailsOfGroup: (id, token) => {
        foccacia.getGroupsByUser(token)
            .then(g => {
                g.filter(group => group.id === id)
            })
    },
    addTeamToGroup: (gid, tid) => foccacia.addTeamsToGroup(gid, tid),
    removeTeamFromGroup: (id, idt) => foccacia.removeTeamsFromGroup(id,idt),
    createUser: name => foccacia.createUser(name)
});
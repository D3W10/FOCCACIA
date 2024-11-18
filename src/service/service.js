export default (api, foccacia) => ({
    createGroup: (name, description = "", teamIds = [], token) => {
        const teams = teamIds.map(e => api.getTeamsByName(e)[0]);

        return foccacia.createGroup(name, description, teams, token);
    },
    editGroup: (id, updates, token) => foccacia.updateGroup(id, updates, token),    
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
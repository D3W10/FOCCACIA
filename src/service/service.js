export default (api, foccacia) => ({
    createGroup: (name, description = "", teamIds = []) => {
        const teams = teamIds.map(e => api.getTeamsByName(e)[0]);

        return foccacia.createGroup(name, description, teams);
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
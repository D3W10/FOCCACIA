export default (api, foccacia) => ({
    searchClubs: name => api.getClubsByName(name),
    searchLeagues: team => api.getLeaguesByTeam(team),
    createGroup: (name, description = "", teamNames = [], token) => {
        const teams = teamNames.map(e => api.getTeamsByName(e)[0]);

        return foccacia.createGroup(name, description, teams, token);
    },
    editGroup: (id, updates, token) => foccacia.updateGroup(id, updates, token),    
    listGroup: token => foccacia.getGroupsByUser(token),
    deleteGroup: (id, token) => foccacia.deleteGroup(id, token),
    getDetailsOfGroup: (id, token) => {
        return foccacia.getGroupsByUser(token).then(g => g.filter(group => group.id === id))
    },
    addTeamsToGroup: (gid, teamNames, token) => {
        const teams = teamNames.map(e => api.getTeamsByName(e)[0]);

        return foccacia.addTeamsToGroup(gid, teams, token);
    },
    removeTeamsFromGroup: (id, idt, token) => foccacia.removeTeamsFromGroup(id, [idt], token),
    createUser: name => foccacia.createUser(name)
});
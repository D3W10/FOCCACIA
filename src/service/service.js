const throwError = code => Promise.reject({ code });

export default (api, foccacia) => {
    const teamTransformer = teams => Promise.all(
        teams.map(async t => {
            const team = await api.getTeamById(t.id);
            const league = await api.getLeagueById(t.leagueId);

            if (!team || !league)
                return throwError("s1");

            return {
                id: t.id,
                name: team.name,
                leagueId: t.leagueId,
                league: league.name,
                season: t.season,
                stadium: team.stadium
            };
        })
    );

    async function getUserSafely(token) {
        const user = await foccacia.getUserByToken(token);
        if (!user)
            return throwError("s2");
    
        return user;
    }

    async function getGroupSafely(id, userId) {
        const group = await foccacia.getGroupById(id);
        if (!group)
            return throwError("s3");
        else if (group.userId !== userId)
            return throwError("w4");

        return group;
    }

    return {
        searchTeams: async name => {
            const teams = await api.getTeamsByName(name);

            return teams ? teams : throwError("s1");
        },

        searchLeagues: async team => {
            const leagues = await api.getLeaguesByTeam(team);

            return leagues ? leagues : throwError("s1");
        },

        createGroup: async (name, description = "", teams = [], token) => {
            const user = await getUserSafely(token);
            const pTeams = await teamTransformer(teams);

            return foccacia.createGroup(name, description, pTeams, user.id);
        },

        editGroup: async (id, updates = {}, token) => {
            const user = await getUserSafely(token);
            await getGroupSafely(id, user.id);

            return foccacia.updateGroup(id, updates);
        },

        listGroups: async token => {
            const user = await getUserSafely(token);

            return foccacia.getGroupsByUser(user.id).then(groups => groups.map(g => g.id));
        },

        deleteGroup: async (id, token) => {
            const user = await getUserSafely(token);
            await getGroupSafely(id, user.id);

            return foccacia.deleteGroup(id);
        },

        getGroupDetails: async (id, token) => {
            const user = await getUserSafely(token);
            const { userId, ...group } = await getGroupSafely(id, user.id);

            return group;
        },

        addTeamsToGroup: async (id, teams = [], token) => {
            const user = await getUserSafely(token);
            await getGroupSafely(id, user.id);
            const pTeams = await teamTransformer(teams);

            return foccacia.addTeamsToGroup(id, pTeams);
        },

        removeTeamFromGroup: async (id, idt, idl, season, token) => {
            const user = await getUserSafely(token);
            await getGroupSafely(id, user.id);

            return foccacia.removeTeamsFromGroup(id, idt, idl, season);
        },

        createUser: async name => foccacia.createUser(name)
    };
};
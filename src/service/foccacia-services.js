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
                stadium: team.stadium,
                logo: team.logo
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
            return throwError("a7");
        else if (group.userId !== userId)
            return throwError("a8");

        return group;
    }

    async function getAuth(header) {
        const auth = header.split(" ", 2);
    
        if (auth.length < 2 || auth[0] !== "Bearer")
            return throwError("h1");
        else
            return auth[1];
    }

    return {
        searchTeams: async name => {
            if (!name)
                return throwError("a1");

            const teams = await api.getTeamsByName(name);

            return teams ?? throwError("s1");
        },

        searchLeagues: async team => {
            if (!team || isNaN(team))
                return throwError("a2");

            const leagues = await api.getLeaguesByTeam(team);

            return leagues ?? throwError("s1");
        },

        createGroup: async (name, description = "", teams = [], auth) => {
            if (!name)
                return throwError("a3");
            else if (!Array.isArray(teams) || !teams.every(t => typeof t.id === "number" && typeof t.leagueId === "number" && typeof t.season === "number"))
                return throwError("a4");

            const token = await getAuth(auth);
            const user = await getUserSafely(token);
            const pTeams = await teamTransformer(teams);

            return foccacia.createGroup(name, description, pTeams, user.id);
        },

        editGroup: async (id, updates = {}, auth) => {
            if (!id)
                return throwError("a5");
            else if (!updates.name && !updates.description)
                return throwError("a6");

            const token = await getAuth(auth);
            const user = await getUserSafely(token);
            await getGroupSafely(id, user.id);

            return foccacia.updateGroup(id, updates);
        },

        listGroups: async auth => {
            const token = await getAuth(auth);
            const user = await getUserSafely(token);

            return (await foccacia.getGroupsByUser(user.id)).map(g => g.id);
        },

        deleteGroup: async (id, auth) => {
            if (!id)
                return throwError("a5");

            const token = await getAuth(auth);
            const user = await getUserSafely(token);
            await getGroupSafely(id, user.id);

            return foccacia.deleteGroup(id);
        },

        getGroupDetails: async (id, auth) => {
            if (!id)
                return throwError("a5");

            const token = await getAuth(auth);
            const user = await getUserSafely(token);
            const { userId, ...group } = await getGroupSafely(id, user.id);

            return group;
        },

        addTeamsToGroup: async (id, teams = [], auth) => {
            if (!id)
                return throwError("a5");
            else if (!Array.isArray(teams) || !teams.every(t => typeof t.id === "number" && typeof t.leagueId === "number" && typeof t.season === "number"))
                return throwError("a4");

            const token = await getAuth(auth);
            const user = await getUserSafely(token);
            const group = await getGroupSafely(id, user.id);
            const pTeams = await teamTransformer(teams);
            const teamsToAdd = pTeams.filter(t => !group.teams.some(gt => Object.keys(gt).every(key => gt[key] === t[key])));

            if (teamsToAdd.length === 0)
                return throwError("a13");

            return foccacia.addTeamsToGroup(id, teamsToAdd);
        },

        removeTeamFromGroup: async (id, idt, idl, season, auth) => {
            if (!id)
                return throwError("a5");
            else if (!idt || isNaN(idt))
                return throwError("a2");
            else if (!idl || isNaN(idl))
                return throwError("a9");
            else if (!season || isNaN(season))
                return throwError("a10");

            const token = await getAuth(auth);
            const user = await getUserSafely(token);
            await getGroupSafely(id, user.id);

            if (!foccacia.getTeamOfGroup(id, idt, idl, season))
                return throwError("a11");

            return foccacia.removeTeamFromGroup(id, idt, idl, season);
        },

        createUser: async name => {
            if (!name)
                return throwError("a12");

            return foccacia.createUser(name);
        }
    };
};
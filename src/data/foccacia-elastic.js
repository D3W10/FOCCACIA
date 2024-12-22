/**
 * @typedef {import("../data/foccacia-data-mem").User} User
 * @typedef {import("../data/foccacia-data-mem").Group} Group
 * @typedef {import("../data/foccacia-data-mem").SafeGroup} SafeGroup
 * @typedef {import("../data/foccacia-data-mem").Team} Team
 */

const ELASTIC_URL = "http://localhost:9200";

/**
 * @param {Object} o 
 * @returns {Object}
*/
const parse = o => ({
    id: o._id,
    ...o._source
});

/**
 * @param {Object} u
 * @returns {User}
 */
const parseUser = u => parse(u);

/**
 * @param {Object} g
 * @returns {Group}
 */
const parseGroup = g => parse(g);

/**
 * @param {Group} g 
 * @returns {SafeGroup}
 */
const getSafeGroup = g => {
    const { userId, ...s } = g;
    return s;
};

/**
 * @param {String} path
 * @param {"GET" | "POST" | "PUT" | "DELETE"} method
 * @param {Object} body
 * @returns {Promise<any | undefined>}
 */
async function fetchData(path, method = "GET", body = undefined) {
    const response = await fetch(`${ELASTIC_URL}/${path}`, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body: ["POST", "PUT"].includes(method) ? JSON.stringify(body) : body
    });

    if (response.ok)
        return await response.json();
}

/**
 * Obtains the user with a specific token
 * @param {String} token
 * @returns {Promise<User | undefined>}
 */
async function getUserByToken(token){
    const data = await fetchData(`users/_search?q=token:"${token}"`);

    return data && data.hits.hits.length > 0 ? parseUser(data.hits.hits[0]) : undefined;
}

/**
 * Obtains the group with a specific id
 * @param {Group["id"]} id 
 * @returns {Promise<Group | undefined>}
 */
async function getGroupById(id) {
    const data = await fetchData(`groups/_doc/${id}`);

    return data ? parseGroup(data) : undefined;
}

/**
 * Creates a new group
 * @param {String} name
 * @param {String} description
 * @param {Team[]} teams
 * @param {User["id"]} user
 * @returns {Promise<SafeGroup>}
 */
async function createGroup(name, description, teams, user) {
    const newGroup = {
        name,
        description: description || "",
        userId: user,
        teams: teams || []
    };

    return getSafeGroup({
        id: (await fetchData("groups/_doc", "POST", newGroup))._id,
        ...newGroup
    });
}

/**
 * Updates a group
 * @param {Group["id"]} id
 * @param {Partial<Group>} changes
 * @returns {Promise<SafeGroup>}
 */
async function updateGroup(id, changes) {
    const group = parseGroup(await fetchData(`groups/_doc/${id}`));

    Object.assign(group, Object.fromEntries(
        Object.entries(changes).filter(([_, value]) => value !== undefined)
    ));

    delete group.id
    await fetchData(`groups/_update/${id}`, "POST", { doc: group });

    return getSafeGroup(group);
}

/**
 * Gets all the groups from a user
 * @param {User["id"]} user 
 * @returns {Promise<SafeGroup[]>}
 */
async function getGroupsByUser(user) {
    const groups = (await fetchData(`groups/_search?q=userId:${user}`)).hits.hits
        .map(parseGroup)
        .map(getSafeGroup);

    return groups;
}

/**
 * Deletes a group
 * @param {Group["id"]} id
 * @returns {Promise<void>}
 */
async function deleteGroup(id) {
    await fetchData(`groups/_doc/${id}`, "DELETE");
}

/**
 * Adds teams to a group
 * @param {Group["id"]} id
 * @param {Team[]} teams
 * @returns {Promise<void>}
 */
async function addTeamsToGroup(id, teams) {
    const group = await getGroupById(id)
    group.teams.push(...teams);

    await fetchData(`groups/_doc/${id}`, "PUT", group);
}

/**
 * Remove a team from a group
 * @param {Group["id"]} id
 * @param {Team["id"]} idTeam
 * @param {Number} leagueId
 * @param {Number} season
 * @returns {Promise<Team>}
 */
async function getTeamOfGroup(id, idTeam, leagueId, season) {
    return (await getGroupById(id)).teams.find(t => t.id === idTeam && t.leagueId === leagueId && t.season === season);
}

/**
 * Remove a team from a group
 * @param {Group["id"]} id
 * @param {Team["id"]} idTeam
 * @param {Number} leagueId
 * @param {Number} season
 * @returns {Promise<void>}
 */
async function removeTeamFromGroup(id, idTeam, leagueId, season) {
    const group = await getGroupById(id);
    group.teams = group.teams.filter(t => t.id !== idTeam || t.leagueId !== leagueId || t.season !== season);

    await fetchData(`groups/_doc/${id}`, "PUT", group);
}

/**
 * Creates a new user
 * @param {String} name
 * @returns {Promise<User>}
 */
async function createUser(name) {
    const newUser = {
        name,
        token: crypto.randomUUID()
    };

    return {
        id: (await fetchData("users/_doc", "POST", newUser))._id,
        ...newUser
    };
}

export default {
    getUserByToken,
    getGroupById,
    createGroup,
    updateGroup,
    getGroupsByUser,
    deleteGroup,
    addTeamsToGroup,
    getTeamOfGroup,
    removeTeamFromGroup,
    createUser
}
/**
 * @typedef {Object} Team
 * @property {Number} id
 * @property {String} name
 * @property {Number} leagueId
 * @property {String} league
 * @property {Number} season
 * @property {String} stadium
 * @property {String} logo
 *
 * @typedef {Object} Group
 * @property {String} id
 * @property {String} name 
 * @property {String} description
 * @property {String} userId
 * @property {Team[]} teams
 * 
 * @typedef {Object} SafeGroup
 * @property {String} id
 * @property {String} name 
 * @property {String} description
 * @property {Team[]} teams
 * 
 * @typedef {Object} User
 * @property {String} id
 * @property {String} username
 * @property {String} password
 * @property {String} token
 */

const USER_ID_START = 1, GROUP_ID_START = 1;

let nextUserId = USER_ID_START;
let nextGroupId = GROUP_ID_START;

/** @type {User[]} */
const users = [];

/** @type {Group[]} */
const groups = [];

/**
 * Obtains the user with a specific token
 * @param {String} token
 * @returns {Promise<User | undefined>}
 */
function getUserByToken(token){
    return Promise.resolve(users.find(u => u.token === token));
}

/**
 * Obtains the group with a specific id
 * @param {Group["id"]} id 
 * @returns {Promise<Group | undefined>}
 */
function getGroupById(id) {
    return Promise.resolve(groups.find(g => g.id === id));
}

/**
 * Creates a new group
 * @param {String} name
 * @param {String} description
 * @param {Team[]} teams
 * @param {User["id"]} user
 * @returns {Promise<SafeGroup>}
 */
function createGroup(name, description, teams, user) {
    const group = {
        id: (nextGroupId++).toString(),
        name,
        description: description || "",
        userId: user,
        teams: teams || []
    };

    groups.push(group);

    const { userId, ...safeGroup } = group;
    return Promise.resolve(safeGroup);
}

/**
 * Updates a group
 * @param {Group["id"]} id
 * @param {Partial<Group>} changes
 * @returns {Promise<SafeGroup>}
 */
function updateGroup(id, changes) {
    const group = groups.find(g => g.id === id);

    Object.assign(group, Object.fromEntries(
        Object.entries(changes).filter(([_, value]) => value !== undefined)
    ));

    const { userId, ...safeGroup } = group;
    return Promise.resolve(safeGroup);
}

/**
 * Gets all the groups from a user
 * @param {User["id"]} user 
 * @returns {Promise<Group[]>}
 */
function getGroupsByUser(user) {
    return Promise.resolve(groups.filter(g => g.userId === user));
}

/**
 * Deletes a group
 * @param {Group["id"]} id
 * @returns {Promise<void>}
 */
function deleteGroup(id) {
    groups.splice(groups.findIndex(g => g.id === id), 1);
    return Promise.resolve();
}

/**
 * Adds teams to a group
 * @param {Group["id"]} id
 * @param {Team[]} teams
 * @returns {Promise<void>}
 */
function addTeamsToGroup(id, teams) {
    const group = groups.find(g => g.id === id);
    group.teams = [...new Set([...group.teams, ...teams])];

    return Promise.resolve();
}

/**
 * Remove a team from a group
 * @param {Group["id"]} id
 * @param {Team["id"]} idTeam
 * @param {Number} leagueId
 * @param {Number} season
 * @returns {Promise<Team>}
 */
function getTeamOfGroup(id, idTeam, leagueId, season) {
    return Promise.resolve(groups.find(g => g.id === id).teams.find(t => t.id === idTeam && t.leagueId === leagueId && t.season === season));
}

/**
 * Remove a team from a group
 * @param {Group["id"]} id
 * @param {Team["id"]} idTeam
 * @param {Number} leagueId
 * @param {Number} season
 * @returns {Promise<void>}
 */
function removeTeamFromGroup(id, idTeam, leagueId, season) {
    const group = groups.find(g => g.id === id);
    group.teams = group.teams.filter(t => t.id !== idTeam || t.leagueId !== leagueId || t.season !== season);

    return Promise.resolve();
}

/**
 * Checks if a username is being used
 * @param {String} username
 * @returns {Promise<Boolean>}
 */
function isUsernameAvailable(username) {
    return Promise.resolve(users.find(u => u.username == username) == undefined);
}

/**
 * Creates a new user
 * @param {String} username
 * @param {String} password
 * @returns {Promise<User>}
 */
function createUser(username, password) {
    const newUser = {
        id: (nextUserId++).toString(),
        username,
        password,
        token: crypto.randomUUID()
    };

    users.push(newUser);
    return Promise.resolve(newUser);
}

/**
 * Logs in a user
 * @param {String} username
 * @param {String} password 
 * @returns {Promise<User | undefined>}
 */
function login(username, password) {
    return Promise.resolve(users.find(u => u.username == username && u.password == password));
}

function resetData() {
    nextUserId = USER_ID_START;
    nextGroupId = GROUP_ID_START;
    users.length = 0;
    groups.length = 0;
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
    isUsernameAvailable,
    createUser,
    login,
    resetData
}
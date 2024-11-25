/**
 * @typedef {Object} Team
 * @property {Number} id
 * @property {String} name
 * @property {Number} leagueId
 * @property {String} league
 * @property {Number} season
 * @property {String} stadium
 *
 * @typedef {Object} Group
 * @property {Number} id
 * @property {String} name 
 * @property {String} description
 * @property {Number} userId
 * @property {Team[]} teams
 * 
 * @typedef {Object} User
 * @property {Number} id
 * @property {String} name
 * @property {String} token
 */

let nextUserId = 1;
let nextGroupId = 1;

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
 * @param {Number} id 
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
 * @returns {Promise<Omit<Group, "userId">>}
 */
function createGroup(name, description, teams, user) {
    const group = {
        id: nextGroupId++,
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
 * @param {Number} id
 * @param {Partial<Group>} changes
 * @returns {Promise<Omit<Group, "userId">>}
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
 * @param {Number} id
 * @returns {Promise<void>}
 */
function deleteGroup(id) {
    groups.splice(groups.findIndex(g => g.id === id), 1);
    return Promise.resolve();
}

/**
 * Adds teams to a group
 * @param {Number} id
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
 * @param {Number} id
 * @param {Number} idt
 * @param {Number} idl
 * @param {Number} season
 * @returns {Promise<void>}
 */
function removeTeamsFromGroup(id, idt, idl, season) {
    const group = groups.find(g => g.id === id);
    group.teams.filter(t => t.id === idt && t.leagueId === idl && t.season === season);

    return Promise.resolve();
}

/**
 * Creates a new user
 * @param {String} name
 * @returns {Promise<User>}
 */
function createUser(name) {
    const newUser = {
        id: nextUserId++,
        name,
        token: crypto.randomUUID()
    };

    users.push(newUser);
    return Promise.resolve(newUser);
}

export default {
    getUserByToken,
    getGroupById,
    createGroup,
    updateGroup,
    getGroupsByUser,
    deleteGroup,
    addTeamsToGroup,
    removeTeamsFromGroup,
    createUser
}
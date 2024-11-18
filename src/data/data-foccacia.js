/**
 * @typedef {Object} Team
 * @property {Number} id
 * @property {String} name
 * @property {String} country
 * @property {Number} founded
 * @property {String} logo
 * @property {String} stadium
 * @property {String} city
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

let nextId = 1;

/** @type {User[]} */
const users = [];

/** @type {Group[]} */
const groups = [];

function getUserByToken(token){
    return users.find(u => u.token === token);
}

function getGroupById(id) {
    return groups.find(g => g.id === id);
}

function error(code){
    return Promise.reject({ code });
}

/**
 * Creates a new group
 * @param {String} name
 * @param {String} description
 * @param {Team[]} teams
 * @param {User["token"]} token
 * @returns {Promise<Omit<Group, "userId">>} The created group
 */
function createGroup(name, description, teams, token) {
    const user = getUserByToken(token);
    if (!user)
        return error("d1");

    const group = {
        id: nextId++,
        name,
        description: description || "",
        userId: user.id,
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
 * @param {User["token"]} token
 * @returns {Promise<Group>} The updated group
 */
function updateGroup(id, changes, token) {
    const user = getUserByToken(token);
    if (!user)
        return error("d1");

    const group = getGroupById(id);
    if (!group)
        return error("d2");
    else if (group.userId !== user.id)
        return error("w4");

    Object.assign(group, changes);
    return Promise.resolve(group);
}

/**
 * Gets all the groups from a user
 * @param {User["token"]} token 
 * @returns {Promise<Group[]>}
 */
function getGroupsByUser(token) {
    const user = getUserByToken(token);
    if (!user)
        return error("d1");

    return Promise.resolve(groups.filter(g => g.userId === user.id));
}

/**
 * Deletes a group
 * @param {Number} id
 * @param {User["token"]} token 
 * @returns {Promise<void>}
 */
function deleteGroup(id, token) {
    const user = getUserByToken(token);
    if (!user)
        return error("d1");

    const group = getGroupById(id);
    if (!group)
        return error("d2");
    else if (group.userId !== user.id)
        return error("w4");

    groups.splice(groups.findIndex(g => g.id === id), 1);
    return Promise.resolve();
}

/**
 * Adds teams to a group
 * @param {Number} groupId
 * @param {Team[]} teams
 * @param {User["token"]} token
 * @returns {Promise<void>}
 */
function addTeamsToGroup(groupId, teams, token) {
    const user = getUserByToken(token);
    if (!user)
        return error("d1");

    const group = getGroupById(groupId);
    if (!group)
        return error("d2");
    else if (group.userId !== user.id)
        return error("w4");

    group.teams = [...new Set([...group.teams, ...teams])];

    return Promise.resolve();
}

/**
 * Removes teams from a group
 * @param {Number} groupId
 * @param {Team[]} teams
 * @param {User["token"]} token
 * @returns {Promise<void>}
 */
function removeTeamsFromGroup(groupId, teams, token) {
    const user = getUserByToken(token);
    if (!user)
        return error("d1");

    const group = getGroupById(groupId);
    if (!group)
        return error("d2");
    else if (group.userId !== user.id)
        return error("w4");

    group.teams = group.teams.filter(t => !teams.map(o => o.id).includes(t.id));

    return Promise.resolve();
}

/**
 * Creates a new user
 * @param {String} name
 * @returns {Promise<void>}
 */
function createUser(name) {
    if (!name)
        return error("w6");

    users.push({
        id: nextId++,
        name,
        token: crypto.randomUUID()
    });

    return Promise.resolve();
}

export default {
    createGroup,
    getGroupsByUser,
    updateGroup,
    deleteGroup,
    addTeamsToGroup,
    removeTeamsFromGroup,
    createUser
}
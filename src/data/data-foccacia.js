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

function getGroupById(id) {
    const group = groups.find(g => g.id === id);
    if (!group)
        return error("d2");

    return Promise.resolve(group);
}

/**
 * Gets all the groups from a user
 * @param {User["token"]} token 
 * @returns {Promise<Group[]>}
 */
function getGroupsByUser(token) {
    return Promise.resolve(groups.filter(g => g.token === token));
}

/**
 * Updates a group
 * @param {Number} id
 * @param {Partial<Group>} changes
 * @returns {Promise<Group|undefined>} The updated group or undefined if not found
 */
function updateGroup(id, changes) {
    const group = getGroupById(id);
    if (!group)
        return undefined;

    Object.assign(group, changes);
    return Promise.resolve(group);
}

/**
 * Deletes a group
 * @param {Number} id
 * @returns {boolean} True if group was deleted, false if not found
 */
function deleteGroup(id) {
    const index = groups.findIndex(g => g.id === id);
    if (index === -1) return false;
    
    groups.splice(index, 1);
    return Promise.resolve(true);
}

/**
 * Adds teams to a group
 * @param {Number} groupId
 * @param {Number[]} teamIds
 * @returns {Promise<Group|undefined>}
 */
function addTeamsToGroup(groupId, teamIds) {
    const group = getGroupById(groupId);
    if (!group) return undefined;

    group.teamIds = [...new Set([...group.teamIds, ...teamIds])];
    return Promise.resolve(group);
}

/**
 * Removes teams from a group
 * @param {Number} groupId
 * @param {Number[]} teamIds
 * @returns {Promise<Group|undefined>}
 */
function removeTeamsFromGroup(groupId, teamIds) {
    const group = getGroupById(groupId);
    if (!group) return undefined;

    group.teamIds = group.teamIds.filter(id => !teamIds.includes(id));
    return Promise.resolve(group);
}

function createUser(name) {
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
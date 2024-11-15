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

/**
 * Creates a new group
 * @param {String} name
 * @param {String} description
 * @param {Team[]} teams
 * @returns {Promise<Group>} The created group
 */
export function createGroup(name, description = "", teams = []) {
    const group = {
        id: nextId++,
        name,
        description,
        teams
    };

    groups.push(group);
    return Promise.resolve(group);
}

/**
 * Gets a group by its ID
 * @param {User["id"]} id 
 * @param {User["token"]} token 
 * @returns {Promise<Group[]>}
 */
export function getGroupsByUser(id, token) {
    return Promise.resolve(groups.filter(g => g.userId === id && g.token === token));
}

/**
 * Updates a group
 * @param {Number} id
 * @param {Partial<Group>} updates
 * @returns {Promise<Group|undefined>} The updated group or undefined if not found
 */
export function updateGroup(id, updates) {
    const group = getGroupById(id);
    if (!group) return undefined;

    Object.assign(group, updates);
    return Promise.resolve(group);
}

/**
 * Deletes a group
 * @param {Number} id
 * @returns {boolean} True if group was deleted, false if not found
 */
export function deleteGroup(id) {
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
export function addTeamsToGroup(groupId, teamIds) {
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
export function removeTeamsFromGroup(groupId, teamIds) {
    const group = getGroupById(groupId);
    if (!group) return undefined;

    group.teamIds = group.teamIds.filter(id => !teamIds.includes(id));
    return Promise.resolve(group);
}

export function createUser(name) {
    users.push({
        id: nextId++,
        name,
        token: crypto.randomUUID()
    });

    return Promise.resolve();
}

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
 * @typedef {Object} League
 * @property {Number} id
 * @property {String} name 
 * @property {String} logo
 * @property {String} country
 * @property {Number[]} seasons
 */

const API_URL = "https://v3.football.api-sports.io";
const API_KEY = "83a825990145b3950d8add20554c52e6";

/**
 * @param {Object} t 
 * @returns {Team}
 */
const parseTeam = t => ({
    id: t.team.id,
    name: t.team.name,
    country: t.team.country,
    founded: t.team.founded,
    logo: t.team.logo,
    stadium: t.venue.name,
    city: t.venue.city
});

/**
 * @param {Object} l
 * @returns {League}
 */
const parseLeague = l => ({
    id: l.league.id,
    name: l.league.name,
    logo: l.league.logo,
    country: l.country.name,
    seasons: l.seasons.map(s => s.year)
});

/**
 * @param {String} path 
 * @returns {Promise<Array<any> | undefined>}
 */
async function fetchData(path) {
    const response = await fetch(`${API_URL}/${path}`, {
        method: "GET",
        headers: {
            "x-apisports-key": API_KEY
        }
    });

    if (response.ok) {
        const data = await response.json();

        if (data.response && data.response.length > 0)
            return data.response;
        else
            return [];
    }
    else
        return;
}

/**
 * @param {String} name 
 * @returns {Promise<Array<Team> | undefined>}
 */
async function getTeamsByName(name) {
    const res = await fetchData(`teams?name=${name}`);

    return res ? res.map(parseTeam) : undefined;
}

/**
 * @param {Number} team 
 * @returns {Promise<Array<League> | undefined>}
 */
async function getLeaguesByTeam(team) {
    const res = await fetchData(`leagues?team=${team}`);

    return res ? res.map(parseLeague) : undefined;
}

/**
 * @param {Number} id 
 * @returns {Promise<Team | undefined>}
 */
async function getTeamById(id) {
    const res = await fetchData(`teams?id=${id}`);

    return res ? parseTeam(res[0]) : undefined;
}

/**
 * @param {Number} id 
 * @returns {Promise<League | undefined>}
 */
async function getLeagueById(id) {
    const res = await fetchData(`leagues?id=${id}`);

    return res ? parseLeague(res[0]) : undefined;
}

export default {
    getTeamsByName,
    getLeaguesByTeam,
    getTeamById,
    getLeagueById
}
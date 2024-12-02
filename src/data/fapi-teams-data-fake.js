/**
 * @typedef {import("./fapi-teams-data").Team} Team
 * @typedef {import("./fapi-teams-data").League} League
 */

/**
 * @param {String} name 
 * @returns {Promise<Array<Team> | undefined>}
 */
async function getTeamsByName(name) {
    if (name == "Benfica")
        return [{"id":211,"name":"Benfica","country":"Portugal","founded":1904,"logo":"https://media.api-sports.io/football/teams/211.png","stadium":"Estádio do Sport Lisboa e Benfica (da Luz)","city":"Lisboa"},{"id":21201,"name":"Benfica","country":"Macao","founded":null,"logo":"https://media.api-sports.io/football/teams/21201.png","stadium":"University of Science and Technology Stadium (MUST)","city":"Taipa"}];
    else if (name == "0")
        return [];
    else
        return;
}

/**
 * @param {String} team 
 * @returns {Promise<Array<League> | undefined>}
 */
async function getLeaguesByTeam(team) {
    if (team == "211")
        return [{"id":94,"name":"Primeira Liga","logo":"https://media.api-sports.io/football/leagues/94.png","country":"Portugal","seasons":[2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024]},{"id":2,"name":"UEFA Champions League","logo":"https://media.api-sports.io/football/leagues/2.png","country":"World","seasons":[2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024]},{"id":96,"name":"Taça de Portugal","logo":"https://media.api-sports.io/football/leagues/96.png","country":"Portugal","seasons":[2016,2017,2018,2019,2020,2021,2022,2023,2024]},{"id":550,"name":"Super Cup","logo":"https://media.api-sports.io/football/leagues/550.png","country":"Portugal","seasons":[2016,2017,2019,2020,2023]},{"id":18,"name":"AFC Cup","logo":"https://media.api-sports.io/football/leagues/18.png","country":"World","seasons":[2017,2018]},{"id":26,"name":"International Champions Cup","logo":"https://media.api-sports.io/football/leagues/26.png","country":"World","seasons":[2018,2019]},{"id":3,"name":"UEFA Europa League","logo":"https://media.api-sports.io/football/leagues/3.png","country":"World","seasons":[2018,2019,2020,2023]},{"id":97,"name":"Taça da Liga","logo":"https://media.api-sports.io/football/leagues/97.png","country":"Portugal","seasons":[2019,2020,2021,2022,2023,2024]},{"id":667,"name":"Friendlies Clubs","logo":"https://media.api-sports.io/football/leagues/667.png","country":"World","seasons":[2020,2021,2022,2023,2024]}];
    else if (team == "212")
        return [{"id":94,"name":"Primeira Liga","logo":"https://media.api-sports.io/football/leagues/94.png","country":"Portugal","seasons":[2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024]},{"id":2,"name":"UEFA Champions League","logo":"https://media.api-sports.io/football/leagues/2.png","country":"World","seasons":[2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023]},{"id":76,"name":"Serie D","logo":"https://media.api-sports.io/football/leagues/76.png","country":"Brazil","seasons":[2014]},{"id":3,"name":"UEFA Europa League","logo":"https://media.api-sports.io/football/leagues/3.png","country":"World","seasons":[2015,2019,2021,2024]},{"id":96,"name":"Taça de Portugal","logo":"https://media.api-sports.io/football/leagues/96.png","country":"Portugal","seasons":[2016,2017,2018,2019,2020,2021,2022,2023,2024]},{"id":550,"name":"Super Cup","logo":"https://media.api-sports.io/football/leagues/550.png","country":"Portugal","seasons":[2018,2020,2022,2023,2024]},{"id":97,"name":"Taça da Liga","logo":"https://media.api-sports.io/football/leagues/97.png","country":"Portugal","seasons":[2019,2020,2021,2022,2023,2024]},{"id":667,"name":"Friendlies Clubs","logo":"https://media.api-sports.io/football/leagues/667.png","country":"World","seasons":[2021,2022,2023,2024]}];
    else if (team == "0")
        return [];
    else
        return;
}

/**
 * @param {String} id 
 * @returns {Promise<Team | undefined>}
 */
async function getTeamById(id) {
    if (id == "211")
        return {"id":211,"name":"Benfica","country":"Portugal","founded":1904,"logo":"https://media.api-sports.io/football/teams/211.png","stadium":"Estádio do Sport Lisboa e Benfica (da Luz)","city":"Lisboa"};
    else if (id == "212")
        return {"id":212,"name":"FC Porto","country":"Portugal","founded":1893,"logo":"https://media.api-sports.io/football/teams/212.png","stadium":"Estádio Do Dragão","city":"Porto"};
    else
        return;
}

/**
 * @param {String} id 
 * @returns {Promise<League | undefined>}
 */
async function getLeagueById(id) {
    if (id == "94")
        return {"id":94,"name":"Primeira Liga","logo":"https://media.api-sports.io/football/leagues/94.png","country":"Portugal","seasons":[2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024]};
    else if (id == "3")
        return {"id":3,"name":"UEFA Europa League","logo":"https://media.api-sports.io/football/leagues/3.png","country":"World","seasons":[2018,2019,2020,2023]};
    else
        return;
}

export default {
    getTeamsByName,
    getLeaguesByTeam,
    getTeamById,
    getLeagueById
}
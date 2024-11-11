import { getError } from "../utils/errorManager";

const API_URL = "https://v3.football.api-sports.io";
const API_KEY = "83a825990145b3950d8add20554c52e6";

/**
 * 
 * @param {String} name 
 * @throws {TypeError}
 */
export async function getTeamsByName(name) {
    try {
        const response = await fetch(`${API_URL}/teams?name=${name}`, {
            method: "GET",
            headers: {
                "x-apisports-key": API_KEY
            }
        });
    
        if (response.ok) {
            const data = await response.json();
    
            if (data.response && data.response.length > 0)
                return data.response.map(t => ({
                    id: t.team.id,
                    name: t.team.name,
                    country: t.team.country,
                    founded: t.team.founded,
                    logo: t.team.logo,
                    stadium: t.venue.name,
                    city: t.venue.city
                }));
            else
                return [];
        }
        else
            throw new Error(getError("EXTERNAL_ERROR"));
    }
    catch (error) {
        if (error instanceof SyntaxError)
            throw new Error(getError("JSON_PARSE_ERROR"));
        else
            throw new Error(getError("UNKNOWN_ERROR"));
    }
}

/**
 * 
 * @param {Number} id 
 * @throws {TypeError}
 */
export async function getLeaguesByTeam(id) {
    try {
        const response = await fetch(`${API_URL}/leagues?team=${id}`, {
            method: "GET",
            headers: {
                "x-apisports-key": API_KEY
            }
        });

        if (response.ok) {
            const data = await response.json();
            
            if (data.response && data.response.length > 0)
                return data.response.map(l => ({
                    id: l.league.id,
                    name: l.league.name,
                    logo: l.league.logo,
                    country: l.country.name
                }));
            else 
                return [];
        }
        else
            throw new Error(getError("EXTERNAL_ERROR"));
    }
    catch (error) {
        if (error instanceof SyntaxError)
            throw new Error(getError("JSON_PARSE_ERROR"));
        else
            throw new Error(getError("UNKNOWN_ERROR"));
    }
}
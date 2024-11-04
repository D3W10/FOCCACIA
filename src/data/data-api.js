const API_URL = "https://v3.football.api-sports.io";
const API_KEY = "83a825990145b3950d8add20554c52e6";

async function searchClubByName(name) {
    const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'GET',
        headers: {
            'x-apisports-key': API_KEY // Inclui a chave da API no cabeçalho da requisição
        }
    });
    const data = await response.json(); // Converte a resposta para formato JSON

    // Verifica se a resposta contém dados válidos
    if (data.response && data.response.length > 0) {
        return {
            id: data.response[0].team.id,
            name: data.response[0].team.name,
            stadium: data.response[0].venue.name
        };
    } else {
        console.log(`Nenhum dado encontrado para a equipa com id ${id}`);
        return null; // Retorna null se não houver dados
    }

    






}

export const data = {
    searchClubByName
}

export default data
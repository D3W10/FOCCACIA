import { beforeEach, describe, it } from "mocha";
import { expect, use} from "chai";
import chaiAsPromised from "chai-as-promised";
import serviceBuilder from "../src/service/service.js";
import api from "../src/data/data-api.js";
import foccacia from "../src/data/data-foccacia.js";

use(chaiAsPromised);

describe("Service", () => {
    let service = serviceBuilder(api, foccacia);

    beforeEach(() => foccacia.resetData());

    describe("searchTeams()", () => {
        it("Should return all teams", async () => {
            expect(await service.searchTeams("Benfica")).to.deep.equal(
                [{"id": 211,"name": "Benfica","country": "Portugal","founded": 1904,"logo": "https://media.api-sports.io/football/teams/211.png","stadium": "Estádio do Sport Lisboa e Benfica (da Luz)","city": "Lisboa"},{"id": 21201,"name": "Benfica","country": "Macao","founded": null,"logo": "https://media.api-sports.io/football/teams/21201.png","stadium": "University of Science and Technology Stadium (MUST)","city": "Taipa"}]
            );
        });

        it("Should return empty for non-existing team", async () => {
            expect(await service.searchTeams("3")).to.deep.equal([]);
        });
    });

    describe("searchLeagues()", () => {
        it("Should return all teams", async () => {
            expect(await service.searchLeagues("211")).to.deep.equal(
                [{"id": 94,"name": "Primeira Liga","logo": "https://media.api-sports.io/football/leagues/94.png","country": "Portugal","seasons": [2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024]},{"id": 2,"name": "UEFA Champions League","logo": "https://media.api-sports.io/football/leagues/2.png","country": "World","seasons": [2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024]},{"id": 96,"name": "Taça de Portugal","logo": "https://media.api-sports.io/football/leagues/96.png","country": "Portugal","seasons": [2016,2017,2018,2019,2020,2021,2022,2023,2024]},{"id": 550,"name": "Super Cup","logo": "https://media.api-sports.io/football/leagues/550.png","country": "Portugal","seasons": [2016,2017,2019,2020,2023]},{"id": 18,"name": "AFC Cup","logo": "https://media.api-sports.io/football/leagues/18.png","country": "World","seasons": [2017,2018]},{"id": 26,"name": "International Champions Cup","logo": "https://media.api-sports.io/football/leagues/26.png","country": "World","seasons": [2018,2019]},{"id": 3,"name": "UEFA Europa League","logo": "https://media.api-sports.io/football/leagues/3.png","country": "World","seasons": [2018,2019,2020,2023]},{"id": 97,"name": "Taça da Liga","logo": "https://media.api-sports.io/football/leagues/97.png","country": "Portugal","seasons": [2019,2020,2021,2022,2023,2024]},{"id": 667,"name": "Friendlies Clubs","logo": "https://media.api-sports.io/football/leagues/667.png","country": "World","seasons": [2020,2021,2022,2023,2024]}]
            );
        });

        it("Should return empty for non-existing team", async () => {
            expect(await service.searchLeagues("osdvbhs")).to.deep.equal([]);
        });

    });

    describe("createGroup()", () => {
        it("Should return the created group", async () => {
            const user = (await service.createUser("Joniel")).token;
            expect(await service.createGroup("grupinho", "teste grupo", [], user)).to.deep.equal({
                "id": 1,
                "name": "grupinho",
                "description": "teste grupo",
                "teams": []
            });
        });

        it("Should return the created group (default vals)", async () => {
            const user = (await service.createUser("Joniel")).token;
            expect(await service.createGroup("grupinho", undefined, undefined, user)).to.deep.equal({
                "id": 1,
                "name": "grupinho",
                "description": "",
                "teams": []
            });
        });

        it("Should return the created group with team/s", async () => {
            const user = (await service.createUser("Joniel")).token;
            expect(await service.createGroup("Awesome Group 2", "This is the second best group ever!", [
                {
                    "id": 211,
                    "leagueId": 94,
                    "season": 2022
                }
            ], user)).to.deep.equal(
                {"id": 1,"name": "Awesome Group 2","description": "This is the second best group ever!","teams": [{"id": 211,"name": "Benfica","leagueId": 94,"league": "Primeira Liga","season": 2022,"stadium": "Estádio do Sport Lisboa e Benfica (da Luz)"}]}
            );

            expect(await service.createGroup("Awesome Group 2", "This is the second best group ever!", [
                {
                    "id": 211,
                    "leagueId": 94,
                    "season": 2022
                },
                {
                    "id": 212,
                    "leagueId": 94,
                    "season": 2022
                }
            ], user)).to.deep.equal(
                {"id": 2,"name": "Awesome Group 2","description": "This is the second best group ever!","teams": [{"id": 211,"name": "Benfica","leagueId": 94,"league": "Primeira Liga","season": 2022,"stadium": "Estádio do Sport Lisboa e Benfica (da Luz)"},{"id": 212,"name": "FC Porto","leagueId": 94,"league": "Primeira Liga","season": 2022,"stadium": "Estádio Do Dragão"}]}
            );
        });
    });
    
    describe("editGroup()", () => {
        //TODO post o jony é burrinho 
    });

    describe("listGroups()", () => {
        it("Should return all Groups", async () => {
            const user = (await service.createUser("Joniel")).token;
            await service.createGroup("Grupo 1", "", [], user);
            await service.createGroup("Grupo 2", "", [], user);
            expect(await service.listGroups(user)).to.deep.equal([1, 2]);
        });

        it("Should return empty for non-existing groups created", async () => {
            const user = (await service.createUser("Joniel")).token;
            expect(await service.listGroups(user)).to.deep.equal([]);
        });
        
        it("Should return error s2", async () => {
            await expect(service.listGroups("A1B2C3D4")).to.be.rejectedWith(Error).then(null, e => expect(e.actual).to.deep.include({ code: "s2" }));
        });
    });
    
    describe("deleteGroup()", () => {
        
    });

    describe("getGroupDetails()", () => {
        
    });

    describe("addTeamsToGroup()", () => {
        
    });
    
    describe("removeTeamFromGroup()", () => {
        
    });

    describe("createUser()", () => {
        it("Should return all Groups", async () => {
            expect(await service.createUser("Joniel")).to.have.all.keys("id", "name", "token");
        });
    }); 
});
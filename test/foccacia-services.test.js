import { beforeEach, describe, it } from "mocha";
import { expect, use} from "chai";
import chaiAsPromised from "chai-as-promised";
import serviceBuilder from "../src/service/foccacia-services.js";
import api from "../src/data/fapi-teams-data-fake.js";
import foccacia from "../src/data/fapi-teams-data.js";

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
            expect(await service.searchTeams("0")).to.deep.equal([]);
        });
    });

    describe("searchLeagues()", () => {
        it("Should return all leagues of one team", async () => {
            expect(await service.searchLeagues("211")).to.deep.equal(
                [{"id": 94,"name": "Primeira Liga","logo": "https://media.api-sports.io/football/leagues/94.png","country": "Portugal","seasons": [2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024]},{"id": 2,"name": "UEFA Champions League","logo": "https://media.api-sports.io/football/leagues/2.png","country": "World","seasons": [2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024]},{"id": 96,"name": "Taça de Portugal","logo": "https://media.api-sports.io/football/leagues/96.png","country": "Portugal","seasons": [2016,2017,2018,2019,2020,2021,2022,2023,2024]},{"id": 550,"name": "Super Cup","logo": "https://media.api-sports.io/football/leagues/550.png","country": "Portugal","seasons": [2016,2017,2019,2020,2023]},{"id": 18,"name": "AFC Cup","logo": "https://media.api-sports.io/football/leagues/18.png","country": "World","seasons": [2017,2018]},{"id": 26,"name": "International Champions Cup","logo": "https://media.api-sports.io/football/leagues/26.png","country": "World","seasons": [2018,2019]},{"id": 3,"name": "UEFA Europa League","logo": "https://media.api-sports.io/football/leagues/3.png","country": "World","seasons": [2018,2019,2020,2023]},{"id": 97,"name": "Taça da Liga","logo": "https://media.api-sports.io/football/leagues/97.png","country": "Portugal","seasons": [2019,2020,2021,2022,2023,2024]},{"id": 667,"name": "Friendlies Clubs","logo": "https://media.api-sports.io/football/leagues/667.png","country": "World","seasons": [2020,2021,2022,2023,2024]}]
            );
        });

        it("Should return empty for invalid team id", async () => {
            expect(await service.searchLeagues("0")).to.deep.equal([]);
        });
    });

    describe("createGroup()", () => {
        it("Should return the created group", async () => {
            const user = (await service.createUser("Alice")).token;

            expect(await service.createGroup("Grupo 1", "O meu primeiro grupo", [], user)).to.deep.equal({
                "id": 1,
                "name": "Grupo 1",
                "description": "O meu primeiro grupo",
                "teams": []
            });
        });

        it("Should return the created group (using default values)", async () => {
            const user = (await service.createUser("Alice")).token;

            expect(await service.createGroup("Grupo 1", undefined, undefined, user)).to.deep.equal({
                "id": 1,
                "name": "Grupo 1",
                "description": "",
                "teams": []
            });
        });

        it("Should return the created group with teams", async () => {
            const user = (await service.createUser("Alice")).token;

            expect(await service.createGroup("Grupo 1", "O meu primeiro grupo", [
                {
                    "id": 211,
                    "leagueId": 94,
                    "season": 2022
                }
            ], user)).to.deep.equal(
                {"id": 1,"name": "Grupo 1","description": "O meu primeiro grupo","teams": [{"id": 211,"name": "Benfica","leagueId": 94,"league": "Primeira Liga","season": 2022,"stadium": "Estádio do Sport Lisboa e Benfica (da Luz)"}]}
            );

            expect(await service.createGroup("Grupo 2", "O meu segundo grupo", [
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
                {"id": 2,"name": "Grupo 2","description": "O meu segundo grupo","teams": [{"id": 211,"name": "Benfica","leagueId": 94,"league": "Primeira Liga","season": 2022,"stadium": "Estádio do Sport Lisboa e Benfica (da Luz)"},{"id": 212,"name": "FC Porto","leagueId": 94,"league": "Primeira Liga","season": 2022,"stadium": "Estádio Do Dragão"}]}
            );
        });
    });
    
    describe("editGroup()", () => {
        it("Should update all group details", async () => {
            const user = (await service.createUser("Alice")).token;
            await service.createGroup("Grupo 1", "O meu primeiro grupo", [], user);

            expect(await service.editGroup(1, {
                name: "Grupo 1 Modificado",
                description: "O meu novo primeiro grupo"
            }, user)).to.deep.equal({
                "id": 1,
                "name": "Grupo 1 Modificado",
                "description": "O meu novo primeiro grupo",
                "teams": []
            });
        });

        it("Should update some group details", async () => {
            const user = (await service.createUser("Alice")).token;
            await service.createGroup("Grupo 1", "O meu primeiro grupo", [], user);

            expect(await service.editGroup(1, {
                name: "Grupo 1 Modificado"
            }, user)).to.deep.equal({
                "id": 1,
                "name": "Grupo 1 Modificado",
                "description": "O meu primeiro grupo",
                "teams": []
            });

            expect(await service.editGroup(1, {
                description: "O meu novo primeiro grupo"
            }, user)).to.deep.equal({
                "id": 1,
                "name": "Grupo 1 Modificado",
                "description": "O meu novo primeiro grupo",
                "teams": []
            });
        });
    });

    describe("listGroups()", () => {
        it("Should return all user groups", async () => {
            const user = (await service.createUser("Alice")).token;
            await service.createGroup("Grupo 1", "", [], user);
            await service.createGroup("Grupo 2", "", [], user);

            expect(await service.listGroups(user)).to.deep.equal([1, 2]);
        });

        it("Should return empty for users without groups", async () => {
            const user = (await service.createUser("Alice")).token;

            expect(await service.listGroups(user)).to.deep.equal([]);
        });
        
        it("Should return error s2 when no valid token is provided", async () => {
            await expect(service.listGroups("0")).to.be.rejectedWith(Error).then(null, e => expect(e.actual).to.deep.include({ code: "s2" }));
        });
    });
    
    describe("deleteGroup()", () => {
        it("Should delete the user's group", async () => {
            const user = (await service.createUser("Alice")).token;
            await service.createGroup("Grupo 1", "", [], user);

            await expect(service.deleteGroup(1, user)).fulfilled;
        });

        it("Should return the confirmation of deletion of the group (with teams)", async () => {
            const user = (await service.createUser("Alice")).token;
            await service.createGroup("Grupo 1", "", [{"id": 211, "leagueId": 3, "season": 2019}], user);

            await expect(service.deleteGroup(1, user)).fulfilled;
        });

        it("Should return the error s3 when no such group exists", async () => {
            const user = (await service.createUser("Alice")).token;

            await expect(service.deleteGroup(7, user)).to.be.rejectedWith(Error).then(null, e => expect(e.actual).to.deep.include({ code: "s3" }));
        });
    });

    describe("getGroupDetails()", () => {
        it("Should return the group details", async () => {
            const user = (await service.createUser("Alice")).token;
            await service.createGroup("Grupo 1", "O meu primeiro grupo", [], user);

            expect(await service.getGroupDetails(1, user)).to.deep.equals({
                "id": 1,
                "name": "Grupo 1",
                "description": "O meu primeiro grupo",
                "teams": []
            });
        });
        
        it("Should return the error s3 when no such group exists", async () => {
            const user = (await service.createUser("Alice")).token;
            await service.createGroup("Grupo 1", "O meu primeiro grupo", [], user);

            await expect(service.getGroupDetails(7, user)).to.be.rejectedWith(Error).then(null, e => expect(e.actual).to.deep.include({ code: "s3" }));
        });
    });

    describe("addTeamsToGroup()", () => {
        it("Should add teams to the group", async () => {
            const user = (await service.createUser("Alice")).token;
            await service.createGroup("Grupo 1", "O meu primeiro grupo", [], user);

            await expect(service.addTeamsToGroup(1, [
                {
                    "id": 211,
                    "leagueId": 94,
                    "season": 2022
                }
            ], user)).fulfilled.then(async () =>
                expect(await service.getGroupDetails(1, user)).to.deep.equal({
                    "id": 1,
                    "name": "Grupo 1",
                    "description": "O meu primeiro grupo",
                    "teams": [
                        {
                            "id": 211,
                            "name": "Benfica",
                            "leagueId": 94,
                            "league": "Primeira Liga",
                            "season": 2022,
                            "stadium": "Estádio do Sport Lisboa e Benfica (da Luz)"
                        }
                    ]
                })
            );

            await service.createGroup("Grupo 2", "O meu segundo grupo", [], user);

            await expect(service.addTeamsToGroup(2, [
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
            ], user)).fulfilled.then(async () =>
                expect(await service.getGroupDetails(2, user)).to.deep.equal({
                    "id": 2,
                    "name": "Grupo 2",
                    "description": "O meu segundo grupo",
                    "teams": [
                        {
                            "id": 211,
                            "name": "Benfica",
                            "leagueId": 94,
                            "league": "Primeira Liga",
                            "season": 2022,
                            "stadium": "Estádio do Sport Lisboa e Benfica (da Luz)"
                        },
                        {
                            "id": 212,
                            "name": "FC Porto",
                            "leagueId": 94,
                            "league": "Primeira Liga",
                            "season": 2022,
                            "stadium": "Estádio Do Dragão"
                        }
                    ]
                })
            );
        });

        it("Should return the error s3 when no such group exists", async () => {
            const user1 = (await service.createUser("Alice")).token;
            const user2 = (await service.createUser("Alice")).token;
            await service.createGroup("Grupo 1", "O meu primeiro grupo", [], user1);

            await expect(service.addTeamsToGroup(1, [
                {
                    "id": 211,
                    "leagueId": 94,
                    "season": 2022
                }
            ], user2)).to.be.rejectedWith(Error).then(null, e => expect(e.actual).to.deep.include({ code: "w4" }));
        });
    });
    
    describe("removeTeamFromGroup()", () => {
        it("Should remove teams from the group", async () => {
            const user = (await service.createUser("Alice")).token;
            await service.createGroup("Grupo 1", "O meu primeiro grupo", [], user);
            await service.addTeamsToGroup(1, [
                {
                    "id": 211,
                    "leagueId": 94,
                    "season": 2022
                }
            ], user);

            await expect(service.removeTeamFromGroup(1, 211, 94, 2022, user)).fulfilled;
        });

        it("Should return the error d1 when no such team exists on the group", async () => {
            const user = (await service.createUser("Alice")).token;
            await service.createGroup("Grupo 1", "O meu primeiro grupo", [], user);

            await expect(service.removeTeamFromGroup(1, 211, 94, 2022, user)).to.be.rejectedWith(Error).then(null, e => expect(e.actual).to.deep.include({ code: "d1" }));
        });
    });

    describe("createUser()", () => {
        it("Should create a new user and return its details", async () => {
            expect(await service.createUser("Alice")).to.have.all.keys("id", "name", "token");
        });
    }); 
});
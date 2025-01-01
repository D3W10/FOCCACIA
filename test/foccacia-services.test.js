import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import servicesBuilder from "../src/service/foccacia-services.js";
import api from "../src/data/fapi-teams-data-fake.js";
import foccacia from "../src/data/foccacia-data-mem.js";
import { errors } from "../src/utils/errorManager.js";

use(chaiAsPromised);

describe("Services", () => {
    let services, validAuth;

    beforeEach(async () => {
        foccacia.resetData();
        services = servicesBuilder(api, foccacia);

        validAuth = "Bearer " + (await foccacia.createUser("test", "test")).token;
    });

    describe("searchTeams()", () => {
        it("Should return teams array when searching for valid team", async () => {
            const teams = await services.searchTeams("Benfica");
            expect(teams).to.be.an("array");
            expect(teams).to.have.lengthOf(2);
            expect(teams[0]).to.have.property("id", 211);
            expect(teams[0]).to.have.property("name", "Benfica");
        });

        it("Should reject with a1 when name is missing", () => {
            expect(services.searchTeams()).to.be.rejectedWith(errors.a1.message);
        });

        it("Should reject with s1 when searching for invalid team", () => {
            expect(services.searchTeams("invalid")).to.be.rejectedWith(errors.s1.message);
        });
    });

    describe("searchLeagues()", () => {
        it("Should return leagues array when searching for valid team", async () => {
            const leagues = await services.searchLeagues(211);
            expect(leagues).to.be.an("array");
            expect(leagues).to.have.lengthOf(9);
            expect(leagues[0]).to.have.property("id", 94);
            expect(leagues[0]).to.have.property("name", "Primeira Liga");
        });

        it("Should reject with a2 when team id is invalid", () => {
            expect(services.searchLeagues()).to.be.rejectedWith(errors.a2.message);
            expect(services.searchLeagues("NaN")).to.be.rejectedWith(errors.a2.message);
        });

        it("Should reject with s1 when searching for invalid team", () => {
            expect(services.searchLeagues(999)).to.be.rejectedWith(errors.s1.message);
        });
    });

    describe("Group Operations", () => {
        const validTeam = {
            id: 211,
            leagueId: 94,
            season: 2022
        };

        describe("createGroup()", () => {
            it("Should create a group successfully", async () => {
                const group = await services.createGroup("Test Group", "Description", [validTeam], validAuth);
                expect(group).to.have.property("id");
                expect(group).to.have.property("name", "Test Group");
                expect(group).to.have.property("description", "Description");
                expect(group.teams).to.be.an("array");
                expect(group.teams[0]).to.have.property("id", 211);
                expect(group.teams[0]).to.have.property("name", "Benfica");
            });

            it("Should reject with a3 when name is missing", () => {
                expect(services.createGroup(null, "", [], validAuth)).to.be.rejectedWith(errors.a3.message);
            });

            it("Should reject with a4 when teams data is invalid", () => {
                expect(services.createGroup("name", "", [{ id: "invalid" }], validAuth))
                    .to.be.rejectedWith(errors.a4.message);
            });

            it("Should reject with h1 when auth header is invalid", () => {
                expect(services.createGroup("name", "", [validTeam], "Invalid"))
                    .to.be.rejectedWith(errors.h1.message);
            });
        });

        describe("editGroup()", () => {
            let groupId;

            beforeEach(async () => {
                const group = await services.createGroup("Test Group", "Description", [validTeam], validAuth);
                groupId = group.id;
            });

            it("Should edit group successfully", async () => {
                const updates = {
                    name: "Updated Group",
                    description: "New Description"
                };
                const group = await services.editGroup(groupId, updates, validAuth);
                expect(group).to.have.property("name", "Updated Group");
                expect(group).to.have.property("description", "New Description");
            });

            it("Should reject with a5 when group id is missing", () => {
                expect(services.editGroup(null, { name: "New Name" }, validAuth))
                    .to.be.rejectedWith(errors.a5.message);
            });

            it("Should reject with a6 when no updates provided", () => {
                expect(services.editGroup(groupId, {}, validAuth))
                    .to.be.rejectedWith(errors.a6.message);
            });

            it("Should reject with h1 when auth header is invalid", () => {
                expect(services.editGroup(groupId, { name: "New Name" }, "Invalid"))
                    .to.be.rejectedWith(errors.h1.message);
            });

            it("Should reject with a7 when group is not found", () => {
                expect(services.editGroup("invalid-id", { name: "New Name" }, validAuth))
                    .to.be.rejectedWith(errors.a7.message);
            });
        });

        describe("listGroups()", () => {
            it("Should list groups successfully", async () => {
                await services.createGroup("Test Group", "", [validTeam], validAuth);
                const groups = await services.listGroups(validAuth);
                expect(groups).to.be.an("array");
                expect(groups).to.have.lengthOf(1);
                expect(groups[0]).to.be.a("string");
            });

            it("Should reject with h1 for invalid auth header", () => {
                expect(services.listGroups("Invalid")).to.be.rejectedWith(errors.h1.message);
            });
        });

        describe("deleteGroup()", () => {
            let groupId;

            beforeEach(async () => {
                const group = await services.createGroup("Test Group", "", [validTeam], validAuth);
                groupId = group.id;
            });

            it("Should delete group successfully", async () => {
                await services.deleteGroup(groupId, validAuth);
                expect(services.getGroupDetails(groupId, validAuth))
                    .to.be.rejectedWith(errors.a7.message);
            });

            it("Should reject with a5 when group id is missing", () => {
                expect(services.deleteGroup(null, validAuth))
                    .to.be.rejectedWith(errors.a5.message);
            });

            it("Should reject with h1 when auth header is invalid", () => {
                expect(services.deleteGroup(groupId, "Invalid"))
                    .to.be.rejectedWith(errors.h1.message);
            });

            it("Should reject with a7 when group is not found", () => {
                expect(services.deleteGroup("invalid-id", validAuth))
                    .to.be.rejectedWith(errors.a7.message);
            });
        });

        describe("getGroupDetails()", () => {
            let groupId;

            beforeEach(async () => {
                const group = await services.createGroup("Test Group", "", [validTeam], validAuth);
                groupId = group.id;
            });

            it("Should get group details successfully", async () => {
                const group = await services.getGroupDetails(groupId, validAuth);
                expect(group).to.have.property("id", groupId);
                expect(group).to.have.property("name", "Test Group");
                expect(group.teams).to.be.an("array");
                expect(group.teams[0]).to.have.property("id", 211);
            });

            it("Should reject with a5 when group id is missing", () => {
                expect(services.getGroupDetails(null, validAuth)).to.be.rejectedWith(errors.a5.message);
            });

            it("Should reject with a7 when group is not found", () => {
                expect(services.getGroupDetails("invalid-id", validAuth)).to.be.rejectedWith(errors.a7.message);
            });
        });

        describe("addTeamsToGroup()", () => {
            let groupId;

            beforeEach(async () => {
                const group = await services.createGroup("Test Group", "", [], validAuth);
                groupId = group.id;
            });

            it("Should add teams successfully", async () => {
                await services.addTeamsToGroup(groupId, [validTeam], validAuth);
                const group = await services.getGroupDetails(groupId, validAuth);
                expect(group.teams).to.have.lengthOf(1);
                expect(group.teams[0]).to.have.property("id", 211);
            });

            it("Should reject with a13 when team already exists", async () => {
                await services.addTeamsToGroup(groupId, [validTeam], validAuth);
                expect(services.addTeamsToGroup(groupId, [validTeam], validAuth))
                    .to.be.rejectedWith(errors.a13.message);
            });
        });

        describe("removeTeamFromGroup()", () => {
            let groupId;

            beforeEach(async () => {
                const group = await services.createGroup("Test Group", "", [validTeam], validAuth);
                groupId = group.id;
            });

            it("Should remove team successfully", async () => {
                await services.removeTeamFromGroup(groupId, validTeam.id, validTeam.leagueId, validTeam.season, validAuth);
                const group = await services.getGroupDetails(groupId, validAuth);
                expect(group.teams).to.have.lengthOf(0);
            });

            it("Should reject with a5 when group id is missing", () => {
                expect(services.removeTeamFromGroup(null, validTeam.id, validTeam.leagueId, validTeam.season, validAuth))
                    .to.be.rejectedWith(errors.a5.message);
            });

            it("Should reject with a2 when team id is invalid", () => {
                expect(services.removeTeamFromGroup(groupId, null, validTeam.leagueId, validTeam.season, validAuth))
                    .to.be.rejectedWith(errors.a2.message);
                expect(services.removeTeamFromGroup(groupId, "NaN", validTeam.leagueId, validTeam.season, validAuth))
                    .to.be.rejectedWith(errors.a2.message);
            });

            it("Should reject with a9 when league id is invalid", () => {
                expect(services.removeTeamFromGroup(groupId, validTeam.id, null, validTeam.season, validAuth))
                    .to.be.rejectedWith(errors.a9.message);
                expect(services.removeTeamFromGroup(groupId, validTeam.id, "NaN", validTeam.season, validAuth))
                    .to.be.rejectedWith(errors.a9.message);
            });

            it("Should reject with a10 when season is invalid", () => {
                expect(services.removeTeamFromGroup(groupId, validTeam.id, validTeam.leagueId, null, validAuth))
                    .to.be.rejectedWith(errors.a10.message);
                expect(services.removeTeamFromGroup(groupId, validTeam.id, validTeam.leagueId, "NaN", validAuth))
                    .to.be.rejectedWith(errors.a10.message);
            });

            it("Should reject with h1 when auth header is invalid", () => {
                expect(services.removeTeamFromGroup(groupId, validTeam.id, validTeam.leagueId, validTeam.season, "Invalid"))
                    .to.be.rejectedWith(errors.h1.message);
            });

            it("Should reject with a11 when team is not in group", async () => {
                await services.removeTeamFromGroup(groupId, validTeam.id, validTeam.leagueId, validTeam.season, validAuth);
                expect(services.removeTeamFromGroup(groupId, validTeam.id, validTeam.leagueId, validTeam.season, validAuth))
                    .to.be.rejectedWith(errors.a11.message);
            });
        });
    });

    describe("createUser()", () => {
        it("Should create user successfully", async () => {
            const user = await services.createUser("Bob", "password");
            expect(user).to.have.property("id");
            expect(user).to.have.property("username", "Bob");
            expect(user).to.not.have.property("password");
        });

        it("Should reject with a12 when username is missing", () => {
            expect(services.createUser(null, "password")).to.be.rejectedWith(errors.a12.message);
        });

        it("Should reject with a14 when password is missing", () => {
            expect(services.createUser("username", null)).to.be.rejectedWith(errors.a14.message);
        });

        it("Should reject with a16 when username already exists", async () => {
            await services.createUser("Alice", "password");
            expect(services.createUser("Alice", "password")).to.be.rejectedWith(errors.a16.message);
        });
    });
});
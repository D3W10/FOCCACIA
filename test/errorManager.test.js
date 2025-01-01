import { expect } from "chai";
import { error, errors, success } from "../src/utils/errorManager.js";

describe("Error Manager", () => {
    /** @type {Response} */
    let res;
    let status;
    let json;

    beforeEach(async () => {
        res = {
            status: function (s) {
                status = s;
                return this;
            },
            json: function (d) {
                json = d;
                return this;
            }
        };
    });

    describe("error()", () => {
        it("Should return the correct error object", () => {
            error(res, "a0");
            expect(status).to.equal(errors.a0.status);
            expect(json).to.deep.equal({ code: "a0", message: errors.a0.message });
        });

        it("Should provide the default error object", () => {
            error(res, "-1");
            expect(status).to.equal(errors["-1"].status);
            expect(json).to.deep.equal({ code: "-1", message: errors["-1"].message });
        });

        it("Should provide the default error object (implicit)", () => {
            error(res);
            expect(status).to.equal(errors["-1"].status);
            expect(json).to.deep.equal({ code: "-1", message: errors["-1"].message });
        });
    });

    describe("success()", () => {
        it("Should return the correct success object when passing an object", () => {
            success(res, { id: 1, name: "Test" });
            expect(status).to.equal(200);
            expect(json).to.deep.equal({ code: "0", message: "Success", data: { id: 1, name: "Test" } });

            success(res, { id: 1, name: "Test" }, 201);
            expect(status).to.equal(201);
            expect(json).to.deep.equal({ code: "0", message: "Success", data: { id: 1, name: "Test" } });
        });

        it("Should return the correct success object when passing a string", () => {
            success(res, "Custom message");
            expect(status).to.equal(200);
            expect(json).to.deep.equal({ code: "0", message: "Custom message" });

            success(res, "Custom message", 201);
            expect(status).to.equal(201);
            expect(json).to.deep.equal({ code: "0", message: "Custom message" });
        });
    });
});
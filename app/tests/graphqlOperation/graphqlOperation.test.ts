import {createHttpServer, MainResult} from "../../src/httpServer/createHttpServer";
import fetch from "node-fetch";
import {FSDirectory} from "../../src/fs/FSDirectory";

jest.mock("../../src/logger.ts", () => ({
  logger: () => {
  },
  loggerError: () => {
  }
}))

let scope: MainResult | undefined = undefined;
let address: string = ""

beforeEach(cb => {
  createHttpServer({
    timer: 0,
    directory: new FSDirectory(`${__dirname}/server`),
    port: 0,
    enableLogUi: false,
  }).then(value => {
    scope = value;
    // @ts-ignore
    address = `http://localhost:${value.httpServer.address().port}`
    cb()
  })
})
afterEach(cb => {
  scope.close().then(_ => cb())
})

describe("when using graphqlSingleOperation", () => {
  describe("when a single operation is send", () => {
    it("should return based on query name from #gqlSingleOperation folder", async () => {
      const response = await fetch(`${address}/test/server`, {
        method: "POST",
        body: JSON.stringify({
          "operationName": "NamedQuery",
          "variables": {},
          "query": "query NamedQuery {\n  me {\n    id\n  }\n}\n"
        })
      });
      expect(response.statusText).toBe("gqlSingleOperation_#_");
      expect(response.status).toBe(200);
    });
    it("should return based on query name not by operationName from #gqlSingleOperation folder", async () => {
      const response = await fetch(`${address}/test/server`, {
        method: "POST",
        body: JSON.stringify({
          "operationName": "NamedQuery",
          "variables": {},
          "query": "query DifferentNamedQuery {\n  me {\n    id\n  }\n}\n"
        })
      });
      expect(response.statusText).toBe("gqlSingleOperation_#_");
      expect(response.status).toBe(200);
    });
  });

  describe("when unnamed operation are send", () => {
    describe("and operationName is null", () => {
      it("should not be parsed", async () => {
        const response = await fetch(`${address}/test/server`, {
          method: "POST",
          body: JSON.stringify({
            "operationName": null,
            "variables": {},
            "query": "{  me {    id  }}"
          })
        });
        expect(response.statusText).toBe("rootServer");
        expect(response.status).toBe(200);
      });
    })

    describe("and operationName is set", () => {
      it("should not be parsed", async () => {
        const response = await fetch(`${address}/test/server`, {
          method: "POST",
          body: JSON.stringify({
            "operationName": "NamedQuery",
            "variables": {},
            "query": "{  me {    id  }}"
          })
        });
        expect(response.statusText).toBe("gqlSingleOperation_#_");
        expect(response.status).toBe(200);
      });
    })
  });

  describe("when http request targeting graphql folder", () => {
    it("should strip keep path before # character", async () => {
      const response = await fetch(`${address}/test/server/#gqlSingleOperation/NamedQuery`, {
        method: "POST"
      });

      expect(response.statusText).toBe("rootServer");
      expect(response.status).toBe(200);
    })
  });

  describe("when an unmapped operation is sent", () => {
    describe("using unmapped operationName", () => {
      it("should return * mapped resource", async () => {
        const response = await fetch(`${address}/test/server`, {
          method: "POST",
          body: JSON.stringify({
            "operationName": "UnmappedNamedQuery",
            "variables": {},
            "query": "query UnmappedNamedQuery {\n  me {\n    id\n  }\n}\n"
          })
        });
        expect(response.statusText).toBe("gqlSingleOperation_#_");
        expect(response.status).toBe(200);
      });
      it("but mapped query name should return * mapped resource", async () => {
        const response = await fetch(`${address}/test/server`, {
          method: "POST",
          body: JSON.stringify({
            "operationName": "UnmappedNamedQuery",
            "variables": {},
            "query": "query NamedQuery {\n  me {\n    id\n  }\n}\n"
          })
        });
        expect(response.statusText).toBe("gqlSingleOperation_#_");
        expect(response.status).toBe(200);
      });
    })

    describe("using null operationName", () => {
      it("should return * mapped resource", async () => {
        const response = await fetch(`${address}/test/server`, {
          method: "POST",
          body: JSON.stringify({
            "operationName": null,
            "variables": {},
            "query": "query UnmappedNamedQuery {\n  me {\n    id\n  }\n}\n"
          })
        });
        expect(response.statusText).toBe("gqlSingleOperation_#_");
        expect(response.status).toBe(200);
      });
      it("but mapped query name should return NamedQuery mapped resource", async () => {
        const response = await fetch(`${address}/test/server`, {
          method: "POST",
          body: JSON.stringify({
            "operationName": null,
            "variables": {},
            "query": "query NamedQuery {\n  me {\n    id\n  }\n}\n"
          })
        });
        expect(response.statusText).toBe("gqlSingleOperation_#_");
        expect(response.status).toBe(200);
      });
    })

    it("should return * mapped resource", async () => {
      const response = await fetch(`${address}/test/server`, {
        method: "POST",
        body: JSON.stringify({
          "operationName": "UnmappedNamedQuery",
          "variables": {},
          "query": "query UnmappedNamedQuery {\n  me {\n    id\n  }\n}\n"
        })
      });
      expect(response.statusText).toBe("gqlSingleOperation_#_");
      expect(response.status).toBe(200);

    });
  });

  describe("when an multiple operation are sent", () => {
    describe("and operationName is set", () => {
      it("should return NamedQuery resource", async () => {
        const response = await fetch(`${address}/test/server`, {
          method: "POST",
          body: JSON.stringify({
            "operationName": "NamedQuery",
            "variables": {},
            "query": "query NamedQuery {\n  me {\n    id\n  }\n}\n query NamedQuery {\n  me {\n    id\n  }\n}\n"
          })
        });
        expect(response.statusText).toBe("gqlSingleOperation_#_");
        expect(response.status).toBe(200);
      });
    })

    describe("and operationName is different than operation name", () => {
      it("should return operationName resource (NamedQuery)", async () => {
        const response = await fetch(`${address}/test/server`, {
          method: "POST",
          body: JSON.stringify({
            "operationName": "NamedQuery",
            "variables": {},
            "query": "query NamedQuery {\n  me {\n    id\n  }\n}\n query NamedQuery {\n  me {\n    id\n  }\n}\n"
          })
        });
        expect(response.statusText).toBe("gqlSingleOperation_#_");
        expect(response.status).toBe(200);
      });
    })

    it("and operationName is null should return rootServer http resource", async () => {
      const response = await fetch(`${address}/test/server`, {
        method: "POST",
        body: JSON.stringify({
          "operationName": null,
          "variables": {},
          "query": "query UnmappedNamedQuery {\n  me {\n    id\n  }\n}\n query UnmappedNamedQuery2 {\n  me {\n    id\n  }\n}\n"
        })
      });
      expect(response.statusText).toBe("rootServer");
      expect(response.status).toBe(200);
    });
  });

})

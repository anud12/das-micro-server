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

describe("when using graphqlSingleOperation without * mapping", () => {

  describe("when an unmapped operation is sent", () => {
    it("should return error", async () => {
      const response = await fetch(`${address}/noStar/server`, {
        method: "POST",
        body: JSON.stringify({
          "operationName": "UnmappedNamedQuery",
          "variables": {},
          "query": "query UnmappedNamedQuery {\n  me {\n    id\n  }\n}\n"
        })
      });
      expect(response.statusText).toBe("Failed to use any resourceReaders for /noStar/server/#gqlSingleOperation/UnmappedNamedQuery");
      expect(response.status).toBe(599);
      expect(await response.text()).toBe("Failed to use any resourceReaders for /noStar/server/#gqlSingleOperation/UnmappedNamedQuery");
    });
  });

  describe(
    `first empty 200 response with default status message and default headers'
second empty 201 response with custom status message and default headers'
third error 599 response due to file not found and default headers`, () => {

      it('using text resource', async () => {
        const fetchFunction = () => fetch(`${address}/noStar/server`, {
          method: "POST",
          body: JSON.stringify({
            "operationName": "noHeader",
            "variables": {},
            "query": "query noHeader {\n  me {\n    id\n  }\n}\n"
          })
        });
        let response = await fetchFunction();
        expect(response.statusText).toBe("OK");
        expect(response.status).toBe(200);
        expect(response.headers.get("content-length")).toBe(null)
        expect(response.headers.get("connection")).toBe("close")
        expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
        expect(response.headers.get("date")).toBeTruthy()
        expect(await response.text()).toBe("");

        response = await fetchFunction();
        expect(response.statusText).toBe("Created");
        expect(response.status).toBe(201);
        expect(response.headers.get("content-length")).toBe(null)
        expect(response.headers.get("connection")).toBe("close")
        expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
        expect(response.headers.get("date")).toBeTruthy()
        expect(await response.text()).toBe("");

        response = await fetchFunction();
        expect(response.statusText).toBe("Failed to use any resourceReaders for /noStar/server/#gqlSingleOperation/noHeader");
        expect(response.status).toBe(599);
        expect(response.headers.get("content-length")).toBe(null)
        expect(response.headers.get("connection")).toBe("close")
        expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
        expect(response.headers.get("date")).toBeTruthy()
        expect(await response.text()).toBe("Failed to use any resourceReaders for /noStar/server/#gqlSingleOperation/noHeader");
      })

      it(`using script resource`, async () => {
        const fetchFunction = () => fetch(`${address}/noStar/server`, {
          method: "POST",
          body: JSON.stringify({
            "operationName": "noHeaderSh",
            "variables": {},
            "query": "query noHeaderSh {\n  me {\n    id\n  }\n}\n"
          })
        });
        let response = await fetchFunction();
        expect(response.statusText).toBe("OK");
        expect(response.status).toBe(200);
        expect(response.headers.get("content-length")).toBe(null)
        expect(response.headers.get("connection")).toBe("close")
        expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
        expect(response.headers.get("date")).toBeTruthy()
        expect(await response.text()).toBe("");

        response = await fetchFunction();
        expect(response.statusText).toBe("Created");
        expect(response.status).toBe(201);
        expect(response.headers.get("content-length")).toBe(null)
        expect(response.headers.get("connection")).toBe("close")
        expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
        expect(response.headers.get("date")).toBeTruthy()
        expect(await response.text()).toBe("");

        response = await fetchFunction();
        expect(response.statusText).toBe("Failed to use any resourceReaders for /noStar/server/#gqlSingleOperation/noHeaderSh");
        expect(response.status).toBe(599);
        expect(response.headers.get("content-length")).toBe(null)
        expect(response.headers.get("connection")).toBe("close")
        expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
        expect(response.headers.get("date")).toBeTruthy()
        expect(await response.text()).toBe("Failed to use any resourceReaders for /noStar/server/#gqlSingleOperation/noHeaderSh");
      })
    })
})

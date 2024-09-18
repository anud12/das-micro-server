import {createHttpServer, MainResult} from "../../src/httpServer/createHttpServer";
import fetch from "node-fetch";
import {FSDirectory} from "../../src/fs/FSDirectory";

jest.mock("../../src/logger.ts", () => ({
  logger: () => {
  },
  loggerError: () => {}
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

describe("when http request is send", () => {

  it("should return 599 when file not found", async () => {
    const response = await fetch(`${address}/nonExistent`);
    expect(response.status).toBe(599);
    expect(response.statusText).toBe("Failed to use any resourceReaders for /nonExistent");
    expect(await response.text()).toBe("Failed to use any resourceReaders for /nonExistent");
  })

  describe("should increment counter when", () => {

    describe(
      `first empty 200 response with default status message and default headers'
second empty 201 response with custom status message and default headers'
third error 599 response due to file not found and default headers`, () => {

        it('using text resource', async () => {
          let response = await fetch(`${address}/http/noHeader`);
          expect(response.status).toBe(200);
          expect(response.statusText).toBe("OK");
          expect([...response.headers.keys()]).toStrictEqual(["connection", "content-type", "date", "transfer-encoding"]);
          expect(response.headers.get("content-length")).toBe(null)
          expect(response.headers.get("connection")).toBe("close")
          expect(response.headers.get("transfer-encoding")).toBe("chunked")
          expect(response.headers.get("date")).toBeTruthy()
          expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
          expect(await response.text()).toBe("");

          response = await fetch(`${address}/http/noHeader`);
          expect(response.status).toBe(201);
          expect(response.statusText).toBe("Created");
          expect([...response.headers.keys()]).toStrictEqual(["connection", "content-type", "date", "transfer-encoding"]);
          expect(response.headers.get("content-length")).toBe(null)
          expect(response.headers.get("connection")).toBe("close")
          expect(response.headers.get("transfer-encoding")).toBe("chunked")
          expect(response.headers.get("date")).toBeTruthy()
          expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
          expect(await response.text()).toBe("");

          response = await fetch(`${address}/http/noHeader`);
          expect(response.status).toBe(599);
          expect(response.statusText).toBe("Failed to use any resourceReaders for /http/noHeader");
          expect([...response.headers.keys()]).toStrictEqual(["connection", "content-type", "date", "transfer-encoding"]);
          expect(response.headers.get("content-length")).toBe(null)
          expect(response.headers.get("connection")).toBe("close")
          expect(response.headers.get("transfer-encoding")).toBe("chunked")
          expect(response.headers.get("date")).toBeTruthy()
          expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
          expect(await response.text()).toBe("Failed to use any resourceReaders for /http/noHeader");
        })

        it(`using script resource`, async () => {
          let response = await fetch(`${address}/http/noHeaderSh`);
          expect(response.status).toBe(200);
          expect(response.statusText).toBe("OK");
          expect(response.headers.get("content-length")).toBe(null)
          expect(response.headers.get("connection")).toBe("close")
          expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
          expect(response.headers.get("date")).toBeTruthy()
          expect(await response.text()).toBe("");

          response = await fetch(`${address}/http/noHeaderSh`);
          expect(response.status).toBe(201);
          expect(response.statusText).toBe("Created");
          expect(response.headers.get("content-length")).toBe(null)
          expect(response.headers.get("connection")).toBe("close")
          expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
          expect(response.headers.get("date")).toBeTruthy()
          expect(await response.text()).toBe("");

          response = await fetch(`${address}/http/noHeaderSh`);
          expect(response.status).toBe(599);
          expect(response.statusText).toBe("Failed to use any resourceReaders for /http/noHeaderSh");
          expect(response.headers.get("content-length")).toBe(null)
          expect(response.headers.get("connection")).toBe("close")
          expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
          expect(response.headers.get("date")).toBeTruthy()
          expect(await response.text()).toBe("Failed to use any resourceReaders for /http/noHeaderSh");
        })
      })

    describe(`first response from 0 resource
second response from _ resource
third response from 2 resource
fourth response from _ resource`, () => {

      it(`using text resource`, async () => {
        let response = await fetch(`${address}/http/underscore`);
        expect(response.status).toBe(200);
        expect(response.statusText).toBe("OK");
        expect(response.headers.get("content-length")).toBe(null)
        expect(response.headers.get("connection")).toBe("close")
        expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
        expect(response.headers.get("date")).toBeTruthy()
        expect(await response.text()).toBe("first response");

        response = await fetch(`${address}/http/underscore`);
        expect(response.status).toBe(499);
        expect(response.statusText).toBe("Underscore Response");
        expect(response.headers.get("content-length")).toBe(null)
        expect(response.headers.get("connection")).toBe("close")
        expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
        expect(response.headers.get("date")).toBeTruthy()
        expect(await response.text()).toBe("Underscore body");

        response = await fetch(`${address}/http/underscore`);
        expect(response.status).toBe(200);
        expect(response.statusText).toBe("OK");
        expect(response.headers.get("content-length")).toBe(null)
        expect(response.headers.get("connection")).toBe("close")
        expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
        expect(response.headers.get("date")).toBeTruthy()
        expect(await response.text()).toBe("third response");

        response = await fetch(`${address}/http/underscore`);
        expect(response.status).toBe(499);
        expect(response.statusText).toBe("Underscore Response");
        expect(response.headers.get("content-length")).toBe(null)
        expect(response.headers.get("connection")).toBe("close")
        expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
        expect(response.headers.get("date")).toBeTruthy()
        expect(await response.text()).toBe("Underscore body");
      })

      it(`using shell resource`, async () => {
        let response = await fetch(`${address}/http/underscoreSh`);
        expect(response.status).toBe(200);
        expect(response.statusText).toBe("OK");
        expect(response.headers.get("content-length")).toBe(null)
        expect(response.headers.get("connection")).toBe("close")
        expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
        expect(response.headers.get("date")).toBeTruthy()
        expect(await response.text()).toBe("first response");

        response = await fetch(`${address}/http/underscoreSh`);
        expect(response.status).toBe(499);
        expect(response.statusText).toBe("Underscore Response");
        expect(response.headers.get("content-length")).toBe(null)
        expect(response.headers.get("connection")).toBe("close")
        expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
        expect(response.headers.get("date")).toBeTruthy()
        expect(await response.text()).toBe("Underscore body");

        response = await fetch(`${address}/http/underscoreSh`);
        expect(response.status).toBe(200);
        expect(response.statusText).toBe("OK");
        expect(response.headers.get("content-length")).toBe(null)
        expect(response.headers.get("connection")).toBe("close")
        expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
        expect(response.headers.get("date")).toBeTruthy()
        expect(await response.text()).toBe("third response");

        response = await fetch(`${address}/http/underscoreSh`);
        expect(response.status).toBe(499);
        expect(response.statusText).toBe("Underscore Response");
        expect(response.headers.get("content-length")).toBe(null)
        expect(response.headers.get("connection")).toBe("close")
        expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
        expect(response.headers.get("date")).toBeTruthy()
        expect(await response.text()).toBe("Underscore body");
      })
    })
  })

  describe("should return first 200 response with default status message and default headers with body", () => {
    it(`using text resource`, async () => {
      let response = await fetch(`${address}/http/withBody`);
      expect(response.status).toBe(200);
      expect(response.statusText).toBe("OK");
      expect(response.headers.get("content-length")).toBe(null)
      expect(response.headers.get("connection")).toBe("close")
      expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
      expect(response.headers.get("date")).toBeTruthy()
      expect(await response.text()).toBe(
        "<html>\n" +
        "    <head/>\n" +
        "    <body/>\n" +
        "</html>"
      );
    })

    it(`using shell resource`, async () => {
      let response = await fetch(`${address}/http/withBodySh`);
      expect(response.status).toBe(200);
      expect(response.statusText).toBe("OK");
      expect(response.headers.get("content-length")).toBe(null)
      expect(response.headers.get("connection")).toBe("close")
      expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
      expect(response.headers.get("date")).toBeTruthy()
      expect(await response.text()).toBe(
        "<html>\n" +
        "    <head/>\n" +
        "    <body/>\n" +
        "</html>"
      );
    })
  })
  describe("should return first 200 response with default status message and custom headers with body", () => {
    it(`using text resource`, async () => {
      let response = await fetch(`${address}/http/withHeaderAndBody`);
      expect(response.status).toBe(200);
      expect(response.statusText).toBe("OK");
      expect(response.headers.get("content-length")).toBe(null)
      expect(response.headers.get("connection")).toBe("close")
      expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
      expect(response.headers.get("header1")).toBe("value1")
      expect(response.headers.get("header2")).toBe("value2")
      expect(response.headers.get("date")).toBeTruthy()
      expect(await response.text()).toBe(
        "<html>\n" +
        "    <head/>\n" +
        "    <body/>\n" +
        "</html>"
      );
    })

    it(`using shell resource`, async () => {
      let response = await fetch(`${address}/http/withHeaderAndBodySh`);
      expect(response.status).toBe(200);
      expect(response.statusText).toBe("OK");
      expect(response.headers.get("content-length")).toBe(null)
      expect(response.headers.get("connection")).toBe("close")
      expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
      expect(response.headers.get("header1")).toBe("value1")
      expect(response.headers.get("header2")).toBe("value2")
      expect(response.headers.get("date")).toBeTruthy()
      expect(await response.text()).toBe(
        "<html>\n" +
        "    <head/>\n" +
        "    <body/>\n" +
        "</html>"
      );
    })
  })

  describe("should apply priority when choosing from multiple types", () => {
    it(`if shellCounter and httpCounter, shell has priority`, async () => {
      let response = await fetch(`${address}/http/priority/allCounter`);
      expect(response.status).toBe(200);
      expect(response.statusText).toBe("sh");
      expect(response.headers.get("content-length")).toBe(null)
      expect(response.headers.get("connection")).toBe("close")
      expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
      expect(response.headers.get("date")).toBeTruthy()
      expect(await response.text()).toBe("");
    })

    it(`if httpUnderscore and shellUnderscore, shell has priority`, async () => {
      let response = await fetch(`${address}/http/priority/allUnderscore`);
      expect(response.status).toBe(200);
      expect(response.statusText).toBe("sh");
      expect(response.headers.get("content-length")).toBe(null)
      expect(response.headers.get("connection")).toBe("close")
      expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
      expect(response.headers.get("date")).toBeTruthy()
      expect(await response.text()).toBe("");
    })

    it(`if httpUnderscore and shellCounter, shell has priority`, async () => {
      let response = await fetch(`${address}/http/priority/underscoreHttp`);
      expect(response.status).toBe(200);
      expect(response.statusText).toBe("sh");
      expect(response.headers.get("content-length")).toBe(null)
      expect(response.headers.get("connection")).toBe("close")
      expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
      expect(response.headers.get("date")).toBeTruthy()
      expect(await response.text()).toBe("");
    })


    it(`if shellUnderscore and httpCounter, http has priority`, async () => {
      let response = await fetch(`${address}/http/priority/underscoreShell`);
      expect(response.status).toBe(200);
      expect(response.statusText).toBe("http");
      expect(response.headers.get("content-length")).toBe(null)
      expect(response.headers.get("connection")).toBe("close")
      expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
      expect(response.headers.get("date")).toBeTruthy()
      expect(await response.text()).toBe("");
    })
  })
})
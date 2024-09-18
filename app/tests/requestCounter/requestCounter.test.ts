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
    timer: 100,
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

describe("request counter", () => {
  it(`should repeat first 3 request after 100ms using text resource
  first empty 200 OK
  second empty 201 Created
  third error 599 Response 
  `, async () => {
    let response = await fetch(`${address}/requestCounter`);
    expect(response.status).toBe(200);
    expect(response.statusText).toBe("OK");
    expect(response.headers.get("content-length")).toBe(null)
    expect(response.headers.get("connection")).toBe("close")
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
    expect(response.headers.get("date")).toBeTruthy()
    expect(await response.text()).toBe("");

    response = await fetch(`${address}/requestCounter`);
    expect(response.status).toBe(201);
    expect(response.statusText).toBe("Created");
    expect(response.headers.get("connection")).toBe("close")
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
    expect(response.headers.get("date")).toBeTruthy()
    expect(await response.text()).toBe("");

    response = await fetch(`${address}/requestCounter`);
    expect(response.status).toBe(599);
    expect(response.statusText).toBe("Failed to use any resourceReaders for /requestCounter");
    expect(response.headers.get("content-length")).toBe(null)
    expect(response.headers.get("connection")).toBe("close")
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
    expect(response.headers.get("date")).toBeTruthy()
    expect(await response.text()).toBe("Failed to use any resourceReaders for /requestCounter");

    await new Promise(res => setTimeout(res, 100))

    response = await fetch(`${address}/requestCounter`);
    expect(response.status).toBe(200);
    expect(response.statusText).toBe("OK");
    expect(response.headers.get("content-length")).toBe(null)
    expect(response.headers.get("connection")).toBe("close")
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
    expect(response.headers.get("date")).toBeTruthy()
    expect(await response.text()).toBe("");

    response = await fetch(`${address}/requestCounter`);
    expect(response.status).toBe(201);
    expect(response.statusText).toBe("Created");
    expect(response.headers.get("content-length")).toBe(null)
    expect(response.headers.get("connection")).toBe("close")
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
    expect(response.headers.get("date")).toBeTruthy()
    expect(await response.text()).toBe("");

    response = await fetch(`${address}/requestCounter`);
    expect(response.status).toBe(599);
    expect(response.statusText).toBe("Failed to use any resourceReaders for /requestCounter");
    expect(response.headers.get("content-length")).toBe(null)
    expect(response.headers.get("connection")).toBe("close")
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
    expect(response.headers.get("date")).toBeTruthy()
    expect(await response.text()).toBe("Failed to use any resourceReaders for /requestCounter");
  })

  it(`should not repeat first 3 request after 50ms using text resource
  first empty 200 OK
  second empty 201 Created
  third error 599 Response 
  `, async () => {
    let response = await fetch(`${address}/requestCounter`);
    expect(response.status).toBe(200);
    expect(response.statusText).toBe("OK");
    expect(response.headers.get("content-length")).toBe(null)
    expect(response.headers.get("connection")).toBe("close")
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
    expect(response.headers.get("date")).toBeTruthy()
    expect(await response.text()).toBe("");

    response = await fetch(`${address}/requestCounter`);
    expect(response.status).toBe(201);
    expect(response.statusText).toBe("Created");
    expect(response.headers.get("content-length")).toBe(null)
    expect(response.headers.get("connection")).toBe("close")
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
    expect(response.headers.get("date")).toBeTruthy()
    expect(await response.text()).toBe("");

    response = await fetch(`${address}/requestCounter`);
    expect(response.status).toBe(599);
    expect(response.statusText).toBe("Failed to use any resourceReaders for /requestCounter");
    expect(response.headers.get("content-length")).toBe(null)
    expect(response.headers.get("connection")).toBe("close")
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
    expect(response.headers.get("date")).toBeTruthy()
    expect(await response.text()).toBe("Failed to use any resourceReaders for /requestCounter");

    await new Promise(res => setTimeout(res, 50))

    response = await fetch(`${address}/requestCounter`);
    expect(response.status).toBe(599);
    expect(response.statusText).toBe("Failed to use any resourceReaders for /requestCounter");
    expect(response.headers.get("content-length")).toBe(null)
    expect(response.headers.get("connection")).toBe("close")
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
    expect(response.headers.get("date")).toBeTruthy()
    expect(await response.text()).toBe("Failed to use any resourceReaders for /requestCounter");

    response = await fetch(`${address}/requestCounter`);
    expect(response.status).toBe(599);
    expect(response.statusText).toBe("Failed to use any resourceReaders for /requestCounter");
    expect(response.headers.get("content-length")).toBe(null)
    expect(response.headers.get("connection")).toBe("close")
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
    expect(response.headers.get("date")).toBeTruthy()
    expect(await response.text()).toBe("Failed to use any resourceReaders for /requestCounter");

    response = await fetch(`${address}/requestCounter`);
    expect(response.status).toBe(599);
    expect(response.statusText).toBe("Failed to use any resourceReaders for /requestCounter");
    expect(response.headers.get("content-length")).toBe(null)
    expect(response.headers.get("connection")).toBe("close")
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
    expect(response.headers.get("date")).toBeTruthy()
    expect(await response.text()).toBe("Failed to use any resourceReaders for /requestCounter");
  })
})
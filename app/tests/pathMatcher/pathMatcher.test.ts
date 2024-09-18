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

describe("path matcher", () => {
  describe("partial", () => {
    describe("should match partial leaf route when request path", () => {
      it(`is exact`, async () => {
        let response = await fetch(`${address}/pathMatcher/partial/test`);
        expect(response.status).toBe(200);
        expect(response.statusText).toBe("test#_");
        expect(response.headers.get("content-length")).toBe(null)
        expect(response.headers.get("connection")).toBe("close")
        expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
        expect(response.headers.get("date")).toBeTruthy()
        expect(await response.text()).toBe("");
      })

      it(`starts with`, async () => {
        let response = await fetch(`${address}/pathMatcher/partial/testPostfix`);
        expect(response.status).toBe(200);
        expect(response.statusText).toBe("test#_");
        expect(response.headers.get("content-length")).toBe(null)
        expect(response.headers.get("connection")).toBe("close")
        expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
        expect(response.headers.get("date")).toBeTruthy()
        expect(await response.text()).toBe("");
      })

      it(`is parent`, async () => {
        let response = await fetch(`${address}/pathMatcher/partial/test/child`);
        expect(response.status).toBe(200);
        expect(response.statusText).toBe("test#_");
        expect(response.headers.get("content-length")).toBe(null)
        expect(response.headers.get("connection")).toBe("close")
        expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
        expect(response.headers.get("date")).toBeTruthy()
        expect(await response.text()).toBe("");
      })

      it(`is grandparent`, async () => {
        let response = await fetch(`${address}/pathMatcher/partial/test/child/child`);
        expect(response.status).toBe(200);
        expect(response.statusText).toBe("test#_");
        expect(response.headers.get("content-length")).toBe(null)
        expect(response.headers.get("connection")).toBe("close")
        expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
        expect(response.headers.get("date")).toBeTruthy()
        expect(await response.text()).toBe("");
      })
    })
  })

  describe("priority postfix", () => {
    it("should match specific resource when request path is exact", async () => {
      let response = await fetch(`${address}/pathMatcher/priorityPostfix/test`);
      expect(response.status).toBe(200);
      expect(response.statusText).toBe("test");
      expect(response.headers.get("content-length")).toBe(null)
      expect(response.headers.get("connection")).toBe("close")
      expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
      expect(response.headers.get("date")).toBeTruthy()
      expect(await response.text()).toBe("");
    })
    it("should match partial resource when request path starts with", async () => {
      let response = await fetch(`${address}/pathMatcher/priorityPostfix/testPostFix`);
      expect(response.status).toBe(200);
      expect(response.statusText).toBe("test#_");
      expect(response.headers.get("content-length")).toBe(null)
      expect(response.headers.get("connection")).toBe("close")
      expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
      expect(response.headers.get("date")).toBeTruthy()
      expect(await response.text()).toBe("");
    })
  })

  describe("catchAll", () => {
    it("should not match specific resource when request path is exact", async () => {
      let response = await fetch(`${address}/pathMatcher/catchAll`);
      expect(response.status).toBe(599);
      expect(response.statusText).toBe("Failed to use any resourceReaders for /pathMatcher/catchAll");
      expect(response.headers.get("content-length")).toBe(null)
      expect(response.headers.get("connection")).toBe("close")
      expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
      expect(response.headers.get("date")).toBeTruthy()
      expect(await response.text()).toBe("Failed to use any resourceReaders for /pathMatcher/catchAll");
    })
    it("should match partial resource when request path starts with", async () => {
      let response = await fetch(`${address}/pathMatcher/catchAll/other`);
      expect(response.status).toBe(200);
      expect(response.statusText).toBe("#_");
      expect(response.headers.get("content-length")).toBe(null)
      expect(response.headers.get("connection")).toBe("close")
      expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")
      expect(response.headers.get("date")).toBeTruthy()
      expect(await response.text()).toBe("");
    })
  })

})
import {createHttpServer, MainResult} from "../../../src/httpServer/createHttpServer";
import fetch from "node-fetch";
import {FSDirectory} from "../../../src/fs/FSDirectory";

jest.mock("../../../src/logger.ts", () => ({
  logger: () => {
  },
  loggerError: () => {
  }
}))

let middleScope: MainResult | undefined = undefined;
let middleAddress: string = ""

let endScope: MainResult | undefined = undefined;
let endAddress: string = ""

beforeEach(async () => {
  await createHttpServer({
    timer: 0,
    directory: new FSDirectory(`${__dirname}/middleServer`),
    port: 0,
    enableLogUi: false,
  }).then(value => {
    middleScope = value;
    // @ts-ignore
    middleAddress = `http://localhost:${value.httpServer.address().port}`
  })
  await createHttpServer({
    timer: 0,
    directory: new FSDirectory(`${__dirname}/endServer`),
    port: 0,
    enableLogUi: false,
  }).then(value => {
    endScope = value;
    // @ts-ignore
    endAddress = `http://localhost:${value.httpServer.address().port}`
  })
})
afterEach(async () => {
  await middleScope.close()
  await endScope.close()
})

describe("forward test", () => {
  describe("when http request is send to middle resource", () => {
    it("should return message from middle server", async () => {
      const response = await fetch(`${middleAddress}/request`, {
        method: "POST",
        body: `FORWARD ${endAddress}/headerEcho`
      });
      expect(response.status).toBe(200);
      expect(response.statusText).toBe("fromEnd");
    })
    it("should return message from middle server when prepended with new lines", async () => {
      const response = await fetch(`${middleAddress}/request`, {
        method: "POST",
        body: `
FORWARD ${endAddress}/headerEcho`
      });
      expect(response.status).toBe(200);
      expect(response.statusText).toBe("fromEnd");
    })
    it("should have headers send by middle server", async () => {
      const response = await fetch(`${middleAddress}/request`, {
        method: "POST",
        body: `FORWARD ${endAddress}/headerEcho`
      });
      expect(response.status).toBe(200);
      expect(response.statusText).toBe("fromEnd");
      expect(response.headers.get("endHeader1")).toBe("endHeader1Value")
      expect(response.headers.get("toBeReplacedHeader")).toBe("originalValue")
    })
    it(`if should have replaced and add header send by middle server
     without having request set up`
      , async () => {
        const response = await fetch(`${middleAddress}/request`, {
          method: "POST",
          body: `FORWARD ${endAddress}/headerEcho

RESPONSE
toBeReplacedHeader:replacedValue
addedHeader:addedHeaderValue
`
        });
        expect(response.status).toBe(200);
        expect(response.statusText).toBe("fromEnd");
        expect(response.headers.get("endHeader1")).toBe("endHeader1Value")
        expect(response.headers.get("toBeReplacedHeader")).toBe("replacedValue")
        expect(response.headers.get("addedHeader")).toBe("addedHeaderValue")
      })
    it("should have appended header that are send to middle server", async () => {
      const response = await fetch(`${middleAddress}/request`, {
        method: "POST",
        headers: {
          baseHeader1: "baseHeader1Value"
        },
        body: `FORWARD ${endAddress}/headerEcho
REQUEST
requestHeader1: requestHeader1Value

RESPONSE
header1:value1
`
      });
      expect(response.status).toBe(200);
      expect(response.statusText).toBe("fromEnd");
      expect(response.headers.get("endHeader1")).toBe("endHeader1Value")
      const expectedBody = {
        "requestheader1": "requestHeader1Value",
        "baseheader1": "baseHeader1Value",
        "content-type": "text/plain;charset=UTF-8",
        "accept": "*/*",
        "content-length": "111",
        "user-agent": "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)",
        "accept-encoding": "gzip,deflate",
        "connection": "close",
        "host": `localhost:${endScope.port}`
      }
      expect(JSON.parse(await response.text())).toStrictEqual(expectedBody);
    })
  })

})

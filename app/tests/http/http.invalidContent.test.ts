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

describe("http invalid status", () => {
  describe("when status code value alphaNumeric", () => {
    it("should return 299", async () => {
      const response = await fetch(`${address}/runBodySh`, {
        method: "POST",
        body: `HTTP/1.1 Two00`
      });
      expect(response.status).toBe(299);
      expect(response.statusText).toBe("Status code and message not given");
    })
  })
})

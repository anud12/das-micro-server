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

describe("proxy test", () => {
  describe("when http request is send to middle resource matching parent level", () => {
    it("should return message from end server", async () => {
      const response = await fetch(`${middleAddress}/path/`, {
        method: "POST",
        body: `PROXY ${endAddress}/path/headerEcho`
      });
      expect(response.status).toBe(200);
      expect(response.statusText).toBe("fromEndPathHeaderEcho");
    })
  })
  describe("when http request is send to middle resource matching any at same level", () => {
    it("should return message from end server", async () => {
      const response = await fetch(`${middleAddress}/path/request`, {
        method: "POST",
        body: `PROXY ${endAddress}/path/`
      });
      expect(response.status).toBe(200);
      expect(response.statusText).toBe("fromEndPath");
    })
  })
  describe("when http request is send to middle resource matching any with 1 level deep", () => {
    it("should return message from end server", async () => {
      const response = await fetch(`${middleAddress}/path/request/headerEcho`, {
        method: "POST",
        body: `PROXY ${endAddress}/path/`
      });
      expect(response.status).toBe(200);
      expect(response.statusText).toBe("fromEndPathHeaderEcho");
    })
  })
  describe("when http request is send to middle resource matching any with 2 levels deep", () => {
    it("should return message from end server", async () => {
      const response = await fetch(`${middleAddress}/path/request/headerEcho/deep`, {
        method: "POST",
        body: `PROXY ${endAddress}/path/`
      });
      expect(response.status).toBe(200);
      expect(response.statusText).toBe("fromEndPathHeaderEchoDeep");
    })
  })
  describe("when http request is send to middle resource for '/path/1/2' matching '/path/*' route", () => {
    it("should return message from end server at '/path/1/2' by each server having its own counter instance", async () => {
      const response = await fetch(`${middleAddress}/path/1/2`, {
        method: "POST",
        body: `PROXY ${endAddress}/path/`
      });

      expect(response.statusText).toBe("from__path_1_2");
      expect(response.status).toBe(200);
    })
  })
})

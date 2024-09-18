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
  describe("when destination is ommited", () => {
    it("should return error message and status", async () => {
      const response = await fetch(`${middleAddress}/request`, {
        method: "POST",
        body: `FORWARD`
      });
      expect(response.status).toBe(599);
      expect(response.statusText).toBe("Failed forward.resourceToPayload TypeError: Only absolute URLs are supported");
    })
  })
})

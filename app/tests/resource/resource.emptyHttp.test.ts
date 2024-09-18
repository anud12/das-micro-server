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

describe("reading empty http", () => {
		it("should return proper status code and text", async () => {
			const response = await fetch(`${address}/emptyHttp`, {
				method: "GET",
			});
			expect(response.status).toBe(599);
			expect(response.statusText).toBe("Failed to use any resourceReaders for /emptyHttp");
		})
})
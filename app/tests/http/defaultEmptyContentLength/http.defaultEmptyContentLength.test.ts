import {createHttpServer, MainResult} from "../../../src/httpServer/createHttpServer";
import fetch from "node-fetch";
import {FSDirectory} from "../../../src/fs/FSDirectory";

jest.mock("../../../src/logger.ts", () => ({
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

describe("http don't add content-length header automatically", () => {
	describe("when status is ommited", () => {
		it("should return empty header value and body", async () => {
			const response = await fetch(`${address}/runBodySh`, {
				method: "POST",
				body: `HTTP/1.1 200 Ok

body`
			});
			expect(response.status).toBe(200);
			expect(response.headers.get("content-length")).toBe(null);
			expect(await response.text()).toBe("body");
			expect(response.statusText).toBe("Ok");
		})
	})
})

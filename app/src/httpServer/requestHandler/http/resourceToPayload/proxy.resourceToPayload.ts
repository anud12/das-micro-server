import {Request} from "express";
import {PayloadResponse, resourceHeaderParser} from "./_resourceToPayload";
import fetch from "node-fetch";
import {Directory} from "../../../../fs/Directory.type";
import {HttpRequestHandlerLogger} from "../http.requestHandler.logger";
import {GraphqlSingleOperationRequestHandlerLogger} from "../../graphql/graphqlSingleOperation.requestHandler.logger";

export const proxyResourceToPayload = async (httpString: string, resourceDirectory:Directory, req: Request, logger: HttpRequestHandlerLogger | GraphqlSingleOperationRequestHandlerLogger): Promise<PayloadResponse> => {
	try {
		let resourceLines = httpString
			.split("\n")
			.reverse();
		let setupLine = resourceLines.pop();
		while (!(setupLine.trimStart().length > 0)) {
			setupLine = resourceLines.pop();
		}

		const [action, baseUrl] = setupLine.split(" ");
		const relativePath = resourceDirectory.relativePath().replace("/*", "").replace("*", "");
		const deltaPath = req.url.replace(relativePath , "");
		const noTrailDeltaPath = deltaPath.replace(/^\//, "");
		const trailingBaseUrl = baseUrl?.endsWith("/")
			? baseUrl
			: baseUrl + "/";

		const url = `${trailingBaseUrl}${noTrailDeltaPath}`;
		if (action !== "PROXY") {
			return undefined
		}
		const proxyResourceToPayloadLogger = logger.createProxyResourceToPayloadLogger()
		proxyResourceToPayloadLogger.start();
		const responseIndex = resourceLines.reverse().findIndex((value => value === "RESPONSE"))
		const responseLines = resourceLines.slice(responseIndex + 1);

		const requestIndex = resourceLines.findIndex((value => value === "REQUEST"))
		const requestLines = resourceLines.slice(requestIndex + 1, responseIndex);


		let originalHeaders = {...req.headers}
		delete originalHeaders.host;
		const fetchArguments: any = {
			method: req.method,
			headers: {
				...originalHeaders,
				...resourceHeaderParser(requestLines)
			}
		}
		if (fetchArguments.method !== "GET" && fetchArguments.method !== "HEAD") {
			fetchArguments.body = req.body;
		}

		proxyResourceToPayloadLogger.addRequest({
			url,
			method: fetchArguments.method,
			headers: fetchArguments.headers,
			body:fetchArguments.body
		});
		let response = await fetch(url, fetchArguments);

		const responseHeaders = {
			...Object.fromEntries(response.headers.entries()),
			...resourceHeaderParser(responseLines),
		}

		const result = {
			status: response.status,
			statusMessage: response.statusText,
			headers: responseHeaders,
			body: await response.text(),
		};
		proxyResourceToPayloadLogger.addResponse(result);
		return [result]
	} catch (e) {
		return [undefined, {
			statusMessage: `Failed proxy.resourceToPayload ${e}`
		}]
	}
}
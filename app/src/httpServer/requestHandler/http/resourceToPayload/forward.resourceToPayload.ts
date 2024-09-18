import {Request} from "express";
import {PayloadResponse, resourceHeaderParser} from "./_resourceToPayload";
import fetch from "node-fetch";
import {HttpRequestHandlerLogger} from "../http.requestHandler.logger";
import {GraphqlSingleOperationRequestHandlerLogger} from "../../graphql/graphqlSingleOperation.requestHandler.logger";

export const forwardResourceToPayload = async (httpString: string, req: Request, logger: HttpRequestHandlerLogger | GraphqlSingleOperationRequestHandlerLogger): Promise<PayloadResponse> => {
	try {
		let resourceLines = httpString
			.split("\n")
			.reverse();
		let setupLine = resourceLines.pop();
		while (!(setupLine.trimStart().length > 0)) {
			setupLine = resourceLines.pop();
		}

		const [action, url] = setupLine.split(" ");
		if (action !== "FORWARD") {
			return undefined
		}
		const forwardResourceToPayloadLogger = logger.createForwardResourceToPayloadLogger()
		forwardResourceToPayloadLogger.start();
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

		forwardResourceToPayloadLogger.addRequest({
			url,
			method: fetchArguments.method,
			headers: fetchArguments.headers,
			body:fetchArguments.body
		})
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
		forwardResourceToPayloadLogger.addResponse(result)
		return [result]
	} catch (e) {
		return [undefined, {
			statusMessage: `Failed forward.resourceToPayload ${e}`
		}]
	}
}
import {PayloadResponse, resourceHeaderParser} from "./_resourceToPayload";
import {HttpRequestHandlerLogger} from "../http.requestHandler.logger";
import {GraphqlSingleOperationRequestHandlerLogger} from "../../graphql/graphqlSingleOperation.requestHandler.logger";

export const httpResourceToPayload = async (httpString: string, logger:HttpRequestHandlerLogger | GraphqlSingleOperationRequestHandlerLogger): Promise<PayloadResponse> => {
  try {
    let responseLines = httpString
      .split("\n")
      .reverse();
    let statusLine = responseLines.pop();
    while (!(statusLine.trimStart().length > 0)) {
      statusLine = responseLines.pop();
    }

    const [action, status, ...statusMessage] = statusLine.split(" ");
    if (action !== "HTTP/1.1") {
      return undefined;
    }
    logger.createHttpResourceToPayloadLogger().start();
    let headers = resourceHeaderParser([...responseLines].reverse());

    responseLines.reverse();
    const bodyIndexStart = responseLines.findIndex(value => value === "");
    let body = responseLines
      .slice(bodyIndexStart + 1)
      .join("\n");
    const result = {
      status: Number(status),
      statusMessage: statusMessage.join(" "),
      headers,
      body
    }
    return [result]
  } catch (e) {
    return [undefined, {
      statusMessage: `Failed stringToHttpResponse ${e}`
    }]
  }
}
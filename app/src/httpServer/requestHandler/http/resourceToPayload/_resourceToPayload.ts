import {Request} from "express";
import {httpResourceToPayload} from "./http.resourceToPayload";
import {forwardResourceToPayload} from "./forward.resourceToPayload";
import {proxyResourceToPayload} from "./proxy.resourceToPayload";
import {Directory} from "../../../../fs/Directory.type";
import {HttpRequestHandlerLogger} from "../http.requestHandler.logger";
import {
  GraphqlSingleOperationRequestHandlerLogger
} from "../../graphql/graphqlSingleOperation.requestHandler.logger";

export type Payload = {
  status?: number,
  statusMessage?: string,
  headers?: Record<string, string>,
  body?: string,
}
export type PayloadError = {
  body?:string
  statusMessage: string
}
export type PayloadResponse =
  | [Payload]
  | [undefined, PayloadError]

export const resourceToPayload = async (httpString: string, resourceDirectory:Directory, req: Request, logger:HttpRequestHandlerLogger | GraphqlSingleOperationRequestHandlerLogger): Promise<PayloadResponse> => {
  if(httpString.replace("\n", "").length < 1) {
    return [undefined, {
      statusMessage: `Failed resourceToPayload received for request url "${req.url}" empty httpString`
    }]
  }
  return await httpResourceToPayload(httpString, logger)
    || await forwardResourceToPayload(httpString, req, logger)
    || await proxyResourceToPayload(httpString, resourceDirectory, req, logger)
    || [undefined, {
      statusMessage: `Failed resourceToPayload given httpString for request url "${req.url}" is not applicable`,
      body: `Failed resourceToPayload given httpString for request url "${req.url}" is not applicable:\n${httpString}`
    }]
}

export const resourceHeaderParser = (responseLines: string[]) => {
  let headers: any = undefined;

  for (const line of responseLines) {
    if (line !== undefined && line !== "") {
      let [key, ...values] = line.trim().split(":");
      headers = {
        ...headers,
        [key]: values.join(":")
      }
    } else {
      return headers
    }
  }
}
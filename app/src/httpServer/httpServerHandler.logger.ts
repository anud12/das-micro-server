import {FsLogger, FsLoggerObject, toFS, updateFS} from "../logging/_fsLogger";
import {logger} from "../logger";
import {sectionConsoleLog} from "../logging/section.consoleLog";
import {doubleSectionConsoleLog} from "../logging/doubleSection.consoleLog";
import {HttpRequestHandlerLogger} from "./requestHandler/http/http.requestHandler.logger";
import {Payload} from "./requestHandler/http/resourceToPayload/_resourceToPayload";
import {IncomingHttpHeaders} from "http";
import {
  GraphqlSingleOperationRequestHandlerLogger
} from "./requestHandler/graphql/graphqlSingleOperation.requestHandler.logger";

export type HttpServerHandlerLoggerRequest = {
  headers: IncomingHttpHeaders
  body: string,
  url: string,
  method: string
}

export class HttpServerHandlerLogger implements FsLogger {

  request?: HttpServerHandlerLoggerRequest
  response?: Payload
  requestHandlerLogger?:HttpRequestHandlerLogger | GraphqlSingleOperationRequestHandlerLogger
  constructor(private parent:FsLogger) {
  }

  addRequest = (request: HttpServerHandlerLoggerRequest) => {
    this.request = request;
    logger([
      doubleSectionConsoleLog.start(`${request.method}: ${request.url}`),
      doubleSectionConsoleLog.line(`${new Date().toISOString()}`),
      sectionConsoleLog.start("Request Headers:", Object.entries(request.headers)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n")),
      sectionConsoleLog.strike("Request Body", request.body),
    ].join("\n"));
    this[updateFS]();
  }

  createHttpRequestHandlerLogger = ():HttpRequestHandlerLogger => {
    this.requestHandlerLogger = new HttpRequestHandlerLogger(this);
    return this.requestHandlerLogger;
  }
  createGraphqlSingleOperationLogger = ():GraphqlSingleOperationRequestHandlerLogger => {
    const logger = new GraphqlSingleOperationRequestHandlerLogger(this);
    this.requestHandlerLogger = logger;
    return logger;
  }

  close = () => {
    logger([
      doubleSectionConsoleLog.line(`${new Date().toISOString()}`),
      doubleSectionConsoleLog.close(`${this.request.method}: ${this.request.url}`)
    ].join("\n"));
  }

  addResponse = (param:Payload) => {
    this.response = param;
    logger([
      sectionConsoleLog.start("Response:"),
      sectionConsoleLog.line(`  Status: ${param.status.toString()}`,),
      sectionConsoleLog.line(`  Status Message: ${param.statusMessage}`),
      sectionConsoleLog.strike("Response Headers", Object.entries(param.headers ?? {})
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n")),
      sectionConsoleLog.strike("Response Body", param.body),
      sectionConsoleLog.close("Response:"),
    ].join("\n"));
    this[updateFS]();
  }

  [updateFS] = () => {
    this.parent[updateFS]()
  }

  [toFS] = (): FsLoggerObject => {
    return {
      _type: "httpServerHandlerLogger",
      request: this.request ?? "",
      requestHandlerLogger: this.requestHandlerLogger?.[toFS]?.(),
      response: this.response,
    };
  }
}
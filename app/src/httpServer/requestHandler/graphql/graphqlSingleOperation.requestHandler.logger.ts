import {FsLogger, FsLoggerObject, toFS, updateFS} from "../../../logging/_fsLogger";
import {logger} from "../../../logger";
import {sectionConsoleLog} from "../../../logging/section.consoleLog";
import {HttpResourceToPayloadLogger} from "../http/resourceToPayload/http.resourceToPayload.logger";
import {ForwardResourceToPayloadLogger} from "../http/resourceToPayload/forward.resourceToPayload.logger";
import {ProxyResourceToPayloadLogger} from "../http/resourceToPayload/proxy.resourceToPayload.logger";

export type GrapqhqlRequestHandlerLoggerError = {
  requestPath: string,
  statusMessage: string
}

export class GraphqlSingleOperationRequestHandlerLogger implements FsLogger {

  counter?: number;
  errorObject: GrapqhqlRequestHandlerLoggerError;
  query?: string;
  operationName ?: string;
  variables?: unknown;
  moduleRoot?: string;
  resource?: string;
  resourceToPayload?: HttpResourceToPayloadLogger | ForwardResourceToPayloadLogger | ProxyResourceToPayloadLogger

  constructor(private parent:FsLogger) {
  }

  start = (args: Pick<GraphqlSingleOperationRequestHandlerLogger, "counter" | "moduleRoot" | "operationName">) => {
    this.counter = args.counter;
    this.moduleRoot = args.moduleRoot;
    this.operationName = args.operationName;
    logger([
      sectionConsoleLog.start(`Grqphql Single Operation Request Handler`),
      sectionConsoleLog.line(`Module FS Path: ${args.moduleRoot}`),
      sectionConsoleLog.line(`Operation: ${args.operationName}`),
      sectionConsoleLog.line(`Counter: ${args.counter}`),
      sectionConsoleLog.close(`Grqphql Single Operation Request Handler`),
    ].join("\n"))
    this[updateFS]();
  }

  addQueryAndVariables = (args: {
    query: GraphqlSingleOperationRequestHandlerLogger["query"],
    variables: GraphqlSingleOperationRequestHandlerLogger["variables"]
  }) => {
    this.query = args.query;
    this.variables = args.variables;
    logger([
      sectionConsoleLog.strike(`Graphql Single Operation Query`, args.query),
      sectionConsoleLog.strike(`Graphql Single Operation Variables:`, JSON.stringify(args.variables, null, 2))
    ].join("\n"))
    this[updateFS]();
  }

  addResourcePath = (args: Pick<GraphqlSingleOperationRequestHandlerLogger, "resource">) => {
    this.resource = args.resource;
    logger([
      sectionConsoleLog.line(`Matched resource FS Path: ${args.resource}`),
    ].join("\n"))
    this[updateFS]();
  }

  createHttpResourceToPayloadLogger = (): HttpResourceToPayloadLogger => {
    this.resourceToPayload = new HttpResourceToPayloadLogger(this);
    return this.resourceToPayload;
  }
  createForwardResourceToPayloadLogger = (): ForwardResourceToPayloadLogger => {
    const logger = new ForwardResourceToPayloadLogger(this);
    this.resourceToPayload = logger;
    return logger;
  }
  createProxyResourceToPayloadLogger = (): ProxyResourceToPayloadLogger => {
    const logger = new ProxyResourceToPayloadLogger(this);
    this.resourceToPayload = logger;
    return logger;
  }


  addNoReaderError = (args: GrapqhqlRequestHandlerLoggerError) => {
    this.errorObject = args;
    logger([
      sectionConsoleLog.strike("Failed to use any resourceHeaders"),
      sectionConsoleLog.line(`Path: ${args.requestPath}`,),
      sectionConsoleLog.line(`Message: ${args.statusMessage}`),
      sectionConsoleLog.close(`Http Request Handler`)
    ].join("\n"))
    this[updateFS]();
  }

  [updateFS] = () => {
    this.parent[updateFS]()
  }

  [toFS] = (): FsLoggerObject => {
    return {
      _type: "graphqlRequestHandlerLogger",
      operationName: this.operationName,
      moduleRoot:this.moduleRoot,
      resource:this.resource,
      variables: this.variables,
      counter: this.counter,
      query: this.query,
      error: this.errorObject,
      resourceToPayload: this.resourceToPayload?.[toFS]?.()
    };
  }

}
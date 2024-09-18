import {FsLogger, FsLoggerObject, toFS, updateFS} from "../../../logging/_fsLogger";
import {logger} from "../../../logger";
import {sectionConsoleLog} from "../../../logging/section.consoleLog";
import {HttpResourceToPayloadLogger} from "./resourceToPayload/http.resourceToPayload.logger";
import {ForwardResourceToPayloadLogger} from "./resourceToPayload/forward.resourceToPayload.logger";
import {ProxyResourceToPayloadLogger} from "./resourceToPayload/proxy.resourceToPayload.logger";

export type HttpRequestHandlerLoggerError = {
  requestPath: string,
  statusMessage: string
}

export type HttpRequestHandlerLoggerStart = {
  counter: number,
  path: string,
}

export class HttpRequestHandlerLogger implements FsLogger {

  counter?: number;
  path?:string;
  errorObject: HttpRequestHandlerLoggerError;
  resourcePath?: string
  resourceToPayload?:HttpResourceToPayloadLogger | ForwardResourceToPayloadLogger | ProxyResourceToPayloadLogger

  constructor(private parent:FsLogger) {
  }

  start = (args: HttpRequestHandlerLoggerStart) => {
    this.path = args.path;
    this.counter = args.counter;
    logger([
      sectionConsoleLog.start(`Http Request Handler`),
      sectionConsoleLog.line(`Request Path: ${args.path}`),
      sectionConsoleLog.line(`Counter: ${args.counter}`),
      sectionConsoleLog.close(`Http Request Handler`),
    ].join("\n"))
    this[updateFS]();
  }

  addResourcePath = (args: HttpRequestHandlerLogger["resourcePath"]) => {
    this.resourcePath = args;
    logger([
      sectionConsoleLog.strike(`Matched FS Path: ${args}`)
    ].join("\n"))
    this[updateFS]();
  }

  createHttpResourceToPayloadLogger = ():HttpResourceToPayloadLogger => {
    this.resourceToPayload = new HttpResourceToPayloadLogger(this);
    return this.resourceToPayload;
  }
  createForwardResourceToPayloadLogger = ():ForwardResourceToPayloadLogger => {
    const logger = new ForwardResourceToPayloadLogger(this);
    this.resourceToPayload = logger;
    return logger;
  }
  createProxyResourceToPayloadLogger = ():ProxyResourceToPayloadLogger => {
    const logger = new ProxyResourceToPayloadLogger(this);
    this.resourceToPayload = logger;
    return logger;
  }

  addError = (args: HttpRequestHandlerLoggerError) => {
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
      _type: "httpRequestHandlerLogger",
      path:this.path,
      counter: this.counter,
      resourcePath: this.resourcePath,
      error: this.errorObject,
      resourceToPayload: this.resourceToPayload?.[toFS]?.()
    };
  }
}
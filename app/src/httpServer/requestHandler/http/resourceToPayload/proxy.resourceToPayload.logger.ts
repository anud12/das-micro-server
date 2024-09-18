import {FsLogger, FsLoggerObject, toFS, updateFS} from "../../../../logging/_fsLogger";
import {logger} from "../../../../logger";
import {sectionConsoleLog} from "../../../../logging/section.consoleLog";
import {Payload} from "./_resourceToPayload";


export type ProxyResourceToPayloadRequest = {
  url: string,
  method: string,
  headers: any,
  body?: string
}

export class ProxyResourceToPayloadLogger implements FsLogger {

  response?: Payload;
  request?: ProxyResourceToPayloadRequest;

  constructor(private parent:FsLogger) {
  }
  start = () => {
    logger([
      sectionConsoleLog.start("Proxy Resource"),
    ].join("\n"))
    this[updateFS]();
  }
  addRequest = (payload: ProxyResourceToPayloadRequest) => {
    this.request = payload;
    logger([
      sectionConsoleLog.strike("Proxy request"),
      sectionConsoleLog.line(`  Method: ${payload.method}`),
      sectionConsoleLog.line(`  URL: ${payload.url}`),
      sectionConsoleLog.strike("Proxy request headers",
        Object.entries(payload.headers ?? {})
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n")),
      sectionConsoleLog.strike("Proxy request body", payload.body),
      sectionConsoleLog.close("Proxy request")
    ].join("\n"))
    this[updateFS]();
  }
  addResponse = (payload: Payload) => {
    this.response = payload;
    logger([
      sectionConsoleLog.strike("Proxy response"),
      sectionConsoleLog.line(`  Status: ${payload.status.toString()}`),
      sectionConsoleLog.line(`  Status Message: ${payload.statusMessage}`),
      sectionConsoleLog.strike("Proxy response headers",
        Object.entries(payload.headers ?? {})
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n")),
      sectionConsoleLog.strike("Proxy response body", payload.body),
      sectionConsoleLog.close("Proxy Resource")
    ].join("\n"))
    this[updateFS]();
  }

  [updateFS] = () => {
    this.parent[updateFS]()
  }

  [toFS] = (): FsLoggerObject => {
    return {
      _type: "proxyResourceToPayloadLogger",
      request: this.request,
      response: this.response,
    };
  }

}
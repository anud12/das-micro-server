import {FsLogger, FsLoggerObject, toFS, updateFS} from "../../../../logging/_fsLogger";
import {logger} from "../../../../logger";
import {sectionConsoleLog} from "../../../../logging/section.consoleLog";
import {Payload} from "./_resourceToPayload";


export type ForwardResourceToPayloadRequest = {
  url: string,
  method: string,
  headers: any,
  body?: string
}

export class ForwardResourceToPayloadLogger implements FsLogger {

  response?: Payload;
  request?: ForwardResourceToPayloadRequest;

  constructor(private parent:FsLogger) {
  }

  start = () => {
    logger([
      sectionConsoleLog.start("Forward Resource"),
    ].join("\n"))
    this[updateFS]();
  }

  addRequest = (payload: ForwardResourceToPayloadRequest) => {
    this.request = payload;
    logger([
      sectionConsoleLog.strike("Forward request"),
      sectionConsoleLog.line(`  Method: ${payload.method}`),
      sectionConsoleLog.line(`  URL: ${payload.url}`),
      sectionConsoleLog.strike("Forward request headers",
        Object.entries(payload.headers ?? {})
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n")),
      sectionConsoleLog.strike("Forward request body", payload.body),
      sectionConsoleLog.close("Forward request")
    ].join("\n"))
    this[updateFS]();
  }
  addResponse = (payload: Payload) => {
    this.response = payload;
    logger([
      sectionConsoleLog.strike("Forward response"),
      sectionConsoleLog.line(`  Status: ${payload.status.toString()}`),
      sectionConsoleLog.line(`  Status Message: ${payload.statusMessage}`),
      sectionConsoleLog.strike("Forward response headers",
        Object.entries(payload.headers ?? {})
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n")),
      sectionConsoleLog.strike("Forward response body", payload.body),
      sectionConsoleLog.close("Forward Resource")
    ].join("\n"))
    this[updateFS]();
  }

  [updateFS] = () => {
    this.parent[updateFS]()
  }

  [toFS] = (): FsLoggerObject => {
    return {
      _type: "forwardResourceToPayloadLogger",
      request: this.request,
      response: this.response,
    };
  }

}
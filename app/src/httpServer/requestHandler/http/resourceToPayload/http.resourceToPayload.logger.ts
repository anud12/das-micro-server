import {FsLogger, FsLoggerObject, toFS, updateFS} from "../../../../logging/_fsLogger";
import {logger} from "../../../../logger";
import {sectionConsoleLog} from "../../../../logging/section.consoleLog";

export class HttpResourceToPayloadLogger implements FsLogger {

  constructor(private parent:FsLogger) {
  }

  start = () => {
    logger([
      sectionConsoleLog.start("Http Resource"),
      sectionConsoleLog.close("Http Resource")
    ].join("\n"))
    this[updateFS]();
  }

  [updateFS] = () => {
    this.parent[updateFS]()
  }

  [toFS] = (): FsLoggerObject => {
    return {
      _type:"httpResourceToPayloadLogger"
    };
  }

}
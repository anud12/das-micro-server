import {logger} from "../logger";
import {HttpServerHandlerLogger} from "./httpServerHandler.logger";
import {FsLogger, FsLoggerObject, toFS, updateFS} from "../logging/_fsLogger";
import {writeFile} from "fs";
import {throttle} from "throttle-debounce";

export type CreateHttpServerLoggerArgs = {
  port:string;
  absolutePath:string;
  counterResetTimer:number;
  launchDescriptionList:string[];
  enableLogUi: boolean,
}
const writeToFile = throttle(500, (data:string) => {
  const string = `var data = ${data}\n` +
    `document.dispatchEvent(new CustomEvent(document.currentScript.getAttribute("eventName"), {
        detail: data
      }))`;
  writeFile("./#log/logData.js", string, (err) => {
    err && logger(err);
  })
})
export class CreateHttpServerLogger implements FsLogger {

  constructor(private args:CreateHttpServerLoggerArgs) {
  }
  children: Array<FsLogger> = [];
  log = () => {
    logger([
      `Listening at http://localhost:${this.args.port}`,
      `Root: ${this.args.absolutePath}`,
      `Counter reset inverval: ${this.args.counterResetTimer}ms`,
      `UI loggin is ${this.args.enableLogUi ? "enabled" : "disabled"}`,
      `Order\t Handler \t\t\t\t Subfolder`,
      ...this.args.launchDescriptionList.map((e, index) => ` ${index}\t${e}`)
    ].join("\n"))
    this[updateFS]();
  };

  createHttpServerHandlerLogger = () => {
    const logger = new HttpServerHandlerLogger(this);
    this.children.push(logger)
    return logger;
  }

  [updateFS] = () => {
    if(this.args.enableLogUi) {
      writeToFile(JSON.stringify(this[toFS](), null, 2))
    }
  }

  [toFS] = (): FsLoggerObject => {
    const object = {
      root:this.args.absolutePath,
      port:this.args.port + "",
      counterResetTimer:this.args.counterResetTimer + "",
      children: this.children.map(e => e?.[toFS]?.())
    }
    return {
      ...object,
      _type:"createHttpServerLogger",
    };
  }

  loggerReset = () => {
    this.children.push({
      [toFS]: () => ({_type:"counterReset"}),
      [updateFS] : () => {}
    })
    this[updateFS]();
  }
}
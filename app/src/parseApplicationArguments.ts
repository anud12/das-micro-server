import {Command} from "commander";
import path from "path";
import {logger} from "./logger";

export type ApplicationArgumentsKeys = "port" | "timer" | "path" | "uilog";
export type ApplicationArguments = Record<ApplicationArgumentsKeys, any>;
export const parseApplicationArguments = (program: Command): ApplicationArguments => {
  let args: Record<ApplicationArgumentsKeys, any> = {
    port: 8081,
    path: ".",
    timer: 2000,
    uilog: false
  };
  try {
    args.port = Number(program.opts().port) || args.port;
  } catch (e) {
    console.error(e);
  }
  try {
    args.timer = Number(program.opts().timer) || args.timer;
  } catch (e) {
    logger(e);
  }
  try{
    args.uilog = Boolean(program.opts().enableLogUi)
  } catch (e) {
    logger(e)
  }
  try {
    args.path = String(program.args[0]) || args.path;
    args.path = path.isAbsolute(args.path)
      ? path.normalize(args.path)
      : path.join(process.cwd(), args.path);
  } catch (e) {
    logger(e)
  }
  return args;
}
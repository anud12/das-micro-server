import {Request} from "express";
import {PayloadResponse} from "./http/resourceToPayload/_resourceToPayload";
import {Directory} from "../../fs/Directory.type";
import {HttpServerHandlerLogger} from "../httpServerHandler.logger";

export type RequestHandlerArguments = {
  rootDirectory: Directory
}

export type RequestHandler = {
  launchDescription: () => string,
  getCounters: () => Record<string, number>
  resetCounters: () => void
  isConsumable: (request:Request, args:RequestHandlerArguments, httpServerHandlerLogger:HttpServerHandlerLogger) => Promise<boolean>,
  consume: (request:Request, args:RequestHandlerArguments, httpServerHandlerLogger:HttpServerHandlerLogger) => Promise<PayloadResponse>,
}
import express, {Express} from "express";
import bodyParser from "body-parser";
import {logger} from "../logger";
import * as http from "http";
import {Server} from "http";
import {closeHandler} from "../closeHandler";
import {HttpRequestHandler} from "./requestHandler/http/http.requestHandler";
import {RequestHandler} from "./requestHandler/requestHandler.type";
import {debounce} from "debounce";
import {GraphqlSingleOperationRequestHandler} from "./requestHandler/graphql/graphqlSingleOperation.requestHandler";
import {Directory} from "../fs/Directory.type";
import {CreateHttpServerLogger} from "./createHttpServer.logger";
import {httpServerHandler} from "./httpServerHandler";
import {uiLog} from "../uiLog/uiLog";
import fs from "fs";

export type MainResult = {
  express: Express,
  httpServer: Server,
  port: number,
  close: () => Promise<CreateHttpServerLogger>,
  logger: CreateHttpServerLogger
}

export type CreateHttpServerArguments = {
  timer: number,
  port: number,
  directory: Directory,
  enableLogUi: boolean
}


export const createHttpServer = async (args: CreateHttpServerArguments): Promise<MainResult> => new Promise(resolve => {
  const app = express();

  app.use(bodyParser.text({type: '*/*'}));

  if (args.enableLogUi) {
    fs.mkdir("./#log", () => {
      fs.writeFile("./#log/index.html", uiLog["index.html"], err => {
        if (err) {
          console.log("Error creating /#log/index.html", err)
        }
      })
      fs.mkdir("./#log/js", () => {
        Object.entries(uiLog.js).forEach(([fileName, data]) => {
          fs.writeFile(`./#log/js/${fileName}`, data, err => {
            if (err) {
              console.log(`Error creating ${fileName}`, err)
            }
          })
        })
      })
    })
  }

  const requestHandles: Array<RequestHandler> = [
    new GraphqlSingleOperationRequestHandler(),
    new HttpRequestHandler()
  ]


  const httpServer = http.createServer(app).listen(args.port, () => {
    let address = httpServer.address();
    let port = typeof address !== "string"
      ? String(address.port)
      : address;

    const createHttpServerLogger = new CreateHttpServerLogger({
      absolutePath: args.directory.absolutePath(),
      port: port,
      counterResetTimer: args.timer,
      launchDescriptionList: requestHandles.map(e => e.launchDescription()),
      enableLogUi: args.enableLogUi,
    })

    let clearRequestCounters = undefined;
    if (args.timer) {
      clearRequestCounters = debounce(() => {
        requestHandles.forEach(handler => handler.resetCounters());
        logger("Counters reset")
        createHttpServerLogger.loggerReset();
      }, args.timer);
    }

    closeHandler.on(() => new Promise<CreateHttpServerLogger>(res => {
      logger("Closing http server")
      requestHandles.forEach(handler => handler.resetCounters());
      httpServer.close(() => res(createHttpServerLogger));
      // @ts-ignore
      clearRequestCounters?.clear?.();
    }))
    createHttpServerLogger.log();
    app.use(httpServerHandler(clearRequestCounters, requestHandles, args, createHttpServerLogger))

    resolve({
      express: app,
      httpServer: httpServer,
      close: closeHandler.send,
      // @ts-ignore
      port: httpServer.address().port,
      logger: createHttpServerLogger,
    })
  })
})



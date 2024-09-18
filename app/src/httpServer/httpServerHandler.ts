import {RequestHandler, RequestHandlerArguments} from "./requestHandler/requestHandler.type";
import {CreateHttpServerLogger} from "./createHttpServer.logger";
import {Request, Response} from "express";
import {CreateHttpServerArguments} from "./createHttpServer";

export const httpServerHandler = (
  clearRequestCounters: () => void,
  requestHandlerList: Array<RequestHandler>,
  args: CreateHttpServerArguments,
  createHttpServerLogger:CreateHttpServerLogger
) => async (req:Request, res: Response, next) => {
  clearRequestCounters?.();
  const filteredRequestHandlers = [] as typeof requestHandlerList;

  const httpServerHandlerLogger = createHttpServerLogger.createHttpServerHandlerLogger()
  httpServerHandlerLogger.addRequest({
    url:req.url,
    method:req.method,
    headers: req.headers,
    body: JSON.stringify(req.body),
  });
  const handlerArguments: RequestHandlerArguments = {
    rootDirectory: args.directory
    // findMatchingPath: (path: string) => findApplicablePathByDirectoryNameRegex(args.path, path)
  }
  await Promise.all(requestHandlerList.map(async value => {
    const isConsumable = await value.isConsumable(req, handlerArguments, httpServerHandlerLogger);
    if (isConsumable) {
      filteredRequestHandlers.push(value)
    }
    return Promise.resolve();
  }))
  const [payload, payloadError] = await filteredRequestHandlers[0].consume(req, handlerArguments, httpServerHandlerLogger);
  res.getHeaderNames().forEach(value => {
    res.removeHeader(value);
  })
  res.setHeader("Content-type", "text/plain; charset=utf-8");
  if (payloadError) {
    res.statusMessage = payloadError.statusMessage
    const body = payloadError.body ?? payloadError.statusMessage ?? ""
    httpServerHandlerLogger.addResponse({
      status: 599,
      statusMessage: payloadError.statusMessage,
      body,
    })
    httpServerHandlerLogger.close();
    res.status(599);

    await new Promise<void>((resolve) => {
      res.write(body, () => resolve())
    })
    res.end();
    next();
    return;
  }
  if (payload?.headers) {
    Object.entries(payload.headers).forEach(([key, value]) => {
      if (key === "content-encoding") {
        return;
      }
      if (key === "content-length") {
        return;
      }
      try {
        res.setHeader(key, value)
      } catch (e) {

      }
    });
  }

  httpServerHandlerLogger.addResponse(payload)
  httpServerHandlerLogger.close();

  if (payload?.statusMessage) {
    res.statusMessage = payload.statusMessage;
  }
  if(!(payload.status) && !(payload.statusMessage)) {
    res.statusMessage = "Status code and message not given";
  }
  res.status(payload?.status || 299);
  await new Promise<void>((resolve) => {
    res.write(payload?.body, () => resolve())
  })
  res.end();

}
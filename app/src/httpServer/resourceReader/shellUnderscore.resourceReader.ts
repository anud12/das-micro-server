import {ResourceReader} from "./_resourceReader";
import {Request} from "express";
import {loggerError} from "../../logger";


const reqToProcessArgs = (req: Request) => {
  return JSON.stringify({
    method: req.method,
    url: req.url,
    query: req.query,
    headers: req.headers,
    body: req.body,
    cookies: req.cookies
  })
}

export const shellUnderscoreResourceReader: ResourceReader = async args => {
  const process = args.directory.run(`_.sh`, [
    reqToProcessArgs(args.req),
    String(args.index)
  ]);
  if(!process) {
    return [undefined, {
      statusMessage: `Failed to use shellUnderscoreResourceReader for ${args.req.path}`,
      body: ``,
    }]
  }
  let output = process.stdout.toString();
  let errorOutput = process.stderr.toString();
  loggerError(errorOutput);
  return [output]
}
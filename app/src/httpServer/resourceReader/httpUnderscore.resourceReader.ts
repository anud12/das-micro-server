import {ResourceReader} from "./_resourceReader";

export const httpUnderscoreResourceReader: ResourceReader = async args => {

  const resource = args.directory.read(`_.http`)

  if(!resource) {
    return [undefined, {
      statusMessage: `httpUnderscoreResourceReader: No usable files found for ${args.req.path}`
    }]
  }
  return [resource]
}
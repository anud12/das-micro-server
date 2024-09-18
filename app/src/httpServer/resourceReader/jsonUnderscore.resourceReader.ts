import {ResourceReader} from "./_resourceReader";

export const jsonUnderscoreResourceReader: ResourceReader = async args => {
  const resource = args.directory.read(`_.json`)

  if(!resource) {
    return [undefined, {
      statusMessage: `jsonUnderscoreResourceReader: No usable files found for ${args.req.path}`
    }]
  }
}
#!/usr/bin/node

process.stdout.write(`
HTTP/1.1 200 fromEnd
endHeader1: endHeader1Value
toBeReplacedHeader: originalValue

${JSON.stringify(JSON.parse(process.argv[2])?.headers)}
`)
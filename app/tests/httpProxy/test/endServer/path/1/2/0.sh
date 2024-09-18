#!/usr/bin/node

process.stdout.write(`
HTTP/1.1 200 from__path_1_2
endHeader1: endHeader1Value
toBeReplacedHeader: originalValue

${JSON.stringify(JSON.parse(process.argv[2])?.headers)}
`)
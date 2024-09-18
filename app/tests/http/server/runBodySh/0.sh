#!/usr/bin/node

process.stdout.write(JSON.parse(process.argv[2])?.body)
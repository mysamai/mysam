#!/bin/sh
curl -H "Content-Type: application/json" -X POST -d '{ "type": "learn" }' http://localhost:3030/webhook
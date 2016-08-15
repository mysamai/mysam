#!/bin/sh
curl -H "Content-Type: application/json" -X POST -d '{ "type": "toggle" }' http://localhost:3030/webhook
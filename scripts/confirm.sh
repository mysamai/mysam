#!/bin/sh
curl -H "Content-Type: application/json" -X POST -d '{ "type": "confirm" }' http://localhost:3030/webhook
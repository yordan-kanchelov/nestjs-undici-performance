#!/bin/bash

echo "Testing Mock Service..."
curl -s http://localhost:3001/api/data | jq .

echo -e "\n\nTesting NestJS Fastify+Axios HTTP Module..."
time curl -s http://localhost:3002/api | jq '.message, .duration'

echo -e "\n\nTesting NestJS Fastify+Undici HTTP Module..."
time curl -s http://localhost:3003/api | jq '.message, .duration'

echo -e "\n\nTesting NestJS Express+Axios HTTP Module..."
time curl -s http://localhost:3004/api | jq '.message, .duration'

echo -e "\n\nRunning 10 concurrent requests to Fastify+Axios HTTP..."
time seq 1 10 | xargs -P 10 -I {} curl -s http://localhost:3002/api -o /dev/null

echo -e "\n\nRunning 10 concurrent requests to Fastify+Undici HTTP..."
time seq 1 10 | xargs -P 10 -I {} curl -s http://localhost:3003/api -o /dev/null

echo -e "\n\nRunning 10 concurrent requests to Express+Axios HTTP..."
time seq 1 10 | xargs -P 10 -I {} curl -s http://localhost:3004/api -o /dev/null
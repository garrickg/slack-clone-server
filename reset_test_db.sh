#!/bin/bash
echo "docker exec slack-postgres dropdb -U postgres testslack; docker exec slack-postgres createdb -U postgres testslack" | ssh pi@192.168.1.154
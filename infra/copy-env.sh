#!/bin/bash
# Locally copies both the curb and bot env files to the servers.

scp ./.env rpi-5:infra
scp ./curb/.env rpi-400:infra/curb
#!/usr/bin/env bash

git remote update

if git status -uno | grep -q 'is behind'; then
  git pull
  echo 'pulling'
  systemctl restart thedoor-discordbot
fi
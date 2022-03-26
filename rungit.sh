#!/usr/bin/env bash

git remote update

if git status -uno | grep -q 'is behind'; then
  git pull
  systemctl restart thedoor-discordbot
fi
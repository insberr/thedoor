#!/usr/bin/env bash

git remote update

if git status -uno | grep -q 'is behind'; then
  git pull
fi

service thedoor-discordbot restart
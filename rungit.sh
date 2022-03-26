git remote update

if git status -uno | grep -q 'is behind'; then
  git pull
fi

sudo service theroom-discordbot restart
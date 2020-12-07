# discord-bot

This is just a little project im doing in my free time, 
If you do decide you want to download the bot, make sure
to run `npm install` in the project directory to download
the node_modules needed. Also, dont forget to run sync.bat to make
sure the database is created BEFORE you run the bot.

To get the bot to run, you need to run 'npm install' to install 
all node_modules that the bot requires, Sync the database, 
make a discord application to act as the bots user, 
https://discord.com/developers/applications,
grab the bots Token from the Application,
paste it into the token section of example-auth.json
and change the file name to 'auth.json', at that point you 
can run 'node bot.js' and the bot will run.

Make Sure you have the latest Python 2 and 3, Node v12 or up,
and install Canvas and Sqlite3 manually if needed.

IF ON LINUX, YOU NEED TO INSTALL MAKE, GCC, AND G++ IF YOU HAVENT
ALREADY, For Debian based distros: `sudo apt install make gcc g++`

If you want to make changes to the code , but have the bot 
restart every time you save changes , install nodemon with
'npm install -g nodemon' and run the bot with 'nodemon bot.js'

If you have any changes to the code that you think should be 
in my repo, create a pull request and ill review it.
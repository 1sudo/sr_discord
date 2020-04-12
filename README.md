# sr_discord

Copy or move the `.env.sample` file to `.env` and edit it to fit your needs.

You can get channel and role ID's by right clicking them and clicking `Copy ID`.

For the token, go to the Discord developer page here:
https://discordapp.com/developers/applications/

1) Click `New Application` and give it a name.
2) Upload an avatar for your bot and then go to the `bot` tab.
3) Click `Add bot`.
4) Turn off `Public bot`.
5) Copy the token and paste it the `token` field in the `.env` file.
6) Go back to the `General Information` tab and copy the `Client ID`.
7) Go to the following link (replacing the client ID with the ID you copied in the last step)

`https://discordapp.com/oauth2/authorize?client_id=<YOUR CLIENT ID>&scope=bot&permissions=3072`
  
Select your server and add it.

Now that your bot is in Discord, simply give it permissions to do the following:

Read messages  
Send messages  
Manage messages  
Manage roles

Ensure that it has those permissions in the channels you added ID's for in your `.env` file and you're good to go.

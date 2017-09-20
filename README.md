# GitEye
An Auth0 WebTask intended to be an endpoint for a GitHub web hook.  Searches updated files for potentially sensitive data.  Currently the following terms are being searched for:

 - password
 - pass
 - pw
 - pwd
 - passwd
 - key
 - user
 - username
 - secret

## Setup
First follow the instructions for installing the WebTask CLI found [here](https://webtask.io/cli).

Once this has been done you can [upload the WebTask](https://webtask.io/docs/101).

This will give you a URL for the web task that can be used as an end point for your GitHub [webhook](https://developer.github.com/webhooks/creating/).

## TODO
Add email notificaitons to the committer and the repo owner.  Currently this only logs to the WebTask console when potentially sensitive content is found.
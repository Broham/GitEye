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

## TODO:
Add email notificaitons to the committer and the repo owner.  Currently this only logs to the WebTask console when potentially sensitive content is found.
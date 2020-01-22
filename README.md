# simultanio

## Client
Written in Typescript for HTML5 Canvas

To build, run `bash build.sh` from `/client`

View by running the Server locally as described below.

## Server

Written in Flask

`python3 -m pip install -r server/requirements.txt` to install python requirements.

Run locally using `python3 startup.py` from `/`


## Deploying

Build client and install server requirements.

To deploy, install gunicorn3 and create a `secrets.sh` file in `/` based on the following template:

```bash
# FLASK
export SECRET_KEY="random text here"
export SERVER_NAME="example.com"
```

Then run `bash startup.sh` from `/`

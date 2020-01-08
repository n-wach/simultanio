# simultanio

## Client
Written in Typescript for HTML5 Canvas

To build:

`npm install package.json`
`npm run recompile-typescript`
`npm run browserify`

View by running the Server locally as described below.

## Server

Written in Flask

`python3 -m pip install server` to install python requirements.

Run locally using `python3 server/__init__.py`. (https://localhost/)

To deploy, install gunicorn and create a `secrets.sh` file in `/server` based on the following template:

```bash
# FLASK
export SECRET_KEY="random text here"
export SERVER_NAME="localhost"
```

Then run `bash startup.sh` from `/server`

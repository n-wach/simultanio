import os

from flask import Flask, request, render_template, send_file

app = Flask(__name__, static_url_path='', static_folder='../client/dist', template_folder="../client/templates")

app.secret_key = os.environ.get("SECRET_KEY")
if os.environ.get("SERVER_NAME") is not None:
    app.config["SERVER_NAME"] = os.environ.get("SERVER_NAME")


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")


@app.route("/js/bundle.js")
def js_bundle():
    return send_file("../client/dist/bundle.js")

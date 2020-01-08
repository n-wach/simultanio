import os

from flask import Flask, request

app = Flask(__name__, static_url_path='', static_folder='static')

app.secret_key = os.environ.get("SECRET_KEY")
if os.environ.get("SERVER_NAME") is not None:
    app.config["SERVER_NAME"] = os.environ.get("SERVER_NAME")

@app.route("/", methods=["GET"])
def hello():
    return render_template("../client/index.html")


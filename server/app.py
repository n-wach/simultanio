import os

from flask import Flask, render_template, send_file, request
from flask_socketio import SocketIO, emit, rooms, join_room, leave_room

from server.match_manager import MatchManager

print("Starting...")
app = Flask(__name__,
            static_url_path='',
            static_folder='../client/dist',
            template_folder="../client/templates")

print("Creating SocketIO...")
socketio = SocketIO(app, cors_allowed_origins="*")  # allowing all is okay because we are behind nginx???

app.secret_key = os.environ.get("SECRET_KEY")
if os.environ.get("SERVER_NAME") is not None:
    app.config["SERVER_NAME"] = os.environ.get("SERVER_NAME")

print("Making matches...")
match_manager = MatchManager(socketio)
print("Ready.")

import sys
sys.stdout.flush()

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")


@app.route("/js/bundle.js")
def js_bundle():
    return send_file(os.path.join("..", "client", "dist", "bundle.js"))


@app.route("/shared/data.json")
def json_data():
    return send_file(os.path.join("..", "shared", "data.json"))


@socketio.on("connect")
def ws_connect():
    join_room("lobby")
    emit_available_matches()


@socketio.on("disconnect")
def ws_disconnect():
    leave_match()


@socketio.on("create match")
def create_match():
    if "lobby" not in rooms():
        return  # can only create from the lobby
    leave_room("lobby")
    match_manager.create_match()
    emit_available_matches(True)


@socketio.on("join match")
def join_match(match_id):
    if "lobby" not in rooms(sid=request.sid):
        return  # can only join from the lobby
    leave_room("lobby")
    match_manager.join_match(match_id)
    emit_available_matches(True)


@socketio.on("leave match")
def leave_match():
    if "lobby" in rooms(sid=request.sid):
        return  # can only leave if in info
    join_room("lobby")
    match_manager.leave_match()
    emit_available_matches(True)


@socketio.on("unready")
def player_unready():
    if "lobby" in rooms(sid=request.sid):
        return
    match_manager.unready()


@socketio.on("ready")
def player_ready():
    if "lobby" in rooms(sid=request.sid):
        return
    match_manager.ready()


@socketio.on("player command")
def player_command(command):
    match = match_manager.get_user_match()
    if match is None:
        return
    for player in match.game.players:
        if player.sid == request.sid:
            player.pending_messages.append(command)
            return


def emit_available_matches(broadcast=False):
    emit("list matches", match_manager.list_matches(),
         room="lobby", broadcast=broadcast)



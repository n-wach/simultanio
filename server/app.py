from flask import Flask, render_template, send_file, request
from flask_socketio import SocketIO, emit, rooms, join_room, leave_room
import os

from server.match_manager import MatchManager

app = Flask(__name__,
            static_url_path='',
            static_folder='../client/dist',
            template_folder="../client/templates")

socketio = SocketIO(app)

app.secret_key = os.environ.get("SECRET_KEY")
if os.environ.get("SERVER_NAME") is not None:
    app.config["SERVER_NAME"] = os.environ.get("SERVER_NAME")


match_manager = MatchManager(socketio)


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")


@app.route("/js/bundle.js")
def js_bundle():
    return send_file("../client/dist/bundle.js")


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
        return  # can only leave if in match
    join_room("lobby")
    match_manager.leave_match()
    emit_available_matches(True)


@socketio.on("mousemove")
def mouse_move(loc):
    match = match_manager.get_user_match()
    if match is None:
        return
    colors = ["red", "orange", "yellow", "green", "blue"]
    color = colors[match.player_sids.index(request.sid) % len(colors)]
    emit("mousemove", {
        "x": loc["x"],
        "y": loc["y"],
        "color": color
    }, room=match.match_id)


def emit_available_matches(broadcast=False):
    emit("list matches", match_manager.list_matches(),
         room="lobby", broadcast=broadcast)



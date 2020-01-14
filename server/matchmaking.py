from flask import request
from flask_socketio import join_room, emit, leave_room


class Matchmaking:
    def __init__(self):
        self.lobbies = []

    def create_lobby(self, name):
        for lobby in self.lobbies:
            if lobby.name == name:
                return lobby
        lobby = GameLobby(name)
        self.lobbies.append(lobby)
        return lobby

    def list_lobbies(self):
        v = []
        for lobby in self.lobbies:
            v.append(lobby.get_info())
        return v

    def join_lobby(self, room_id):
        for lobby in self.lobbies:
            if room_id == lobby.room_id:
                lobby.join()
                return

    def get_user_lobby(self):
        for lobby in self.lobbies:
            if request.sid in lobby.player_sids:
                return lobby

    def leave_lobby(self):
        self.get_user_lobby().leave()


class GameLobby:
    def __init__(self, name):
        self.name = name
        self.room_id = "game_lobby_{}".format(id(self))
        self.player_sids = []

    def get_info(self):
        return {
            "name": self.name,
            "id": self.room_id,
            "player_count": len(self.player_sids)
        }

    def join(self):
        self.player_sids.append(request.sid)
        join_room(self.room_id)

    def send_message(self, message):
        emit("send message", message, room=self.room_id)

    def leave(self):
        self.player_sids.remove(request.sid)
        leave_room(self.room_id)


matchmaking = Matchmaking()


def init_namespace(socketio):

    @socketio.on("create lobby")
    def create_lobby(name):
        lobby = matchmaking.create_lobby(name)
        matchmaking.join_lobby(lobby.room_id)
        emit("list lobbies", matchmaking.list_lobbies(), broadcast=True)

    @socketio.on("list lobbies")
    def list_lobbies():
        emit("list lobbies", matchmaking.list_lobbies())

    @socketio.on("connect")
    def connect():
        list_lobbies()

    @socketio.on("join lobby")
    def join_lobby(lobby_id):
        matchmaking.join_lobby(lobby_id)

    @socketio.on("leave lobby")
    def leave_lobby():
        matchmaking.leave_lobby()

    @socketio.on("send message")
    def send_message(message):
        lobby = matchmaking.get_user_lobby()
        lobby.send_message(message)




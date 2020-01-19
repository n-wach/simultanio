from flask import request
from flask_socketio import join_room, leave_room, emit

from server.namer import random_adjective, random_noun


class Match:
    def __init__(self, socketio, manager):
        self.socketio = socketio
        self.manager = manager
        self.name = random_adjective().capitalize() + random_noun().capitalize()
        self.match_id = "match_{}".format(id(self))
        self.player_sids = []
        self.max_players = 4

    def get_listing(self):
        return {
            "name": self.name,
            "id": self.match_id,
            "player_count": len(self.player_sids),
            "max_players": self.max_players,
        }

    def join(self):
        self.player_sids.append(request.sid)
        join_room(self.match_id)
        emit("join match", self.get_listing())

    def leave(self):
        self.player_sids.remove(request.sid)
        leave_room(self.match_id)

    def start(self):
        self.socketio.start_background_task(self.logic_loop)

    def logic_loop(self):
        print(self.name, "start")
        while len(self.player_sids) > 0:
            self.socketio.sleep(5)
        print(self.name, "end")
        self.manager.matches.remove(self)



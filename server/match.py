from time import time

from flask import request, current_app, copy_current_request_context
from flask_socketio import join_room, leave_room, emit

from server.game.game import Game
from server.namer import random_adjective, random_noun


class Match:
    def __init__(self, socketio, manager):
        self.socketio = socketio
        self.manager = manager
        self.name = random_adjective().capitalize() + random_noun().capitalize()
        self.match_id = "match_{}".format(id(self))
        self.max_players = 4
        self.game = Game(self)
        self.tick_period = 0.5

    def get_listing(self):
        return {
            "name": self.name,
            "id": self.match_id,
            "player_count": len(self.game.players),
            "max_players": self.max_players,
        }

    def join(self):
        if len(self.game.players) >= self.max_players:
            return
        self.game.add_player(request.sid)
        join_room(self.match_id)
        emit("join match", self.get_listing())

    def leave(self):
        self.game.remove_player(request.sid)
        leave_room(self.match_id)

    def start(self):
        self.socketio.start_background_task(self.logic_loop)

    def logic_loop(self):
        print(self.name, "start")
        last_tick_time = time()
        while len(self.game.players) > 0:
            self.socketio.sleep(self.tick_period)
            t = time()
            dt = t - last_tick_time
            self.game.tick(dt)
            self.game.broadcast_update(self.socketio)
            last_tick_time = t
        print(self.name, "end")
        self.manager.matches.remove(self)


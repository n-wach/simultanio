from time import time

from flask import request, current_app, copy_current_request_context
from flask_socketio import join_room, leave_room, emit

from server.game.game import Game
from server.namer import random_adjective, random_noun


class Match:
    class Status:
        WAITING = "waiting",
        STARTED = "started",
        ENDED = "ended",

    def __init__(self, socketio, manager):
        self.socketio = socketio
        self.manager = manager
        self.name = random_adjective().capitalize() + random_noun().capitalize()
        self.match_id = "match_{}".format(id(self))
        self.max_players = 4
        self.tick_period = 0.1
        self.status = Match.Status.WAITING
        self.duration = 0
        self.game = Game(self)

    def get_info(self):
        return {
            "id": self.match_id,
            "name": self.name,
            "player_count": len(self.game.players),
            "max_players": self.max_players,
            "status": self.status,
            "duration": self.duration,
        }

    def join(self):
        if len(self.game.players) >= self.max_players:
            return
        player = self.game.add_player(request.sid)
        join_room(self.match_id)
        emit("join info", player.get_update())

    def leave(self):
        self.game.remove_player(request.sid)
        leave_room(self.match_id)
        emit("leave info")

    def start(self):
        self.socketio.start_background_task(self.logic_loop)

    def logic_loop(self):
        print(self.name, "start")
        last_tick_time = time()
        while len(self.game.players) > 0:
            self.socketio.sleep(self.tick_period)
            t = time()
            dt = t - last_tick_time
            self.duration += dt
            for player in self.game.players:
                player.tick(dt)
            for player in self.game.players:
                player.broadcast_update(self.socketio)
            last_tick_time = t
        print(self.name, "end")
        self.manager.matches.remove(self)


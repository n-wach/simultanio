import random
from time import time

from flask import request
from flask_socketio import join_room, leave_room, emit

from server.game.game import Game
from server.namer import random_adjective, random_noun


class Match:
    class Status:
        WAITING = "waiting",
        STARTED = "started",
        ENDED = "ended",

    def __init__(self, socketio, manager, terrain):
        self.socketio = socketio
        self.manager = manager
        self.name = random_adjective().capitalize() + random_noun().capitalize()
        self.match_id = id(self)
        self.room_name = "match_{}".format(self.match_id)
        self.max_players = 4
        self.tick_period = 0.2
        self.status = Match.Status.WAITING
        self.ready_count = 0
        self.duration = 0
        self.game = Game(self, terrain)
        print(self.name, "waiting")

    def get_info(self):
        return {
            "id": self.match_id,
            "name": self.name,
            "playerCount": len(self.game.players),
            "maxPlayers": self.max_players,
            "status": self.status,
            "duration": self.duration,
        }

    def join(self):
        if len(self.game.players) >= self.max_players:
            return
        player = self.game.add_player(request.sid)
        join_room(self.room_name)
        emit("join match", player.get_update())
        self.send_update()

    def leave(self):
        player = self.game.remove_player(request.sid)
        self.unready(player)
        leave_room(self.room_name)
        emit("leave match")
        self.send_update()

    def ready(self, player):
        if not player.ready:
            player.ready = True
            self.ready_count += 1
            self.send_update()
        if self.ready_count == len(self.game.players):
            self.start()

    def unready(self, player):
        if player.ready and self.status == Match.Status.WAITING:
            player.ready = False
            self.ready_count -= 1
            self.send_update()

    def start(self):
        if self.status != Match.Status.STARTED:
            self.status = Match.Status.STARTED
            self.send_update()
            self.socketio.start_background_task(self.logic_loop)

    def send_update(self):
        for player in self.game.players:
            player.broadcast_update(self.socketio)

    def logic_loop(self):
        print(self.name, "start")
        last_tick_time = time()
        while self.status == Match.Status.STARTED:
            self.socketio.sleep(self.tick_period)
            t = time()
            dt = t - last_tick_time
            last_tick_time = t
            self.duration += dt

            random.shuffle(self.game.players)
            for player in self.game.players:
                player.tick(dt)
            self.send_update()

            if len(self.game.players) == 0:
                self.status = Match.Status.ENDED
        print(self.name, "end")


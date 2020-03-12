from flask import request

from server.game.terrain import Terrain
from server.match import Match


class MatchManager:
    def __init__(self, socketio):
        self.socketio = socketio
        self.matches = []
        self.terrain_queue = []

        self.tick_period = 5
        self.socketio.start_background_task(self.logic_loop)

    def logic_loop(self):
        self.socketio.sleep(0.1)
        while True:
            if len(self.terrain_queue) < 5:
                self.terrain_queue.append(Terrain(50, 50))
            self.socketio.sleep(self.tick_period)

    def create_match(self):
        if len(self.terrain_queue) == 0:
            self.terrain_queue.append(Terrain(50, 50))
        match = Match(self.socketio, self, self.terrain_queue.pop())
        self.matches.append(match)
        match.join()

    def list_matches(self):
        matches = []
        for match in self.matches:
            if len(match.game.players) > 0:
                matches.append(match)
        # throw out all matches will no players
        self.matches = matches
        return {
            "matches": [match.get_info() for match in self.matches]
        }

    def join_match(self, match_id):
        for match in self.matches:
            if match.match_id == match_id:
                match.join()
                return

    def ready(self):
        for match in self.matches:
            for player in match.game.players:
                if player.sid == request.sid:
                    match.ready(player)
                    return

    def unready(self):
        for match in self.matches:
            for player in match.game.players:
                if player.sid == request.sid:
                    match.unready(player)
                    return

    def get_user_match(self):
        for match in self.matches:
            for player in match.game.players:
                if player.sid == request.sid:
                    return match

    def leave_match(self):
        match = self.get_user_match()
        if match is None:
            return
        match.leave()

from flask import request

from server.match import Match


class MatchManager:
    def __init__(self, socketio):
        self.socketio = socketio
        self.matches = []

    def create_match(self):
        match = Match(self.socketio, self)
        self.matches.append(match)
        match.join()
        match.start()

    def list_matches(self):
        return [match.to_dict() for match in self.matches]

    def join_match(self, match_id):
        for match in self.matches:
            if match.match_id == match_id:
                match.join()
                return

    def get_user_match(self):
        for match in self.matches:
            if request.sid in match.player_sids:
                return match

    def leave_match(self):
        match = self.get_user_match()
        if match is None:
            return
        match.leave()

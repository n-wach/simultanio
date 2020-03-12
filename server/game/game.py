import random

from server.game.player import Player


class Game:
    def __init__(self, match, terrain):
        self.match = match
        self.players = []
        self.terrain = terrain
        self.player_slots = [True] * 4

    def gen_player_id(self):
        ids = list(range(len(self.player_slots)))
        while len(ids) > 0:
            i = random.choice(ids)
            if self.player_slots[i]:
                self.player_slots[i] = False
                return i
            else:
                ids.remove(i)
        return None

    def add_player(self, sid):
        player_id = self.gen_player_id()
        color = Player.Color.ALL[player_id]
        player = Player(self, sid, color, player_id)
        self.players.append(player)
        return player

    def remove_player(self, sid):
        for player in self.players:
            if player.sid == sid:
                self.player_slots[player.player_id] = True
                self.players.remove(player)
                return player

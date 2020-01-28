from server.game.player import Player
from server.game.terrain import Terrain


class Game:
    def __init__(self, match):
        self.match = match
        self.players = []
        self.terrain = Terrain(100, 100)
        self.player_ids = [True]*4

    def gen_player_id(self):
        for i in range(len(self.player_ids)):
            if self.player_ids[i]:
                self.player_ids[i] = False
                return i
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
                self.player_ids[player.player_id] = True
                self.players.remove(player)
                return

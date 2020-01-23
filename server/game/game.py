from server.game.player import Player
from server.game.terrain import Terrain


class Game:
    def __init__(self, match):
        self.match = match
        self.players = []
        self.terrain = Terrain(100, 100)

    def add_player(self, sid):
        color = Player.Color.ALL[len(self.players) % len(Player.Color.ALL)]
        player = Player(self, sid, color)
        self.players.append(player)
        return player

    def remove_player(self, sid):
        for player in self.players:
            if player.sid == sid:
                self.players.remove(player)
                return

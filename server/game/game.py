from server.game.player import Player
from server.game.terrain import Terrain


class Game:
    def __init__(self):
        self.players = []
        self.entities = []
        self.ticks = 0
        self.terrain = Terrain(100, 100)

    def tick(self):
        for player in self.players:
            player.act()

        self.ticks += 1

        for entity in self.entities:
            entity.tick()

        self.terrain.update_fog()

        for player in self.players:
            player.send_update()

    def add_player(self):
        self.players.append(Player())

    def add_entity(self, entity):
        self.entities.append(entity)


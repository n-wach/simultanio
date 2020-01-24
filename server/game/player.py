from server.game.building import City
import random

from server.game.terrain import TerrainView
from server.game.unit import Unit


class Player:
    class Color:
        RED = "red"
        ORANGE = "orange"
        YELLOW = "yellow"
        GREEN = "green"
        BLUE = "blue"
        PURPLE = "purple"
        ALL = [RED, BLUE, GREEN, ORANGE, PURPLE, YELLOW]  # in order of preference

    def __init__(self, game, sid, color):
        self.game = game
        self.sid = sid
        self.stored_energy = 0
        self.stored_matter = 0
        self.color = color
        self.terrain_view = TerrainView(game.terrain, self)

        scout = Unit(x=0, y=0, owner=self, terrain=game.terrain)
        scout.set_target(game.terrain.width, game.terrain.height)

        self.entities = [City(self, game.terrain,
                              random.randrange(0, game.terrain.width),
                              random.randrange(0, game.terrain.height)),
                         scout]
        self.id = id(self)

    def get_entities(self):
        return [entity.get_self() for entity in self.entities]

    def get_self(self):
        return {
            "stored_energy": self.stored_energy,
            "stored_matter": self.stored_matter,
            "entities": self.get_entities(),
            "color": self.color,
            "id": self.id,
        }

    def get_terrain_view(self):
        return {
            "width": self.game.terrain.width,
            "height": self.game.terrain.height,
            "grid": self.terrain_view.get_player_grid()
        }

    def get_other_players(self):
        return [p.get_self() for p in self.game.players if p != self]

    def get_update(self):
        return {
            "info": self.game.match.get_info(),
            "you": self.get_self(),
            "other_players": self.get_other_players(),
            "terrain_view": self.get_terrain_view(),
        }

    def broadcast_update(self, socketio):
        socketio.emit("game update", self.get_update(), room=self.sid)

    def tick(self, dt):
        for entity in self.entities:
            entity.tick(dt)
        # Human player will act based on WS events received since last call
        # AI player will act using AI
        pass



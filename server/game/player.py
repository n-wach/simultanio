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

        self.capital = City(self, game.terrain,
                            random.randrange(0, game.terrain.width),
                            random.randrange(0, game.terrain.height))

        self.scout = Unit(x=self.capital.grid_x, y=self.capital.grid_y,
                          owner=self, terrain_view=self.terrain_view)

        self.entities = [self.capital, self.scout]
        self.id = id(self)

        self.pending_messages = []

    def get_entities(self):
        return [entity.get_self() for entity in self.entities]

    def get_entities_from_perspective(self,other):
        return [entity.get_self() for entity in self.entities if other.terrain_view.entity_visible(entity)]

    def get_self(self):
        return {
            "stored_energy": self.stored_energy,
            "stored_matter": self.stored_matter,
            "entities": self.get_entities(),
            "color": self.color,
            "id": self.id,
        }

    def get_self_from_perspective(self, other):
        return {
            "entities": self.get_entities_from_perspective(other),
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
        return [p.get_self_from_perspective(self) for p in self.game.players if p != self]

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

        for message in self.pending_messages:
            if message["command"] == "set target":
                self.scout.set_target(message["x"], message["y"])

        # Human player will act based on WS events received since last call
        # AI player will act using AI
        pass

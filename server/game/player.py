from server.game.building import City, EnergyGenerator, MatterCollector, Building, BUILDING_TYPES, InConstructionState
from server.game.entity import IdleState

from server.game.terrain import TerrainView
from server.game.unit import PathingState, PathingToBuildState
from server.game.unit import Scout, Unit, Fighter, Builder


class Player:

    class Color:
        RED = "red"
        ORANGE = "orange"
        YELLOW = "yellow"
        GREEN = "green"
        BLUE = "blue"
        PURPLE = "purple"
        ALL = [RED, BLUE, GREEN, ORANGE, PURPLE, YELLOW]  # in order of preference

    def __init__(self, game, sid, color, player_id):
        self.game = game
        self.sid = sid
        self.stored_energy = 0
        self.stored_matter = 0
        self.color = color
        self.terrain_view = TerrainView(game.terrain, self)
        spawn_pos = game.terrain.spawn_positions[player_id]

        self.capital = City(self, spawn_pos[0], spawn_pos[1])
        self.starting_units = []
        for c, p in zip([Scout, Builder, Fighter], self.terrain_view.terrain.neighboring_points(*spawn_pos)):
            unit = c(self, *spawn_pos)
            unit.state = PathingState(*p, unit)
            self.starting_units.append(unit)
        self.starting_units.append(EnergyGenerator(self, spawn_pos[0] + 1, spawn_pos[1] + 1))
        self.starting_units.append(MatterCollector(self, spawn_pos[0] - 1, spawn_pos[1] - 1))
        self.entities = [self.capital] + self.starting_units
        self.id = id(self)
        self.player_id = player_id

        self.pending_messages = []

    def add_entity(self, entity):
        self.entities.append(entity)

    def construct_building(self, building_type, target_x, target_y):
        mc = building_type.STATS["cost"]["matter"]
        ec = building_type.STATS["cost"]["energy"]
        if mc <= self.stored_matter and ec <= self.stored_energy:
            self.stored_matter -= mc
            self.stored_energy -= ec
            building = building_type(self, target_x, target_y)
            building.health = 0
            building.state = InConstructionState(building)
            self.entities.append(building)
            return building
        return None

    def get_self(self):
        return {
            "storedEnergy": self.stored_energy,
            "storedMatter": self.stored_matter,
            "entities": [entity.get_self() for entity in self.entities],
            "color": self.color,
            "id": self.id,
        }

    def get_self_from_perspective(self, other):
        return {
            "entities": [entity.get_self() for entity in self.entities if other.terrain_view.entity_visible(entity)],
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
            "otherPlayers": self.get_other_players(),
            "terrainView": self.get_terrain_view(),
        }

    def broadcast_update(self, socketio):
        socketio.emit("game update", self.get_update(), room=self.sid)

    def tick(self, dt):
        self.process_messages()

        for entity in self.entities:
            entity.tick(dt)

        # Human player will act based on WS events received since last call
        # AI player will act using AI

    def process_messages(self):
        for message in self.pending_messages:
            print(message)
            if message["command"] == "set target":
                for e in self.entities:
                    if id(e) in message["ids"]:
                        if isinstance(e, Unit):
                            e.state = PathingState(e.align_x(message["x"]), e.align_y(message["y"]), e)
            elif message["command"] == "clear target":
                for e in self.entities:
                    if id(e) in message["ids"]:
                        if isinstance(e, Unit) and isinstance(e.state, PathingState):
                            e.state = IdleState(e)
            elif message["command"] == "build":
                building_type = message["buildingType"]
                for e in self.entities:
                    if id(e) in message["ids"]:
                        if isinstance(e, Builder) and building_type in e.STATS["can_build"]:
                            e.state = PathingToBuildState(BUILDING_TYPES[building_type],
                                                          e.align_x(message["x"]), e.align_y(message["y"]), e)
        self.pending_messages.clear()


    def get_entities_at(self, x, y):
        for player in self.game.players:
            for entity in player.entities:
                if self.terrain_view.entity_visible(entity) and (entity.grid_x == x and entity.grid_y == y):
                    yield entity

    def get_building_at(self, x, y):
        for entity in self.get_entities_at(x, y):
            if isinstance(entity, Building):
                return entity
        return None

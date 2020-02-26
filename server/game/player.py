from server.game.building import City, Building, BUILDING_TYPES, GeneratingState, TrainingState, GhostState
from server.game.entity import IdleState

from server.game.terrain import TerrainView
from server.game.unit import PathingState, PathingToBuildState, UNIT_TYPES
from server.game.unit import Scout, Unit, Builder


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

        self.entities = []
        self.capital = City(self, spawn_pos[0], spawn_pos[1])
        self.starting_scout = Scout(self, spawn_pos[0] - 1, spawn_pos[1])
        self.starting_builder = Builder(self, spawn_pos[0] + 1, spawn_pos[1])
        self.add_entity(self.capital)
        self.add_entity(self.starting_builder)
        self.add_entity(self.starting_scout)
        self.id = id(self)
        self.player_id = player_id

        self.pending_messages = []

    def add_entity(self, entity):
        entity.exists = True
        if not isinstance(entity.state, GhostState):
            self.terrain_view.discover_single_view(entity)
        self.entities.append(entity)

    def delete_entity(self, entity):
        entity.exists = False
        self.entities.remove(entity)

    def train_unit(self, unit_type, target_x, target_y):
        if self.can_afford(unit_type):
            self.purchase(unit_type)
            unit = unit_type(self, target_x, target_y)
            self.entities.append(unit)
            return unit
        return None

    def tick(self, dt):
        # todo: AI player does AI stuff
        self.process_messages()

        for entity in self.entities:
            entity.tick(dt)

    def process_messages(self):
        for message in self.pending_messages:
            if message["command"] == "set target":
                for e in self.entities:
                    if id(e) in message["ids"] and isinstance(e, Unit):
                        e.state = PathingState(self.terrain_view.terrain.align_x(message["x"]),
                                               self.terrain_view.terrain.align_y(message["y"]), e)
            elif message["command"] == "clear target":
                for e in self.entities:
                    if id(e) in message["ids"] and isinstance(e, Unit) and isinstance(e.state, PathingState):
                        e.state = IdleState(e)
            elif message["command"] == "build":
                building_type = message["buildingType"]
                ghost = None
                for e in self.entities:
                    if id(e) in message["ids"] and isinstance(e, Builder) and building_type in e.STATS["can_build"]:
                        building_cls = BUILDING_TYPES[building_type]
                        if ghost is None and self.can_afford(building_cls):
                            self.purchase(building_cls)
                            ghost = building_cls(self, message["x"], message["y"], starting_health=0)
                            ghost.state = GhostState(ghost)
                            self.add_entity(ghost)
                        if ghost:
                            e.state = PathingToBuildState(ghost, e)
            elif message["command"] == "train":
                for e in self.entities:
                    if id(e) == message["building"]:
                        if isinstance(e, Building) \
                                and message["unitType"] in e.STATS["can_train"] \
                                and isinstance(e.state, GeneratingState):
                            e.state = TrainingState(UNIT_TYPES[message["unitType"]], e)
        self.pending_messages.clear()

    def visible_entities_at(self, x, y):
        for player in self.game.players:
            for entity in player.entities:
                if self.terrain_view.entity_visible(entity) and (entity.grid_x == x and entity.grid_y == y):
                    yield entity

    def visible_buildings_at(self, x, y):
        for entity in self.visible_entities_at(x, y):
            if isinstance(entity, Building):
                yield entity

    def purchase(self, building_type):
        mc = building_type.STATS["cost"]["matter"]
        ec = building_type.STATS["cost"]["energy"]
        self.stored_matter -= mc
        self.stored_energy -= ec

    def refund(self, building_type):
        mc = building_type.STATS["cost"]["matter"]
        ec = building_type.STATS["cost"]["energy"]
        self.stored_matter += mc
        self.stored_energy += ec

    def can_afford(self, building_type):
        mc = building_type.STATS["cost"]["matter"]
        ec = building_type.STATS["cost"]["energy"]
        return mc <= self.stored_matter and ec <= self.stored_energy

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

import math

from server.game.building import GhostState, InConstructionState
from server.game.entity import IdleState
from server.game.entity import UnalignedEntity
from server.shared import entity_stats


class Unit(UnalignedEntity):
    pass


class Scout(Unit):
    TYPE = "scout"
    STATS = entity_stats(TYPE)


class Builder(Unit):
    TYPE = "builder"
    STATS = entity_stats(TYPE)


class Fighter(Unit):
    TYPE = "fighter"
    STATS = entity_stats(TYPE)

    def __init__(self, *args, **kwargs):
        super(Fighter, self).__init__(*args, **kwargs)
        self.default_state = GuardingState(self)


class PathingState(IdleState):
    TYPE = "pathing"

    def __init__(self, target_x, target_y, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.target_x = target_x
        self.target_y = target_y
        self.path = []
        self.calculate_path()

    def calculate_path(self):
        self.path = self.parent.terrain_view.get_path((self.parent.grid_x, self.parent.grid_y),
                                                      (self.target_x, self.target_y))

    def tick(self, dt):
        remaining_distance = dt * self.parent.STATS["movement_speed"]
        while remaining_distance > 0 and len(self.path) > 0:
            next_pos = self.path[0]
            if not self.parent.terrain_view.passable(*next_pos):
                self.calculate_path()
                continue
            dx = next_pos[0] - self.parent.x
            dy = next_pos[1] - self.parent.y
            dd = math.sqrt(dx ** 2 + dy ** 2)
            if dd < remaining_distance:
                self.parent.x = next_pos[0]
                self.parent.y = next_pos[1]
                self.path.pop(0)
                remaining_distance -= dd
                self.parent.terrain_view.discover_single_view(self.parent)
            else:
                self.parent.x += (dx / dd) * remaining_distance
                self.parent.y += (dy / dd) * remaining_distance
                remaining_distance = 0

        if len(self.path) == 0:
            self.parent.reset()

    def get_self(self):
        return {
            "type": self.TYPE,
            "path": [{"x": p[0], "y": p[1]} for p in self.path]
        }


class GuardingState(IdleState):
    TYPE = "guarding"

    def tick(self, dt):
        nearest = self.parent.owner.get_nearest_enemy(self.parent.grid_x,
                                                      self.parent.grid_y,
                                                      max_radius=self.parent.STATS["active_sight"])
        if nearest:
            self.parent.state = FightingState(target=nearest, entity=self.parent)


class FightingState(PathingState):
    TYPE = "fighting"

    def __init__(self, target, *args, **kwargs):
        super().__init__(target.grid_x, target.grid_y, *args, **kwargs)
        self.target = target

    def tick(self, dt):
        if not self.parent.owner.terrain_view.entity_visible(self.target):
            self.parent.reset()
        else:
            if (self.target_x, self.target_y) is not (self.target.grid_x, self.target.grid_y):
                self.target_x = self.target.grid_x
                self.target_y = self.target.grid_y
                self.calculate_path()
            dx = self.parent.grid_x - self.target.grid_x
            dy = self.parent.grid_y - self.target.grid_y
            d2 = dx * dx + dy * dy
            r2 = self.parent.STATS["fighting_range"] ** 2
            if d2 < r2:
                self.target.health -= self.parent.STATS["fighting_dps"] * dt
            if d2 > r2 / 2:
                # get a little closer
                super().tick(dt)
            else:
                self.path = []

    def get_self(self):
        return {
            "type": self.TYPE,
            "path": [{"x": p[0], "y": p[1]} for p in self.path],
            "target": id(self.target)
        }


class ConstructingState(IdleState):
    TYPE = "constructing"

    def __init__(self, building, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.building = building

    def tick(self, dt):
        self.building.repair(dt * self.parent.STATS["rebuild_rate"])

    def get_self(self):
        return {
            "type": self.TYPE,
            "building": id(self.building)
        }


class PathingToBuildState(PathingState):
    TYPE = "pathingToBuild"

    def __init__(self, building, *args, **kwargs):
        super().__init__(building.grid_x, building.grid_y, *args, **kwargs)
        self.building = building

    def tick(self, dt):
        super().tick(dt)
        if self.condition():
            self.transition()

    def condition(self):
        dx = self.target_x - self.parent.x
        dy = self.target_y - self.parent.y
        in_range = dx * dx + dy * dy < self.parent.STATS["build_range"] ** 2
        return self.building.exists and (len(self.path) == 0 or in_range)

    def transition(self):
        # check to see if pathing actually terminated nearby / if buildable in location
        dx = self.target_x - self.parent.x
        dy = self.target_y - self.parent.y
        in_range = dx * dx + dy * dy < self.parent.STATS["build_range"] ** 2
        if in_range and self.building.exists:
            if isinstance(self.building.state, GhostState):
                self.building.state = InConstructionState(self.building)
                self.parent.owner.terrain_view.discover_single_view(self.building)
            self.parent.state = ConstructingState(self.building, self.parent)
        else:
            self.parent.reset()

    def get_self(self):
        return {
            "type": self.TYPE,
            "ghost": id(self.building),
            "path": [{"x": p[0], "y": p[1]} for p in self.path]
        }


UNIT_TYPES = {cls.TYPE: cls for cls in Unit.__subclasses__() if hasattr(cls, "TYPE")}

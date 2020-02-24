import math

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

        if self.condition():
            self.transition()

    def condition(self):
        return len(self.path) == 0

    def transition(self):
        self.parent.state = IdleState(self.parent)

    def get_self(self):
        return {
            "type": self.TYPE,
            "path": [{"x": p[0], "y": p[1]} for p in self.path]
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

    def __init__(self, building_type, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.building_type = building_type

    def condition(self):
        dx = self.target_x - self.parent.x
        dy = self.target_y - self.parent.y
        return len(self.path) == 0 or dx * dx + dy * dy < self.parent.STATS["build_range"] ** 2

    def transition(self):
        # check to see if pathing actually terminated nearby / if buildable in location
        dx = self.target_x - self.parent.x
        dy = self.target_y - self.parent.y
        if not dx * dx + dy * dy < self.parent.STATS["build_range"] ** 2 \
                or not self.parent.owner.terrain_view.passable(self.target_x, self.target_y):
            self.parent.state = IdleState(self.parent)
        else:
            building_at_location = self.parent.owner.get_building_at(self.target_x, self.target_y)
            if building_at_location is not None:
                if isinstance(building_at_location, self.building_type):
                    self.parent.state = ConstructingState(building_at_location, self.parent)
                else:
                    self.parent.state = IdleState(self.parent)
            else:
                building = self.parent.owner.construct_building(self.building_type, self.target_x, self.target_y)
                if building is not None:
                    self.parent.state = ConstructingState(building, self.parent)

    def get_self(self):
        return {
            "type": self.TYPE,
            "buildingType": self.building_type.TYPE,
            "path": [{"x": p[0], "y": p[1]} for p in self.path]
        }


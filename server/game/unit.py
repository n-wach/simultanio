import math

from server.game.building import City
from server.game.entity import EntityState
from server.game.entity import UnalignedEntity


class PathingState(EntityState):
    def __init__(self, target_x, target_y, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.target_x = target_x
        self.target_y = target_y
        self.path = []
        self.calculate_path()

    def calculate_path(self):
        self.path = self.parent.terrain_view.get_path((self.parent.grid_x, self.parent.grid_y), (self.target_x, self.target_y))

    def tick(self, dt):
        remaining_distance = dt * self.parent.MOVEMENT_SPEED
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
        len(self.path) == 0

    def transition(self):
        self.parent.state = EntityState(self.parent)


class Unit(UnalignedEntity):
    ACTIVE_SIGHT = 5
    PASSIVE_SIGHT = 5
    ENERGY_COST = 10
    MATTER_COST = 10
    TIME_COST = 10
    MOVEMENT_SPEED = 2
    TYPE = "unit"

    def __init__(self, owner, x, y):
        super().__init__(owner, x, y)

    def get_path(self):
        path = []
        if isinstance(self.state, PathingState):
            for pos in self.state.path:
                path.append({"x": pos[0], "y": pos[1]})
        return path

    def get_self(self):
        return {
            "type": self.TYPE,
            "x": self.x,
            "y": self.y,
            "id": id(self),
            "path": self.get_path(),
        }


class Scout(Unit):
    ACTIVE_SIGHT = 7
    PASSIVE_SIGHT = 7
    ENERGY_COST = 10
    MATTER_COST = 10
    TIME_COST = 10
    MOVEMENT_SPEED = 3
    TYPE = "scout"


class BuildingState(EntityState):
    def __init__(self, building, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.building = building

    # contribute to health of the building
    def tick(self, dt):
        pass


class PathingToBuildState(PathingState):
    def __init__(self, building_type, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.building_type = building_type

    def start(self):
        pass

    def condition(self):
        return \
            (self.target_x - self.parent.x) ** 2 + (self.target_y - self.parent.y) ** 2 < self.parent.BUILD_RANGE ** 2 \
            or len(self.path) == 0

    def transition(self):
        # check to see if pathing actually terminated nearby / if buildable in location
        if not (self.target_x - self.parent.x) ** 2 + (
                self.target_y - self.parent.y) ** 2 < self.parent.BUILD_RANGE ** 2 \
                or not self.parent.owner.terrain_view.passable(self.target_x, self.target_y):
            self.parent.state = EntityState(self.parent)
        else:
            building_at_location = self.parent.owner.get_building_at(self.target_x, self.target_y)
            if building_at_location is not None:
                if isinstance(building_at_location, self.building_type):
                    self.parent.state = BuildingState(building_at_location, self.parent)
                else:
                    self.parent.state = EntityState(self.parent)
            else:
                building = City(self.parent.owner, self.target_x, self.target_y)
                self.parent.owner.add_entity(building)
                self.parent.state = BuildingState(building, self.parent)


class Builder(Unit):
    ACTIVE_SIGHT = 5
    PASSIVE_SIGHT = 5
    ENERGY_COST = 10
    MATTER_COST = 10
    TIME_COST = 10
    MOVEMENT_SPEED = 1
    TYPE = "builder"

    BUILD_RANGE = 1

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        print(id(self))


class Fighter(Unit):
    ACTIVE_SIGHT = 5
    PASSIVE_SIGHT = 5
    ENERGY_COST = 10
    MATTER_COST = 10
    TIME_COST = 10
    MOVEMENT_SPEED = 1.5
    TYPE = "fighter"


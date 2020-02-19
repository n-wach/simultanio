import math

from server.game.building import City
from server.game.entity import UnalignedEntity
from server.game.entity import EntityState


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
        pass


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


class Builder(Unit):
    ACTIVE_SIGHT = 5
    PASSIVE_SIGHT = 5
    ENERGY_COST = 10
    MATTER_COST = 10
    TIME_COST = 10
    MOVEMENT_SPEED = 1
    TYPE = "builder"

    BUILD_RANGE = 1

    def __init__(self, owner, x, y):
        super().__init__(owner, x, y)

        self.build_target_set = False
        print(id(self))

    def set_build_target(self, x, y):
        self.set_target(x, y)
        self.build_target_set = True

    def tick(self, dt):
        super().tick(dt)

        if self.build_target_set:
            # need to check if picked location is actually available
            if False:
                pass
            else:
                if (self.target_x-self.x)**2 + (self.target_y-self.y)**2 < self.BUILD_RANGE**2:
                    self.owner.add_entity(City(self.owner, self.target_x, self.target_y))
                    self.build_target_set = False


class Fighter(Unit):
    ACTIVE_SIGHT = 5
    PASSIVE_SIGHT = 5
    ENERGY_COST = 10
    MATTER_COST = 10
    TIME_COST = 10
    MOVEMENT_SPEED = 1.5
    TYPE = "fighter"


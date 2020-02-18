import math

from server.game.entity import UnalignedEntity


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
        self.target_x = x
        self.target_y = y
        self.path = []
        self.calculate_path()

    def set_target(self, x, y):
        self.target_x = self.align_x(x)
        self.target_y = self.align_y(y)
        self.calculate_path()

    def calculate_path(self):
        self.path = self.terrain_view.get_path((self.grid_x, self.grid_y), (self.target_x, self.target_y))

    def valid_path(self):
        return all(self.terrain_view.passable(*p) for p in self.path)

    def tick(self, dt):
        remaining_distance = dt * self.MOVEMENT_SPEED
        while remaining_distance > 0 and len(self.path) > 0:
            next_pos = self.path[0]
            if not self.terrain_view.passable(*next_pos):
                self.calculate_path()
                continue
            dx = next_pos[0] - self.x
            dy = next_pos[1] - self.y
            dd = math.sqrt(dx ** 2 + dy ** 2)
            if dd < remaining_distance:
                self.x = next_pos[0]
                self.y = next_pos[1]
                self.path.pop(0)
                remaining_distance -= dd
                self.terrain_view.discover_single_view(self)
            else:
                self.x += (dx / dd) * remaining_distance
                self.y += (dy / dd) * remaining_distance
                remaining_distance = 0

    def get_path(self):
        path = []
        for pos in self.path:
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

    def set_build_target(self, x, y):
        self.set_target(x, y)

    def tick(self, dt):
        super().tick(dt)


class Fighter(Unit):
    ACTIVE_SIGHT = 5
    PASSIVE_SIGHT = 5
    ENERGY_COST = 10
    MATTER_COST = 10
    TIME_COST = 10
    MOVEMENT_SPEED = 1.5
    TYPE = "fighter"


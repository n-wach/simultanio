import math

from server.game.entity import UnalignedEntity


class Unit(UnalignedEntity):
    ACTIVE_SIGHT = 5
    PASSIVE_SIGHT = 5
    ENERGY_COST = 10
    MATTER_COST = 10
    TIME_COST = 10
    MOVEMENT_SPEED = 10
    VARIATION = "unit"

    def __init__(self, x, y, *args, **kwargs):
        super().__init__(x, y, **kwargs)
        self.target_x = x
        self.target_y = y
        self.path = []
        self.calculate_path()

    def set_target(self, x, y):
        self.target_x = x
        self.target_y = y
        self.calculate_path()

    def calculate_path(self):
        self.path = self.terrain_view.get_path((self.grid_x, self.grid_y), (self.target_x, self.target_y))

    def tick(self, dt):
        dist = dt * self.MOVEMENT_SPEED
        while dist > 0 and len(self.path) > 0:
            next_pos = self.path[0]
            if not self.terrain_view.terrain.tile_at(*next_pos).passable:
                self.calculate_path()
                break
            dx = next_pos[0] - self.x
            dy = next_pos[1] - self.y
            dd = math.sqrt(dx ** 2 + dy ** 2)
            if dd < dist:
                self.x = next_pos[0]
                self.y = next_pos[1]
                self.path.pop(0)
                dist -= dd
                self.terrain_view.update_view()
            else:
                self.x += (dx / dd) * dist
                self.y += (dy / dd) * dist
                dist = 0


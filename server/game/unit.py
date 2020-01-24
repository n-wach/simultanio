import math

from server.game.entity import UnalignedEntity


class Unit(UnalignedEntity):
    ACTIVE_SIGHT = 5
    PASSIVE_SIGHT = 5
    ENERGY_COST = 10
    MATTER_COST = 10
    TIME_COST = 10
    MOVEMENT_SPEED = 1
    VARIATION = "unit"

    def __init__(self, x, y, *args, **kwargs):
        super().__init__(x, y, **kwargs)
        self.target_x = x
        self.target_y = y
        self.calculate_path()

    def set_target(self, x, y):
        self.target_x = x
        self.target_y = y
        self.calculate_path()

    def calculate_path(self):
        pass

    def tick(self, dt):
        dx = self.target_x - self.x
        dy = self.target_y - self.y
        dist = math.sqrt(dx ** 2 + dy ** 2)
        if dist < dt * self.MOVEMENT_SPEED:
            self.x = self.target_x
            self.y = self.target_y
        else:
            self.x += (dx / dist) * dt * self.MOVEMENT_SPEED
            self.y += (dy / dist) * dt * self.MOVEMENT_SPEED



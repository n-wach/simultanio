from server.game.entity import UnalignedEntity


class Unit(UnalignedEntity):
    ENERGY_COST = 10
    MATTER_COST = 10
    TIME_COST = 10

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

    def tick(self):
        pass



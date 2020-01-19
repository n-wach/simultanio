from math import floor


class Entity:
    ACTIVE_SIGHT = 0
    PASSIVE_SIGHT = 0

    def __init__(self, owner, terrain, grid_x, grid_y):
        self.owner = owner
        self.terrain = terrain
        self.grid_x = grid_x
        self.grid_y = grid_y

    def tick(self):
        pass


class UnalignedEntity(Entity):
    def __init__(self, x, y, *args, **kwargs):
        super().__init__(grid_x=floor(x), grid_y=floor(y), *args, **kwargs)
        self._x = x
        self._y = x

    @property
    def x(self):
        return self._x

    @x.setter
    def x(self, x):
        self._x = x
        self.grid_x = floor(x)

    @property
    def y(self):
        return self._y

    @y.setter
    def y(self, y):
        self._y = y
        self.grid_y = floor(y)

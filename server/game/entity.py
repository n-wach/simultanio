from math import floor


class EntityState:
    def __init__(self, entity):
        self.parent = entity

    def start(self):
        pass

    def tick(self, dt):
        pass


class Entity:
    ACTIVE_SIGHT = 0
    PASSIVE_SIGHT = 0
    TYPE = "unknown"

    def __init__(self, owner, grid_x, grid_y):
        self.owner = owner
        self.terrain_view = owner.terrain_view
        self.grid_x = grid_x
        self.grid_y = grid_y
        self.owner.terrain_view.discover_single_view(self)
        self.state = EntityState(self)
        self.health = 0

    def tick(self, dt):
        self.state.tick(dt)

    @property
    def state(self):
        return self._state

    @state.setter
    def state(self, state):
        self._state = state
        state.start()

    def get_self(self):
        return {
            "type": self.TYPE,
            "x": self.grid_x,
            "y": self.grid_y,
            "id": id(self),
        }


class UnalignedEntity(Entity):
    def __init__(self, owner, x, y):
        super().__init__(owner, x, y)
        self.grid_x = self.align_x(x)
        self.grid_y = self.align_y(y)
        self.x = x
        self.y = y

    @property
    def x(self):
        return self._x

    @x.setter
    def x(self, x):
        self._x = x
        self.grid_x = self.align_x(x)

    @property
    def y(self):
        return self._y

    @y.setter
    def y(self, y):
        self._y = y
        self.grid_y = self.align_y(y)

    def align_x(self, x):
        return min(max(floor(x), 0), self.owner.terrain_view.terrain.width - 1)

    def align_y(self, y):
        return min(max(floor(y), 0), self.owner.terrain_view.terrain.height - 1)

    def get_self(self):
        return {
            "type": self.TYPE,
            "x": self.x,
            "y": self.y,
            "id": id(self),
        }

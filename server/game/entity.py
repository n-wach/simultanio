from server.shared import entity_stats


class IdleState:
    TYPE = "idle"

    def __init__(self, entity):
        self.parent = entity

    def start(self):
        pass

    def tick(self, dt):
        pass

    def get_self(self):
        return {
            "type": self.TYPE,
        }


class Entity:
    TYPE = "unknown"
    STATS = entity_stats(TYPE)

    def __init__(self, owner, grid_x, grid_y, starting_health=1.0):
        self.owner = owner
        self.terrain_view = owner.terrain_view
        self.default_state = IdleState(self)
        self.grid_x = self.terrain_view.terrain.align_x(grid_x)
        self.grid_y = self.terrain_view.terrain.align_y(grid_y)
        self.state = self.default_state
        self.health = starting_health
        self.exists = False

    def tick(self, dt):
        self.state.tick(dt)
        if self.health < 0:
            self.owner.delete_entity(self)

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
            "state": self.state.get_self(),
            "health": self.health,
            "x": self.grid_x,
            "y": self.grid_y,
            "id": id(self),
        }

    def reset(self):
        self.state = self.default_state


class UnalignedEntity(Entity):
    def __init__(self, owner, x, y):
        super().__init__(owner, x, y)
        self.grid_x = self.terrain_view.terrain.align_x(x)
        self.grid_y = self.terrain_view.terrain.align_y(y)
        self.x = x
        self.y = y

    @property
    def x(self):
        return self._x

    @x.setter
    def x(self, x):
        self._x = x
        self.grid_x = self.owner.terrain_view.terrain.align_x(x)

    @property
    def y(self):
        return self._y

    @y.setter
    def y(self, y):
        self._y = y
        self.grid_y = self.owner.terrain_view.terrain.align_y(y)

    def get_self(self):
        return {
            "type": self.TYPE,
            "state": self.state.get_self(),
            "health": self.health,
            "x": self.x,
            "y": self.y,
            "id": id(self),
        }

from server.game.entity import Entity, EntityState


class GeneratingState(EntityState):
    def __init__(self, energy_rate, matter_rate, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.energy_rate = energy_rate
        self.matter_rate = matter_rate

    def tick(self, dt):
        self.parent.owner.stored_energy += dt * self.energy_rate
        self.parent.owner.stored_matter += dt * self.matter_rate


class InConstructionState(EntityState):
    def tick(self, dt):
        if self.parent.health >= 1.0:
            self.parent.state = self.parent.active_state


class Building(Entity):
    ACTIVE_SIGHT = 7
    PASSIVE_SIGHT = 8
    ENERGY_COST = 10
    MATTER_COST = 10

    def repair(self):
        self.health += 0.1
        if self.health > 1.0:
            self.health = 1.0


class EnergyGenerator(Building):
    GENERATION_RATE = 1
    TYPE = "energyGenerator"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.active_state = GeneratingState(self.GENERATION_RATE, 0.0, self)
        self.state = self.active_state


class MatterCollector(Building):
    GENERATION_RATE = 1
    TYPE = "matterCollector"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.active_state = GeneratingState(0.0, self.GENERATION_RATE, self)
        self.state = self.active_state


class City(Building):
    GENERATION_RATE = 1
    BUILD_TIME = 5

    TYPE = "city"
    ACTIVE_SIGHT = 10
    PASSIVE_SIGHT = 12

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.active_state = GeneratingState(self.GENERATION_RATE, self.GENERATION_RATE, self)
        self.state = self.active_state


BUILDING_TYPES = {cls.TYPE: cls for cls in Building.__subclasses__() if hasattr(cls, "TYPE")}

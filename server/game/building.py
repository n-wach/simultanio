from server.game.entity import Entity, IdleState
from server.shared import entity_stats


class GeneratingState(IdleState):
    TYPE = "generating"

    def __init__(self, rates, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.rates = rates

    def tick(self, dt):
        self.parent.owner.stored_energy += dt * self.rates["energy"]
        self.parent.owner.stored_matter += dt * self.rates["matter"]


class InConstructionState(IdleState):
    TYPE = "inConstruction"

    def tick(self, dt):
        if self.parent.health >= 1.0:
            self.parent.state = self.parent.active_state


class Building(Entity):
    def repair(self, amount):
        self.health += amount
        if self.health > 1.0:
            self.health = 1.0


class EnergyGenerator(Building):
    TYPE = "energyGenerator"
    STATS = entity_stats(TYPE)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.active_state = GeneratingState(self.STATS["generates"], self)
        self.state = self.active_state


class MatterCollector(Building):
    TYPE = "matterCollector"
    STATS = entity_stats(TYPE)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.active_state = GeneratingState(self.STATS["generates"], self)
        self.state = self.active_state


class City(Building):
    TYPE = "city"
    STATS = entity_stats(TYPE)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.active_state = GeneratingState(self.STATS["generates"], self)
        self.state = self.active_state


BUILDING_TYPES = {cls.TYPE: cls for cls in Building.__subclasses__() if hasattr(cls, "TYPE")}

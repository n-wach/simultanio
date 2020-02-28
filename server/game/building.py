from server.game.entity import Entity, IdleState
from server.shared import entity_stats


class GeneratingState(IdleState):
    TYPE = "generating"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.rates = self.parent.STATS["generates"]

    def tick(self, dt):
        self.parent.owner.stored_energy += dt * self.rates["energy"]
        self.parent.owner.stored_matter += dt * self.rates["matter"]


class InConstructionState(IdleState):
    TYPE = "inConstruction"

    def tick(self, dt):
        if self.parent.health >= 1.0:
            self.parent.reset()


class GhostState(IdleState):
    TYPE = "ghost"

    def tick(self, dt):
        if not self.parent.owner.terrain_view.passable(self.parent.grid_x, self.parent.grid_y) \
                or len(list(self.parent.owner.visible_buildings_at(self.parent.grid_x, self.parent.grid_y))) > 1:
            self.parent.owner.delete_entity(self.parent)


class TrainingState(IdleState):
    TYPE = "training"

    def __init__(self, unit, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.unit = unit
        self.duration = 0

    def tick(self, dt):
        if self.parent.owner.stored_energy < self.unit.STATS["cost"]["energy"]:
            self.duration = 0
            return
        elif self.parent.owner.stored_matter < self.unit.STATS["cost"]["matter"]:
            self.duration = 0
            return
        self.duration += dt
        if self.duration > self.unit.STATS["cost"]["time"]:
            self.parent.owner.train_unit(self.unit, self.parent.grid_x, self.parent.grid_y)
            self.parent.reset()

    def get_self(self):
        return {
            "type": self.TYPE,
            "trainingStatus": self.duration / self.unit.STATS["cost"]["time"]
        }


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
        self.default_state = GeneratingState(self)
        self.reset()


class MatterCollector(Building):
    TYPE = "matterCollector"
    STATS = entity_stats(TYPE)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.default_state = GeneratingState(self)
        self.reset()


class City(Building):
    TYPE = "city"
    STATS = entity_stats(TYPE)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.default_state = GeneratingState(self)
        self.reset()


class Trainer(Building):
    TYPE = "trainer"
    STATS = entity_stats(TYPE)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.default_state = IdleState(self)
        self.reset()


BUILDING_TYPES = {cls.TYPE: cls for cls in Building.__subclasses__() if hasattr(cls, "TYPE")}

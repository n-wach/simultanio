from server.game.entity import Entity


class Building(Entity):
    ACTIVE_SIGHT = 7
    PASSIVE_SIGHT = 8


class EnergyGenerator(Building):
    GENERATION_RATE = 1

    def tick(self, dt):
        self.owner.energy += dt * self.GENERATION_RATE


class MatterCollector(Building):
    GENERATION_RATE = 1

    def tick(self, dt):
        self.owner.matter += dt * self.GENERATION_RATE


class City(Building):
    GENERATION_RATE = 1

    VARIATION = "city"
    ACTIVE_SIGHT = 10
    PASSIVE_SIGHT = 12

    def tick(self, dt):
        self.owner.stored_matter += dt * self.GENERATION_RATE
        self.owner.stored_energy += dt * self.GENERATION_RATE

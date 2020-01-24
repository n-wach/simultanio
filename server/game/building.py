from server.game.entity import Entity


class Building(Entity):
    ACTIVE_SIGHT = 7
    PASSIVE_SIGHT = 8


class EnergyGenerator(Building):
    def tick(self):
        self.owner.energy += 1


class MatterCollector(Building):
    def tick(self):
        self.owner.matter += 1


class City(Building):
    ACTIVE_SIGHT = 12
    PASSIVE_SIGHT = 10

    def tick(self):
        self.owner.matter += 1
        self.owner.energy += 1

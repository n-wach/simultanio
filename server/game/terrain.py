import math
from random import random

import numpy as np
from scipy.ndimage.filters import gaussian_filter

from server.game.entity import UnalignedEntity


class Tile:
    LAND = "land"
    WATER = "water"
    MATTER_SOURCE = "matter_source"
    UNKNOWN = "unknown"

    def __init__(self, passable, matter_source):
        self.passable = passable
        self.matter_source = matter_source

    def get_name(self):
        return Tile.UNKNOWN


class Land(Tile):
    def __init__(self):
        super(Land, self).__init__(passable=True, matter_source=False)

    def get_name(self):
        return Tile.LAND


class Water(Tile):
    def __init__(self):
        super(Water, self).__init__(passable=False, matter_source=False)

    def get_name(self):
        return Tile.WATER


class MatterSource(Tile):
    def __init__(self):
        super(MatterSource, self).__init__(passable=True, matter_source=True)

    def get_name(self):
        return Tile.MATTER_SOURCE


# precondition: sum of weights in weight_blur is 1
def noise(weight_blur, width, height):
    noise_vals = np.zeros((width, height))
    for (weight, blur) in weight_blur:
        noise_vals += weight * gaussian_filter(np.random.rand(width, height), sigma=blur)
    return noise_vals


class Terrain:
    def __init__(self, width, height, weight_blur=None, bias=0.51, source_chance=0.01):
        # get random noise and smooth it a bit
        if weight_blur is None:
            weight_blur = ((0.3, 4), (0.7, 9))

        vals = noise(weight_blur, width, height)
        self.width = width
        self.height = height

        def place_tile(val):
            if val < bias:
                if random() < source_chance:
                    return MatterSource()
                return Land()
            return Water()

        self.tiles = tuple(tuple(place_tile(vals[x, y]) for y in range(height)) for x in range(width))
        # TODO guarantee large paths between bases

    def tile_at(self, x, y):
        """
        Coord system:
        (0,0),(1,0),(2,0)
        (0,1),(1,1),(2,1)
        (0,2),(1,2),(2,2)
        """
        return self.tiles[x][y]

    def points_near(self, x, y, radius):
        right = max(math.ceil(x) - radius, 0)
        left = min(math.floor(x) + radius, self.width - 1)
        top = max(math.ceil(y) - radius, 0)
        bottom = min(math.floor(y) + radius, self.height - 1)

        r2 = (radius + 0.2) ** 2

        for px in range(right, left + 1):
            for py in range(top, bottom + 1):
                dx = px - x
                dy = py - y
                if dx ** 2 + dy ** 2 <= r2:
                    yield (px, py)

    def neighboring_points(self, x, y):
        """
        [ ][x][ ]
        [x][*][x]
        [ ][x][ ]
        """
        if x > 0:
            yield (x - 1, y)
        if y > 0:
            yield (x, y - 1)
        if x < self.width - 1:
            yield (x + 1, y)
        if y < self.height - 1:
            yield (x, y + 1)


class TerrainView:
    def __init__(self, terrain, player):
        self.terrain = terrain
        self.player = player
        self.discovered_grid = [[False for y in range(self.terrain.height)] for x in range(self.terrain.width)]
        self.visibility_grid = [[False for y in range(self.terrain.height)] for x in range(self.terrain.width)]

    def get_player_grid(self):
        self.update_view()
        return [[self.terrain.tiles[x][y].get_name()
                 if self.discovered_grid[x][y] else Tile.UNKNOWN
                 for y in range(self.terrain.height)]
                for x in range(self.terrain.width)]

    def update_view(self):
        for y in range(self.terrain.height):
            for x in range(self.terrain.width):
                self.visibility_grid[x][y]=False

        for entity in self.player.entities:
            if isinstance(entity, UnalignedEntity):
                x = entity.x
                y = entity.y
            else:
                x = entity.grid_x
                y = entity.grid_y
            for point in self.terrain.points_near(x, y, entity.PASSIVE_SIGHT):
                self.discovered_grid[point[0]][point[1]] = True
            for point in self.terrain.points_near(x, y, entity.ACTIVE_SIGHT):
                self.visibility_grid[point[0]][point[1]] = True

    def entity_visible(self, entity):
        return self.visibility_grid[entity.grid_x][entity.grid_y]


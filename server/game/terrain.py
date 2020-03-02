import math
from random import random

import networkx
import numpy as np
from scipy.ndimage.filters import gaussian_filter

from server.game.building import GhostState


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
    def __init__(self, width, height, weight_blur=None, bias=0.5, source_chance=0.01):
        # get random noise and smooth it a bit
        if weight_blur is None:
            weight_blur = ((0.3, 4), (0.7, 9))
        self.width = width
        self.height = height
        w_pad = math.floor(width / 6)
        h_pad = math.floor(height / 6)
        self.spawn_positions = [(w_pad, h_pad),
                                (width - w_pad, h_pad),
                                (width - w_pad, height - h_pad),
                                (w_pad, height - h_pad)]

        print("Generating terrain")
        while True:
            self.tiles = self.gen_terrain(weight_blur, bias, source_chance)

            no_path = False

            # TODO: add blur to guarantee large paths (using numpy so its fast)
            tiles_saved = self.tiles
            # DONT call player grid pls
            total_view = TerrainView(self, None, True)
            lengths = []
            for i in range(len(self.spawn_positions)):
                try:
                    length = total_view.path_length(self.spawn_positions[i],
                                                    self.spawn_positions[(i+1) % len(self.spawn_positions)])
                    lengths.append(length)
                except (networkx.NetworkXNoPath, networkx.NodeNotFound):
                    no_path = True
                    break
            self.tiles = tiles_saved

            if no_path:
                print("No path")
                continue
            else:
                break

    def gen_terrain(self, weight_blur, bias, source_chance):
        vals = noise(weight_blur, self.width, self.height)
        while not all(vals[pos[0], pos[1]] < bias for pos in self.spawn_positions):
            vals = noise(weight_blur, self.width, self.height)

        def place_tile(val):
            if val < bias:
                if random() < source_chance:
                    return MatterSource()
                return Land()
            return Water()

        return tuple(tuple(place_tile(vals[x, y]) for y in range(self.height)) for x in range(self.width))

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

    def align_x(self, x):
        return min(max(math.floor(x), 0), self.width - 1)

    def align_y(self, y):
        return min(max(math.floor(y), 0), self.height - 1)


class TerrainView:
    def __init__(self, terrain, player, discovered=False):
        self.terrain = terrain
        self.player = player
        self.discovered_grid = [[discovered for y in range(self.terrain.height)] for x in range(self.terrain.width)]
        self.visibility_grid = [[False for y in range(self.terrain.height)] for x in range(self.terrain.width)]
        self.graph = networkx.Graph()
        self.init_graph()

    def get_player_grid(self):
        self.update_view()
        return [[{
            "type": self.terrain.tiles[x][y].get_name() if self.discovered_grid[x][y] else Tile.UNKNOWN,
            "active": self.visibility_grid[x][y],
        } for y in range(self.terrain.height)] for x in range(self.terrain.width)]

    def discover_single_view(self, entity):
        x = entity.grid_x
        y = entity.grid_y
        for point in self.terrain.points_near(x, y, entity.STATS["passive_sight"]):
            if not self.discovered_grid[point[0]][point[1]]:
                self.discover(point)

    def update_view(self):
        for y in range(self.terrain.height):
            for x in range(self.terrain.width):
                self.visibility_grid[x][y] = False

        for entity in self.player.entities:
            if isinstance(entity.state, GhostState):
                continue
            x = entity.grid_x
            y = entity.grid_y
            for point in self.terrain.points_near(x, y, entity.STATS["active_sight"]):
                self.visibility_grid[point[0]][point[1]] = True

    def entity_visible(self, entity):
        return entity.exists and self.visibility_grid[entity.grid_x][entity.grid_y]

    def discover(self, p):
        self.discovered_grid[p[0]][p[1]] = True
        tile = self.terrain.tile_at(*p)
        if not tile.passable:
            self.graph.remove_node(p)

    def init_graph(self):
        for x in range(self.terrain.width):
            for y in range(self.terrain.height):
                if self.passable(x, y):
                    self.graph.add_node((x, y))

        for x in range(self.terrain.width):
            for y in range(self.terrain.height):
                if not self.passable(x, y):
                    continue
                p = (x, y)
                if self.passable(x - 1, y):
                    self.graph.add_edge((x - 1, y), p, weight=1)
                if self.passable(x, y - 1):
                    self.graph.add_edge((x, y - 1), p, weight=1)
                # todo: diagonals can lead to being stuck due to problems in entity align_x/y
                # if self.passable(x - 1, y - 1):
                #     self.graph.add_edge((x - 1, y - 1), p, weight=1.414)
                # if self.passable(x + 1, y - 1):
                #     self.graph.add_edge((x + 1, y - 1), p, weight=1.414)

    def path_length(self, origin, target):
        return networkx.astar_path_length(self.graph, origin, target, lambda s, d: (s[0] - d[0]) ** 2 + (s[1] - d[1]) ** 2, weight="weight")

    def get_path(self, origin, target):
        try:
            return networkx.astar_path(self.graph, origin, target,
                                       lambda s, d: (s[0] - d[0]) ** 2 + (s[1] - d[1]) ** 2,
                                       weight="weight")[1:]
        except (networkx.NetworkXNoPath, networkx.NodeNotFound):
            # todo: get path to closest point
            return []

    def passable(self, x, y):
        if x < 0 or x > self.terrain.width - 1 or y < 0 or y > self.terrain.height - 1:
            return False
        return not self.discovered_grid[x][y] or self.terrain.tile_at(x, y).passable

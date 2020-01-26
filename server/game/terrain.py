import math
from random import random

# for terrain generation
import numpy as np
from scipy.ndimage.filters import gaussian_filter

# for priority queue in A*
import heapq

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
        self.width = width
        self.height = height
        w_pad = math.floor(width / 6)
        h_pad = math.floor(height / 6)
        self.spawn_positions = [(w_pad, h_pad),
                                (width - w_pad, h_pad),
                                (w_pad, height - h_pad),
                                (width - w_pad, height - h_pad)]
        self.tiles = self.gen_terrain(weight_blur, bias, source_chance)
        while not self.is_terrain_valid():
            self.tiles = self.gen_terrain(weight_blur, bias, source_chance)
        # TODO guarantee large paths between bases

    def gen_terrain(self, weight_blur, bias, source_chance):
        vals = noise(weight_blur, self.width, self.height)

        def place_tile(val):
            if val < bias:
                if random() < source_chance:
                    return MatterSource()
                return Land()
            return Water()

        return tuple(tuple(place_tile(vals[x, y]) for y in range(self.height)) for x in range(self.width))

    def is_terrain_valid(self):
        return all(self.tile_at(pos[0], pos[1]).passable for pos in self.spawn_positions)

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
        self.new_obstacle = False

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
                if not self.discovered_grid[point[0]][point[1]]:
                    self.new_obstacle = True
                self.discovered_grid[point[0]][point[1]] = True
            for point in self.terrain.points_near(x, y, entity.ACTIVE_SIGHT):
                self.visibility_grid[point[0]][point[1]] = True

    def entity_visible(self, entity):
        return self.visibility_grid[entity.grid_x][entity.grid_y]

    def get_path(self, origin, target):
        came_from, node = a_star_search(self, origin, target)
        nodes = []
        while node != origin and node is not None:
            nodes.append(node)
            node = came_from[node]
        return list(reversed(nodes))

    # implement methods for TerrainView to be a graph
    # ie fill out methods used by a_star_search

    def in_bounds(self, x, y):
        return 0 <= x < self.terrain.width and 0 <= y < self.terrain.height

    def neighboring_points(self, x, y):
        for nx in range(x-1, x+2):
            for ny in range(y-1, y+2):
                if self.in_bounds(nx, ny):
                    yield nx, ny

    def neighbors(self, position):
        return filter(
            lambda n: not self.discovered_grid[n[0]][n[1]] or self.terrain.tile_at(n[0], n[1]).passable,
            self.neighboring_points(position[0], position[1])
        )

    def cost(self, start, end):
        return 1.0

    def heuristic(self, node, goal):
        return (goal[0]-node[0])**2 + (goal[1]-node[1])**2


def a_star_search(graph, start, goal):
    # collection of nodes from which to propagate search
    # pairs nodes with "priority", ie how close node is to start
    frontier = PriorityQueue()
    # start propagating search from start
    frontier.put(start, 0.0)

    # dictionary mapping position on graph to closest position in propagation
    came_from = {start: None}
    # dictionary mapping position on graph to cost to have reached position from start
    cost_so_far = {start: 0.0}
    # in case goal is unreachable, we keep track of node with minimum heuristic as replacement goal
    (min_heuristic, min_heuristic_node) = graph.heuristic(goal, start), start

    while not frontier.empty():
        # get node with minimal priority, ie the node that is most likely to give a good path
        current = frontier.get()

        # terminate search if we have reached goal
        # propagating longer can only find worse path
        if current == goal:
            break

        # otherwise, propagate further
        for neighbor in graph.neighbors(current):
            # cost of new neighbor
            new_cost = cost_so_far[current] + graph.cost(current, neighbor)

            # add next to propagation if not yet found or if this is a shorter path
            if neighbor not in cost_so_far or new_cost < cost_so_far[neighbor]:
                cost_so_far[neighbor] = new_cost
                # give it priority such that algorithm chooses nicer looking paths
                # eg propagate first in direction towards goal rather than simply branching rapidly
                heuristic = graph.heuristic(goal, neighbor)
                priority = new_cost + heuristic
                frontier.put(neighbor, priority)
                came_from[neighbor] = current

                # check to see if current neighbor has lowest heuristic
                if heuristic < min_heuristic:
                    min_heuristic = heuristic
                    min_heuristic_node = neighbor
    return came_from, min_heuristic_node


class PriorityQueue:
    def __init__(self):
        self.elements = []

    def empty(self):
        return len(self.elements) == 0

    def put(self, item, priority):
        heapq.heappush(self.elements, (priority, item))

    def get(self):
        return heapq.heappop(self.elements)[1]
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


class Terrain:
    def __init__(self, width, height):
        self.width = width
        self.height = height
        self.tiles = tuple(tuple(Land() for _ in range(height)) for __ in range(width))

    def tile_at(self, x, y):
        """
        Coord system:
        (0,0),(1,0),(2,0)
        (0,1),(1,1),(2,1)
        (0,2),(1,2),(2,2)
        """
        return self.tiles[x][y]

    def points_near(self, x, y, radius):
        right = max(x - radius, 0)
        left = min(x + radius, self.width - 1)
        top = max(y - radius, 0)
        bottom = min(y + radius, self.height - 1)

        r2 = radius ** 2

        for px in range(right, left + 1):
            for py in range(top, bottom + 1):
                dx = px - x
                dy = py - y
                if dx ** 2 + dy ** 2 > r2:
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

    def get_player_grid(self, player):
        return [[self.tiles[x][y].get_name() for y in range(self.height)] for x in range(self.width)]



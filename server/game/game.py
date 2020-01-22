from server.game.player import Player, Color
from server.game.terrain import Terrain


class Status:
    WAITING = "waiting",
    STARTED = "started",
    ENDED = "ended",


class Game:
    PLAYER_COLORS = [Color.RED, Color.BLUE, Color.GREEN, Color.ORANGE]

    def __init__(self, match):
        self.match = match
        self.players = []
        self.entities = []
        self.duration = 0
        self.terrain = Terrain(100, 100)
        self.status = Status.WAITING

    def tick(self, dt):
        for player in self.players:
            player.tick(dt)

        self.duration += dt

        for entity in self.entities:
            entity.tick(dt)

    def get_player_update(self, player):
        return {
            "listing": self.match.get_listing(),
            "duration": self.duration,
            "you": player.as_dict(),
            "other_players": [p.as_dict() for p in self.players if p != player],
            "terrain": self.get_player_terrain(player),
            "entities": self.get_player_entities(player),
            "status": self.status
        }

    def get_player_terrain(self, player):
        return {
            "width": self.terrain.width,
            "height": self.terrain.height,
            "grid": self.terrain.get_player_grid(player)
        }

    def get_player_entities(self, player):
        entities = []
        for entity in self.entities:
            if player.can_see(entity):
                entities.append(entity)
        return entities

    def add_player(self, sid):
        color = Game.PLAYER_COLORS[len(self.players) % len(Game.PLAYER_COLORS)]
        player = Player(sid, color)
        self.players.append(player)
        return player

    def remove_player(self, sid):
        for player in self.players:
            if player.sid == sid:
                self.players.remove(player)
                return

    def broadcast_update(self, socketio):
        for player in self.players:
            update = self.get_player_update(player)
            socketio.emit("game update", update, room=player.sid)

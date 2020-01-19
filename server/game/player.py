from flask_socketio import emit


class Color:
    RED = "red"
    ORANGE = "orange"
    YELLOW = "yellow"
    GREEN = "green"
    BLUE = "blue"
    PURPLE = "purple"


class Player:
    def __init__(self, sid, color):
        self.sid = sid
        self.stored_energy = 0
        self.stored_matter = 0
        self.color = color
        self.id = id(self)

    def as_dict(self):
        return {
            "stored_energy": self.stored_energy,
            "stored_matter": self.stored_matter,
            "color": self.color,
            "id": self.id,
        }

    def act(self):
        # Human player will act based on WS events received since last call
        # AI player will act using AI
        pass

    def send_update(self, update_object):
        emit("game update", update_object, room=self.sid)


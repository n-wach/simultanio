
class Player:
    def act(self):
        # Human player will act based on WS events received since last call
        # AI player will act using AI
        pass

    def send_update(self):
        # Player will be sent:
        #  - all explored tiles
        #  - all revealed tiles and occupying entities
        #  - global info like player's resources, time in ticks
        pass


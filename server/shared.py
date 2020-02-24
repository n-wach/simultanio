import json
import os

with open(os.path.join("shared", "data.json")) as d:
    data = json.load(d)


def entity_stats(t):
    return data["entities"][t]

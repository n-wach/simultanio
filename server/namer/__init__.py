import random
import os
from pathlib import Path

d = str(Path(__file__).parent)

with open(os.path.join(d, "nouns.txt")) as nouns:
    noun_pool = list(map(lambda s: s[:-1], nouns.readlines()))


with open(os.path.join(d, "adjectives.txt")) as adjectives:
    adjective_pool = list(map(lambda s: s[:-1], adjectives.readlines()))


def random_noun():
    return random.choice(noun_pool)


def random_adjective():
    return random.choice(adjective_pool)


import random

# Liste de blagues
blagues = [
    "Pourquoi les plongeurs plongent-ils toujours en arrière et jamais en avant ? Parce que sinon ils tombent dans le bateau !",
    "Pourquoi les squelettes ne se battent jamais entre eux ? Parce qu’ils n’ont pas les tripes !",
    "Pourquoi les canards sont toujours à l'heure ? Parce qu’ils sont dans l’étang !",
    "Quel est le comble pour un électricien ? De ne pas être au courant !"
]

# Choisir une blague au hasard
blague_du_jour = random.choice(blagues)

print("💡 Blague du jour :")
print(blague_du_jour)

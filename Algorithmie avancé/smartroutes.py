# Pour lancer : python3 rendu_monnaie.py
# pip3 install pandas

import pandas as pd

file_path = 'smartroutes.csv'

df = pd.read_csv(file_path)

print(df)

destination = "Nice"
route_disponible = []

for i in range(0, len(df)):
    if df['destination'][i] == destination:
      route_disponible.append(i)


shortest_route = df['distance'][route_disponible[0]]

for j in range(0, len(route_disponible)):
  if df['distance'][route_disponible[j]] < shortest_route:
    best_route = route_disponible[j]

print("Best route : " + df['source'][best_route])
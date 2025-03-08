# Pour lancer : python3 rendu_monnaie.py

def rendu_monnaie(montant_rendu):
    pieces = [4, 3, 1]
    n = len(pieces)
    dp = [float('inf')] * (montant_rendu + 1)
    dp[0] = 0
    parent = [-1] * (montant_rendu + 1)

    for i in range(1, montant_rendu + 1):
        for j in range(n):
            if pieces[j] <= i and dp[i - pieces[j]] + 1 < dp[i]:
                dp[i] = dp[i - pieces[j]] + 1
                parent[i] = j

    resultat = {}
    while montant_rendu > 0:
        piece = pieces[parent[montant_rendu]]
        if piece in resultat:
            resultat[piece] += 1
        else:
            resultat[piece] = 1
        montant_rendu -= piece

    # Afficher le résultat
    print("Rendu de monnaie :")
    total_pieces = 0
    for valeur, quantite in resultat.items():
        print(f"- {quantite} pièce(s) de {valeur} centimes")
        total_pieces += quantite

    print(f"Nombre total de pièces : {total_pieces}")


prix_boisson = 4  
argent_insere = 10
montant_rendu = argent_insere - prix_boisson

print(f"Montant à rendre : {montant_rendu} centimes\n")
rendu_monnaie(montant_rendu)
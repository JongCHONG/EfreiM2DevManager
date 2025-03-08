import pandas as pd

# 🌟 Charger les entreprises depuis un fichier Excel
def load_companies_from_excel(filename):
    df = pd.read_excel(filename)
    return df['nom'].tolist()

# Charger depuis l'Excel
companies = load_companies_from_excel('entreprises.xlsx')

# Insérer les entreprises dans l’AVL Tree
avl_tree = AVLTree()
root = None
for company in companies:
    root = avl_tree.insert(root, company)

# 🔍 Recherche d'une entreprise
while True:
    search_query = input("Entrez le nom d'une entreprise (ou 'exit' pour quitter) : ").strip()
    if search_query.lower() == "exit":
        break
    result = avl_tree.search(root, search_query)
    if result:
        print(f"✅ Entreprise trouvée : {result.key}")
    else:
        print("❌ Entreprise non trouvée")

# 📜 Affichage des entreprises triées
print("\n📌 Liste triée des entreprises :")
sorted_companies = avl_tree.in_order_traversal(root, [])
for company in sorted_companies:
    print(company)

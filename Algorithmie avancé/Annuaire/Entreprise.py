import json

# 🌳 Définition de l'AVL Tree pour stocker les entreprises
class AVLNode:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None
        self.height = 1

class AVLTree:
    def insert(self, root, key):
        """ Insère une entreprise dans l'arbre AVL """
        if not root:
            return AVLNode(key)

        if key < root.key:
            root.left = self.insert(root.left, key)
        else:
            root.right = self.insert(root.right, key)

        root.height = 1 + max(self.get_height(root.left), self.get_height(root.right))
        balance = self.get_balance(root)

        # 🚀 Rotation pour équilibrer l'arbre
        if balance > 1 and key < root.left.key:
            return self.right_rotate(root)
        if balance < -1 and key > root.right.key:
            return self.left_rotate(root)
        if balance > 1 and key > root.left.key:
            root.left = self.left_rotate(root.left)
            return self.right_rotate(root)
        if balance < -1 and key < root.right.key:
            root.right = self.right_rotate(root.right)
            return self.left_rotate(root)

        return root

    def left_rotate(self, z):
        y = z.right
        T2 = y.left
        y.left = z
        z.right = T2
        z.height = 1 + max(self.get_height(z.left), self.get_height(z.right))
        y.height = 1 + max(self.get_height(y.left), self.get_height(y.right))
        return y

    def right_rotate(self, z):
        y = z.left
        T3 = y.right
        y.right = z
        z.left = T3
        z.height = 1 + max(self.get_height(z.left), self.get_height(z.right))
        y.height = 1 + max(self.get_height(y.left), self.get_height(y.right))
        return y

    def get_height(self, node):
        return node.height if node else 0

    def get_balance(self, node):
        return self.get_height(node.left) - self.get_height(node.right) if node else 0

    def search(self, root, key):
        """ Recherche une entreprise dans l’arbre AVL """
        if not root or root.key == key:
            return root
        if key < root.key:
            return self.search(root.left, key)
        return self.search(root.right, key)

    def in_order_traversal(self, root, results=[]):
        """ Trie les entreprises et les affiche """
        if root:
            self.in_order_traversal(root.left, results)
            results.append(root.key)
            self.in_order_traversal(root.right, results)
        return results

# 🚀 Charger les entreprises depuis un fichier JSON
def load_companies_from_json(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        return json.load(f)

# 🌟 Exécution
avl_tree = AVLTree()
root = None

# Charger les entreprises
companies = load_companies_from_json('entreprises.json')
for company in companies:
    root = avl_tree.insert(root, company)

# 🔍 Interface en ligne de commande pour la recherche
while True:
    search_query = input("Entrez le nom d'une entreprise (ou 'exit' pour quitter) : ").strip()
    if search_query.lower() == "exit":
        break
    result = avl_tree.search(root, search_query)
    if result:
        print(f"✅ Entreprise trouvée : {result.key}")
    else:
        print("❌ Entreprise non trouvée")

# 📜 Affichage de toutes les entreprises triées
print("\n📌 Liste triée des entreprises :")
sorted_companies = avl_tree.in_order_traversal(root, [])
for company in sorted_companies:
    print(company)

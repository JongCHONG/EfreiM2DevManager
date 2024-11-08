import 'package:efrei_m2_flutter/pages/register.dart';
import 'package:flutter/material.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Login"),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
            const Text("Bienvenue au Carnet d'adresse"),
            const SizedBox(height: 20),
            const Image(
              image: AssetImage('lib/images/gto.jpg'),
            ),
            const Padding(
              padding: EdgeInsets.all(8.0),
              child: TextField(
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Email',
              ),
              ),
            ),
            const Padding(
              padding: EdgeInsets.all(8.0),
              child: TextField(
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Mot de passe',
              ),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
              ElevatedButton(
                onPressed: () {
                print("Connexion");
                },
                child: const Text('Connexion'),
              ),
              const SizedBox(width: 10),
              ElevatedButton(
                onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => RegisterPage()),
                );
                },
                child: const Text('Inscription'),
              ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

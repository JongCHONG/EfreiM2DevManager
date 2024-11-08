import 'package:flutter/material.dart';
import 'package:efrei_m2_flutter/controllers/auth.dart';

class RegisterPage extends StatelessWidget {
  RegisterPage({super.key});

  final AuthController authController = AuthController();

  final TextEditingController usernameController = TextEditingController(text: "jong");
  final TextEditingController emailController = TextEditingController(text: "jong@test.com");
  final TextEditingController passwordController = TextEditingController(text: "jongjong");
  final TextEditingController confirmPasswordController =
      TextEditingController(text: "jongjong");

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Inscription"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            TextField(
              controller: usernameController,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Nom',
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: emailController,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Email',
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              obscureText: true,
              controller: passwordController,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Mot de passe',
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              obscureText: true,
              controller: confirmPasswordController,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Confirmer le mot de passe',
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () async {
                if (passwordController.text == confirmPasswordController.text) {
                  try {
                    await authController.register(
                      usernameController.text,
                      emailController.text,
                      passwordController.text,
                    );
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Inscription réussie')),
                    );
                  } catch (e) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Erreur: $e')),
                    );
                  }
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Les mots de passe ne correspondent pas')),
                  );
                }
              },
              child: const Text('Inscription'),
            ),
          ],
        ),
      ),
    );
  }
}

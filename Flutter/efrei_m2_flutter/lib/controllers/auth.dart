import "package:firebase_auth/firebase_auth.dart";
import 'package:cloud_firestore/cloud_firestore.dart';
import 'dart:async';

class AuthController {
  final auth = FirebaseAuth.instance;
  final firestore = FirebaseFirestore.instance.collection("users");

  //inscription
  Future register(String username, String email, String password) async {
    UserCredential credential = await auth.createUserWithEmailAndPassword(
        email: email, password: password);
    String id = credential.user!.uid;
    Map<String, dynamic> data = {
      "username": username,
      "email": email,
      "password": password,
    };
    addUser(id, data);
    return getUser(id);
  }

  Future login(String email, String password) async {
    UserCredential credential =
        await auth.signInWithEmailAndPassword(email: email, password: password);
    String uid = credential.user!.uid;
    //return getUser(uid);
  }

  //recuperer un UTILISATEURS
  Future getUser(uid) async {
    DocumentSnapshot snapshot = await firestore.doc(uid).get();
    //return snapshot;
  }

  //ajouter un UTILISATEURS
  addUser(String uid, Map<String, dynamic> data) async {
    try {
      await firestore.doc(uid).set(data);
      print("User added successfully");
    } catch (e) {
      print("Failed to add user: $e");
    }
  }

  //mettre à jour un UTILISATEURS
  updateUser(String uid, Map<String, dynamic> data) {
    firestore.doc(uid).update(data);
  }
}

import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase"; // ✅ Your firebase.ts should export both auth and db

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState(""); // ✅ Only used during sign-up
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        setMessage("✅ Logged in successfully!");
      } else {
        if (!name.trim()) {
          setMessage("❌ Please enter your name.");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const user = userCredential.user;

        // ✅ Save the user's name and email to Firestore
        await setDoc(doc(db, "users", user.uid), {
          name: name.trim(),
          email: email.trim(),
          createdAt: new Date()
        });

        setMessage("✅ Account created successfully!");
      }
    } catch (error: any) {
      setMessage("❌ " + error.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "1rem", textAlign: "center" }}>
      <h2>{isLogin ? "Log In" : "Sign Up"}</h2>

      {!isLogin && (
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
      />

      <input
        type="password"
        placeholder="Password (6+ characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
      />

      <button onClick={handleAuth} style={{ width: "100%", padding: "0.5rem" }}>
        {isLogin ? "Log In" : "Sign Up"}
      </button>

      <p style={{ marginTop: "1rem" }}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{ border: "none", background: "none", color: "#007bff", cursor: "pointer" }}
        >
          {isLogin ? "Sign Up" : "Log In"}
        </button>
      </p>

      {message && (
        <p style={{ marginTop: "1rem", color: message.startsWith("✅") ? "green" : "red" }}>{message}</p>
      )}
    </div>
  );
}

export default Auth;
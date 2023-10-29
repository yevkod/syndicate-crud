import { useEffect, useState } from "react";
import { app } from "../firebaseConfig";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const auth = getAuth(app);
  const router = useRouter();
  const googleProvider = new GoogleAuthProvider();

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((response: any) => {
        console.log(response.user);
        sessionStorage.setItem("Token", response.user.accessToken);
        router.push("/home");
      })
      .catch((err) => {
        alert("Cannot login");
      });
  };

  useEffect(() => {
    const token = sessionStorage.getItem("Token");
    token ? router.push("/home") : "";
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    signIn();
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              className="w-full p-2 border rounded"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="mb-4">
            <input
              className="w-full p-2 border rounded"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <button
            onClick={signIn}
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            Sign In
          </button>
          <br />
        </form>
      </div>
    </div>
  );
};

export default Login;

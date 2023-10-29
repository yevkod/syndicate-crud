import { useEffect, useState } from "react";
import { app } from "../firebaseConfig";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const auth = getAuth(app);
  const router = useRouter();
  const googleProvider = new GoogleAuthProvider();

  const signUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((response: any) => {
        console.log(response.user);
        sessionStorage.setItem("Token", response.user.accessToken);
        router.push("/home");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const signUpWithGoogle = () => {
    signInWithPopup(auth, googleProvider).then((response: any) => {
      console.log(response.user);
      sessionStorage.setItem("Token", response.user.accessToken);
      router.push("/home");
    });
  };

  const LogIn = () => {
    router.push("/login");
  };

  useEffect(() => {
    const token = sessionStorage.getItem("Token");
    token ? router.push("/home") : "";
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    signUp();
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
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
            className="bg-blue-500 text-white p-2 rounded w-full"
            onClick={signUp}
          >
            Sign Up
          </button>
          <br />
          <br />
          <button
            className="bg-blue-500 text-white p-2 rounded w-full"
            onClick={signUpWithGoogle}
          >
            Sign Up with Google
          </button>
          <br />
          <br />
          <button
            className="bg-blue-500 text-white p-2 rounded w-full"
            onClick={LogIn}
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

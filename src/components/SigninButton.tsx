
import { signIn } from "@/utils/auth-client";

export default function SignInButton() {
  const handleSignIn = async () => {
    try {
      await signIn();
      console.log(signIn.name);
      
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 w-full">
      <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-700">Login</h1>
        <button
          onClick={handleSignIn}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

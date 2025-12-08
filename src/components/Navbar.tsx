import SignoutButton from "./SignoutButton";
import { authClient } from "@/utils/auth-client";

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex justify-center items-center text-xl font-black py-4">
        Loading...
      </div>
    );
  }

  return (
    <nav
      className="flex justify-between p-2 border-2 border-black"
    >
        <div className="flex justify-center items-center gap-1">
        <span className="text-black">Tagda</span>
        <span className="text-black">
          AI
        </span>
        </div>
   

      <div className="flex items-center gap-4">
        {session ? (
          <div className="flex items-center gap-3">
            <span className="text-black font-bold text-sm">
              Hey, {session.user?.name ?? "Creator"}
            </span>
            <SignoutButton />
          </div>
        ) : (
          <a
            href="/signin"
            className="
              bg-gray-800
              text-white
            "
          >
            Sign in
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

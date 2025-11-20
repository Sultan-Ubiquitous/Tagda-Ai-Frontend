import SignoutButton from "./SignoutButton";
import { authClient } from "@/utils/auth-client";

const Navbar = () => {
  
    const {data: session, isPending} = authClient.useSession();

    if(isPending){
        return (
            <div className="flex justify-center items-center min-h-screen text-xl font-black">
                Loading....
            </div>
        )
    }

    return (
    <div className="w-full flex justify-end py-2 px-4 shadow-md">
      {session && <SignoutButton />}
    </div>
  );
}

export default Navbar

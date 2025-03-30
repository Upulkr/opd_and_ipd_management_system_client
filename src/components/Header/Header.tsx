import { Activity } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuthStore } from "@/stores/useAuth";
import { useUserProfileData } from "@/stores/useUserProfileData";

const Header = () => {
  const navigate = useNavigate();
  const resetToken = useAuthStore((state) => state.resetToken);
  const user = useUserProfileData((state) => state.user);
  const token = useAuthStore((state) => state.token);
  if (!user) {
    return null;
  }
  const { username } = user;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
      <Link to="/">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold">MediCare</h1>
        </div>
      </Link>
      <div className="ml-auto flex items-center gap-4">
        {token === null && (
          <>
            <Dialog>
              <DialogTrigger asChild>
                <Link to="/log-in">
                  {" "}
                  <Button variant="outline">Login</Button>
                </Link>
              </DialogTrigger>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Link to="/sign-up">
                  <Button>Sign Up</Button>
                </Link>
              </DialogTrigger>
            </Dialog>
          </>
        )}
        {token !== null && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>
                    {username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <Link to="/user-profile">
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  resetToken();
                  localStorage.clear();
                  sessionStorage.clear();
                  navigate("/log-in");
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;

import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="bg-white border-b ">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          Hospital Drug Management
        </Link>
        {/* <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div> */}
      </div>
    </header>
  );
}

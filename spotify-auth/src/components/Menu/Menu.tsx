import { Link } from "react-router-dom";
import "./Menu.css";

const Menu = () => {

    const token = localStorage.getItem("token");
    return (
        <nav className="p-4 bg-gray-800 text-white flex justify-between">
            <h1 className="text-xl font-bold">SpotYnov</h1>
            <div>
                {token ? (
                    <>
                        <Link to="/groups" className="mr-4">Groupes</Link>
                        <Link to="/profile">Profil</Link>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="mr-4">Connexion</Link>
                        <Link to="/register">Inscription</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Menu;
import { Link } from 'react-router-dom';
import "./Menu.css";

const Menu = () => {
    const token = localStorage.getItem("token");

    return (
        <nav className="menu bg-base-100 rounded-box p-4 w-auto h-screen m-5 mb-5">
            {/* Logo / Titre */}
            <h1 className="text-xl font-bold text-center mb-8">SpotYnov</h1>

            {/* Liens de navigation */}
            <div className="flex flex-col space-y-4">
                {token ? (
                    <>
                        <Link to="/groups" className="hover:bg-gray-700 p-2 rounded-md transition duration-300">Groupes</Link>
                        <Link to="/profile" className="hover:bg-gray-700 p-2 rounded-md transition duration-300">Profil</Link>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="hover:bg-gray-700 p-2 rounded-md transition duration-300">Connexion</Link>
                        <Link to="/register" className="hover:bg-gray-700 p-2 rounded-md transition duration-300">Inscription</Link>
                    </>
                )}
            </div>
        </nav>

        
    );
};

export default Menu;

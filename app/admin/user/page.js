'use client';

import { supabase } from "@/lib/supabase";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBars, FaTrash } from 'react-icons/fa';

export default function Admin() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [allProfils, setAllProfils] = useState([]);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        if (!loading && user && !user.is_admin) {
            router.push('/');
        }
    }, [loading, user, router]);

    useEffect(() => {

        const fetchUsers = async () => {
            let { data: profils, error } = await supabase
                .from('profils')
                .select('*');

            if (error) {
                console.error('Erreur de récupération :', error);
            } else {
                setAllProfils(profils);
            }
        };

        fetchUsers();
        console.log(allProfils);
        
    }, []);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-center text-gray-600">Chargement...</p>
            </div>
        );
    }
    
    const deleteUser = async (id) => {
        const { error } = await supabase
            .from('profils')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erreur lors de la suppression :', error);
        } else {
            console.log('Profil supprimé');
            fetchUsers();
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
           {/* Mobile Menu Toggle */}
            <div className="md:hidden p-4 flex justify-between items-center bg-white border-b">
                <div className="text-xl font-semibold text-gray-700">Dashboard</div>
                <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="text-gray-700">
                    <FaBars size={24} />
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`md:w-64 bg-white border-r px-6 py-8 ${showMobileMenu ? 'block' : 'hidden'} md:block`}>
                <div className="text-xl font-semibold text-gray-700 mb-10">Dashboard</div>
                <nav className="space-y-4 text-gray-700">
                    <a href="/admin" className="block hover:text-indigo-600 p-2">Dashboard</a>
                    <a href="/admin/articles" className="block hover:text-indigo-600 p-2">Contenu</a>
                    <a href="/admin/user" className="block hover:text-indigo-600 bg-gray-100 p-2">Utilisateurs</a>
                </nav>
            </aside>

            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl text-gray-700 font-bold">Bienvenue, {user.nickname}</h1>
                        <p className="text-gray-500 text-sm">Voici un aperçu du trafic de votre site et des utilisateurs actifs.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="font-medium text-gray-700">{user.nickname}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <img src={`https://stmouhqxlajaofnzgeup.supabase.co/storage/v1/object/public/media/${user.avatar}`} alt="Avatar Preview" className="object-cover w-10 h-10 rounded-full" />
                    </div>
                </div>

                {/* User Table*/}
                <div className="overflow-x-auto bg-white rounded-lg shadow-md p-6">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pseudo</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {allProfils.map((profils) => (
                                <tr key={profils.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{profils.nickname}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profils.is_admin ? "Admin" : "User"}</td>
                                    {!profils.is_admin && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => deleteUser(profils.id)}>
                                                <FaTrash className="text-red-500 w-5 h-5" />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

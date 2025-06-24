'use client';

import { supabase } from "@/lib/supabase";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaTrash } from 'react-icons/fa';

export default function Admin() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [allProfils, setAllProfils] = useState([]);
    
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
        return <p className="text-center text-gray-600 mt-8">Chargement...</p>;
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
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r px-6 py-8 hidden md:block">
                <div className="text-xl font-semibold text-gray-700 mb-10">Dashboard</div>
                <nav className="space-y-4 text-gray-700">
                    <a href="/admin" className="block hover:text-indigo-600 p-2">Dashboard</a>
                    <a href="/admin/articles" className="block hover:text-indigo-600 p-2">Contenu</a>
                    <a href="/admin/user" className="block bg-gray-100 hover:text-indigo-600 p-2">Utilisateurs</a>
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl text-gray-700 font-bold">Bienvenue, {user.nickname}</h1>
                        <p className="text-gray-500 text-sm">Voici un aperçu du trafic de votre site et des utilisateurs actifs.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="font-medium text-gray-700">{user.nickname}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    </div>
                </div>

                {/* User Table*/}
                <table>
                    <thead>
                        <tr>
                            <th className="text-gray-500">Pseudo</th>
                            {/* <th className="text-gray-500">Email</th>
                            <th className="text-gray-500">Dernière Connexion</th> */}
                            <th className="text-gray-500">Rôle</th>
                            <th className="text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allProfils.map((profils) => (
                            <tr key={profils.id}>
                                <td className="text-gray-500">{profils.nickname}</td>
                                {/* <td>{profils.users?.email}</td> */}
                                {/* <td>{profils.lastConnexion}</td> */}
                                <td className="text-gray-500">{profils.is_admin ? "Admin" : "User"}</td>
                                {!profils.is_admin &&
                                    <td>
                                        <button onClick={() => deleteUser(profils.id)}><FaTrash className="text-red-500 w-5 h-5" /></button>
                                    </td>
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {allArticles.map((article) => (
                        <div key={article.id} className="bg-white border rounded-lg p-4 shadow-sm">
                            <div className="h-32 bg-gray-200 rounded mb-4" />
                            <p className="text-indigo-600 text-sm font-medium mb-1">{article.articles_created_by_fkey?.nickname ?? 'Auteur inconnu'} • {new Date(article.created_at).toLocaleString("fr-FR", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            })}</p>
                            <h3 className="text-lg font-semibold mb-1 text-gray-700">{article.title}</h3>
                            <p className="text-gray-500 text-sm mb-3">{article.content}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{article.theme}</span>
                                <button className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700" onClick={() => router.push(`edit/${article.id}`)}>
                                    Voir
                                </button>
                            </div>
                        </div>
                    ))}
                </div> */}
            </main>
        </div>
    );
}

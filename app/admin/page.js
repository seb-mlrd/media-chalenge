'use client';

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
export default function Admin() {
    const {user, loading} = useAuth();
    const router = useRouter();

    if (loading) return <p>Chargement...</p>;

    if(user.is_admin == false){        
        router.push('/');
        return
    }
    return(
        <div>
            <h1>Dashboard Admin</h1>
        </div>
    );
}
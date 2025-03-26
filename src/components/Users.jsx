import { useEffect, useState } from 'react'
import s from './users.module.scss'
import { FaSearchengin } from "react-icons/fa"
import AddUser from "../pages/AddUser/AddUser"
import EditUser from "../pages/EditUser/EditUser"
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"



const Users = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
            const usersData = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    status: data.status,
                    createdAt: data.createdAt?.toDate().toLocaleDateString('en-GB') || 'N/A'
                };
            });
            setUsers(usersData);
        });
        return () => unsubscribe();
    }, []);

    const handleDeleteUser = async (userId) => {
        try {
            await deleteDoc(doc(db, 'users', userId));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={s.container}>
            <div className={s.top}>
                <div className={s.searchContainer}>
                    <div className={s.searchInput}>
                        <FaSearchengin className={s.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search for users"
                            className={s.inputField}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <button className={s.addButton} onClick={() => setIsModalOpen(true)}>
                    Add new user
                </button>
            </div>

            <table className={s.usersTable}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Created at</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.createdAt}</td>
                            <td><span className={s.role}>{user.role}</span></td>
                            <td>
                                <span className={user.status === 'active' ? s.statusActive : s.statusInactive}>
                                    {user.status}
                                </span>
                            </td>
                            <td>
                                <div className={s.actions}>
                                    <button
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setIsEditModalOpen(true);
                                        }}
                                        className={s.viewButton}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(user.id)}
                                        className={s.deleteButton}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <AddUser isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <EditUser
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                userData={selectedUser}
            />
        </div>
    );
};

export default Users;

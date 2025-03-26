import React, { useState } from 'react'
import s from './addUser.module.scss'
import { MdClose } from "react-icons/md"
import { addDoc, collection, db } from "../../firebase"
import { getDocs, query, serverTimestamp, where } from "firebase/firestore"



const AddUser = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');

    const checkEmailUnique = async (email) => {
        const q = query(collection(db, 'users'), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        return querySnapshot.empty;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Email is required');
            return;
        }

        try {
            const isUnique = await checkEmailUnique(email);

            if (!isUnique) {
                setError('Email already exists');
                return;
            }

            await addDoc(collection(db, 'users'), {
                name,
                email,
                role,
                status: 'active',
                createdAt: serverTimestamp()
            });

            onClose();
            setName('');
            setEmail('');
            setRole('user');
        } catch (error) {
            console.error("Error adding user:", error);
            setError('Error saving user');
        }
    };
    if (!isOpen) return null;

    return (
        <div className={s.modalOverlay}>
            <div className={s.modal}>
                <div className={s.modalHeader}>
                    <h3>Add New User</h3>
                    <button onClick={onClose} className={s.closeButton}>
                        <MdClose size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={s.form}>
                    {error && <div className={s.error}>{error}</div>}
                    <div className={s.formGroup}>
                        <label>Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className={s.formGroup}>
                        <label>Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={s.formGroup}>
                        <label>Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className={s.formActions}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={s.cancelButton}
                        >
                            Cancel
                        </button>
                        <button type="submit" className={s.submitButton}>
                            Add User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
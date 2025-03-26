import React, { useState } from 'react'
import s from './editUser.module.scss'
import { MdClose } from "react-icons/md"
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase";


const EditUser = ({ isOpen, onClose, userData }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');
    const [status, setStatus] = useState('active');
    const [error, setError] = useState('');

    const checkEmailUnique = async (email, excludeId) => {
        const q = query(
            collection(db, 'users'),
            where('email', '==', email),
            where('__name__', '!=', excludeId)
        );

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
            const isUnique = await checkEmailUnique(email, userData.id);

            if (!isUnique) {
                setError('Email already exists');
                return;
            }

            await updateDoc(doc(db, 'users', userData.id), {
                name,
                email,
                role,
                status
            });

            onClose();
        } catch (error) {
            console.error("Error updating user:", error);
            setError('Error updating user');
        }
    };

    if (!isOpen) return null;

    return (
        <div className={s.modalOverlay}>
            <div className={s.modal}>
                <div className={s.modalHeader}>
                    <h3>Edit User</h3>
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
                            <option value="editor">Editor</option>
                        </select>
                    </div>

                    <div className={s.formGroup}>
                        <label>Status</label>
                        <div className={s.radioGroup}>
                            <label>
                                <input
                                    type="radio"
                                    name="status"
                                    value="active"
                                    checked={status === 'active'}
                                    onChange={(e) => setStatus(e.target.value)}
                                />
                                Active
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="status"
                                    value="inactive"
                                    checked={status === 'inactive'}
                                    onChange={(e) => setStatus(e.target.value)}
                                />
                                Inactive
                            </label>
                        </div>
                    </div>

                    <div className={s.formActions}>
                        <button type="button" onClick={onClose} className={s.cancelButton}>
                            Cancel
                        </button>
                        <button type="submit" className={s.submitButton}>
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUser;
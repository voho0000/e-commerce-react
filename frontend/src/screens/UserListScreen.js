import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                users: action.payload,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};
export default function UserListScreen() {
    const navigate = useNavigate();
    const [{ loading, error, users }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const { state } = useContext(Store);
    const { userInfo } = state;

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/users`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(err),
                });
            }
        };
        fetchData();
    }, [userInfo]);
    return (
        <div>
            <Helmet>
                <title>會員</title>
            </Helmet>
            <h1>會員</h1>
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>編號</th>
                            <th>姓名</th>
                            <th>信箱</th>
                            <th>管理員權限</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.isadmin ? 'YES' : 'NO'}</td>
                                <td>
                                    <Button
                                        type="button"
                                        variant="light"
                                        onClick={() => navigate(`/admin/user/${user.id}`)}
                                    >
                                        Edit
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
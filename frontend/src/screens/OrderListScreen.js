import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
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
                orders: action.payload,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true, successDelete: false };
        case 'DELETE_SUCCESS':
            return {
                ...state,
                loadingDelete: false,
                successDelete: true,
            };
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false };
        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false };
        default:
            return state;
    }
};
export default function OrderListScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] = 
  useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
        try {
            dispatch({ type: 'FETCH_REQUEST' });
            const { data } = await axios.get(`/api/orders`, {
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
    if (successDelete) {
        dispatch({ type: 'DELETE_RESET' });
    } else {
        fetchData();
    }
}, [userInfo, successDelete]);

  const deleteHandler = async (order) => {
    if (window.confirm('Are you sure to delete?')) {
        try {
            dispatch({ type: 'DELETE_REQUEST' });
            await axios.delete(`/api/orders/${order.id}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            toast.success('訂單已成功刪除');
            dispatch({ type: 'DELETE_SUCCESS' });
        } catch (err) {
            toast.error(getError(error));
            dispatch({
                type: 'DELETE_FAIL',
            });
        }
    }
};

return (
    <div>
        <Helmet>
            <title>訂單</title>
        </Helmet>
        <h1>訂單</h1>
        {loadingDelete && <LoadingBox></LoadingBox>}
        {loading ? (
            <LoadingBox></LoadingBox>
        ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
        ) : (
            <table className="table">
                <thead>
                    <tr>
                        <th>編號</th>
                        <th>使用者</th>
                        <th>日期</th>
                        <th>總價</th>
                        <th>付款日期</th>
                        <th>運送日期</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.user_id ? order.name : 'DELETED USER'}</td>
                            <td>{order.create_time.substring(0, 10)}</td>
                            <td>{order.total_price}</td>
                            <td>{order.ispaid ? order.paid_time.substring(0, 10) : 'No'}</td>
                            <td>
                                {order.isdelivered
                                    ? order.delivered_time.substring(0, 10)
                                    : 'No'}
                            </td>
                            <td>
                                <Button
                                    type="button"
                                    variant="light"
                                    onClick={() => {
                                        navigate(`/order/${order.id}`);
                                    }}
                                >
                                    細節
                                </Button>
                                &nbsp;
                                <Button
                                    type="button"
                                    variant="light"
                                    onClick={() => deleteHandler(order)}
                                >
                                    刪除
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
import React, { useContext, useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                shippingCoupons: action.payload,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'CREATE_REQUEST':
            return { ...state, loadingCreate: true };
        case 'CREATE_SUCCESS':
            return {
                ...state,
                loadingCreate: false,
            };
        case 'CREATE_FAIL':
            return { ...state, loadingCreate: false };

        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true, successDelete: false };
        case 'DELETE_SUCCESS':
            return {
                ...state,
                loadingDelete: false,
                successDelete: true,
            };
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false, successDelete: false };

        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false };
        default:
            return state;
    }
};

export default function ShippingCouponScreen() {
    const [
        {
            loading,
            error,
            coupons,
            loadingCreate,
            loadingDelete,
            successDelete,
            shippingCoupons
        },
        dispatch,
    ] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const navigate = useNavigate();

    const { state } = useContext(Store);
    const { userInfo } = state;
    const [coupon_name, setCouponName] = useState('');
    const [price_criteria, setPriceCriteria] = useState('');
    const [shipping_code, setShippingCode] = useState('');
    const [start_date, setStart] = useState('');
    const [end_date, setEnd] = useState('');
    const [max_num, setMax] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('I am fetching')
                const { data } = await axios.get(`/api/coupons/shipping`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                console.log(data)
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

    const createHandler = async (e) => {
        try {
            dispatch({ type: 'CREATE_REQUEST' });
            const { data } = await axios.post(`/api/coupons/shipping/create`,
                {
                    coupon_name,
                    start_date,
                    end_date,
                    price_criteria,
                    max_num,
                    shipping_code
                }
                , {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    },
                });
            dispatch({
                type: 'CREATE_SUCCESS',
            });
            toast.success('?????????????????????');
        } catch (err) {
            toast.error(getError(err));
            dispatch({ type: 'CREATE_FAIL', payload: getError(err) });
        }

    };

    const deleteHandler = async (coupon) => {
        if (window.confirm('??????????????????????')) {
            try {
                await axios.delete(`/api/coupons/shipping/${coupon.id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                toast.success('?????????????????????');
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
            <Row>
                <Col>
                    <h1 className='my-3'>?????????</h1>
                </Col>
            </Row>
            <Row className='my-3'>
                <form onSubmit={createHandler}>
                    <div className="row">
                        <div className="col text-center">
                            <Form.Group className="mb-3" controlId="coupon_name">
                                <Form.Label>???????????????</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={coupon_name}
                                    required
                                    placeholder="????????????"
                                    onChange={(e) => setCouponName(e.target.value)}
                                />
                            </Form.Group>
                        </div>
                        <div className="col text-center">
                            <Form.Group className="mb-3" controlId="shipping_code">
                                <Form.Label>?????????</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={shipping_code}
                                    required
                                    placeholder="HAPPY2023"
                                    onChange={(e) => setShippingCode(e.target.value)}
                                />
                            </Form.Group>
                        </div>
                        <div className="col text-center">
                            <Form.Group className="mb-3" controlId="start_date">
                                <Form.Label>????????????</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={start_date}
                                    onChange={(e) => setStart(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </div>
                        <div className="col text-center">
                            <Form.Group className="mb-3" controlId="end_date">
                                <Form.Label>????????????</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={end_date}
                                    onChange={(e) => setEnd(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </div>
                        <div className="col text-center">
                            <Form.Group className="mb-3" controlId="price_criteria">
                                <Form.Label>????????????????????????</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={price_criteria}
                                    placeholder='1000'
                                    onChange={(e) => setPriceCriteria(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </div>
                        <div className="col text-center">
                            <Form.Group className="mb-3" controlId="max_num">
                                <Form.Label>??????????????????</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={max_num}
                                    placeholder='10000'
                                    onChange={(e) => setMax(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </div>
                        <div className="col">
                            <Form.Label>???????????????</Form.Label>
                            <Button
                                type="submit"
                                style={{ display: "block" }}

                            >
                                ????????????</Button>
                        </div>

                    </div>
                </form>
            </Row>
            <Row className='my-3'>
                {loadingCreate && <LoadingBox></LoadingBox>}
                {loadingDelete && <LoadingBox></LoadingBox>}

                {
                    loading ? (
                        <LoadingBox></LoadingBox>
                    ) : error ? (
                        <MessageBox variant="danger">{error}</MessageBox>
                    ) : (
                        <table className="table text-center">
                            <thead>
                                <tr>
                                    <th>???????????????</th>
                                    <th>?????????</th>
                                    <th>????????????</th>
                                    <th>????????????</th>
                                    <th>????????????????????????</th>
                                    <th>??????????????????</th>
                                    <th>??????</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shippingCoupons.map((coupon) => (
                                    <tr key={coupon.id}>
                                        <td>{coupon.name}</td>
                                        <td>{coupon.code}</td>
                                        <td>{coupon.start_date.substring(0, 10)}</td>
                                        <td>{coupon.end_date.substring(0, 10)}</td>
                                        <td>{coupon.price_criteria}</td>
                                        <td>{coupon.max_num}</td>
                                        <td>
                                            <Button
                                                type="button"
                                                variant="light"
                                                onClick={() => deleteHandler(coupon)}
                                            >
                                                ??????
                                            </Button>
                                        </td>
                                    </tr>

                                ))}
                            </tbody>
                        </table>
                    )
                }
            </Row>




        </div >
    );
}
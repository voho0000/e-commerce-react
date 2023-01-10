import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { getError } from '../utils';
import { toast } from 'react-toastify';

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, order: action.payload, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'PAY_REQUEST':
            return { ...state, loadingPay: true };
        case 'PAY_SUCCESS':
            return { ...state, loadingPay: false, order: action.payload, successPay: true };
        case 'PAY_FAIL':
            return { ...state, loadingPay: false };
        case 'PAY_RESET':
            return { ...state, loadingPay: false, successPay: false };
        case 'DELIVER_REQUEST':
            return { ...state, loadingDeliver: true };
        case 'DELIVER_SUCCESS':
            return { ...state, loadingDeliver: false, successDeliver: true };
        case 'DELIVER_FAIL':
            return { ...state, loadingDeliver: false };
        case 'DELIVER_RESET':
            return {
                ...state,
                loadingDeliver: false,
                successDeliver: false,
            };
        default:
            return state;
    }
}
export default function OrderScreen() {
    const { state } = useContext(Store);
    const { userInfo } = state;

    const params = useParams();
    const { id: orderId } = params;
    const navigate = useNavigate();

    const [
        {
            loading,
            error,
            order,
            successPay,
            loadingPay,
            loadingDeliver,
            successDeliver,
        },
        dispatch,
    ] = useReducer(reducer, {
        loading: true,
        order: {},
        error: '',
        successPay: false,
        loadingPay: false,
    });






    function onError(err) {
        toast.error(getError(err));
    }

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                console.log('I am fetching');
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/orders/${orderId}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };

        if (!userInfo) {
            return navigate('/login');
        };
        if (
            !order.id ||
            successPay ||
            successDeliver ||
            (order.id && order.id !== orderId)
        ) {
            fetchOrder();
            if (successPay) {
                dispatch({ type: 'PAY_RESET' });
            }
            if (successDeliver) {
                dispatch({ type: 'DELIVER_RESET' });
            }
        }
    }, [userInfo, orderId, navigate, successPay, successDeliver,]);

    const paymentHandler = async (e) => {
        order.ispaid = true;
        try {
            dispatch({ type: 'PAY_REQUEST' });
            const { data } = await axios.put(`/api/orders/${order.id}/pay`,
                order,
                {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
            dispatch({ type: 'PAY_SUCCESS', payload: data, successPay: true });
            toast.success('訂單已成功付款');
            //localStorage.setItem('userInfo', JSON.stringify(data));
        } catch (err) {
            toast.error(getError(err));
            dispatch({ type: 'PAY_FAIL' });
        }
    }

    async function deliverOrderHandler() {
        try {
            dispatch({ type: 'DELIVER_REQUEST' });
            const { data } = await axios.put(
                `/api/orders/${order.id}/deliver`,
                {},
                {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({ type: 'DELIVER_SUCCESS', payload: data });
            toast.success('訂單已成功運送');
        } catch (err) {
            toast.error(getError(err));
            dispatch({ type: 'DELIVER_FAIL' });
        }
    }


    return loading ? (
        <LoadingBox></LoadingBox>
    ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
    ) : (
        <div>
            <Helmet>
                <title>訂單 {orderId}</title>
            </Helmet>
            <h1 className="my-3">訂單</h1>
            <Row>
                <Col md={8}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>運送</Card.Title>
                            <Card.Text>
                                <strong>姓名:</strong> {order.shipping_address.fullname} <br />
                                <strong>地址: </strong> {order.shipping_address.address},
                                {order.shipping_address.city}, {order.shipping_address.postal_code}
                                ,{order.shipping_address.country}
                            </Card.Text>
                            {order.isdelivered ? (
                                <MessageBox variant="success">
                                    運送日期： {order.delivered_time.substring(0,10)}
                                </MessageBox>
                            ) : (
                                <MessageBox variant="danger">Not Delivered</MessageBox>
                            )}
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>付款</Card.Title>
                            <Card.Text>
                                <strong>方式:</strong> {order.payment_method}
                            </Card.Text>
                            {order.ispaid ? (
                                <MessageBox variant="success">
                                    付款日期： {order.paid_time.substring(0,10)}
                                </MessageBox>
                            ) : (
                                <MessageBox variant="danger">Not Paid</MessageBox>
                            )}
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>購買項目</Card.Title>
                            <ListGroup variant="flush">
                                {order.orderItems.map((item) => (
                                    <ListGroup.Item key={item.product_id}>
                                        <Row className="align-items-center">
                                            <Col md={2}>
                                                <img
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    className="img-fluid rounded img-thumbnail"
                                                    id="img-thumbnail"
                                                ></img>{' '}
                                            </Col>
                                            <Col md={4}>
                                                <Link to={`/product/${item.product_id}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={3}>
                                                <span>{item.quantity}</span>
                                            </Col>
                                            <Col md={3}>${item.price}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>訂單總結</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>商品價格</Col>
                                        <Col>${order.items_price}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>運費</Col>
                                        <Col>${order.shipping_price}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>折扣金額</Col>
                                        <Col>${order.discount_price}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            <strong> 訂單總價</strong>
                                        </Col>
                                        <Col>
                                            <strong>${order.total_price}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                {!order.ispaid && (order.user_id===userInfo.id)&&(
                                    <ListGroup.Item>

                                        <div className="d-grid">
                                            <Button
                                                type="button"
                                                onClick={paymentHandler}
                                            >
                                                付款
                                            </Button>
                                        </div>

                                        {loadingPay && <LoadingBox></LoadingBox>}
                                    </ListGroup.Item>
                                )}

                                {userInfo.isadmin ? (
                                    userInfo.isadmin&& order.ispaid && !order.isdelivered && (
                                    <ListGroup.Item>
                                        {loadingDeliver && <LoadingBox></LoadingBox>}
                                        <div className="d-grid">
                                            <Button type="button" onClick={deliverOrderHandler}>
                                                送貨
                                            </Button>
                                        </div>
                                    </ListGroup.Item>
                                ))
                                :(null)}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
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

    const paymentHandler = async (e) => {
        e.preventDefault();
        order.ispaid = true;
        try {
            dispatch({ type: 'PAY_REQUEST' });
            const { data } = await axios.put(`/api/orders/${order.id}/pay`,
                order,
                {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
            dispatch({ type: 'PAY_SUCCESS', payload: data, successPay: true });
            //localStorage.setItem('userInfo', JSON.stringify(data));
        } catch (err) {
            toast.error(getError(err));
        }
    }




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
            toast.success('Order is delivered');
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
                <title>Order {orderId}</title>
            </Helmet>
            <h1 className="my-3">Order {orderId}</h1>
            <Row>
                <Col md={8}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Shipping</Card.Title>
                            <Card.Text>
                                <strong>Name:</strong> {order.shipping_address.fullname} <br />
                                <strong>Address: </strong> {order.shipping_address.address},
                                {order.shipping_address.city}, {order.shipping_address.postal_code}
                                ,{order.shipping_address.country}
                            </Card.Text>
                            {order.isdelivered ? (
                                <MessageBox variant="success">
                                    Delivered at {order.delivered_time}
                                </MessageBox>
                            ) : (
                                <MessageBox variant="danger">Not Delivered</MessageBox>
                            )}
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Payment</Card.Title>
                            <Card.Text>
                                <strong>Method:</strong> {order.payment_method}
                            </Card.Text>
                            {order.ispaid ? (
                                <MessageBox variant="success">
                                    Paid at {order.paid_time}
                                </MessageBox>
                            ) : (
                                <MessageBox variant="danger">Not Paid</MessageBox>
                            )}
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Items</Card.Title>
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
                            <Card.Title>Order Summary</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col>${order.items_price}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>${order.shipping_price}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Discount</Col>
                                        <Col>${order.discount_price}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            <strong> Order Total</strong>
                                        </Col>
                                        <Col>
                                            <strong>${order.total_price}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                {!order.ispaid && (
                                    <ListGroup.Item>

                                        <div className="d-grid">
                                            <Button
                                                type="button"
                                                onClick={paymentHandler}
                                            >
                                                Pay
                                            </Button>
                                        </div>

                                        {loadingPay && <LoadingBox></LoadingBox>}
                                    </ListGroup.Item>
                                )}

                                {userInfo.isadmin && order.ispaid && !order.isdelivered && (
                                    <ListGroup.Item>
                                        {loadingDeliver && <LoadingBox></LoadingBox>}
                                        <div className="d-grid">
                                            <Button type="button" onClick={deliverOrderHandler}>
                                                Deliver Order
                                            </Button>
                                        </div>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
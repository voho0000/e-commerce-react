import Axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import ListGroup from 'react-bootstrap/ListGroup';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import LoadingBox from '../components/LoadingBox';
import axios from 'axios';

const reducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_REQUEST':
            return { ...state, loading: true };
        case 'CREATE_SUCCESS':
            return { ...state, loading: false };
        case 'CREATE_FAIL':
            return { ...state, loading: false };
        default:
            return state;
    }
};


export default function PlaceOrderScreen() {
    const navigate = useNavigate();

    const [{ loading }, dispatch] = useReducer(reducer, {
        loading: false,
    });

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;

    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [shippingCode, setShippingCode] = useState('');
    const [appliedShippingCoupon, setAppliedShippingCoupon] = useState(null);
    const [discount_price, setDiscount] = useState(0);
    const [discountError, setDiscountError] = useState(null);
    const [shippingError, setShippingError] = useState(null);

    cart.items_price = cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
        ;
    cart.shipping_price = appliedShippingCoupon ? 0 : cart.items_price > 30000 ? 0 : 100;
    cart.discount_price = discount_price;
    cart.total_price = cart.items_price + cart.shipping_price - cart.discount_price;

    const placeOrderHandler = async () => {
        try {
            dispatch({ type: 'CREATE_REQUEST' });

            const { data } = await Axios.post(
                '/api/orders',
                {
                    orderItems: cart.cartItems,
                    shipping_address: cart.shipping_address,
                    payment_method: cart.payment_method,
                    items_price: cart.items_price,
                    shipping_price: cart.shipping_price,
                    discount_price: cart.discount_price,
                    total_price: cart.total_price,
                    discount_coupon: appliedCoupon,
                    shipping_coupon: appliedShippingCoupon
                },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );
            ctxDispatch({ type: 'CART_CLEAR' });
            dispatch({ type: 'CREATE_SUCCESS' });
            localStorage.removeItem('cartItems');
            await Axios.delete(`api/cart`,                
            {
                headers: {
                    authorization: `Bearer ${userInfo.token}`,
                },
            })
            navigate(`/order/${data.order.id}`);
        } catch (err) {
            dispatch({ type: 'CREATE_FAIL' });
            toast.error(getError(err));
        }
    };

    const applyHandler = async (code) => {

        try {
            const { data } = await axios.get(`/api/coupons/discount/${code}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            if (data) {
                const date = new Date();
                if (date > new Date(data.end_date)) {
                    setDiscountError(`????????????????????????`);
                } else {
                    if (data.price_criteria > cart.items_price) {
                        setDiscountError(`????????????${data.price_criteria}???????????????`);
                    } else {
                        setDiscount(data.discount_num)
                        setAppliedCoupon({ code: data.code, id: data.id });
                    }
                }
            } else {
                // Handle invalid coupon code
                setDiscountError('???????????????');
            }
        } catch (error) {
            // Handle network errors
            setDiscountError(error)
        }

    };

    const applyShippingHandler = async (code) => {

        try {
            const { data } = await axios.get(`/api/coupons/shipping/${code}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            if (data) {
                const date = new Date();
                if (date > new Date(data.end_date)) {
                    setShippingError(`????????????????????????`);
                } else {
                    if (data.price_criteria > cart.items_price) {
                        setShippingError(`????????????${data.price_criteria}???????????????`);
                    } else {
                        setShippingCode(data.code)
                        setAppliedShippingCoupon({ code: data.code, id: data.id });
                    }
                }
            } else {
                // Handle invalid coupon code
                setShippingError('???????????????');
            }
        } catch (error) {
            // Handle network errors
            setShippingError(error)
        }

    };



    useEffect(() => {
        if (!cart.payment_method) {
            navigate('/payment');
        }
    }, [cart, navigate, discount_price]);

    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
            <Helmet>
                <title>????????????</title>
            </Helmet>
            <h1 className="my-3">????????????</h1>
            <Row>
                <Col md={8}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>????????????</Card.Title>
                            <Card.Text>
                                <strong>??????:</strong> {cart.shipping_address.fullName} <br />
                                <strong>??????:</strong> {cart.shipping_address.phone} <br />
                                <strong>??????: </strong> {cart.shipping_address.address},
                                {cart.shipping_address.city}, {cart.shipping_address.postalCode},
                                {cart.shipping_address.country}
                            </Card.Text>
                            <Link to="/shipping">Edit</Link>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>????????????</Card.Title>
                            <Card.Text>
                                <strong>??????:</strong> {cart.payment_method}
                            </Card.Text>
                            <Link to="/payment">Edit</Link>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>????????????</Card.Title>
                            <ListGroup variant="flush">
                                {cart.cartItems.map((item) => (
                                    <ListGroup.Item key={item.id}>
                                        <Row className="align-items-center">
                                            <Col md={2}>
                                                <img
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    className="img-fluid rounded img-thumbnail"
                                                    id="img-thumbnail"
                                                ></img>{' '}

                                            </Col>
                                            <Col md={5}>
                                                <Link to={`/product/${item.id}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={1}>
                                                <span>{item.quantity}</span>
                                            </Col>
                                            <Col md={2}>${item.price}</Col>
                                            <Col md={2}>${item.price * item.quantity}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <Link to="/cart">Edit</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>????????????</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>????????????</Col>
                                        <Col>${cart.items_price}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>??????</Col>
                                        <Col>${cart.shipping_price}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>????????????</Col>
                                        <Col>${cart.discount_price}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            <strong> ????????????</strong>
                                        </Col>
                                        <Col>
                                            <strong>${cart.total_price}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className="d-grid">
                                        <Button
                                            type="button"
                                            onClick={placeOrderHandler}
                                            disabled={cart.cartItems.length === 0}
                                        >
                                            ????????????
                                        </Button>
                                    </div>
                                    {loading && <LoadingBox></LoadingBox>}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <Card.Title>??????</Card.Title>

                            <Form>
                                {appliedCoupon && (
                                    <Alert variant="success">
                                        ??????????????????: {appliedCoupon.code}?????????{discount_price}??????
                                    </Alert>
                                )}
                                {!appliedCoupon && discountError && <Alert variant="danger">{discountError}</Alert>}
                                <Form.Group className="mb-3" controlId="discount">
                                    <Form.Label>????????? : </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={couponCode}
                                        placeholder="???????????????"
                                        onChange={(e) => setCouponCode(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Button
                                        variant="primary"
                                        onClick={() => applyHandler(couponCode)}
                                        disabled={appliedCoupon}
                                    >
                                        ??????
                                    </Button>
                                </Form.Group>
                                {appliedShippingCoupon && (
                                    <Alert variant="success">
                                        ??????????????????: {appliedShippingCoupon.code}???
                                    </Alert>
                                )}
                                {!appliedShippingCoupon && shippingError && <Alert variant="danger">{shippingError}</Alert>}
                                <Form.Group className="mb-3" controlId="discount">
                                    <Form.Label>????????? : </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={shippingCode}
                                        placeholder="???????????????"
                                        onChange={(e) => setShippingCode(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Button
                                        variant="primary"
                                        onClick={() => applyShippingHandler(shippingCode)}
                                        disabled={appliedShippingCoupon}
                                    >
                                        ??????
                                    </Button>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
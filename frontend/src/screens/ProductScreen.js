import axios from 'axios';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Rating from '../components/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
    switch (action.type) {
        case 'REFRESH_PRODUCT':
            return { ...state, product: action.payload };
        case 'CREATE_REQUEST':
            return { ...state, loadingCreateReview: true };
        case 'CREATE_SUCCESS':
            return { ...state, reviews: action.payload, loadingCreateReview: false };
        case 'CREATE_FAIL':
            return { ...state, loadingCreateReview: false };
        case 'FETCH_PRODUCT_REQUEST':
            return { ...state, loadingFetchProduct: true };
        case 'FETCH_PRODUCT_SUCCESS':
            return { ...state, product: action.payload, loadingFetchProduct: false };
        case 'FETCH_PRODUCT_FAIL':
            return { ...state, loadingFetchProduct: false, error: action.payload };
        case 'FETCH_REVIEW_REQUEST':
            return { ...state, loadingFetchReview: true };
        case 'FETCH_REVIEW_SUCCESS':
            return { ...state, reviews: action.payload, loadingFetchReview: false };
        case 'FETCH_REVIEW_FAIL':
            return { ...state, loadingFetchReview: false, error: action.payload };
        default:
            return state;
    }
};



function ProductScreen() {
    let reviewsRef = useRef();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const params = useParams();
    const navigate = useNavigate();
    const { id } = params;
    const [{ loadingFetchProduct, loadingFetchReview, error, product, reviews, loadingCreateReview }, dispatch] =
        useReducer(reducer, {
            product: [],
            reviews: [],
            loadingFetchProduct: true,
            loadingFetchReview: true,
            error: '',
        });



    useEffect(() => {
        const fetchProductData = async () => {
            dispatch({ type: 'FETCH_PRODUCT_REQUEST' });
            try {
                const result = await axios.get(`/api/products/${id}`);
                dispatch({ type: 'FETCH_PRODUCT_SUCCESS', payload: result.data });
            } catch (err) {
                dispatch({ type: 'FETCH_PRODUCT_FAIL', payload: getError(err) });
            }
        };

        const fetchReviewData = async () => {
            dispatch({ type: 'FETCH_REVIEW_REQUEST' });
            try {
                const { data } = await axios.get(`/api/products/${id}/reviews`);
                //console.log(data)
                dispatch({ type: 'FETCH_REVIEW_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_REVIEW_FAIL', payload: getError(err) });
            }
        };
        fetchProductData();
        fetchReviewData();
    }, [id]);



    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;
    const addToCartHandler = async () => {
        const existItem = cart.cartItems.find((x) => x.id === product.id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product.id}`);
        if (data.countinstock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...product, quantity },
        });

        navigate('/cart');

    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!comment || !rating) {
            toast.error('Please enter comment and rating');
            return;
        }
        try {
            const { data } = await axios.post(
                `/api/products/${product.id}/reviews`,
                { rating, comment },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );

            dispatch({
                type: 'CREATE_SUCCESS', payload: data.reviews
            });
            toast.success('Review submitted successfully');
            dispatch({ type: 'REFRESH_PRODUCT', payload: data.product });
            window.scrollTo({
                behavior: 'smooth',
                top: reviewsRef.current.offsetTop,
            });
        } catch (error) {
            toast.error(getError(error));
            dispatch({ type: 'CREATE_FAIL' });
        }
    };
    console.log(reviews);
    return (loadingFetchProduct && loadingFetchReview) ? (
        <LoadingBox />
    ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
    ) : (
        <div>
            <Row>
                <Col md={4}>
                    <img
                        className="img-large"
                        src={product.image_url}
                        alt={product.name}
                        style={{ objectFit:'contain'}}
                    ></img>
                </Col>
                <Col md={5}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Helmet>
                                <title>{product.name}</title>
                            </Helmet>
                            <h1>{product.name}</h1>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Rating
                                rating={product.rating}
                                num_reviews={product.num_reviews}
                            ></Rating>
                        </ListGroup.Item>
                        <ListGroup.Item>價格 : ${product.price}</ListGroup.Item>
                        <ListGroup.Item>
                            商品描述:
                            <p>{product.description}</p>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>價格：</Col>
                                        <Col>${product.price}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>商品狀態：</Col>
                                        <Col>
                                            {product.countinstock > 0 ? (
                                                <Badge bg="success">有存貨</Badge>
                                            ) : (
                                                <Badge bg="danger">Unavailable</Badge>
                                            )}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                {product.countinstock > 0 && (
                                    <ListGroup.Item>
                                        <div className="d-grid">
                                            <Button onClick={addToCartHandler} variant="primary">
                                                加入購物車
                                            </Button>
                                        </div>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <div className="my-3">
                <h2 ref={reviewsRef}>評論</h2>
                <div className="mb-3">
                    {product.num_reviews === 0 && (
                        <MessageBox>There is no review</MessageBox>
                    )}
                </div>
                <ListGroup>
                    {reviews.map((review) => (
                        <ListGroup.Item key={review.id}>
                            <strong>{review.name}</strong>
                            <Rating rating={review.rating} caption=" "></Rating>
                            <p>{review.review_date.substring(0, 10)}</p>
                            <p>{review.comment}</p>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <div className="my-3">
                    {userInfo ? (
                        <form onSubmit={submitHandler}>
                            <h2>Write a customer review</h2>
                            <Form.Group className="mb-3" controlId="rating">
                                <Form.Label>Rating</Form.Label>
                                <Form.Select
                                    aria-label="Rating"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                >
                                    <option value="">Select...</option>
                                    <option value="1">1- Poor</option>
                                    <option value="2">2- Fair</option>
                                    <option value="3">3- Good</option>
                                    <option value="4">4- Very good</option>
                                    <option value="5">5- Excelent</option>
                                </Form.Select>
                            </Form.Group>
                            <FloatingLabel
                                controlId="floatingTextarea"
                                label="Comments"
                                className="mb-3"
                            >
                                <Form.Control
                                    as="textarea"
                                    placeholder="Leave a comment here"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </FloatingLabel>

                            <div className="mb-3">
                                <Button disabled={loadingCreateReview} type="submit">
                                    Submit
                                </Button>
                                {loadingCreateReview && <LoadingBox></LoadingBox>}
                            </div>
                        </form>
                    ) : (
                        <MessageBox>
                            Please{' '}
                            <Link to={`/signin?redirect=/product/${product.id}`}>
                                Sign In
                            </Link>{' '}
                            to write a review
                        </MessageBox>
                    )}
                </div>
            </div>
        </div>
    );
}
export default ProductScreen;
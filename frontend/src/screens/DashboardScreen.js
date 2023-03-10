import React, { useContext, useEffect, useReducer } from 'react';
import Chart from 'react-google-charts';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                summary: action.payload,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default function DashboardScreen() {
    const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });
    const { state } = useContext(Store);
    const { userInfo } = state;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get('/api/orders/summary', {
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
            <h1>財務報表</h1>
            {loading ? (
                <LoadingBox />
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <>
                    <Row>
                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        {summary.users && summary.users
                                            ? summary.users.num_users
                                            : 0}
                                    </Card.Title>
                                    <Card.Text className='fa fa-users'> 買家</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        {summary.orders && summary.users
                                            ? summary.orders.num_orders
                                            : 0}
                                    </Card.Title>
                                    <Card.Text className='fa fa-shopping-cart'> 訂單數</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        $
                                        {summary.orders && summary.users
                                            ? summary.orders.total_sales
                                            : 0}
                                    </Card.Title>
                                    <Card.Text className="fa fa-money"> 銷售額</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <div className="my-3">
                        <h2>日銷售額</h2>
                        {summary.dailyOrders.length === 0 ? (
                            <MessageBox>No Sale</MessageBox>
                        ) : (
                            <Chart
                                width="100%"
                                height="400px"
                                chartType="AreaChart"
                                loader={<div>Loading Chart...</div>}
                                data={[
                                    ['Date', 'Sales'],
                                    ...summary.dailyOrders.map((x) => [x.date, Number(x.sales)]),
                                ]}
                            ></Chart>
                        )}
                    </div>
                    <div className="my-3">
                        <h2>種類比例</h2>
                        {summary.productCategories.length === 0 ? (
                            <MessageBox>No Category</MessageBox>
                        ) : (
                            <Chart
                                width="100%"
                                height="400px"
                                chartType="PieChart"
                                loader={<div>Loading Chart...</div>}
                                data={[
                                    ['Category', 'Products'],
                                    ...summary.productCategories.map((x) => [x.category, Number(x.count)]),
                                ]}
                            ></Chart>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
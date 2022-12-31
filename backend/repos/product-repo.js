import pool from '../pool.js'

export default class ProductRepo {
    static async getProducts() {
        try {
            const { rows } = await pool.query('SELECT * FROM product;');
            return rows
        } catch (err) {
            console.log(err)
        }
    }

    static async getCategories() {
        try {
            const { rows } = await pool.query('SELECT distinct(category) FROM product;');
            let categories = rows.map(({ category }) => category)
            return categories
        } catch (err) {
            console.log(err)
        }
    }


    static async findById(id) {
        try {
            const data = await pool.query('SELECT * FROM product WHERE id = $1;', [id]);
            return data
        } catch (err) {
            console.log(err)
        }


    }

    static async testQuery() {
        try {
            let { rows } = await pool.query(``)
            console.log(rows)
        } catch (err) {
            console.log(err)
        }
    }

    static async filterProduct(query) {
        try {
            const PAGE_SIZE = 3;
            const pageSize = query.pageSize ? query.pageSize : PAGE_SIZE;
            const page = query.page ? query.page : 1;
            const category = query.category ? query.category : '';
            const price = query.price ? query.price : '';
            const rating = query.rating ? query.rating : '';
            const order = query.order ? query.order : '';
            const searchQuery = query.query ? query.query : '';

            const queryFilter =
                searchQuery && searchQuery !== 'all'
                    ? `AND name ILIKE '%${searchQuery}%'`
                    : '';

            const categoryFilter =
                category && category !== 'all'
                    ? `AND category = '${category}'`
                    : '';

            const ratingFilter =
                rating && rating !== 'all'
                    ? `AND rating >= ${Number(rating)}`
                    : '';

            const priceFilter =
                price && price !== 'all'
                    ? `AND price >= ${Number(price.split('-')[0])} AND price <= ${Number(
                        price.split('-')[1]
                    )}`
                    : '';

            const sortOrder =
                order === 'featured'
                    ? 'ORDER BY featured DESC'
                    : order === 'lowest'
                        ? 'ORDER BY price ASC'
                        : order === 'highest'
                            ? 'ORDER BY price DESC'
                            : order === 'toprated'
                                ? 'ORDER BY rating DESC'
                                : order === 'newest'
                                    ? 'ORDER BY created_time DESC'
                                    : 'ORDER BY id DESC';

            const offset = pageSize * (page - 1);
            const limit = pageSize;

            const finalquery = `
                SELECT * FROM product where true
                ${queryFilter} ${categoryFilter} ${ratingFilter} ${priceFilter} ${sortOrder}
                LIMIT ${limit} OFFSET ${offset} ;
                `;

            console.log(finalquery)
            
            const {rows} =await pool.query(finalquery)
            return rows

        } catch {
            console.log(err)
        }
    }

    static async countProduct(query) {
        try {
            console.log(query);
            const category = query.category ? query.category : '';
            const price = query.price ? query.price : '';
            const rating = query.rating ? query.rating : '';
            const searchQuery = query.query ? query.query : '';

            const queryFilter =
                searchQuery && searchQuery !== 'all'
                    ? `AND name ILIKE '%${searchQuery}%'`
                    : '';

            const categoryFilter =
                category && category !== 'all'
                    ? `AND category = '${category}'`
                    : '';

            const ratingFilter =
                rating && rating !== 'all'
                    ? `AND rating >= ${Number(rating)}`
                    : '';

            const priceFilter =
                price && price !== 'all'
                    ? `AND price >= ${Number(price.split('-')[0])} AND price <= ${Number(
                        price.split('-')[1]
                    )}`
                    : '';

            const countquery = `
                SELECT count(*) FROM product where true
                ${queryFilter} ${categoryFilter} ${ratingFilter} ${priceFilter} ;
                `;  
            
            var {rows} = await pool.query(countquery);
            console.log(countquery)
            const countProducts = Number(rows[0].count);
            return countProducts

        } catch {
            console.log(err)
        }
    }


    static async countProductCategories() {
        try {
            const { rows } = await pool.query(`SELECT category, COUNT(*) as count
                FROM product
                GROUP BY category;`)
            return rows
        } catch (err) {
            console.log(err)
        }
    }

  
}





// category, rating, price, name
// 依照order方式排列
// 傳回第xx-xx樣商品即可(根據所在頁數)

import pool from '../pool.js'
const PAGE_SIZE = 3;
export default class ProductRepo {
    static async getProducts() {
        try {
            const { rows } = await pool.query(
                `SELECT * FROM product WHERE discontinue_date IS NULL ORDER BY id ASC;`);
            return rows
        } catch (err) {
            console.log(err)
        }
    }

    static async getCategories() {
        try {
            const { rows } = await pool.query(
                `SELECT DISTINCT(category) FROM product WHERE discontinue_date IS NULL;`);
            let categories = rows.map(({ category }) => category)
            return categories
        } catch (err) {
            console.log(err)
        }
    }


    static async findById(id) {
        try {
            var { rows } = await pool.query('SELECT * FROM product WHERE id = $1;', [id]);
            rows = rows[0]
            return rows
        } catch (err) {
            console.log(err)
        }
    }

    static async filterProduct(query) {
        try {
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
                SELECT * FROM product where discontinue_date IS NULL
                ${queryFilter} ${categoryFilter} ${ratingFilter} ${priceFilter} ${sortOrder}
                LIMIT ${limit} OFFSET ${offset} ;
                `;
            const { rows } = await pool.query(finalquery)
            return rows

        } catch {
            console.log(err)
        }
    }

    static async countProduct(query) {
        try {
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
                SELECT count(*) FROM product where discontinue_date IS NULL
                ${queryFilter} ${categoryFilter} ${ratingFilter} ${priceFilter} ;
                `;

            var { rows } = await pool.query(countquery);
            const countProducts = Number(rows[0].count);
            return countProducts

        } catch {
            console.log(err)
        }
    }


    static async countProductCategories() {
        try {
            const { rows } = await pool.query(`SELECT category, COUNT(*) as count
                FROM product where discontinue_date IS NULL
                GROUP BY category;`)
            return rows
        } catch (err) {
            console.log(err)
        }
    }

    static async findByPage(query) {
        try {
            const pageSize = query.pageSize ? query.pageSize : PAGE_SIZE;
            const page = query.page ? query.page : 1;

            const offset = pageSize * (page - 1);
            const limit = pageSize;

            const finalquery = `
                SELECT * FROM product where discontinue_date IS NULL order by id asc
                LIMIT ${limit} OFFSET ${offset} ;
                `;

            const { rows } = await pool.query(finalquery)
            return rows
        } catch (err) {
            console.log(err)
        }
    }

    static async countProductAll() {
        try {
            var { rows } = await pool.query(`SELECT count(*) from product where discontinue_date IS NULL; `)
            rows = rows[0].count
            return rows
        } catch (err) {
            console.log(err)
        }
    }

    static async createProduct(p) {
        try {
            await pool.query(`INSERT INTO product (name, image_url, price, category,
                brand, countinstock, rating, num_reviews, description, created_time) 
                    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, current_timestamp);`,
                [p.name, p.image_url, p.price, p.category,
                p.brand, p.countinstock, p.rating, p.num_reviews, p.description]);

                const { rows } = await pool.query(`
                    SELECT * FROM product 
                        WHERE id = (SELECT MAX(id) FROM product);`);
            return rows[0]
        } catch (err) {
            console.log(err)
        }
    }

    static async updateProduct(p) {
        try {
            await pool.query(
                `UPDATE product
                    SET name = $1, image_url = $2, price = $3, category = $4, brand = $5,
                        countinstock = $6, description = $7
                        WHERE id = $8 ;`,
                [p.name, p.image_url, p.price, p.category, p.brand, p.countinstock, p.description, p.id]);
        } catch (err) {
            console.log(err)
        }
    }

    static async updateImage(image_url, productId) {
        try {
            await pool.query(
                `UPDATE product
                    SET image_url = $1 WHERE id = $2 ;`,
                [image_url, productId]);
        } catch (err) {
            console.log(err)
        }
    }

    static async deleteProduct(productId) {
        try {
            await pool.query(
                `UPDATE product
                    SET discontinue_date = current_timestamp WHERE id = $1 ;`,
                [productId]);
        } catch (err) {
            console.log(err)
        }
    }

    static async updateProductReview(productId) {
        try {
            // update review number of a product
            await pool.query(
                `UPDATE product
                    SET num_reviews = (SELECT COUNT(*) FROM review WHERE review.product_id = product.id)
                    WHERE id = $1;`,
                [productId]);
            // update rating of a prodcut
            await pool.query(
                `UPDATE product
                    SET rating = (SELECT AVG(rating) FROM review WHERE review.product_id = product.id)
                    WHERE id = $1;`,
                [productId]);

            let { rows } = await pool.query(
                `SELECT * FROM product WHERE id = $1;`,
                [productId]);
            rows = rows[0];
            return rows

        } catch (err) {
            console.log(err)
        }
    }


}





// category, rating, price, name
// ??????order????????????
// ?????????xx-xx???????????????(??????????????????)

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(`${__dirname}/product.db`);

function getProducts({ category, term, sort }) {
    if ((!category || category === 'All') && !term) {
        return new Promise((resolve) => {
        db.all(
            `
            SELECT * FROM product
            ${sort ? `ORDER BY product_price` : ``}
            `,
            [],
            (err, rows) => {
            resolve(rows);
            },
        );
        });
    }

  return new Promise((resolve) => {
    const categoryQuery = category
        ? category === 'All'
            ? ''
            : `product_category LIKE '%${category.toLowerCase()}'`
        : '';
    const termQuery = term ? `${categoryQuery ? 'AND' : ''} product_title LIKE '%${term.toLowerCase()}%'` : '';

    db.all(
        `
            SELECT * FROM product
            WHERE
            ${categoryQuery}
            ${termQuery}
            ${sort ? `ORDER BY product_price` : ``}
        `,
        [],
        (err, rows) => {
            resolve(rows);
        },
        );
    });
}

function getProductById(productId) {
  return new Promise((resolve) => {
    db.all(
        `
            SELECT * FROM product
            WHERE product_id = ${productId}
        `,
        [],
        (err, data) => {
            !data || data.length === 0 ? resolve(null) : resolve(data[0]);
        },
        );
    });
}

module.exports = {
    getProducts,
    getProductById,
};

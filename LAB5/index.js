const express = require('express');
const fs = require('fs');
const { getProducts, getProductById } = require('./models/product');

const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('views'));

app.get('/', async (req, res) => {
    const { category, term, sort } = req.query;
    const convertedCategory = category ? category.trim() : null;
    const convertedTerm = term ? term.trim() : null;
    const convertedSort = sort === 'up' ? true : false;

    const products = await getProducts({ category: convertedCategory, term: convertedTerm, sort: convertedSort });
    res.render('index.ejs', { products });
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.get('/signup', (req, res) => {
    res.render('signup.ejs');
});

app.get('/product/:productId', async (req, res) => {
    const { productId } = req.params;
    const product = await getProductById(productId);
    const feedbackHashMap = JSON.parse(fs.readFileSync(`${__dirname}/models/comment.json`).toString());
    const productFeedback = feedbackHashMap[productId];
    if (!product) {
        res.send('<h1>404 Not Found</h1>');
        return;
    }
            res.render('product.ejs', { product, feedbacks: productFeedback ? productFeedback : [] });
});

app.post('/product/:productId', async (req, res) => {
    const { productId } = req.params;
    const { review } = req.body;
    const feedbackHashMap = JSON.parse(fs.readFileSync(`${__dirname}/models/comment.json`).toString());
    const productFeedback = feedbackHashMap[productId];
    if (productFeedback) {
        feedbackHashMap[productId].push(review);
    } else {
        feedbackHashMap[productId] = [review];
    }
    fs.writeFileSync(`${__dirname}/models/comment.json`, JSON.stringify(feedbackHashMap));
    res.redirect(`/product/${productId}`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('서버가 실행됐습니다.');
    console.log(`서버 주소: http://localhost:${PORT}`);
});

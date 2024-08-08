"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const product_1 = require("./entity/product");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const ormconfig_1 = require("./ormconfig");
ormconfig_1.AppDataSource.initialize().then((connection) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Connected to the database');
    const app = (0, express_1.default)();
    app.use(body_parser_1.default.json({ limit: '10mb' }));
    const corsOptions = {
        origin: 'https://66b4de282ca2642058bcff84--admin-panel-prj.netlify.app',
        optionsSuccessStatus: 200
    };
    app.use((0, cors_1.default)(corsOptions));
    const productRepository = connection.getRepository(product_1.Product);
    // Get all products
    app.get('/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const products = yield productRepository.find();
        res.json(products);
    }));
    // Add a new product
    app.post('/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const product = productRepository.create(req.body);
        const result = yield productRepository.save(product);
        res.send(result);
    }));
    // Update a product
    app.put('/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const productId = parseInt(req.params.id, 10);
        const product = yield productRepository.findOne({ where: { id: productId } });
        if (!product) {
            return res.status(404).send('Product not found');
        }
        productRepository.merge(product, req.body);
        const result = yield productRepository.save(product);
        res.send(result);
    }));
    // Delete a product
    app.delete('/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const productId = parseInt(req.params.id, 10);
        const result = yield productRepository.delete(productId);
        res.send(result);
    }));
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})).catch(error => console.log(error));

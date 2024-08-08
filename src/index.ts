import 'reflect-metadata';
import { Product } from './entity/product';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { AppDataSource } from './ormconfig';

AppDataSource.initialize().then(async (connection: any) => {
  console.log('Connected to the database');

  const app = express();
  app.use(bodyParser.json({ limit: '10mb' }));

  const corsOptions = {
    origin: 'https://admin-panel-prj.netlify.app',
    optionsSuccessStatus: 200
  };

  app.use(cors(corsOptions));


  const productRepository = connection.getRepository(Product);

  // Get all products
  app.get('/products', async (req: express.Request, res: express.Response) => {
    const products = await productRepository.find();
    res.json(products);
  });

  // Add a new product
  app.post('/products', async (req: express.Request, res: express.Response) => {
    const product = productRepository.create(req.body);
    const result = await productRepository.save(product);
    res.send(result);
  });

  // Update a product
  app.put('/products/:id', async (req: express.Request, res: express.Response) => {
    const productId = parseInt(req.params.id, 10);
    const product = await productRepository.findOne({ where: { id: productId } });
    if (!product) {
      return res.status(404).send('Product not found');
    }
    productRepository.merge(product, req.body);
    const result = await productRepository.save(product);
    res.send(result);
  });

  // Delete a product
  app.delete('/products/:id', async (req: express.Request, res: express.Response) => {
    const productId = parseInt(req.params.id, 10);
    const result = await productRepository.delete(productId);
    res.send(result);
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

}).catch(error => console.log(error));

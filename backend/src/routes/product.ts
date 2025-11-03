import { Router } from 'express';
import validateProduct from '../middlewares/validate-product';
import { getProducts, createProduct } from '../controllers/products';

const router = Router();

router.get('/', getProducts);

router.post('/', validateProduct, createProduct);

export default router;

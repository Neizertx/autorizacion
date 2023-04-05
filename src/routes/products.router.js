import { Router } from 'express';
import ProductsManager from '../persistencia/daos/mongoManager/ProductsManager.js';
import { userPermision } from '../persistencia/middlewares/userRol.js';
// sessions
import session from 'express-session';

const router = Router();

const productManager = new ProductsManager(); 

router.get('/todos', async (req, res) => { 
    const { limit = 10, page = 1 } = req.query; 
    const products = await productManager.getAllProducts(limit, page);

    if (products.length === 0) {
        res.send('No hay productos listados');
    } else {
        res.render('products', { products, limit, page })
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const singleProduct = await productManager.getProductById(id);

    if (singleProduct) {
        res.render('products', { singleProduct });
    } else {
        res.send(`Lamentablemente el Id ${id} no se encuentra listado.`);
    }
})

router.post('/agregar', userPermision, async (req, res) => {
    console.log(userPermision);
    
    const prod = req.body;
    try {
        const newProduct = await productManager.addProduct(prod);
        res.redirect('/products/todos'); 
    } catch (error) {
        res.redirect('error');
    }
})

router.delete('/:id' , async (req, res)=>{
    const {id} = req.params;
    const delProd = await productManager.deleteProduct(id);
    res.json({message : delProd });
})

export default router
import { Router } from 'express';
import CartManager from '../persistencia/daos/mongoManager/CartManager.js';
// middleware de credenciales: status / user
import { userPermision } from '../persistencia/middlewares/userRol.js';
// sessions
import session from 'express-session';

const router = Router();

const cartManager = new CartManager();

router.post('/', async (req, res) => {
    const createNewCart = await cartManager.createCart();
    res.redirect('/cart/todos')
})

router.get('/todos', userPermision, async (req, res) => { 
    const allCarts = await cartManager.getAllCarts({});
  
    res.render('cart', { allCarts })
})



router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    const getCart = await cartManager.getCartById(cid);
    const notif = 'No se han seleccionado productos';
    if(getCart.length === 0){
        res.status(200).render('cart', {notif})
    } else {
        res.status(200).render('cart', { getCart })

    }
})

router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const purch = await cartManager.addProductsToCart(cid, pid, parseInt(quantity));
    res.status(200).json({ message: `Has agregado ${quantity} ${(quantity > 1) ? 'productos' : 'producto'} correctamente.`, cart: purch });
})


export default router
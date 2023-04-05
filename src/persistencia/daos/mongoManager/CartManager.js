import { cartModel } from '../../models/cart.models.js';
import { productsModel } from '../../models/products.models.js'


export default class CartManager {
    async createCart() {
        try {
            const createCart = await cartModel.create({
                cart: []
            });
            return createCart;
        } catch (error) {
            return error;
        }
    }

    async getAllCarts() {
        try {
            const allCarts = await cartModel.find().lean();
          
            return allCarts
        } catch (error) {
            return error;
        }
    }

    async getCartById(id) {
        try {
            const getCart = await cartModel.findById( id );
            return getCart.productList;
        } catch (error) {
            return error;
        }
    }

    async addProductsToCart(cid, pid, quantity) {

        try {
            const getCart = await cartModel.findById(cid); 
            const getProd = await productsModel.findById(pid); 

            if (getCart) {
                const compare = getCart.productList.find(e => e.productId == pid);
                if (compare) {

                    
                    const addQuantity = getCart.productList.map(el => {
                        if (el.productId == pid) {
                            el.quantity += quantity;
                        }
                        return el;
                    })
                    return await cartModel.findByIdAndUpdate(cid, { productList: addQuantity });

                } else {
                    const addToCart = await cartModel.findByIdAndUpdate( { '_id' : cid } , {$push: { productList:  {productId : pid , productName: getProd.name  , quantity: quantity }}});

                    return addToCart 
                }
            }

        } catch (error) {
            console.log(error);
        }
    }


}
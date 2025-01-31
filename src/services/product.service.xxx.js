'use strict';
const { BadRequestError } = require('../core/error.response');
const { product, clothing, electronic, furniture } = require('../models/product.model')

//define factory class to create product
class ProductFactory {
    /*
        type: 'Clothing',
        payload
    */
    static productRegistry = {}// key and class
    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product types ${type}`)
        return new productClass(payload).createProduct()
    }

    //query
    static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {

    }
}

// product_name: { type: String, required: true },
//     product_thumb: { type: String, required: true },
//     product_description: String,
//     product_price: { type: Number, required: true },
//     product_quantity: { type: Number, required: true },
//     product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
//     product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
//     product_attributes: { type: Schema.Types.Mixed, required: true }
//define base product
class Product {
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_quantity, product_type, product_shop, product_attributes
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    //create new product
    async createProduct(product_id) {
        return await product.create({ ...this, _id: product_id })
    }
}

//define class for differrent product type = clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.product_attributes)
        if (!newClothing) throw new BadRequestError('create new Clothing error');

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('create new Product error');
        return newProduct;
    }
}
//define class for differrent product type = Electronics
class Electronics extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadRequestError('create new Electronics error');

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError('create new Product error');
        return newProduct;
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError('create new Furniture error');

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('create new Product error');
        return newProduct;
    }
}

//register product types 
ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)


module.exports = ProductFactory;
import faker from 'faker'
faker.locale = 'es'

function createNFakeProducts(n = 5) {
    const nuevos = [];
    for (let i = 1; i<= n; i++) {
        const nuevoProducto = createFakeProduct(i);
        nuevos.push(nuevoProducto);
    }
    return nuevos;
}

function createFakeProduct(id) {
    return {
        id: id,
        title: faker.commerce.product(),
        price: faker.commerce.price(),
        thumbnail: faker.image.imageUrl()
    }
}

export {
    createFakeProduct,
    createNFakeProducts
}
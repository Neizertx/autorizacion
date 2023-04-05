import mongoose from 'mongoose';

try {
    mongoose.connect('mongodb+srv://Mateo:123@cluster0.1bo5lan.mongodb.net/?retryWrites=true&w=majority');
    console.log('Conectado a la Base de Datos');
} catch (error) {
    console.log(error);
}
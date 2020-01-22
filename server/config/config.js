/* 
    Puerto
*/
process.env.PORT = process.env.PORT || 3000;

/**
 * Entorno
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * Vencimiento de Token
 */
/* 
60 segundos
60 minutos
24 horas
30 dias
*/
/**
 * Vencimiento de Token
 */
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

/* 
    SEED de autenticacion
*/
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
/**
 * Base de datos
 */
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI
    console.log('DB');
}
process.env.NODE_ENV = urlDB;

/**
 * Google Client ID
 */
process.env.CLIENT_ID = process.env.CLIENT_ID || '566332590030-pff2a7hu0708ip9sceohclk7uiklm7h1.apps.googleusercontent.com'
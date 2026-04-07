import {express} from 'express';
import {createProperties, getAllProperties} from '../controllers/propertiesController.js';

const route = express();

 route.post('/properties', createProperties);
    route.get('/properties/all', getAllProperties);

    export default route;
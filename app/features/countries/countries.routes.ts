import { Router } from 'express';
import { CountriesController } from './countries.controller';

const router = Router();
const controller = new CountriesController();

// GET /api/countries - Lấy tất cả countries
router.get('/', controller.getAllCountries.bind(controller));

// GET /api/countries/continent/:continent - Lấy countries theo châu lục
router.get('/continent/:continent', controller.getCountriesByContinent.bind(controller));

// GET /api/countries/:slug - Lấy country theo slug
router.get('/:slug', controller.getCountryBySlug.bind(controller));

// GET /api/countries/:slug/tours - Lấy tours của country
router.get('/:slug/tours', controller.getToursByCountry.bind(controller));

export default router;

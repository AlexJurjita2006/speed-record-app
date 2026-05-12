import express from 'express';
import { getLocationSuggestions, getRouteInfo, getNavigationRoute } from '../controllers/routeController.js';
const router = express.Router();

router.get('/search', getLocationSuggestions);
router.get('/', getRouteInfo);
router.get('/navigate', getNavigationRoute);   // <-- nou

export default router;
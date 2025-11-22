import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface IconDefaultWithPrivate extends L.Icon.Default {
  _getIconUrl?: any;
}

delete (L.Icon.Default.prototype as IconDefaultWithPrivate)._getIconUrl;

(L.Icon.Default as any).mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default L;

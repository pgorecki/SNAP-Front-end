export function getLatLongFromDevice() {
  const latLng = [];
  const location = Geolocation.currentLocation(); // eslint-disable-line no-undef
  if (location !== null && location.coords) {
    latLng[0] = location.coords.latitude;
    latLng[1] = location.coords.longitude;
  }
  return latLng;
}

export function createGeocodeUrl(location) {
  const apiKey = '88e54b6832d340aba770a6449045c79d'; // Max. 2500 requests/day
  const baseUrl = `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&countrycode=us`;
  return `${baseUrl}&q=${encodeURIComponent(location)}`;
}

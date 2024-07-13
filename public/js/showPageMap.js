mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/outdoors-v12", //style of the map
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 8, // starting zoom
});
map.addControl(new mapboxgl.NavigationControl()); //adds navigation control to the map
const marker = new mapboxgl.Marker() //creates a marker on the map
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${campground.title}</h3><p>${campground.location}</p>` //displays name of the location and campground title
    )
  )
  .addTo(map);

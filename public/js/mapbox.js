const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations)
mapboxgl.accessToken = 'pk.eyJ1IjoiY2xvY2t3aXplMTcxIiwiYSI6ImNsZGU4Y21teTBiOG4zb3BmeWgwbHhzOWMifQ.bTdKRi2WZzOGV6y_Ze3a4Q';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/clockwize171/clde8hvrs007n01p5ukgya1ts', // style URL
    // center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9, // starting zoom
});

const bounds = new mapboxgl.LngLatBounds();
locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map);

    // App popup
    new mapboxgl.Popup({
        offset: 30,
    })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map)

    // Extend map bound to include current location
    bounds.extend(loc.coordinates)
})

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
    }
});
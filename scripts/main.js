function run() {

    var map = L.map('mapid').setView([51.505, -0.09], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia3NoYWZmMDMiLCJhIjoiY2poMTZkdm81MDBybjJxcGIxMmI3eHdjcSJ9.ou0XqCZckeVfJ3S03y2hSA', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'your.mapbox.access.token'
    }).addTo(map);

    map.setView([38.8, -98.4842], 8);

    getXml("data/kansas.xml", function(dataString) {
        parseSitesXml(dataString, function (data) {
            showMarkers(map, data);
        })
    });
}


function getXml(url, callback) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(this.responseText);
        }
    };

    xhttp.open("GET", url, true);
    xhttp.send();
}

function parseSitesXml(xmlString, callback) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xmlString,"text/xml");

    let items = xmlDoc.getElementsByTagName("item");
    let locations = [];
    for (element of items) {
        locations.push(parseItem(element));
    }

    callback(locations);
}

function parseItem(xmlNode) {

    let location = xmlNode.getElementsByTagName('georss:point')[0].textContent.split(" ");

    return {
        title: xmlNode.getElementsByTagName('title')[0].textContent,
        link: xmlNode.getElementsByTagName('link')[0].textContent,
        description: xmlNode.getElementsByTagName('description')[0].textContent,
        guid: xmlNode.getElementsByTagName('guid')[0].textContent,
        location: {
            lat: location[0],
            lon: location[1]
        }
    };
}

function showMarkers(map, data) {
    data.forEach(function(location) {
        let marker = L.marker([location.location.lat, location.location.lon]).addTo(map);
        marker.bindPopup(getMarkerContent(location));
    })
}

function getMarkerContent(location) {
    return  "<b>" + location.title + "</b><br>" +
            "<p>" + location.description + "</p><br>" +
            "<a href='" + location.link + "'>" + location.link + "</a>";
}
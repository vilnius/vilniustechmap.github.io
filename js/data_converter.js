function convertDataFromGoogleSpreadsheetsJson(data) {
    var feedEntries = data.feed.entry;
    var features = [];

    function transformEntry(jsonEntry) {
        var currentPropertiesText = jsonEntry['content']['$t'];

        var propsArray = currentPropertiesText.split(", ");
        var props = {};

        for (var i = 0; i < propsArray.length; i++) {
            var propPart = propsArray[i];
            var nameCutIndex = propPart.indexOf(": ");
            var propName = propPart.substring(0, nameCutIndex);
            var propValue = propPart.substring(nameCutIndex + 2);

            props[propName] = propValue;
        }

        if (!props['longitude'] || !props['latitude']) {
            return false;
        }

        props['longitude'] = parseFloat(props['longitude'].replace(",", "."));
        props['latitude'] = parseFloat(props['latitude'].replace(",", "."));

        return {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    props['longitude'],
                    props['latitude']
                ]
            },
            "properties": {
                "title": jsonEntry['title']['$t'],
                "address": props['address'],
                "contactPerson": props['contactperson'],
                "contactPhone": props['contactphone'],
                "contactEmail": props['contactemail'],
                "pictureUrl": props['logolink'],
                "websiteUrl": props['website'],
                "revenues": props['revenues'],
                "color": "blue",
                "icon": "building"
            }
        };
    }

    for (var i = 0; i < feedEntries.length; i++) {
        var geoEntry = transformEntry(feedEntries[i]);
        if (!geoEntry) {
            continue;
        }
        features.push(geoEntry);
    }

    return {
        "type": "FeatureCollection",
        "features": features
    }
}
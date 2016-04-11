function convertDataFromGoogleSpreadsheetsJson(data) {
    var feedEntries = data.feed.entry;
    var features = [];

    function transformEntry(jsonEntry) {
        var currentPropertiesText = jsonEntry['content']['$t'];

        // var propsArray = currentPropertiesText.split(", ");
        var re = /(\w+): (.+?(?=(?:, \w+:|$)))/mgi;
        var propsArray = re.exec(currentPropertiesText)
        var props = {};
        
        while (propsArray != null) {
            
            var propName = propsArray[1];
            var propValue = propsArray[2];

            props[propName] = propValue;
            
            propsArray = re.exec(currentPropertiesText);
        }

        if (!props['longitude'] || !props['latitude']) {
            return null;
        }

        props['longitude'] = parseFloat(props['longitude'].replace(",", "."));
        props['latitude'] = parseFloat(props['latitude'].replace(",", "."));
        
<<<<<<< HEAD
        if (props['website'].search("http") == -1)
		{
		  props['website'] = "http://" + props['website'];	
		}
=======
        if (props['website'].search("http") == -1) {
		  props['website'] = "http://" + props['website'];	
		}
        
        function fixFundingRaised() {
            var number = props['fundingraised'];
            if (!number) {
                number = "0";
            }
            
            if (number.indexOf('-') > 0) {
                number = number.split('-');
                number = number[0].trim()
            }
            
            number = number.replace(/\D/g, '');
            number = number.trim();

            number = parseInt(number);
            
            return number;
        }
        
        function fixEmployeeCount() {
            var number = props['headcount'];
            
            if (!number) {
                number = "0";
            }

            number = number.replace(/\D/g, '');
            number = number.trim();

            number = parseInt(number);
            
            return number;
        }
        
        function fixRevenues() {
            var number = props['revenues'];
            
            if (!number) {
                number = "0";
            }
            if (number.indexOf('-') > 0) {
                number = number.split('-');
                number = number[0].trim()
            }
            number = number.replace(/\D/g, '');
            number = number.trim();
            number = parseInt(number);
            
            return number;
        }
        
        props['fundingraised'] = fixFundingRaised();
        props['headcount'] = fixEmployeeCount();
        props['revenues'] = fixRevenues();
        
>>>>>>> gh-pages

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
                "headcount": props['headcount'],
                "fundingraised": props['fundingraised'],
                "industrycategorytype": props['industrycategorytype'],
                "color": "blue",
                "icon": "building"
            }
        };
    }

    for (var i = 0; i < feedEntries.length; i++) {
        var geoEntry = transformEntry(feedEntries[i]);
        if (!geoEntry) {
            console.warn("Skipping ", feedEntries[i]);
            continue;
        }
        features.push(geoEntry);
    }

    return features;
}

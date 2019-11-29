ymaps.ready(init);

function createBalloonContent(pvzObj) {
	return ['<div class="balloonHeader">',
				'<b>' + pvzObj.brand + ' - ' + pvzObj.index + '</b>',
			'</div>',
			'<div class="balloonBody">',
				'<div class="address">' + pvzObj.address + '</div>',
				'<div class="desc">' + pvzObj.desc + '</div>',
			'</div>',
			'<div class="balloonFooter">',
				'<div class="worktime">' + pvzObj.worktime.join('<br>').replace(new RegExp("открыто: ", "g"), '') + '</div>',
			'</div>',
	].join('\n');
}

function createHintContent(pvzObj) {
	return ['<div class="hintBody">',
				'<div>' + pvzObj.brand + ' - ' + pvzObj.index + ', ' + pvzObj.address + '</div>',
			'</div>'
	].join('\n');
}

function init(){ 

	var indexFrom = 443961;

	var myMap = new ymaps.Map("map", {
		center: [50, 70],
		zoom: 4,
		controls: ['zoomControl', 'searchControl', 'typeSelector',  'fullscreenControl']
	}, {
		searchControlProvider: 'yandex#search'
	}),
	objectManager = new ymaps.ObjectManager({
		clusterize: true,
		clusterBalloonItemContentLayout: ymaps.templateLayoutFactory.createClass('{{ geoObject.properties.balloonContent|raw }}')
	});

	ymaps.option.presetStorage.add('rupost#icon', {iconImageHref:'rp_icon.png', iconImageSize: [32, 32], iconImageOffset: [-16, -16], iconLayout: 'default#image'});

	objectManager.objects.options.set('preset', 'rupost#icon');
	objectManager.clusters.options.set('preset', 'islands#blueClusterIcons');

	myMap.geoObjects.add(objectManager);			

	$.getJSON('pvz.json',function(data){
		var yaCollection = {
			type: "FeatureCollection",
			features: []
		};
		var i = 0;
		$.each(data, function(key,val){
			var pvz = {
				place: val.address['place'],
				street: val.address['street'],
				house: val.address['house'],
				index: val.address['index'],
				brand: val['brand-name'],
				desc: val['getto'],
				worktime: val["work-time"],
				latitude: parseFloat(val["latitude"]),
				longitude: parseFloat(val["longitude"])
			}

			for (let key of Object.keys(pvz)) {
				if (typeof pvz[key] == 'undefined') { pvz[key] = ""; };
			}

			pvz.address = pvz.place + (pvz.street != '' ? ', ' + pvz.street : '') + (pvz.house != '' ? ', ' + pvz.house : '')

			var yaObject = {
				type: "Feature",
				id: i++,
				pvz: pvz,
				geometry: {
					type: "Point",
					coordinates: [pvz.latitude, pvz.longitude]
				},
				properties: {				
					clusterCaption: '<b>' + pvz.brand + ' - ' + pvz.index + '</b>',	
					balloonContent: createBalloonContent(pvz),
					hintContent: createHintContent(pvz)
				}
			};
			yaCollection.features.push(yaObject);
		});				
		objectManager.add(JSON.stringify(yaCollection));
	});		
	
}
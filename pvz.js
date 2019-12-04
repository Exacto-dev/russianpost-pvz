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

function createFilterButton(mapObj, buttonName, filters) {
	var filterButton = new ymaps.control.Button({
		data: {
			content: buttonName
		},
		options: {
			maxWidth: 150
		},
		state: {
			selected: true
		}
	});
	
	filterButton.events.add(['select', 'deselect'], function () {
		filters[buttonName] = filterButton.isSelected();
		objectManager.setFilter(function (obj) {
			return filters[obj.properties.pvz.type];
		});
	});	

	mapObj.controls.add(filterButton, {
		float: "left"
	});		
}

function init(){ 

	const POST_OFFICE = 'Отделения почты';
	const DELIVERY_POINT = 'Пункты выдачи';

	var pvzMap = new ymaps.Map("map", {
		center: [50, 70],
		zoom: 4,
		controls: ['zoomControl', 'searchControl', 'typeSelector',  'fullscreenControl']
	}, {
		searchControlProvider: 'yandex#search'
	});
	
	objectManager = new ymaps.ObjectManager({
		clusterize: true,
		clusterBalloonItemContentLayout: ymaps.templateLayoutFactory.createClass('{{ geoObject.properties.balloonContent|raw }}')
	});

	ymaps.option.presetStorage.add('rupost#icon', {iconImageHref:'rp_icon.png', iconImageSize: [32, 32], iconImageOffset: [-16, -16], iconLayout: 'default#image'});

	objectManager.objects.options.set('preset', 'rupost#icon');
	objectManager.clusters.options.set('preset', 'islands#blueClusterIcons');

	pvzMap.geoObjects.add(objectManager);	

	filters = {[POST_OFFICE]: true, [DELIVERY_POINT]: true};
	createFilterButton(pvzMap, POST_OFFICE, filters);
	createFilterButton(pvzMap, DELIVERY_POINT, filters);

	$.getJSON('pvz.json', function(data){
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

			pvz.address = pvz.place + (pvz.street != '' ? ', ' + pvz.street : '') + (pvz.house != '' ? ', ' + pvz.house : '');
			pvz.type = pvz.brand == 'Почта России' ? POST_OFFICE : DELIVERY_POINT;

			var yaObject = {
				type: "Feature",
				id: i++,
				geometry: {
					type: "Point",
					coordinates: [pvz.latitude, pvz.longitude]
				},
				properties: {	
					pvz: pvz,			
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
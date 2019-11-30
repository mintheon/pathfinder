$(document).ready(function() {
	branchlist(depBranchlist);
	branchlist(drawBranchlist);

	// showClickRoute();
});

// 다음 지도 사용
var map = new L.Map('map', {
	center: new L.LatLng(36.1358642, 128.0785804), //중심점 : 김천 위경도 좌표
	zoom: 0.5,	//Leaflet.KoreanTmsProviders.js : resolutions기준 줌 레벨(Level 12)
	crs: L.Proj.CRS.Daum, //Leaflet.KoreanTmsProviders.js : 새로 정의된 Daum Map CRS
	worldCopyJump: false,  //https://leafletjs.com/reference-1.3.2.html#map-worldcopyjump 참조    
});
var baseLayers = L.tileLayer.koreaProvider('DaumMap.Street').addTo(map);
baseLayers.on("load", function() {console.log("로딩");
})

// 나중에 미국 추가 - 
// OSM 사용
// var map = L.map('map').setView([36.441163, 127.861612], 7);
// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
// 	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);


var tbody;
var orgBColor = '#ffffff';
var route = new Array();
var branchObject = new Object;
var branchObjectDataArray = new Array();
var totalprice = 0;
var routecnt = 0;
var trs = null;
var selectRouteCnt = 0;
arr = new Array;
var selectRouteStr;

/* Map Data */
/* Route Plan 초기화 */
var mapPlan = L.Routing.plan({
	routeWhileDragging : false,
	draggableWaypoints : false
});

// var greenIcon = new L.Icon({
// iconUrl: '/static/css/test.png',
// shadowUrl:
// 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
// iconSize: [100, 100],
// iconAnchor: [12, 41],
// popupAnchor: [1, -34],
// shadowSize: [41, 41]
// });

// var greenIcon = new L.Icon({
// 	iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
// 	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
// 	iconSize: [25, 41],
// 	iconAnchor: [12, 41],
// 	popupAnchor: [1, -34],
// 	shadowSize: [41, 41]
// });

// var blueIcon = new L.Icon({
// 	  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
// 	  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
// 	  iconSize: [25, 41],
// 	  iconAnchor: [12, 41],
// 	  popupAnchor: [1, -34],
// 	  shadowSize: [41, 41]
// 	});

// var redIcon = new L.Icon({
// 	  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
// 	  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
// 	  iconSize: [25, 41],
// 	  iconAnchor: [12, 41],
// 	  popupAnchor: [1, -34],
// 	  shadowSize: [41, 41]
// 	});


/* Route Control 초기화 */
var mapControl = L.Routing.control({
	draggableWaypoints: false,
	addWaypoints:false,
	  createMarker: function(i, wp, nWps) {
		    if (i === 0) {
		      // here change the starting and ending icons
		      return L.marker(wp.latLng, {
		        icon: greenIcon // here pass the custom marker icon instance
		      }).bindPopup("<b>출발</b>").openPopup();
		    }else if( i === nWps - 1){
			      // here change the starting and ending icons
			      return L.marker(wp.latLng, {
			        icon: redIcon // here pass the custom marker icon instance
			      }).bindPopup("<b>도착</b>").openPopup();
		    } else {
		      // here change all the others
		      return L.marker(wp.latLng, {
		        icon: blueIcon
		      }).bindPopup("<b>asdasd</b>").openPopup();
		    }
	  }
});
	
var marker = new Array(); // 지도에 출력할 Marker 정보 배열
var latLngInfo = new Array(); // 최종경로 출력 전 기존 경로 데이터 배열
var removeMarker;
var removeInfo;
var prev_size = 0;	
var bool_routed = false;

var testarr = new Array();

// tr누르면 밑에 테이블어 show해주는거
function showClickRoute(){
	$("#allDataTable tr").click(
			function() {
				selectRouteStr = "";
				selectRouteCnt = 0;

				// 현재 클릭된 Row(<tr>)
				var tr = $(this);
				var td = tr.children();
				
				var branch_name = td.eq(0).text().trim();
				var branch_value = td.eq(1).text().trim();
				var branch_lat = td.eq(2).text().trim();
				var branch_lng = td.eq(3).text().trim();
				if (arr.indexOf(branch_name) == -1) {
					testarr.push(tr);
					arr.push(branch_name);
					if (arr.length > 0) {
						routecnt++;
						$.each(arr, function(i) {
							selectRouteCnt++;
							if (selectRouteCnt == 1)
								selectRouteStr += '<tr onClick="cancelRoute(this)">' + 
									'<td>' + '출발지' + '</td>' +
									'<td>' + (i + 1) + '</td>' + 
									'<td>' + arr[i] + '</td>' + 
									'</tr>';
							else
								selectRouteStr += '<tr onClick="cancelRoute(this)">' + 
								'<td>' + '경유지' + '</td>' + 
								'<td>' + (i + 1) + '</td>' + 
								'<td>' + arr[i] + '</td>' +
								'</tr>';
						});
					}
				} else {
					routecnt--;
// testarr.splice(tr);
					arr.splice(arr.indexOf(branch_name), 1);
					$.each(arr, function(i) {
						selectRouteCnt++;
						if (selectRouteCnt == 1)
							selectRouteStr += '<tr onClick="cancelRoute(this)">' + 
								'<td>' + '출발지' + '</td>' +
								'<td>' + (i + 1) + '</td>' + 
								'<td>' + arr[i] + '</td>' + 
								'</tr>';
						else
							selectRouteStr += '<tr onClick="cancelRoute(this)">' + 
							'<td>' + '경유지' + '</td>' + 
							'<td>' + (i + 1) + '</td>' + 
							'<td>' + arr[i] + '</td>' +
							'</tr>';
					});
				}
				$("#selectRoute").html(selectRouteStr);
			});
}

// 색깔 바꾸기, 마크 찍기
function HighLightTR(target, backColor) {
	tbody = target.parentNode;
	trs = tbody.getElementsByTagName('tr');
	/* 기존 경로결과를 초기화하고 남아있던 Marker 출력. */
	if (bool_routed){
		bool_routed = false;
		
		/* 기존에 존재하던 Waypoints들 수 만큼 mapPlan에서 제거. */
		mapPlan.spliceWaypoints(0, prev_size,
				mapPlan.getWaypoints());
		
		/* 경로 초기화 */
		mapControl.setWaypoints(mapPlan.getWaypoints());
		mapControl.addTo(map);

		/* Marker 배열 초기화 */
		marker.length = 0;
		
		/* 기존에 남은 경로 출력 */
		for (var i = 0; i < latLngInfo.length; i++) {
			if(i === 0)
				marker.push(L.marker(latLngInfo[i]).addTo(map).bindPopup("<b>"+branchObjectDataArray[i].branch_name+"</b><br>1비용 - "+branchObjectDataArray[i].branch_value).openPopup());

			else if(i === latLngInfo.length -1)
				marker.push(L.marker(latLngInfo[i]).addTo(map).bindPopup("<b>"+branchObjectDataArray[i].branch_name+"</b><br>2비용 - "+branchObjectDataArray[i].branch_value).openPopup());
			
			else
				marker.push(L.marker(latLngInfo[i]).addTo(map).bindPopup("<b>"+branchObjectDataArray[i].branch_name+"</b><br>3비용 - "+branchObjectDataArray[i].branch_value).openPopup());

		}
	}
	
	for (var i = 0; i < trs.length; i++) {
		// 녹색을 클릭
		if (trs[i].style.backgroundColor == 'rgb(45, 180, 0)'
				&& trs[i] == target) {
			
			trs[i].style.backgroundColor = orgBColor;
			route = route.splice(1, route.length);
			branchObjectDataArray = branchObjectDataArray.splice(1, branchObjectDataArray.length);
			/* 삭제될 마커 정보 저장. */
			removeMarker = marker;
			/* removeInfo = latLngInfo; */
			
			if(marker.length === 1){
				/* Marker 배열은 삭제된 배열을 제거하고 남은 배열 저장. */
				marker = marker.splice(1, marker.length);

				latLngInfo = latLngInfo.splice(1, latLngInfo.length);

				/* 지도에서 Merker 제거. */
				map.removeLayer(removeMarker[0]);
			} else{
				marker = marker.splice(2, marker.length);	
				latLngInfo = latLngInfo.splice(1, latLngInfo.length);
				
				map.removeLayer(removeMarker[0]);
				map.removeLayer(removeMarker[1]);
				marker.unshift(L.marker(latLngInfo[0],{icon: greenIcon}).addTo(map).bindPopup("<b>출발!!!!</b>").openPopup());
			}

			if (route.length != 0)
				route[0].style.backgroundColor = 'rgb(45, 180, 0)';
				continue;
		}

		// 첫번째 클릭.
		if (route.length == 0 && trs[i] == target) {
			trs[i].style.backgroundColor = 'rgb(45, 180, 0)';
			route.push(target);
			branchObject = new Object;
			branchObject.branch_name = target.childNodes[0].innerHTML.trim();
			branchObject.branch_value = target.childNodes[1].innerHTML.trim();
			branchObject.branch_lat = target.childNodes[2].innerHTML.trim();
			branchObject.branch_lng = target.childNodes[3].innerHTML.trim();
			branchObjectDataArray.push(branchObject);
			
			if(latLngInfo.length === 0){
				/* 위경도정보추가 */
				latLngInfo.push([branchObject.branch_lat, branchObject.branch_lng]);
				/* 마커추가 */	
				marker.push(L.marker([branchObject.branch_lat, branchObject.branch_lng],{ icon: greenIcon}).addTo(map).bindPopup("<b>출발</b>").openPopup());	
			}
// marker.push(L.marker([branchObject.branch_lat,
// branchObject.branch_lng]).addTo(map).bindPopup("<b>"+branchObject.branch_name+"</b><br>비용
// - "+branchObject.branch_value).openPopup());
			continue;
		}

		// 나머지 클릭
		if (trs[i] == target) {
			if (trs[i].style.backgroundColor == backColor) {
				trs[i].style.backgroundColor = orgBColor;
				// 0 1 2 3 4 5 6에서 slice(1,4)하면 1 2 3 출력
				// var a = route = route.splice(1, route.length);
				var index = 0;
				route.forEach(function(item) {
					if (item.childNodes[0].innerHTML.trim() === target.childNodes[0].innerHTML.trim()) {
						var t1 = new Array();
						t1 = route.splice(index, 1);
						t1 = branchObjectDataArray.splice(index, 1);
						
						/* 제거할 마커 정보 Splice */
						removeMarker = marker.splice(index, 1);
						latLngInfo.splice(index, 1);

						/* 해당 마커를 Map에서 제거 */
						map.removeLayer(removeMarker[0]);
					}
					index++;
				});
			} else {
				trs[i].style.backgroundColor = backColor;

				branchObject = new Object();
				branchObject.branch_name = target.childNodes[0].innerHTML.trim();
				branchObject.branch_value = target.childNodes[1].innerHTML.trim();
				branchObject.branch_lat = target.childNodes[2].innerHTML.trim();
				branchObject.branch_lng = target.childNodes[3].innerHTML.trim();
				branchObjectDataArray.push(branchObject);
				route.push(target);
				
				/* 위경도정보추가 */
				latLngInfo.push([branchObject.branch_lat, branchObject.branch_lng]);
				/* Marker 추가 */
				marker.push(L.marker([branchObject.branch_lat, branchObject.branch_lng]).addTo(map).bindPopup("<b>"+branchObject.branch_name+"</b><br>비용 - "+branchObject.branch_value).openPopup());
			}
		}
	} // endfor i
}

// data : encodeURI(JSON.stringify(data)),

// 전송 버튼 누르면 경로 출력
$(function() {
	/* 지도 출력 함수 */
	function drawMap(mapInfoData) {
		bool_routed = true;
		
		/* 이전 맵에 미리 클릭된 마커를 모두 제거. */
		for(var i = 0; i < marker.length; i++) {
			map.removeLayer(marker[i]);
		}
		
		/* 기존에 존재하던 Waypoints들 수 만큼 mapPlan에서 제거. */
		mapPlan.spliceWaypoints(0, prev_size,
				mapPlan.getWaypoints());
			
		/* mapPlan에 새로운 경로 추가. */
		mapPlan.setWaypoints(mapInfoData);


		/* Controller에 mapPlan 등록. */
		test = mapControl.setWaypoints(mapPlan.getWaypoints());
		
		/* 이전에 탐색한 WayPoints 길이를 저장 */
		prev_size = mapPlan.getWaypoints().length;
		
		/* map에 출력. */
		mapControl.addTo(map);
		
		return test;
	}
	
	//! 전송버튼 클릭
	$("#submitroute").click(
		function() {
			if (routecnt <= 0) {
				alert("출발지와 목적지를 포함한 경로가 세개 이상이어야 합니다.");
			} else if (routecnt > 100) {
				alert("경유지가 너무 MP염");
			} else {
// <img src="/static/css/flag.png" width="30px" height="30px"/>
// <img src="/static/css/circle.png" width="15px" height="15px"/>
// <img src="/static/css/line.png" width="30px" height="30px"/>
// <img src="/static/css/circle.png" width="15px" height="15px"/>
// <img src="/static/css/home.png" width="30px" height="30px"/>
				var str = "";
				var intersectionalStr = "";
				$.ajax({
					url : "/maproute/maproutesend",
					type : 'post',
					data : JSON.stringify({
						"data" : branchObjectDataArray
					}),
					contentType : "application/json; charset=UTF-8",
					async: false,

					success : function(branchObjectDataArray) {
						var mapInfoData = [];
						console.log("branchObjectDataArray - ", branchObjectDataArray);
						if (branchObjectDataArray.length > 0) {
							$.each(branchObjectDataArray, function(i, s) {
								/*
								 * data[i].branch_value data[i].branch_lat
								 * data[i].branch_lng data[i].priceBetweenAandB
								 */
								mapInfoData.push (L.latLng(branchObjectDataArray[i].branch_lat, branchObjectDataArray[i].branch_lng));
							});
						}
						
						new Promise(function(resolve, reject) {
							resolve(drawMap(mapInfoData));
							
						}).then((result) => {
							test.on('routesfound', function (e) {
								var totalDistance = 0;
								var intersectionalDistance = 0;
								var intersectionalDistanceArr = new Array;
								
								var intersectionalTime =0;
								var intersectionalTimeArr = new Array;
								var j = 0;
								var BetweenAandBArr = new Array;
								for(var i = 0; i < branchObjectDataArray.length; i++){
									BetweenAandBArr[i] = branchObjectDataArray[i].priceBetweenAandB;
								}
								
								for(var i = 0; i < e.routes[0].instructions.length; i++){
									if(e.routes[0].instructions[i].type == 'DestinationReached'){
										intersectionalDistanceArr[j] = (intersectionalDistance/1000).toFixed(1);
										intersectionalTimeArr[j] = (intersectionalTime).toFixed(1);
										intersectionalTime = 0;
										intersectionalDistance = 0;
									}
									
									else if(e.routes[0].instructions[i].type == 'WaypointReached'){
										intersectionalDistanceArr[j] = (intersectionalDistance/1000).toFixed(1);
										intersectionalTimeArr[j] = (intersectionalTime).toFixed(1);
										intersectionalTime = 0;
										intersectionalDistance = 0;
										j++;
									}
									else{
										intersectionalDistance += e.routes[0].instructions[i].distance;
										intersectionalTime += e.routes[0].instructions[i].time;
									}
								}

								
								for(var i = 0; i < intersectionalDistanceArr.length; i++){
									totalDistance += Number(intersectionalDistanceArr[i]);
								}
								var time = 0;
								var hArr = new Array();
								var mArr = new Array();
								var sArr = new Array();
								
								var sumHArr = new Array();
								var sumMArr = new Array();
								var sumSArr = new Array();
								var testArray = new Array();
								//각각 시간 어레이에 저장
								  for (var i = 0; i < intersectionalTimeArr.length; i++){
									    time += parseInt(intersectionalTimeArr[i]);
									    mArr[i] = parseInt(intersectionalTimeArr[i]/60);
									    hArr[i] = parseInt(mArr[i]/60);
									    sArr[i] = parseInt(intersectionalTimeArr[i]%60);
									    mArr[i] = parseInt(mArr[i]%60);
								  }
								  //누적 시간  어레이에 넣기
								  for(var i = 0; i < intersectionalTimeArr.length; i++){
									  testArray[i]=0;
									  for(var j = 0; j < i+1; j++){
										  testArray[i] += parseInt(intersectionalTimeArr[j]);
									  }
								  }
								  //누적시간 어레이를 계산
								  for (var i = 0; i < intersectionalTimeArr.length; i++){
									    sumMArr[i] = parseInt(testArray[i]/60);
									    sumHArr[i] = parseInt(sumMArr[i]/60);
									    sumSArr[i] = parseInt(testArray[i]%60);
									    sumMArr[i] = parseInt(sumMArr[i]%60);
								  }
								  console.log("testArray - ", testArray);
								  console.log("sumHArr - ", sumHArr);
								  console.log("sumMArr - ", sumMArr);
								  console.log("sumSArr - ", sumSArr);
								  
							    var m = time/60;
							    var h = parseInt(m/60);
							    var s = parseInt(time%60);
							    var m = parseInt(m%60);
							    
							for(var i = 0; i < branchObjectDataArray.length; i++){
								if(i === branchObjectDataArray.length -1){
									console.log(branchObjectDataArray[i]);
								} else{
									intersectionalStr += "<div class=\"col-1 col-sm-6 col-md-2 col-lg-24\" style=\"padding-right: 0px; padding-left: 0px;\">"
									intersectionalStr +="<div class=\'container-fluid\' style=\"padding-right: 0px; padding-left: 0px;\">";
									intersectionalStr +="<ul class=\'htimeline\'>";
									intersectionalStr +="<li data-date='"+sumHArr[i]+":"+sumMArr[i]+":"+sumSArr[i]+"' class='step col-sm-12 orange'>";
									intersectionalStr +="<div>"+branchObjectDataArray[i].branch_name+"</div>";
									intersectionalStr +="<div class='tasks container-fluid'>";
									intersectionalStr +="<div class='resource' data-name='a와b비용'>";
									intersectionalStr +="<div class='task col-sm-8' style='text-align:right'>"+BetweenAandBArr[i]+"</div>";	
									intersectionalStr +="</div>";	
									intersectionalStr +="<div class='resource' data-name='a와b거리'>";
									intersectionalStr +="<div class='task col-sm-8 col-sm-offset-6' style='text-align:right'>"+intersectionalDistanceArr[i]+"</div>";	
									intersectionalStr +="</div>"
									intersectionalStr +="<div class='resource' data-name='a와b시간'>";
									intersectionalStr +="<div class='task col-sm-8' style='text-align:right'>"+hArr[i]+":"+mArr[i]+":"+sArr[i]+"</div>";	
									intersectionalStr +="</div>";	
									intersectionalStr +="</div></li></ul></div></div>";	
								}
							}
							    str += "<br/>총 걸리는 시간 : " + h + "시간 " + m + "분 " + s +"초 <br/> 총 거리 : " + (totalDistance).toFixed(1) +"Km";
							    $("#finalPathDiv").html(str);
							    $("#box").html(intersectionalStr);
							});
						})
					},
					
					error : function(jqXHR, textStatus, errorThrown) {
						alert("에러 발생~~ \n" + textStatus + " : "
								+ errorThrown);
				}
			});
		}
	})
})

// 맵을 클릭할 때마다 포인트를 add해주는 ajax를 만들어야함.

/*
 * testarr.forEach(function(element){ console.log(element); });
 * 
 * for(var i = 0; i < testarr.length; ++i){ console.log('하이염');
 * console.log(testarr[i].branch_lat); console.log(testarr[i].branch_lng); }
 */



function cancelRoute(target) {
	for (var i = 0; i < branchObjectDataArray.length; i++) {
		if (target.childNodes[2].innerHTML === branchObjectDataArray[i].branch_name) {
			var ttt = branchObjectDataArray[i].branch_name;
		}
	}
	for (var i = 0; i < trs.length; i++) {
		if(i == 0)
			continue;
		
		if (ttt == trs[i].getElementsByTagName('td')[0].innerHTML){
			HighLightTR(trs[i], 'rgb(201, 204, 153)');
			
				selectRouteStr = "";
				selectRouteCnt = 0;

				routecnt--;
				arr.splice(arr.indexOf(ttt), 1);
				$.each(arr, function(ii) {
					selectRouteCnt++;
					if (selectRouteCnt == 1)
						selectRouteStr += '<tr onClick="cancelRoute(this)">' + 
							'<td>' + '출발지' + '</td>' +
							'<td>' + (ii + 1) + '</td>' + 
							'<td>' + arr[ii] + '</td>' + 
							'</tr>';
					else
						selectRouteStr += '<tr onClick="cancelRoute(this)">' + 
						'<td>' + '경유지' + '</td>' + 
						'<td>' + (ii + 1) + '</td>' + 
						'<td>' + arr[ii] + '</td>' +
						'</tr>';
				});
			$("#selectRoute").html(selectRouteStr);

		}
	}
}

// 검색버튼
$('#btnSearch').click(function(e){
	e.preventDefault();
	var url = "";    
	url = url + "?searchType=branchName";
	url = url + "&keyword=" + $('#keyword').val();
	branchsearch(url);
});

// 검색뷰
function branchsearch(searchUrl, searchpage) {
	$.ajax({
		type : "GET",
		url : "/maproute/search" + searchUrl +"&page=" + 0 ,
		contentType : 'application/json',
		async: false,
		success : function(res) {
			var str = '<tr onclick=\"event.cancelBubble=true\">';
				str += '<th onclick=\"event.cancelBubble=true\"';
				str += 'style=\"background-color: #fafafa; text-align: center;\">branch_name(지역이름)</th>';
				str += '<th onclick=\"event.cancelBubble=true\" style=\"display: none\">branch_value(교통비)</th>';
				str += '<th onclick=\"event.cancelBubble=true\" style=\"display: none\">branch_lat(위도)</th>';
				str += '<th onclick=\"event.cancelBubble=true\" style=\"display: none\">branch_lng(경도)</th>';
			$.each(res.data, function(key, value) {
				str += '<tr id="' + key + '" onClick=\"HighLightTR(this, \'rgb(201, 204, 153)\');\">';
				str += '<td class=\"test\">'+ value.branchName+ '</td>';
				str += '<td style=\"display: none\"> '+ value.branchValue+ '</td>';
				str += '<td style=\"display: none\">'+ value.branchLat+ '</td>';
				str += '<td style=\"display: none\">'+ value.branchLng+ '</td>';
				str += '</tr>'
			});
			$("#allDataTable").html(str);
			if(trs !== null){
				for(var i = 0; i < trs.length; ++i){
					if (arr.includes(trs[i].childNodes[0].innerHTML.trim())) {
						var index = arr.indexOf(trs[i].childNodes[0].innerHTML.trim());
						if(index == 0){
							trs[i].style.backgroundColor = 'rgb(45, 180, 0)';
						}
						else{
							trs[i].style.backgroundColor =  'rgb(201, 204, 153)';
						}
						
					}
// console.log("arr - ",arr);
// console.log("trs[i].childNodes.innerHTML[0] - ", );
// console.log("res.data - ",res.data);
// console.log("trs - ",trs);
				}
			}
			showClickRoute();
		}
	})
}

function branchlist(handleFunc) {
	$.ajax({
		url : "/maproute/branchLoding",
		type: "get",
		success : function(res) {
			handleFunc(res)
		}
	})
}

function carlist(handleFunc, areaIndex) {

	console.log("#areaIndex",areaIndex);
	
	$.ajax({
		url : "/maproute/carLoading",
		data: {areaIndex},
		type: "get",
		success : function(res) {
			handleFunc(res)
		}
	})
}

// 출발지 선택 Draw
function depBranchlist(res) {
	res = res.data;

	let branchData = $.map(res, function (obj) {
		
		obj.id = obj.id || obj.branchIndex;
		obj.text = obj.text || obj.branchName;

		return obj;
	})
	

	$('#depSelect').select2({
		width: '100%',
		placeholder: '출발지 선택',
		data: branchData,
		// 이전달 다음달 변경 시
		viewChange: function (view, y, m) {
			console.log(view, y, m)
	}
	});
}

// 차량 선택 Draw
function depCarlist(res) {
	res = res.data;

	let carData = $.map(res, function (obj) {
		
		obj.id = obj.id || obj.carIndex;
		obj.text = obj.text || obj.carName;

		return obj;
	})
	

	$('#carSelect').select2({
		width: '100%',
		placeholder: '차량 선택',
		data: carData,
		// 이전달 다음달 변경 시
		viewChange: function (view, y, m) {
			console.log(view, y, m)
	}
	});
}

// 경유지 선택 Draw
function drawBranchlist(res) {
	let str = "";
			
			$.each(res.data, function(key, value) {
				str += "<tr class='tr-shadow'>"
				str += `<td id="${value.branchIndex}" class="">${value.branchName}</td>`
				str += `<td style="display: none">${value.branchLat}</td>`
				str += `<td style="display: none">${value.branchLng}</td>`
				str += "</td>"
				// str += '<td id="' + key + '" onClick=\"HighLightTR(this, \'rgb(201, 204, 153)\');\">';
			});
			
			$("#allDataTable").html(str);
}

$("#depSelect").on('select2:select', function(e) {
	let selectData = e.params.data;

	carlist(depCarlist, selectData.areaIndex);
})

// 캘린더 띄움 (차량선택 화면에서 다음 버튼 클릭)
$('#nextCarButton').click(function () {
	let todayDate = moment().format('YYYY[-]MM[-]DD');
	
	$('.calendar').calendar({
		width: $('#headingDate').width(),
		height: 280,
	date:new Date(),
	format:'yyyy-MM-dd',
	startWeek: 0,
	selectedRang:[moment(), moment().add(3, 'M')],
	weekArray: ['일','월','화','수','목','금','토'],
	monthArray: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
	onSelected: function (view, date, data) {
		$('#selectDate').html(moment(date).format('YYYY-MM-DD'))
	},
	});
})
$(document).ready(() => {
  $(".scrollbar-outer").scrollbar();
  branchlist(depBranchlist);
});

$("#testButton").on("click", e => {
  $("#depSelect")
    .val("652")
    .trigger("change");
});

// 다음 지도 사용
// var map = new L.Map("map", {
//   center: new L.LatLng(36.1358642, 128.0785804), //중심점 : 김천 위경도 좌표
//   zoom: 0.5, //Leaflet.KoreanTmsProviders.js : resolutions기준 줌 레벨(Level 12)
//   crs: L.Proj.CRS.Daum, //Leaflet.KoreanTmsProviders.js : 새로 정의된 Daum Map CRS
//   worldCopyJump: false //https://leafletjs.com/reference-1.3.2.html#map-worldcopyjump 참조
// });
// var baseLayers = L.tileLayer.koreaProvider("DaumMap.Street").addTo(map);
// baseLayers.on("load", function() {
//   console.log("맵 로딩");
// });

// 나중에 미국 추가 -
// OSM 사용
let map = L.map("map").setView([36.441163, 127.861612], 7);

L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var routeControl = L.Routing.control({
  serviceUrl: "http://218.39.221.89:5000/route/v1",
  routeWhileDragging: false,
  draggableWaypoints: false,
  createMarker: () => {
    return null;
  }
})
  .on("routesfound", e => {
    let routes = e.routes[0];

    carculateData(routes)
      .then(result => drawTimeline(result))
      .catch(error => {
        alert(error);
      });
  })
  // .on("routingstart", showSpinner)
  // .on("routesfound routingerror", hideSpinner)
  .addTo(map);

//히스토리에 등록할 sortList
let sortList;
let routeList;

const branchlist = handleFunc => {
  $.ajax({
    url: "/maproute/branchLoding",
    type: "get"
  }).then(res => {
    handleFunc(res);
  });
};

// 차량 선택 Draw
const carlist = (handleFunc, areaIndex) => {
  $.ajax({
    url: "/maproute/carLoading",
    data: { areaIndex },
    type: "get"
  }).then(res => {
    handleFunc(res);
  });
};

// 출발지 선택 Draw
const depBranchlist = res => {
  res = res.data;

  let branchData = $.map(res, obj => {
    obj.id = obj.id || obj.branchIndex;
    obj.text = obj.text || obj.branchName;

    return obj;
  });

  $("#depSelect").select2({
    width: "100%",
    placeholder: "출발지 선택",
    data: branchData,
    sorter: data => data.sort((a, b) => a.text.localeCompare(b.text))
  });
};

// 출발지 선택시 Event
$("#depSelect").on("select2:select", e => {
  let selectData = e.params.data;

  markerGroup.clearLayers();
  markerAdd(selectData);

  carlist(depCarlist, selectData.areaIndex);

  $("#branchSelect").empty();
});

// 차량 선택 Draw
const depCarlist = res => {
  res = res.data;

  let carData = $.map(res, obj => {
    obj.id = obj.id || obj.carIndex;
    obj.text = obj.text || `${obj.carName}톤트럭 (${obj.carNumber})`;

    return obj;
  });

  $("#carSelect").empty();
  $("#carSelect").html("<option></option>");

  $("#carSelect").select2({
    width: "100%",
    placeholder: "차량 선택",
    data: carData,
    sorter: data => data.sort((a, b) => a.text.localeCompare(b.text)) // 앞에 숫자로 정렬되게 해야함.
  });
};

// 차량 선택시 Event
$("#carSelect").on("select2:select", e => {
  let selectData = e.params.data;

  $.ajax({
    url: "/maproute/getReserve.do",
    data: { carIndex: selectData.carIndex },
    type: "get"
  }).then(res => {
    loadCalendar(res);
  });
});

// 경유지 선택 Draw
const selectBranchlist = res => {
  let dep = $("#depSelect").val();
  res = res.data;

  let branchData = res
    .filter(obj => {
      return obj.branchIndex != dep;
    })
    .map(obj => {
      obj.id = obj.id || obj.branchIndex;
      obj.text = obj.text || obj.branchName;

      return obj;
    });

  $("#branchSelect").select2({
    width: "100%",
    placeholder: "경유지 선택",
    data: branchData,
    maximumSelectionLength: 19,
    sorter: data => data.sort((a, b) => a.text.localeCompare(b.text))
  });
};

// 경유지 선택시 Event
$("#branchSelect").on("select2:select", e => {
  let selectData = e.params.data;

  markerAdd(selectData);
});

// 경유지 삭제시 Event
$("#branchSelect").on("select2:unselect", e => {
  let selectData = e.params.data;

  markerRemove(selectData);
});

//! 마커 그룹
let markerGroup = L.layerGroup().addTo(map);

// 마커 추가
const markerAdd = selectData => {
  let marker = L.marker([selectData.branchLat, selectData.branchLng]);
  marker.id = selectData.branchIndex;
  marker.name = selectData.branchName;
  marker.cost = selectData.branchValue;

  marker
    .addTo(markerGroup)
    .bindPopup(selectData.branchName)
    .openPopup();
};

// 경로 그리기
const drawRoute = () => {
  let wayPoints = sortList.map(branch => {
    return L.Routing.waypoint(
      L.latLng(branch.branchLat, branch.branchLng),
      branch.branchName
    );
  });

  return routeControl.setWaypoints(wayPoints);
};

const markerRemove = selectData => {
  markerGroup.eachLayer(layer => {
    layer.id === selectData.branchIndex ? markerGroup.removeLayer(layer) : "";
  });
};

//! 이벤트 객체 부분
// 다음버튼 누를 경우에
// Lambda의 bind 형식때문에 function으로 사용
$(".next").click(function(e) {
  e.preventDefault();

  var sectionValid = true;
  var collapse = $(this).closest(".collapse");

  $.each(collapse.find("input, select, textarea"), function() {
    if (!$(this).valid()) {
      //? valid 주석해놓음 (테스트 불편)
      sectionValid = false;
    }
  });

  if (sectionValid) {
    collapse
      .parents(".card")
      .next()
      .find(".collapse")
      .collapse("toggle");
  }
});

$("#resultPrev").click(e => {
  e.preventDefault();

  routeControl.getPlan().setWaypoints([]);
});

$("#resultButton").click(e => {
  mapSort();
});

// sort 요청
const mapSort = () => {
  let markerList = [];

  markerGroup.eachLayer(layer => {
    markerList.push({
      branchIndex: layer.id,
      branchName: layer.name,
      branchLat: layer.getLatLng().lat,
      branchLng: layer.getLatLng().lng,
      branchValue: layer.cost
    });
  });

  requestSort(markerList);
};

// request sort 통신 소스
const requestSort = markerList => {
  $.ajax({
    url: "/maproute/mapsort",
    type: "post",
    contentType: "application/json",
    data: JSON.stringify(markerList)
  })
    .then(res => {
      sortList = $.extend(true, [], res.data);
      console.log("#소팅 완료 sortList", sortList);

      return drawRoute();
    })
    .catch(error => {
      alert("#error : ", error);
    });
};

// reduce로 변경 요망
// 현재 쓰레기 코드임. 시간 남으면 리팩토링 필수.
const carculateData = lrmData => {
  return new Promise((resolve, reject) => {
    let routeInfo = {};
    let fee = 0;

    let routes = [];
    let rdist = 0,
      rtime = 0,
      index = 1;

    lrmData.instructions.forEach(item => {
      rdist += item.distance;
      rtime += item.time;

      if (
        item.type === "WaypointReached" ||
        item.type === "DestinationReached"
      ) {
        rdist /= 1000;
        routes.push({
          rdist: rdist.toFixed(3),
          rtime: rtime,
          rdep: sortList[index - 1].branchName,
          rarvl: sortList[index].branchName,
          rfee: sortList[index - 1].routeCost
        });

        fee += sortList[index - 1].routeCost;
        rdist = 0;
        rtime = 0;
        index++;
      }
    });

    let dlvrdate = moment(
      $("#dateSelect").val() + " 09:00:00",
      "YYYY-MM-DD HH:mm:ss"
    ).format("YYYY-MM-DD HH:mm:ss");

    let arrivedate = moment(dlvrdate, "YYYY-MM-DD HH:mm:ss")
      .add(lrmData.summary.totalTime.toFixed(0), "s")
      .format("YYYY-MM-DD HH:mm:ss");

    routeInfo.carIndex = $("#carSelect").val();
    routeInfo.dlvrdate = dlvrdate;
    routeInfo.arrivedate = arrivedate;
    routeInfo.dist = (lrmData.summary.totalDistance / 1000.0).toFixed(3);
    routeInfo.time = lrmData.summary.totalTime.toFixed(0);
    routeInfo.fee = fee;
    routeInfo.dep = routes[0].rdep;
    routeInfo.arvl = routes[routes.length - 1].rarvl;
    routeInfo.routes = $.extend(true, [], routes);

    resolve(routeInfo);
  });
};

// 타임라인 그리기
const drawTimeline = routeInfo => {
  routeList = $.extend(true, {}, routeInfo);
  console.log("#routeInfo", routeList);

  let sumTime = 0;

  let str = "<ul>";
  $.each(routeInfo.routes, function(key, value) {
    str += "<li><span></span>";
    str += "<div>";
    str += `<div class="title">${value.rdep} → ${value.rarvl}</div>`;
    str += `<div class="info">${value.rdist}km</div>`;
    str += `<div class="type">${value.rfee}원</div>`;
    str += "</div>";

    str += "<span class='number'>";
    str += `<span>${sumTime.toHHMMSS()}</span>`;

    sumTime += value.rtime;
    str += `<span>${sumTime.toHHMMSS()}</span></span>`;
    str += "</li>";
  });

  str += "</ul>";

  $(".tmline").html(str);
};

const loadCalendar = res => {
  $("#calendarBox").html("<div id='calendar'></div>");
  $("#dateSelect").val("");

  let calendarSize = $("#headingDate").width();
  let disableList = res.data;

  $("#calendar").calendar({
    width: calendarSize,
    height: calendarSize * 0.8,
    date: new Date(),
    format: "yyyy-MM-dd",
    startWeek: 0,
    selectedRang: [moment().add(1, "D"), moment().add(3, "M")],
    disableDay: disableList,
    weekArray: ["일", "월", "화", "수", "목", "금", "토"],
    monthArray: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월"
    ],
    onSelected: (view, date, data) => {
      $("#dateSelect").val(moment(date).format("YYYY-MM-DD"));
    }
  });
};

$("#routeForm").validate({
  onkeyup: false,
  // ignore: "",
  // errorClass: "is-invalid",
  rules: {
    depSelect: {
      required: true
    },
    carSelect: {
      required: true
    },
    dateSelect: {
      required: true
    },
    branchSelect: {
      required: true
    }
  },
  messages: {
    depSelect: {
      required: "출발지를 선택해주세요."
    },
    carSelect: {
      required: "차량을 선택해주세요."
    },
    dateSelect: {
      required: "날짜를 선택해주세요."
    },
    branchSelect: {
      required: "지점을 선택해주세요."
    }
  },

  // 에러 위치 조정
  errorPlacement: (error, element) => {
    if (element.is(":radio") || element.is("select") || element.is("input")) {
      error.appendTo(element.parents(".card-body"));
    } else {
      error.insertAfter(element);
    }
  },

  // valid 실패시
  invalidHandler: (form, validator) => {
    var errors = validator.numberOfInvalids();

    if (errors) {
      alert(validator.errorList[0].message);
      validator.errorList[0].element.focus();
    }
  },

  // valid 성공시
  submitHandler: form => {
    insertPlan(routeList);
  }
});

// 회원 생성
function insertPlan(req) {
  $.ajax({
    url: "/maproute/insertPlan.do",
    type: "post",
    contentType: "application/json",
    // 이름 : routeList
    data: JSON.stringify(req)
  }).then(res => {
    let text = res.data;

    alert(text);
    location.reload();
  });
}

Number.prototype.toHHMMSS = function() {
  var sec_num = Math.floor(this / 1);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours + ":" + minutes + ":" + seconds;
};

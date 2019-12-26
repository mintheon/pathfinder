// 첫 시작
$(document).ready(function() {
  treeLoading();
});

// 검색 enter press
function searchEnter() {
  if (window.event.keyCode == 13) {
    searchClick();
  }
}
// 검색버튼
function searchClick() {
  userLoading();
  $("#keyword").val("");
}

// 페이지 버튼 생성
function pageButton(totalPages, currentPage) {
  $("#page").paging({
    nowPage: currentPage + 1,
    pageNum: totalPages,
    buttonNum: 12,
    callback: function(page) {
      sessionStorage.setItem("page", page - 1);

      userLoading();
    }
  });
}
function resetvalid(formName) {
  $(formName)[0].reset();
  var length = $(formName)[0].length;
  var sclass = null;
  for (var i = 0; i < length; i++) {
    sclass = $(formName)[0][i].getAttribute("id");
    sclass = "#" + sclass;
    console.log();
    $(sclass).removeClass("is-invalid");
    $(sclass).removeClass("is-valid");
  }
}

// 유저 로딩
function userLoading() {
  let treeId = sessionStorage.getItem("treeId");
  let selectPage = sessionStorage.getItem("page");

  let searchType = $("select#searchType").val();
  let keyword = $("#keyword").val();

  $.ajax({
    url: "/admin/usermanage/userlist.do",
    type: "get",
    data: {
      treeId: treeId,
      page: selectPage,
      searchType: searchType,
      keyword: keyword
    },
    success: function(res) {
      let str = "";
      let count = "";

      if (res.resultCode !== "ERROR") {
        $.each(res.data, function(key, value) {
          str += `<tr class="tr-shadow">`;
          str += "<td>" + value.userIndex + "</td>";
          str += "<td>" + value.userName + "</td>";
          str += "<td>" + value.branchName + "</td>";
          str += "<td>" + value.userPosition + "</td>";
          str += "<td>" + value.userId + "</td>";
          str += "<td>" + value.userEmail + "</td>";
          str += "<td>" + value.userPhone + "</td>";
          str +=
            "<td>" +
            (value.userAuth
              ? '<h6><span class="badge badge-danger">관리자</span></h6>'
              : '<h6><span class="badge badge-danger:focus">사용자</span></h6>') +
            "</td>";

          str += "<td><div class='table-data-feature'>";
          str += `<button class="item btn btn-primary-outline btn-sm" data-toggle="modal" data-target='#modifyModal' data-placement="top" title="Edit" onclick='modalUserLoading(${value.userIndex})' value='수정'><i class="fas fa-user-edit"></i></button>`;
          str += `<button class="item btn btn-primary-outline btn-sm" data-toggle="tooltip" data-placement="top" title="Delete" onclick='deleteCheckModal(${value.userIndex})' value='삭제'><i class="fas fa-user-minus"></i></button>`;
          str += "</div></td>";
          str += "</tr>";
        });
        pageButton(res.pagination.totalPages, res.pagination.currentPage);
      } else {
        count += `<li class="breadcrumb-item active">0명</li>`;
        str += `<tr class="tr-shadow">`;
        str += `<td colspan="9">`;
        str += `${res.description}`;
        str += `</td>`;
        str += `</tr>`;
      }
      $("#table #body").html(str);

      // $("#headerol").html(count);
    },
    error: function(request, status, error) {
      $("#errorMessage").text(
        "code:" +
          request.status +
          "\n" +
          "message:" +
          request.responseText +
          "\n" +
          "error:" +
          error
      );
      $("#failModal").modal("show");
    }
  });
}

// 회원 생성
function userCreate(req) {
  $.ajax({
    url: "/admin/usermanage",
    type: "post",
    contentType: "application/json",
    async: false,
    data: req,
    success: function(res) {
      if (res.resultCode === "ERROR") {
        insertModal.find("#serverFormCheck").html("잘못된 값 요청");

        for (var key in res.errorList) {
          console.log(key + " : " + res.errorList[key]);
        }
      } else {
        userLoading();
        $("#updateTitle").text("등록 성공");
        $("#updateMessage").text("해당 회원을 추가하였습니다.");
        $("#updateAlertModal").modal("show");
      }
    },
    error: function(request, status, error) {
      $("#errorMessage").text(
        "code:" +
          request.status +
          "\n" +
          "message:" +
          request.responseText +
          "\n" +
          "error:" +
          error
      );
      $("#failModal").modal("show");
    }
  });
}

function deleteCheckModal(userIndex) {
  $("#checkOk").on("click", function() {
    userDelete(userIndex);
  });

  $("#checkTitle").text("확인");
  $("#checkMessage").text("회원 정보를 삭제하시겠습니까?");
  $("#checkModal").modal("show");
}

// 회원 삭제
function userDelete(userIndex) {
  $.ajax({
    url: "/admin/usermanage",
    type: "delete",
    data: { userIndex: userIndex },
    success: function() {
      userLoading();

      $("#updateTitle").text("삭제 성공");
      $("#updateMessage").text("해당 회원을 삭제하였습니다.");
      $("#updateAlertModal").modal("show");
    },
    error: function(request, status, error) {
      $("#errorMessage").text(
        "code:" +
          request.status +
          "\n" +
          "message:" +
          request.responseText +
          "\n" +
          "error:" +
          error
      );
      $("#failModal").modal("show");
    }
  });
}

// 회원 수정
function userUpdate(req) {
  $.ajax({
    url: "/admin/usermanage",
    type: "put",
    contentType: "application/json",
    data: req,
    success: function(res) {
      if (res.resultCode === "ERROR") {
        modifyModal.find(".formError").html("잘못된 값을 요청하였습니다.");

        for (var key in res.description) {
          console.log(key + " : " + res.description[key]);
        }
      } else {
        userLoading();

        $("#updateTitle").text("업데이트 성공");
        $("#updateMessage").text("해당 유저 정보를 수정하였습니다.");
        $("#updateAlertModal").modal("show");
      }
    },
    error: function(request, status, error) {
      $("#errorMessage").text(
        "code:" +
          request.status +
          "\n" +
          "message:" +
          request.responseText +
          "\n" +
          "error:" +
          error
      );
      $("#failModal").modal("show");
    }
  });
}

// 비밀번호 초기화
function userPwReset(userIndex) {
  $.ajax({
    url: "/admin/usermanage",
    type: "patch",
    data: { userIndex: userIndex },
    success: function(res) {
      userLoading();

      $("#updateTitle").text("업데이트 성공");
      $("#updateMessage").text("해당 회원의 패스워드를 초기화하였습니다.");
      $("#updateAlertModal").modal("show");
    },
    error: function(request, status, error) {
      $("#errorMessage").text(
        "code:" +
          request.status +
          "\n" +
          "message:" +
          request.responseText +
          "\n" +
          "error:" +
          error
      );
      $("#failModal").modal("show");
    }
  });
}

// ! Modal 관련 =======================
// TODO JavaScript 다시 선언시 Const 중복 에러발생
var insertModal = $("#insertModal");
var modifyModal = $("#modifyModal");

const selectInit = modal => {
  // init
  modal.find("#branchIndex").select2({
    width: "100%",
    placeholder: "지점 선택",
    theme: "bootstrap4"
  });

  modal.find("#userPosition").select2({
    width: "100%",
    placeholder: "직책 선택",
    theme: "bootstrap4"
  });
};

// insertModal 열릴 시
insertModal.on("shown.bs.modal", function() {
  $("#myInput").trigger("focus");
  areaLoading(insertModal);
});

// insertModal 닫힐 시
insertModal.on("hidden.bs.modal", function() {
  $("#userCreateForm")[0].reset();
  insertModal.find(".formCheck").html("");

  insertModal.find("#areaIndex").empty();
  insertModal.find("#branchIndex").empty();
  insertModal.find("#userPosition").trigger("change");

  $("#userCreateForm")
    .validate()
    .resetForm();
  resetvalid("#userCreateForm");
});

// modifyModal 열릴 시
modifyModal.on("shown.bs.modal", function() {
  $("#myInput").trigger("focus");

  // 2개의 모달창이 존재해도 백그라운드 모달의 스크롤이 사라지지 않음
  // 참조 :
  // https://stackoverflow.com/questions/37467690/modal-with-another-modal-causes-scroll-on-body
  $(this).css("overflow-y", "auto");
});

// modifyModal 닫힐 시
modifyModal.on("hidden.bs.modal", function() {
  $("#userCreateForm")[0].reset();
  modifyModal.find(".formCheck").html("");

  $("#userModifyForm")
    .validate()
    .resetForm();
  resetvalid("#userModifyForm");
});

insertModal.find("#areaIndex").on("select2:select", function(e) {
  let selectData = e.params.data;
  branchLoading(insertModal, selectData.id);
});

modifyModal.find("#areaIndex").on("select2:select", function(e) {
  let selectData = e.params.data;
  branchLoading(modifyModal, selectData.id);
});

function arrayToObject(array) {
  return array.reduce(function(result, item) {
    let obj = {};
    obj.id = item[0];
    obj.text = item[1];

    result.push(obj);

    return result;
  }, []);
}

// 모달 내 지역 로딩
function areaLoading(modal) {
  $.ajax({
    url: "/admin/usermanage/arealist.do",
    type: "get",
    async: false,
    success: function(res) {
      let areaData = arrayToObject(res.data);

      modal.find("#areaIndex").html("<option></option>");
      modal.find("#areaIndex").select2({
        width: "100%",
        placeholder: "지역 선택",
        theme: "bootstrap4",
        data: areaData
      });

      selectInit(modal);
    },
    error: function(request, status, error) {
      $("#errorMessage").text(
        "code:" +
          request.status +
          "\n" +
          "message:" +
          request.responseText +
          "\n" +
          "error:" +
          error
      );
      $("#failModal").modal("show");
    }
  });
}

// 모달 내 지점 로딩
function branchLoading(modal, selected) {
  $.ajax({
    url: "/admin/usermanage/branchlist.do",
    type: "get",
    data: { areaIndex: selected },
    async: false,
    success: function(res) {
      let branchData = arrayToObject(res.data);

      modal.find("#branchIndex").empty();
      modal.find("#branchIndex").html("<option></option>");
      modal.find("#branchIndex").select2({
        width: "100%",
        placeholder: "지점 선택",
        theme: "bootstrap4",
        data: branchData
      });
    },
    error: function(request, status, error) {
      $("#errorMessage").text(
        "code:" +
          request.status +
          "\n" +
          "message:" +
          request.responseText +
          "\n" +
          "error:" +
          error
      );
      $("#failModal").modal("show");
    }
  });
}

// 모달 내 패스워드 초기화 버튼 클릭
modifyModal.find("#userPw").click(function() {
  let userIndex = $("#userModifyForm #userIndex").val();

  $("#checkOk").on("click", function() {
    userPwReset(userIndex);
  });

  $("#checkTitle").text("확인");
  $("#checkMessage").text("해당 회원의 비밀번호를 초기화 하시겠습니까?");
  $("#checkModal").modal("show");
});

// 수정 폼 모달 데이터 로딩
function modalUserLoading(userIndex) {
  $.ajax({
    url: "/admin/usermanage/userread.do",
    data: { userIndex: userIndex },
    type: "get",
    success: function(res) {
      res = res.data;

      modifyModal.find("#userIndex").val(res.userIndex);
      modifyModal.find("#userId").val(res.userId);
      modifyModal.find("#userName").val(res.userName);
      modifyModal.find("#userEmail").val(res.userEmail);
      modifyModal.find("#userPhone").val(res.userPhone);
      modifyModal
        .find("[name=userAuth][value=" + res.userAuth + "]")
        .prop("checked", true);

      areaLoading(modifyModal);
      modifyModal.find("#areaIndex").val(res.areaIndex);
      modifyModal.find("#areaIndex").trigger("change");

      branchLoading(modifyModal, res.areaIndex);
      modifyModal.find("#branchIndex").val(res.branchIndex);
      modifyModal.find("#branchIndex").trigger("change");

      modifyModal.find("#userPosition").val(res.userPosition);
      modifyModal.find("#userPosition").trigger("change");
    },
    error: function(request, status, error) {
      $("#errorMessage").text(
        "code:" +
          request.status +
          "\n" +
          "message:" +
          request.responseText +
          "\n" +
          "error:" +
          error
      );
      $("#failModal").modal("show");
    }
  });
}

// 폼 내용 Json으로 변경
$.fn.serializeObject = function() {
  let result = {};
  let extend = function(i, element) {
    let node = result[element.name];
    if ("undefined" !== typeof node && node !== null) {
      if ($.isArray(node)) {
        node.push(element.value);
      } else {
        result[element.name] = [node, element.value];
      }
    } else {
      result[element.name] = element.value;
    }
  };

  $.each(this.serializeArray(), extend);
  return JSON.stringify(result);
};

// ! JSTREE 부분 ====================

// jstree 로딩
function treeLoading() {
  $("#jstree").jstree({
    plugins: ["wholerow"],
    core: {
      themes: {
        name: "proton",
        reponsive: true
      },
      data: function(node, callback) {
        callback(treeData(node.id));
      }
    }
  });

  // jstree 값 받아오기
  function treeData(id) {
    let result = "";

    $.ajax({
      url: "/admin/usermanage/treelist.do",
      type: "get",
      data: { id: id },
      async: false,
      success: function(res) {
        result = res.data;
      },
      error: function(request, status, error) {
        $("#errorMessage").text(
          "code:" +
            request.status +
            "\n" +
            "message:" +
            request.responseText +
            "\n" +
            "error:" +
            error
        );
        $("#failModal").modal("show");
      }
    });

    return result;
  }

  $("#jstree")
    .on("changed.jstree", function(e, data) {
      let selectData = data.instance.get_node(data.selected);

      sessionStorage.setItem("treeId", selectData.id);
      sessionStorage.setItem("page", 0);

      if (selectData.children.length > 0) {
        $("#jstree")
          .jstree(true)
          .toggle_node(selectData);
      }

      userLoading();
    })
    .bind("open_node.jstree", function(e, data) {
      let nodesToKeepOpen = [];

      nodesToKeepOpen.push(data.node.id);
      nodesToKeepOpen.push(data.node.parent);

      $(".jstree-node").each(function() {
        if (nodesToKeepOpen.indexOf(this.id) === -1) {
          $("#jstree")
            .jstree()
            .close_node(this.id);
        }
      });
    });
}

// ! validation ====================
// select 포커스 문제 해결
$(".selectpicker").on("change", function() {
  $(this).blur();
});

// 모든 폼 valid 적용
$("form").each(function() {
  $(this).validate({
    onkeyup: false,
    errorClass: "is-invalid",
    validClass: "is-valid",
    ignore: ":hidden, [readonly]",
    // errorClass: "is-invalid",
    rules: {
      userId: {
        required: true,
        rangelength: [3, 15],
        remote: "/admin/usermanage/idcheck.do"
      },
      userName: {
        required: true,
        rangelength: [2, 10]
      },
      userEmail: {
        required: true,
        email: true
      },
      userPhone: {
        required: true,
        pattern: /^\d{3}-\d{4}-\d{4}$/
      },
      areaIndex: {
        required: true
      },
      branchIndex: {
        required: true
      },
      userPosition: {
        required: true
      },
      userAuth: {
        required: true
      }
    },
    messages: {
      userId: {
        required: "아이디를 입력하세요.",
        rangelength: jQuery.validator.format(
          "아이디는 {0}자 이상 {1}자 이하로 입력해주세요."
        ),
        remote: "이미 존재하는 아이디입니다."
      },
      userName: {
        required: "이름을 입력하세요.",
        rangelength: jQuery.validator.format(
          "이름은 {0}자 이상 {1}자 이하로 입력해주세요."
        )
      },
      userEmail: {
        required: "이메일을 입력하세요.",
        email: "이메일 형식이 맞지 않습니다."
      },
      userPhone: {
        required: "연락처를 입력하세요.",
        pattern: "연락처 형식이 맞지 않습니다."
      },
      areaIndex: {
        required: "지역을 선택하세요."
      },
      branchIndex: {
        required: "지점을 선택하세요."
      },
      userPosition: {
        required: "직책을 선택하세요."
      },
      userAuth: {
        required: "권한을 선택하세요."
      }
    },

    // 에러 위치 조정
    errorPlacement: function(error, element) {
      if (element.is(":radio") || element.is("select")) {
        error.appendTo(element.parents(".col-sm-8"));
      } else {
        error.insertAfter(element);
      }
    },

    // valid 실패시
    invalidHandler: function(form, validator) {
      var errors = validator.numberOfInvalids();

      if (errors) {
        validator.errorList[0].element.focus();
      }
    },

    // valid 성공시
    submitHandler: function(form) {
      const formId = $(form).attr("id");
      const req = $(form).serializeObject();

      switch (formId) {
        case "userCreateForm":
          userCreate(req);
          insertModal.modal("hide");
          break;

        case "userModifyForm":
          userUpdate(req);
          modifyModal.modal("hide");
          break;
        default:
          $("#errorMessage").text("valid 에러");
          $("#failModal").modal("show");
          break;
      }

      return false;
    },
    highlight: function(element, errorClass, validClass) {
      $(element)
        .addClass(errorClass)
        .removeClass(validClass);
    },
    unhighlight: function(element, errorClass, validClass) {
      console.log(1);
      $(element)
        .removeClass(errorClass)
        .addClass(validClass);
    }
  });
});

<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@include file="../include/header.jsp" %>
            <!-- // header -->

           
<div class="container">
    <div class="h3-head">
        <h3 class="h3">라이선스 정책 관리</h3>

    </div>
    <div class="tabs-box">
        <div class="tabs">
            <a href="#" class="active">라이선스 정책 관리</a>
            <a href="${path}/license/aidcodeinfo" >라이선스 제공 기능</a>
            <a href="${path}/license/creditinfo">Credit 제공</a>
        </div>
        <div class="right">
            <span class="tit">솔루션 선택</span>
            <select class="select" id="sltdeviceid" onchange="selectDeviceChange(this.value)">
                <option value="10">네트워크</option>
                <option value="20">서버</option>
                <option value="30">AP</option>
                <option value="40">데이터베이스</option>
                <option value="50">환경센서</option>
            </select>
            <button class="btn" type="button" onclick="selectDevice()">조회</button>

<%--            <form name="diviceform" autocomplete="on" action="/portal/license/licensemanage" method="post">--%>
<%--                <input type="hidden" class="inp" id="diviceid" value="30">--%>
<%--                <button class="btn" id="finddevice">조회</button>--%>
<%--            </form>--%>
        </div>
    </div>
    <div class="flex align-items-center gap10 align-end mb10">
        <button class="btn btn3">행추가</button>
        <button class="btn">저장</button>
    </div>

    <div class="table-type1 cursor">
        <table id="license-table">
            <thead>
                <tr>
                    <th>솔루션 명</th>
                    <th>가격정책</th>
                    <th>기본요금</th>
                    <th>가용장비</th>
                    <th>제공기능</th>
                    <th>정책내용</th>
                    <th>시작일자</th>
                    <th>종료일자</th>
                    <th>비고</th>
                </tr>
            </thead>
            <tbody id="license-tbody">
            <c:choose>
                <c:when test="${fn:length(license) > 0}">
                    <c:forEach items="${license}" var="list">
                        <tr id="data-area" ondblclick="license_tbody_dblclick(this)">
                     <!--   <tr onclick="javascript:popupOpen('Modal1');"> -->
                            <td class="text-center" id="solutioncode">
                              <c:if test="${list.solutioncode eq '10'}">Network</c:if>
                              <c:if test="${list.solutioncode eq '20'}">Server</c:if>
                              <c:if test="${list.solutioncode eq '30'}">Ap</c:if>
                              <c:if test="${list.solutioncode eq '40'}">DBMS</c:if>
                              <c:if test="${list.solutioncode eq '40'}">FMS</c:if>
                          </td>
                          <td class="text-center" id="policycode">
                              <c:if test="${list.policycode eq '1'}">Free</c:if>
                              <c:if test="${list.policycode eq '2'}">Basic</c:if>
                              <c:if test="${list.policycode eq '3'}">Pro</c:if>
                              <c:if test="${list.policycode eq '4'}">Ent</c:if>
                          </td>
                          <td class="text-center">${list.licenseamount}</td>
                          <td class="text-center">${list.licenseint}</td>
                          <td class="text-center" id="aidcode">
                              <c:if test="${list.aidcode eq '10'}">기본기능</c:if>
                              <c:if test="${list.aidcode eq '20'}">부가기능</c:if>
                              <c:if test="${list.aidcode eq '30'}">고급기능</c:if>
                          </td>
                          <td class="text-center">${list.licensecontent}</td>
                          <td class="text-center">${list.strstdate}</td>
                          <td class="text-center">${list.streddate}</td>
                          <td class="text-center"></td>
                        </tr>
                    </c:forEach>
                </c:when>
            </c:choose>
            </tbody>
        </table>
  </div>
</div>
<!-- // wrap -->


<div class="popup-wrap" id="Modal1">
<div class="bg-popup"></div>
<div class="popup-box">
    <div class="popup-cont">
        <div class="popup" style="width:770px">
            <div class="popup-head">
                <h3 class="h3-popup">수정</h3>
                <button class="btn-close" onclick="javascript:popupClose('Modal1');"><span class="hidden">닫기</span></button>
            </div>
            <div class="popup-body ">

                <div class="table-type2" style="width:700px">
                    <table>
                        <colgroup>
                            <col style="width:20%">
                            <col style="width:30%">
                            <col style="width:20%">
                            <col style="width:30%">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th>가격정책</th>
                                <td>
                                    <select class="select" id="modal_policycode">
                                        <option value="1">FREE</option>
                                        <option value="2">Basic</option>
                                        <option value="3">Pro</option>
                                        <option value="4">Ent</option>
                                    </select>
                                </td>
                                <th>기본요금</th>
                                <td ><input type="text" id="modal_licenseamount" class="inp" value="무료" style="width:100%"></td>
                            </tr>
                            <tr>
                                <th>가용장비</th>
                                <td><input type="number" id="modal_licenseint" class="inp" value="5" style="width:100%"></td>
                                <th>제공기능</th>
                                <td>
                                    <select class="select small" id="modal_aidcode">
                                        <option value="10">기본기능</option>
                                        <option value="20">부가기능</option>
                                        <option value="30">고급기능</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>라이선스 <br>정책 내용</th>
                                <td colspan="3">
                                    <textarea id="modal_licensecontent" class="inp" style="height: 90px; width:100%"></textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="popup-btns">
                <button class="btn">저장</button>
            </div>
        </div>
    </div>
</div>
</div>

<script>

    function selectDevice(){
        const sltcode = $('#sltdeviceid option:selected').val();
        var url = "${pageContext.request.contextPath}/license/licensemanage";
        url = url + "?deviceid="+sltcode;

        location.href=url;
<%--alert("...");--%>

<%--        var form = document.createElement('form'); // 폼객체 생성--%>
<%--        var objs;--%>
<%--        objs = document.createElement('input'); // 값이 들어있는 녀석의 형식--%>
<%--        objs.setAttribute('type', 'text'); // 값이 들어있는 녀석의 type--%>
<%--        objs.setAttribute('name', 'deviceid'); // 객체이름--%>
<%--        objs.setAttribute('value', deviceid); //객체값--%>
<%--        form.appendChild(objs);--%>
<%--        form.setAttribute('method', 'post'); //get,post 가능--%>
<%--        form.setAttribute('action', "${pageContext.request.contextPath}/license/licensemanage"); //보내는 url--%>
<%--        document.body.appendChild(form);--%>
<%--        form.submit();--%>
    }

    var selectDeviceChange = function (value){
        console.log("value --------------->"+value);
        $("#diviceid").val(value);
        console.log("value --------------->"+value);
    }

    $(document).ready(function() {
        var formObj = $("form[role='form']");

        $("#finddevice").on("click", function (e) {
            e.preventDefault();

            formObj.submit();
        });
    });



    // $(function() {
    //     $('#license-tbody tr').on('dllclick', function () {
    //         popupOpen('Modal1');
    //     })
    //     $('#license-table tr').on('dllclick', function () {
    //         popupOpen('Modal1');
    //     })
    //
    //     $('#Modal1').on('show.bs.modal', function(event) {
    //         var button = $(event.relatedTarget);
    //         var deleteUrl = button.data('title');
    //         var modal = $(this);
    //     })
    //
    // })
    // $('#license-tbody tr').on('dllclick', function () {
    //     popupOpen('Modal1');
    // })
    function license_tbody_dblclick(dblclicked_element){
        var row_td = dblclicked_element.getElementsByTagName("td");
        var modal = document.getElementById("Modal1");
        var row1 = row_td[1].innerHTML;
        var row4 = row_td[4].innerHTML;
        //$("select[name=셀렉트박스name]").val();
        if(row_td[1].innerHTML == "FREE"){
            row_td[1].innerHTML = "1";
        }else if(row_td[1].innerHTML == "Basic"){
            row_td[1].innerHTML = "2";
        }else if(row_td[1].innerHTML == "Pro"){
            row_td[1].innerHTML = "3";
        }else{
            row_td[1].innerHTML = "4";
        }
        if(row_td[4].innerHTML == "기본기능"){
            row_td[4].innerHTML = "10";
        }else if(row_td[4].innerHTML == "부가기능"){
            row_td[4].innerHTML = "20";
        }else{
            row_td[4].innerHTML = "30";
        }
        alert("row_td[1]-->"+row_td[1].innerHTML);
        $("#modal_policycode").val(row_td[1].innerHTML);
        $("#modal_licenseamount").val(row_td[2].innerHTML);
        $("#modal_licenseint").val(row_td[3].innerHTML);
        $("#modal_aidcode").val(row_td[4].innerHTML);
        $("#modal_licensecontent").val(row_td[5].innerHTML);
        row_td[1].innerHTML = row1;
        row_td[4].innerHTML = row4;
        modal.style.display = 'block';
       // popupOpen('Modal1');
    }

    function aidcodeinfo(){
        let f = document.createElement('form');
        f.setAttribute('method', 'post');
        f.setAttribute('action', '${path}/license/aidcodeinfo');
        document.body.appendChild(f);
        f.submit();
    }

    // 팝업 함수 호출
// popupOpen('Modal1');
</script>
<%@include file="../include/footer.jsp" %>
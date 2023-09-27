<%@ page import="com.hamonsoft.cportal.domain.Member" %>
<%@ page import="com.hamonsoft.cportal.mail.MailSend" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<c:set var="path" value="<%=request.getContextPath() %>" scope="application"/>

<script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>

<%@include file="../include/header.jsp" %>

<div class="container">
    <form class="form-wrap" role="form" action="chginforesult" method="post">
        <h2 class="h2">회원정보</h2>
        <div class="tabs1">
            <a href="#" class="active">회원정보</a>
            <a href="${path}/user/chgpw">비밀번호 변경</a>
            <a href="${path}/user/withdrawal">회원탈퇴</a>
        </div>
        <div class="inp-area">
            <div class="label">이메일 *</div>
            <div class="inp-box"><input type="text" class="inp2" placeholder="이메일" name="email" id="email" value="${member.email}" readonly></div>
        </div>
        <div class="inp-area">
            <div class="label">성명 *</div>
            <div class="inp-box"><input type="text" class="inp2" placeholder="성명" name="membername" value="${member.membername}" required></div>
        </div>
        <div class="inp-area">
            <div class="label">그룹명 *</div>
            <div class="inp-box">
                <input type="text" class="inp2" name="grpname" placeholder="그룹명" value="${member.grpname}" required>
            </div>
        </div>
        <div class="inp-area">
            <div class="label">휴대전화 *</div>
            <div class="inp-box">
                <input type="text" class="inp2" placeholder="휴대전화" name="celltel" value="${member.celltel}" required>
                <button class="btn" style="display: none">인증번호전송</button>
            </div>
        </div>
        <div class="inp-area" style="display: none">
            <div class="label">인증번호 *</div>
            <div class="inp-box">
                <span class="time">남은시간 : 4분 59초</span>
                <input type="text" class="inp2" value="12345">
                <button class="btn">인증하기</button>
            </div>
        </div>
        <div class="inp-area">
            <div class="label">회사명 *</div>
            <div class="inp-box"><input type="text" class="inp2" placeholder="회사명" name="businessname" value="${member.businessname}" required></div>
        </div>
        <div class="inp-area">
            <div class="label">사업자등록번호 *</div>
            <div class="inp-box"><input type="text" class="inp2" placeholder="'-'빼고 숫자만 입력하세요(10자리 체크)" maxlength="10" name="businessnumber" value="${member.businessnumber}" required></div>
        </div>
        <div class="inp-area">
            <div class="label">등급선택 *</div>
            <div class="inp-box">
                <select class="large" name="licensegrade" id="licensegrade">
                    <option value="1">Free</option>
                    <option value="2">Basic</option>
                    <option value="3">Pro</option>
                    <option value="4">Enterprise</option>
                </select>
            </div>
            <input type="hidden" name="prelicensegrade" value="${member.licensegrade}">
        </div>

        <div id="billinfo" style="display: block">
            <hr class="hr1 mt30">
            <h3 class="h3">세금계산서 발행</h3>

            <div class="inp-area">
                <div class="label">법인(회사)명</div>
                <div class="inp-box"><input type="text" class="inp2" placeholder="회사명" name="companyname" value="${tax.companyname}"></div>
            </div>
            <div class="inp-area">
                <div class="label">대표자명</div>
                <div class="inp-box"><input type="text" class="inp2" placeholder="대표자명" name="representationname" value="${tax.representationname}"></div>
            </div>
            <div class="inp-area">
                <div class="label">사업자 등록 번호</div>
                <div class="inp-box">
                    <div class="hp-box">
                        <input type="hidden" name="taxcompanynumber" id="taxcompanynumber" value="${tax.taxcompanynumber}">
                        <input type="text" class="inp2" placeholder="" maxlength="3" id="tax1">
                        <span>-</span>
                        <input type="text" class="inp2" placeholder="" maxlength="2" id="tax2">
                        <span>-</span>
                        <input type="text" class="inp2" placeholder="" maxlength="5" id="tax3">
                    </div>
                </div>
            </div>
            <div class="inp-area">
                <div class="label">전자세금계산서<br>발행메일</div>
                <div class="inp-box"><input type="text" class="inp2" placeholder="전자세금계산서 발행 메일을 입력하세요." name="taxemail" value="${tax.taxemail}"></div>
            </div>
            <div class="inp-area">
                <div class="label">주소</div>
                <div class="inp-box">
                    <input type="hidden" name="postnumber" id="postnumber" value="${tax.postnumber}">
                    <input type="text" class="inp2" id="address1" placeholder="우편번호를 검색하세요." name="address" value="${tax.address}">
                    <button class="btn" id="searchPostNum">우편번호검색</button>
                </div>
            </div>
            <div class="inp-area">
                <div class="label"></div>
                <div class="inp-box">
                    <input type="text" class="inp2" id="address2" placeholder="상세주소 등록" name="detailaddress" value="${tax.detailaddress}">
                </div>
            </div>
            <div class="inp-area">
                <div class="label">업종</div>
                <div class="inp-box"><input type="text" class="inp2" placeholder="업종을 입력하세요" name="businesskind" value="${tax.businesskind}"></div>
            </div>
            <div class="inp-area">
                <div class="label">업태</div>
                <div class="inp-box"><input type="text" class="inp2" placeholder="업태를 입력하세요" name="businesscondition" value="${tax.businesscondition}"></div>
            </div>
            <input type="hidden" name="paid_amount" id="paid_amount" value="${tax.paid_amount}">
        </div>
        <button class="btn large block" id="chguserinfo">회원정보 변경</button>
        <input type="hidden" name="basecharge" value="0">
        <input type="hidden" name="addcharge" value="0">
        <input type="hidden" name="datakeepterm" value="30">
        <input type="hidden" name="datakeepunit" value="D">
    </form>
</div>

<script>

    $(document).ready(function () {
        var formObj = $("form[role='form']");

        $("#licensegrade").val("${member.licensegrade}").prop("selected", true);
        $("#licensegrade").SumoSelect();

        var grade = $("#licensegrade").val();

        if (grade == "1") {
            $("#billinfo").hide();
            $("input[name='basecharge']").val('0');
        } else {
            $("#billinfo").show();

            <c:forEach items="${licenselist}" var="license">
            if (grade == "${license.commoncode}") {
                console.log("commoncode - ${license.commoncode}, baselicense - ${license.baselicense}");
                $("input[name='basecharge']").val("${license.baselicense}");
            }
            </c:forEach>

            if (grade == "4") {
                console.log("Enterprise 등급은 baselicense 를 100만원으로 한다.");
                $("input[name='basecharge']").val("1000000");
            }
        }

        $("#licensegrade").change(function (e) {

            if (grade == "1") {
                $("#billinfo").hide();
                $("input[name='basecharge']").val('0');
            } else {
                $("#billinfo").show();

                <c:forEach items="${licenselist}" var="license">
                if (grade == "${license.commoncode}") {
                    console.log("commoncode - ${license.commoncode}, baselicense - ${license.baselicense}");
                    $("input[name='basecharge']").val("${license.baselicense}");
                }
                </c:forEach>

                if (grade == "4") {
                    console.log("Enterprise 등급은 baselicense 를 100만원으로 한다.");
                    $("input[name='basecharge']").val("1000000");
                }
            }
        });

        var taxnum = $("#taxcompanynumber").val();
        var tax1 = taxnum.substring(0, 3);
        var tax2 = taxnum.substring(3, 5);
        var tax3 = taxnum.substring(5, 10);

        $("#tax1").val(tax1);
        $("#tax2").val(tax2);
        $("#tax3").val(tax3);

        $("#chguserinfo").on("click", function (e) {
            e.preventDefault();

            var email = $("#email").val();

            var tax1 = $("#tax1").val();
            var tax2 = $("#tax2").val();
            var tax3 = $("#tax3").val();
            var taxnum = tax1 + tax2 + tax3;

            $("input[name='taxcompanynumber']").val(taxnum);

            if (email.trim().length == 0) {
                alert("email 을 입력해 주세요.");
                return;
            }

            if ($("input[name='membername']").val() == "") {
                alert("성명을 입력해 주세요.");
                return;
            }

            if ($("input[name='celltel']").val() == "") {
                alert("휴대전화를 입력해 주세요.");
                return;
            }

            if ($("input[name='businessname']").val() == "") {
                alert("회사명을 입력해 주세요.");
                return;
            }

            if ($("input[name='businessnumber']").val() == "") {
                alert("사업자등록번호를 입력해 주세요.");
                return;
            }

            formObj.submit();
        });

        $("#searchPostNum").on("click", function (e) {
            e.preventDefault();

            new daum.Postcode({
                oncomplete: function (data) {
                    // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

                    // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                    // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                    var addr = ''; // 주소 변수
                    var extraAddr = ''; // 참고항목 변수

                    //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                    if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                        addr = data.roadAddress;
                    } else { // 사용자가 지번 주소를 선택했을 경우(J)
                        addr = data.jibunAddress;
                    }

                    // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
                    if (data.userSelectedType === 'R') {
                        // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                        // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                            extraAddr += data.bname;
                        }
                        // 건물명이 있고, 공동주택일 경우 추가한다.
                        if (data.buildingName !== '' && data.apartment === 'Y') {
                            extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                        }
                        // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                        if (extraAddr !== '') {
                            extraAddr = ' (' + extraAddr + ')';
                        }
                        // 조합된 참고항목을 해당 필드에 넣는다.
                        // document.getElementById("sample6_extraAddress").value = extraAddr;

                    } else {
                        // document.getElementById("sample6_extraAddress").value = '';
                    }

                    // 우편번호와 주소 정보를 해당 필드에 넣는다.
                    document.getElementById('postnumber').value = data.zonecode;
                    // document.getElementById("sample6_address").value = addr;
                    document.getElementById("address1").value = addr + extraAddr;
                    // 커서를 상세주소 필드로 이동한다.
                    document.getElementById("address2").focus();
                }
            }).open();
        });

    });

</script>

<%@include file="../include/footer.jsp" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
<script src="https://cdn.iamport.kr/v1/iamport.js"></script>
<%@include file="../include/header.jsp" %>

<div class="container">
    <form class="form-wrap" role="form" method="post">
        <h2 class="h2">회원가입</h2>
        <h3 class="h3">로그인 정보</h3>
        <div class="form-desc">* 표시는 필수 입력 항목입니다.</div>
        <hr class="hr1">
        <div class="inp-area">
            <div class="label">이메일 *</div>
            <div class="inp-box">
                <div class="email">
                    <input type="hidden" name="email" id="emailId" value="">
                    <input type="text" class="inp2" placeholder="아이디" id="id" required>
                    <span>@</span>
                    <input type="text" class="inp2" placeholder="메일주소" id="EmailInput" required>
                    <select class="select large" style="width:130px" id="Email">
                        <option>선택</option>
                        <option>naver.com</option>
                        <option>nate.com</option>
                        <option>gmail.com</option>
                        <option>daum.net</option>
                        <option>hamonsoft.co.kr</option>
                        <option>직접입력</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="inp-area">
            <div class="label">비밀번호 *</div>
            <div class="inp-box">
                <input type="password" class="inp2" name="password" id="password1" placeholder="비밀번호를 입력하세요(영문/숫자/특수문자 조합으로 9~16자)" required>
                  <i class="far fa-eye" id="togglePassword" style="margin-top: 15px;margin-left: -30px; cursor: pointer;"></i>
            </div>
        </div>
        <div class="alert-msg" id="pwAlert">반드시 영문(대문자,소문자 반드시 1개 이상)과 숫자, 특수문자를 혼합하여 9~16자 입력해주시기 바랍니다.<br>(허용 특수문자 : !@#$%^+=-)</div>

        <div class="inp-area">
            <div class="label">비밀번호 확인 *</div>
            <div class="inp-box"><input type="password" class="inp2" id="password2" placeholder="비밀번호 확인" required></div>
        </div>

        <h3 class="h3 mt20">관리자 정보</h3>
        <hr class="hr1">
        <div class="inp-area">
            <div class="label">성명 *</div>
            <div class="inp-box">
                <input type="text" class="inp2" name="membername" placeholder="성명" required>
            </div>
        </div>
        <div class="inp-area">
            <div class="label">그룹명 *</div>
            <div class="inp-box">
                <input type="text" class="inp2" name="grpname" placeholder="그룹명" required>
            </div>
        </div>
        <div class="inp-area">
            <div class="label">휴대전화 *</div>
            <div class="inp-box">
                <div class="hp-box">
                    <input type="hidden" name="celltel" value="">
                    <input type="text" class="inp2" id="tel1" placeholder="" maxlength="3" required>
                    <span>-</span>
                    <input type="text" class="inp2" id="tel2" placeholder="" maxlength="4" required>
                    <span>-</span>
                    <input type="text" class="inp2" id="tel3" placeholder="" maxlength="4" required>
                </div>
                <button class="btn" style="display: none">휴대폰 인증</button>
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
            <div class="inp-box"><input type="text" class="inp2" name="businessname" placeholder="회사명" required></div>
        </div>
        <div class="inp-area">
            <div class="label">사업자등록번호 *</div>
            <div class="inp-box"><input type="text" class="inp2" name="businessnumber" placeholder="'-'빼고 숫자만 입력하세요(10자리 체크)" maxlength="10" required></div>
        </div>
        <div class="inp-area">
            <div class="label">등급선택 *</div>
            <div class="inp-box">
                <select class="select large" name="licensegrade" id="licensegrade">
                    <option value="1">Free</option>
                    <option value="2">Basic</option>
                    <option value="3">Pro</option>
                    <option value="4">Enterprise</option>
                </select>
            </div>
        </div>
        <div id="billinfo" style="display: none">
            <h3 class="h3 mt20">세금계산서 발행 기관 정보</h3>
            <hr class="hr1">

            <div class="inp-area">
                <div class="label">법인(회사)명</div>
                <div class="inp-box"><input type="text" class="inp2" placeholder="회사명" name="companyname"></div>
            </div>
            <div class="inp-area">
                <div class="label">대표자명</div>
                <div class="inp-box"><input type="text" class="inp2" placeholder="대표자명" name="representationname"></div>
            </div>
            <div class="inp-area">
                <div class="label">사업장 전화번호</div>
                <div class="inp-box">
                    <div class="hp-box">
                        <input type="hidden" name="companyphone" value="">
                        <input type="text" class="inp2" id="companyphone1" placeholder="" maxlength="3">
                        <span>-</span>
                        <input type="text" class="inp2" id="companyphone2" placeholder="" maxlength="4">
                        <span>-</span>
                        <input type="text" class="inp2" id="companyphone3" placeholder="" maxlength="4">
                    </div>
                </div>
            </div>
            <div class="inp-area">
                <div class="label">사업자 등록 번호</div>
                <div class="inp-box">
                    <div class="hp-box">
                        <input type="hidden" name="taxcompanynumber" value="">
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
                <div class="inp-box"><input type="email" class="inp2" placeholder="전자세금계산서 발행 메일을 입력하세요." name="taxemail"></div>
            </div>
            <div class="inp-area">
                <div class="label">주소</div>
                <div class="inp-box">
                    <input type="hidden" name="postnumber" id="postnumber" value="">
                    <input type="text" class="inp2" id="address1" placeholder="우편번호를 검색하세요." name="address">
                    <button class="btn" id="searchPostNum">우편번호검색</button>
                </div>
            </div>
            <div class="inp-area">
                <div class="label"></div>
                <div class="inp-box">
                    <input type="text" class="inp2" id="address2" placeholder="상세주소 등록" name="detailaddress">
                </div>
            </div>
            <div class="inp-area">
                <div class="label">업종</div>
                <div class="inp-box"><input type="text" class="inp2" placeholder="업종을 입력하세요" name="businesskind"></div>
            </div>
            <div class="inp-area">
                <div class="label">업태</div>
                <div class="inp-box"><input type="text" class="inp2" placeholder="업태를 입력하세요" name="businesscondition"></div>
            </div>
            <div class="inp-area">
                <div class="label">결재수단</div>
                <div class="inp-box">
                    <select class="select large" name="settlementmeans" id="settlementmeans">
                        <option value="card">카드</option>
                        <option value="cash">현금</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="mb5">
            <label><input type="checkbox" class="checkbox" id="agreement"><div><em></em></div><span class="checkbox-txt">[필수] NETIS <a href="agreeterms" class="red bold" target="_blank">이용약관</a>과 <a href="personalinformation" class="blue bold" target="_blank">개인정보처리방침</a>에 동의합니다.</span></label>
        </div>
        <div class="mb15">
            <input type="hidden" name="agreeyn" id="agreeyn" value="N">
            <label><input type="checkbox" class="checkbox" id="checkmarketing"><div><em></em></div><span class="checkbox-txt">[선택] <a href="agreemarketing" class="red bold" target="_blank">마케팅 활용 및 정보 수신</a> 동의합니다.</span></label>
        </div>
        <div class="msg1">본 마케팅 활용 및 정보수신에 동의를 거부하실 수 있으며 이경우 회원가입은 가능하나 일부 서비스 이용 및 이벤트 안내 등의 서비스 제공이 제한 될 수 있습니다.</div>
        <button class="btn large block" id="insertMember">회원가입</button>
        <input type="hidden" name="emailcertificationyn" value="0">
        <input type="hidden" name="withdrawalyn" value="0">
        <input type="hidden" name="withdrawaldate" value="">
        <input type="hidden" name="updatedBy" value="administrator">

        <input type="hidden" name="baseamount" value="0">
        <input type="hidden" name="basecharge" value="0">
        <input type="hidden" name="addcharge" value="0">
        <input type="hidden" name="datakeepterm" value="30">
        <input type="hidden" name="datakeepunit" value="D">
        <input type="hidden" name="customer_uid" value="">
        <input type="hidden" name="paid_amount" value="0">
    </form>
</div>

<script>
    function send_mail() {
        var mailto = $('#mailto').val();
        window.open("mail/test_mail?mailto=" + mailto, "", "width=370, height=360, resizable=no, scrollbars=no, status=no");
    }

    function existEmailYN(value){
        console.log("..................."+value);
        var url = "${path}/member/findEmail";
        const params = {
            "email": value
        };

        $.ajax({
            type: 'post',
            url: url,
            async : true, // 비동기화 동작 여부
            data: JSON.stringify(params),
            contentType: "application/json",
            success: function(data) {
                if(data == "Y"){
                    alert("입력하신 이메일 아이디("+value+")는\n이미 등록된 아이디 입니다.");
                    $("input[name='email']").val("");
                    $("#id").val("")
                    $('#EmailInput').val("");
                    // 직접 index 값을 주어 selected 속성 주기
                    $("#Email option:eq(0)").attr("selected", "selected");
                    $("#id").focus();
                }
            },
            error: function(err){
            }
        });
    }

    $(document).ready(function () {

        $("#Email").SumoSelect();
        $("#licensegrade").SumoSelect();
        $("#settlementmeans").SumoSelect();

        console.log("result = ${result}");
        console.log("resaon = ${reason}");

        if ("${result}" == "fail") {
            alert("${reason}");
            self.location = "${path}/member/insertMember";
            return;
        }

        var formObj = $("form[role='form']");

        $("#licensegrade").change(function (e) {
            var grade = $(this).val();

            if (grade == "1") {
                $("#billinfo").hide();
                $("[id=companyphone1]").attr("required" , false);
                $("[id=companyphone2]").attr("required" , false);
                $("[id=companyphone3]").attr("required" , false);
                $("input[name='basecharge']").val('0');
            } else {
                $("#billinfo").show();
                $("[id=companyphone1]").attr("required" , true);
                $("[id=companyphone2]").attr("required" , true);
                $("[id=companyphone3]").attr("required" , true);
                $("input[name='companyname']").val($("input[name='businessname']").val());
                $("input[name='taxcompanynumber']").val($("input[name='businessnumber']").val());
                $("#tax1").val($("input[name='businessnumber']").val().substr(0,3));
                $("#tax2").val($("input[name='businessnumber']").val().substr(3,2));
                $("#tax3").val($("input[name='businessnumber']").val().substr(5,5));
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

        $('#Email').change(function () {
            console.log($(this).val());
            if ($(this).val() == "선택" || $(this).val() == "직접입력") {
                $('#EmailInput').val('');
            } else {
                $('#EmailInput').val($(this).val());
                var email = $("#id").val() + "@" + $(this).val();
                $("input[name='email']").val(email);
                existEmailYN(email);

            }
        });


        $('#id').change(function () {
            console.log($(this).val());
            var emailInput = $("#EmailInput").val();
            if (emailInput.trim().length >= 1) {
                var email = $("#id").val() + "@" + emailInput;
                $("input[name='email']").val(email);
                existEmailYN(email);
            }
        });

        $('#EmailInput').change(function () {
            console.log($(this).val());

            var id = $("#id").val();
            if (id.trim().length == 0) {
                alert("id를 입력해 주세요.");
                return;
            }
            var emailInput = $("#EmailInput").val();
            var email = id + "@" + emailInput;
            $("input[name='email']").val(email);
            existEmailYN(email);
        });

        const togglePassword = document.querySelector('#togglePassword');
          const password = document.querySelector('#password1');

          togglePassword.addEventListener('click', function (e) {
            // toggle the type attribute
            const type = password1.getAttribute('type') === 'password' ? 'text' : 'password';
            password1.setAttribute('type', type);
            // toggle the eye slash icon
            this.classList.toggle('fa-eye-slash');
        });

        $('#password1').change(function () {
            var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^+=-]).{9,16}$/;

            var pw = $(this).val();
            if (false === reg.test(pw)) {
                $("#pwAlert").show();
                alert("비밀번호 : 영문(대문자,소문자 반드시 1개 이상)과 숫자,\n 특수문자를 혼합하여 9~16자입니다.");
                setTimeout(function(){
                  $("#password1").focus();
                });
            } else {
                $("#pwAlert").hide();
            }
        });

        $('#password2').change(function () {
            if ($("#password1").val() != $("#password2").val()) {
                alert("비밀번호가 서로 다릅니다.");
                $("#password2").focus();
                $("#password2").val("");
            }
        });


        $("#insertMember").on("click", function (e) {
        	if(!confirm("회원가입 하시겠습니까?")){
        	    $("#membername").focus();
        		return;
        	}

            e.preventDefault();

            var id = $("#id").val();
            var emailInput = $("#EmailInput").val();
            var email = id + "@" + emailInput;

            if (id.trim().length == 0 || emailInput.trim().length == 0) {
                alert("email 을 입력해 주세요.");
                return;
            }

            $("input[name='email']").val(email);

            var tax1 = $("#tax1").val();
            var tax2 = $("#tax2").val();
            var tax3 = $("#tax3").val();
            var taxnum = tax1 + tax2 + tax3;

            $("input[name='taxcompanynumber']").val(taxnum);

            if ($("#pwAlert").is(":visible") == true) {
                $("#password1").focus();
                return;
            }

            var pw1 = $("#password1").val();
            var pw2 = $("#password2").val();

            if (pw1 == "" || pw2 == "") {
                alert("비밀번호를 입력해 주세요.");
                return;
            }

            if (pw1 != pw2) {
                alert("비밀번호를 확인해 주세요.");
                $("#password2").focus();
                return;
            }

            if ($("input[name='membername']").val() == "") {
                alert("성명을 입력해 주세요.");
                return;
            }

            if ($("input[name='grpname']").val() == "") {
                alert("그룹명을 입력해 주세요.");
                return;
            }

            var tel1 = $("#tel1").val();
            var tel2 = $("#tel2").val();
            var tel3 = $("#tel3").val();
            var celltel = tel1 + tel2 + tel3;

            if (tel1.trim().length <= 2 || tel2.trim().length <= 2 || tel3.trim().length != 4) {
                alert("휴대전화를 입력해 주세요.");
                return;
            }else{
                var regPhone = /^[0-9]+$/;
                if (false === regPhone.test(celltel)) {
                   alert("휴대폰 번호를 정확하게 입력하십시요.(3-(3,4)-4 자리)");
                   $("#tel1").focus();
                   retuirn;
                }
            }

            $("input[name='celltel']").val(celltel);
            if($("#licensegrade").val() >= "2"){
                var companyphone1 = $("#companyphone1").val();
                var companyphone2 = $("#companyphone2").val();
                var companyphone3 = $("#companyphone3").val();
                var companyphone = companyphone1 + companyphone2 + companyphone3;
                if (companyphone1.trim().length <= 1 || companyphone2.trim().length <= 2 || companyphone3.trim().length != 4) {
                    alert("사업장 전화번호를 입력해 주세요.");
                    $("#companyphone1").focus();
                    return;
                }else{
                    var regPhone = /^[0-9]+$/;
                    if (false === regPhone.test(companyphone)) {
                       alert("사업장 전화번호를 정확하게 입력하십시요.(0-9숫자만 가능)");
                       $("#companyphone1").focus();
                       return;
                    }
                    $("input[name='companyphone']").val(companyphone);
                }
                // 법인(회사)명 입력여부 확인
                if($("input[name='companyname']").val().length <= 1){
                    alert("법인(회사)명을 입력하십시요.");
                    $("input[name='companyname']").focus();
                    return;
                }

                // 대표자명 입력여부 확인
                if($("input[name='representationname']").val().length <= 1){
                    alert("대표자명을 입력하십시요.");
                    $("input[name='representationname']").focus();
                    return;
                }

                // 사업자 등록 번호 입력여부 확인
                if($("input[name='taxcompanynumber']").val().length != 10){
                    alert("세금계산서 발행기관 사업자등록번호를 입력하십시요.");
                    $("input[name='taxcompanynumber']").focus();
                    return;
                }else{
                     console.log("taxcompanynumber.val() -->"+$("input[name='taxcompanynumber']").val());
                     if(false == checkCorporateRegiNumber($("input[name='taxcompanynumber']").val())){
                         var errMsg = "세금계산서 발행기관 사업자등록번호를 유효성 검사에 실패 했습니다.\n정확한 사업자 등록번호를 입력하십시요.";
                         errMsg += "\n"+$("input[name='taxcompanynumber']").val();
                         alert(errMsg);
                         $("input[name='taxcompanynumber']").focus();
                         return;
                     }
                 }

                // 법인(회사) 주소 입력여부 확인
                if($("#postnumber").val().length != 5){
                    alert("법인(회사) 주소를 입력하십시요.");
                    $("input[name='address']").focus();
                    return;
                }

                // 법인(회사)상세주소 입력여부 확인
                if($("input[name='detailaddress']").val().length == 0){
                    alert("법인(회사) 상세주소를 입력하십시요.");
                    $("input[name='detailaddress']").focus();
                    return;
                }

                // 업종 입력여부 확인
                if($("input[name='businesskind']").val().length == 0){
                    alert("업종을 입력하십시요.");
                    $("input[name='businesskind']").focus();
                    return;
                }

                // 업태 입력여부 확인
                if($("input[name='businesscondition']").val().length == 0){
                    alert("업태을 입력하십시요.");
                    $("input[name='businesscondition']").focus();
                    return;
                }


            }

            if ($("input[name='businessname']").val() == "") {
                alert("회사명을 입력해 주세요.");
                return;
            }

            if ($("input[name='businessnumber']").val() == "") {
                alert("사업자등록번호를 입력해 주세요.");
                return;
            }else{
           //     console.log("businessnumber.val() -->"+$("input[name='businessnumber']").val());
           //     if(false == checkCorporateRegiNumber($("input[name='businessnumber']").val())){
           //         alert("사업자등록번호를 유효성 검사에 실패 했습니다.\n정확한 사업자 등록번호를 입력하십시요.");
           //         $("#businessnumber").focus();
           //         return;
           //     }
            }

            if ($("#agreement").prop("checked") == false) {
                alert("NETIS 이용약관과 개인정보처리방침에 동의해 주세요.");
                return;
            }

            if ($("#checkmarketing").is(':checked')) {
                $("#agreeyn").val("Y");
            } else {
                $("#agreeyn").val("N");
            }

            var grade = $("#licensegrade").val();
            var settlementmeans = $("#settlementmeans").val();

            var membername = $("input[name='membername']").val();
            var basecharge = $("input[name='basecharge']").val();
            var addcharge = $("input[name='addcharge']").val();
            var paid_amount = Number(basecharge) + Number(addcharge);
            $("input[name='paid_amount']").val(paid_amount);
            console.log("paid_amount", paid_amount);

            if (grade != "1" && settlementmeans == "card") {
                alert('다음은 카드 등록을 위한 화면입니다.\n실제 결제는 이루어지지 않습니다.\n카드 정보는 따로 저장하지 않습니다.');
                let IMP = window.IMP;
                IMP.init("imp42261033");

                $.ajax({
                    url: "${path}/iamport/gettoken",
                    type: 'POST',
                    datatype: 'json',
                    data: {
                    }
                }).done(function (auth) {
                    console.log("getauth result ---------------");
                    console.log(auth);

                    IMP.request_pay({
                        pg: "html5_inicis.INIBillTst",
                        pay_method: "card",
                        merchant_uid: "merchant_" + new Date().getTime(),   // 주문번호
                        name: "NETIS CLOUD",
                        amount: 0, // 카드 등록을 위한 절차이므로 0원.... paid_amount,                         // 숫자 타입
                        // customer_uid 파라미터가 있어야 빌링키 발급을 시도함.
                        customer_uid: "hamonsoft_" + new Date().getTime(),
                        buyer_name: membername
                        // buyer_email: $('#email').val(),
                        // buyer_tel: $('#mobile').val(),
                        // buyer_addr: $('#address').val(),
                        // buyer_postcode: "08512"
                    }, function (rsp) { // callback
                        console.log("rsp.imp_uid - ", rsp.imp_uid);
                        console.log("rsp -", rsp);
                        if (rsp.success) {
                            console.log("customer_uid", rsp.customer_uid);
                            console.log("merchant_uid", rsp.merchant_uid);

                            $("input[name='customer_uid']").val(rsp.customer_uid);

                            $("form[role='form']").submit();

                            /* 회원 가입시는 실제 결제를 하지 않아야 하므로 이 부분 막음.
                            $.ajax({
                                url: "${path}/iamport/again",
                                type: 'POST',
                                datatype: 'json',
                                data: {
                                    email: $('#email').val(),
                                    customer_uid: rsp.customer_uid,
                                    paid_amount: rsp.paid_amount
                                }
                            }).done(function(result){
                                console.log("rsesult", result);
                                $("form[role='form']").submit();
                            }).fail(function(error){
                                alert(JSON.stringify(error));
                            });
                            */
                        }
                    });
                }).fail(function(error){
                    alert(JSON.stringify(error));
                });
            } else {
                formObj.submit();
            }
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


    //사업자 등록번호 유효성 체크
    function checkCorporateRegiNumber(number){
        var numberMap = number.replace(/-/gi, '').split('').map(function (d){
            return parseInt(d, 10);
        });

        if(numberMap.length == 10){
            var keyArr = [1, 3, 7, 1, 3, 7, 1, 3, 5];
            var chk = 0;

            keyArr.forEach(function(d, i){
                chk += d * numberMap[i];
            });

            chk += parseInt((keyArr[8] * numberMap[8])/ 10, 10);
            console.log(chk);
            return Math.floor(numberMap[9]) === ( (10 - (chk % 10) ) % 10);
        }

        return false;
    }

</script>

<%@include file="../include/footer.jsp" %>
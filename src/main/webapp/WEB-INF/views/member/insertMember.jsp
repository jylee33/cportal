<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@include file="../include/header.jsp" %>

<%--<section class="content">--%>

<%--    <form role="form" method="post">--%>
<%--        <div class="box-body">--%>
<%--            <div class="form-group">--%>
<%--                <label>email</label>--%>
<%--                <input type="text"--%>
<%--                       name='email' class="form-control" placeholder="email">--%>
<%--            </div>--%>
<%--            <div class="form-group">--%>
<%--                <label>membername</label>--%>
<%--                <input type="text"--%>
<%--                       name="membername" class="form-control" placeholder="membername">--%>
<%--            </div>--%>
<%--            <div class="form-group">--%>
<%--                <label>celltel</label>--%>
<%--                <input type="number"--%>
<%--                       name="celltel" class="form-control" placeholder="celltel">--%>
<%--            </div>--%>
<%--            <div class="form-group">--%>
<%--                <label>password</label>--%>
<%--                <input type="password"--%>
<%--                       name="password" class="form-control" placeholder="password">--%>
<%--            </div>--%>
<%--            <div class="form-group">--%>
<%--                <label>businessname</label>--%>
<%--                <input type="text"--%>
<%--                       name="businessname" class="form-control" placeholder="businessname">--%>
<%--            </div>--%>
<%--            <div class="form-group">--%>
<%--                <label>businessnumber</label>--%>
<%--                <input type="number"--%>
<%--                       name="businessnumber" class="form-control" placeholder="businessnumber">--%>
<%--            </div>--%>
<%--            <div class="form-group">--%>
<%--                <label>licensegrade</label>--%>
<%--                <div class="input-group has-validation">--%>
<%--                    <select id="licensegrade" name="licensegrade">--%>
<%--                        <option value="1">Free</option>--%>
<%--                        <option value="2">Basic</option>--%>
<%--                        <option value="3">Pro</option>--%>
<%--                        <option value="4">Enterprise</option>--%>
<%--                    </select>--%>
<%--                </div>--%>
<%--            </div>--%>
<%--            <div class="form-group">--%>
<%--                <label>companyphone</label>--%>
<%--                <input type="number"--%>
<%--                       name="companyphone" class="form-control" placeholder="companyphone">--%>
<%--            </div>--%>
<%--            <div class="form-group">--%>
<%--                <label>emailcertificationyn</label>--%>
<%--                <div class="input-group has-validation">--%>
<%--                    <select id="emailcertificationyn" name="emailcertificationyn">--%>
<%--                        <option value="0">n</option>--%>
<%--                        <option value="1">y</option>--%>
<%--                    </select>--%>
<%--                </div>--%>
<%--            </div>--%>
<%--            <div class="form-group">--%>
<%--                <label>withdrawalyn</label>--%>
<%--                <div class="input-group has-validation">--%>
<%--                    <select id="withdrawalyn" name="withdrawalyn">--%>
<%--                        <option value="1">y</option>--%>
<%--                        <option value="0">n</option>--%>
<%--                    </select>--%>
<%--                </div>--%>
<%--            </div>--%>
<%--            <div class="form-group">--%>
<%--                <label>withdrawaldate</label>--%>
<%--                <input type="number"--%>
<%--                       name="withdrawaldate" class="form-control" placeholder="withdrawaldate">--%>
<%--            </div>--%>
<%--            <div class="form-group">--%>
<%--                <label>joindate</label>--%>
<%--                <input type="number"--%>
<%--                       name="joindate" class="form-control" placeholder="joindate">--%>
<%--            </div>--%>
<%--            <div class="form-group">--%>
<%--                <label>updatedBy</label>--%>
<%--                <input type="text"--%>
<%--                       name="updatedBy" class="form-control" placeholder="updatedBy">--%>
<%--            </div>--%>

<%--        </div>--%>
<%--        <!-- /.box-body -->--%>

<%--        <div class="box-footer">--%>
<%--            <button type="submit" class="btn btn-primary">Submit</button>--%>
<%--        </div>--%>
<%--    </form>--%>

<%--</section>--%>

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
                    <input type="hidden" name="email" value="">
                    <input type="text" class="inp2" placeholder="아이디" id="id">
                    <span>@</span>
                    <input type="text" class="inp2" placeholder="메일주소" id="EmailInput">
                    <select class="select large" style="width:130px" id="Email">
                        <option>선택</option>
                        <option>naver.com</option>
                        <option>nate.com</option>
                        <option>gmail.com</option>
                        <option>daum.com</option>
                        <option>직접입력</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="inp-area">
            <div class="label">비밀번호 *</div>
            <div class="inp-box">
                <input type="password" class="inp2" name="password" placeholder="비밀번호를 입력하세요(영문/숫자/특수문자 조합으로 9~16자)">
            </div>
        </div>
        <div class="alert-msg">반드시 영문과 숫자, 특수문자를 혼합하여 9~16자 입력해주시기 바랍니다.<br>(허용 특수문자 : !@#$%^+=-)</div>

        <div class="inp-area">
            <div class="label">비밀번호 확인 *</div>
            <div class="inp-box"><input type="password" class="inp2" placeholder="비밀번호 확인"></div>
        </div>

        <h3 class="h3 mt20">관리자 정보</h3>
        <hr class="hr1">
        <div class="inp-area">
            <div class="label">성명 *</div>
            <div class="inp-box">
                <input type="text" class="inp2" name="membername" placeholder="성명">
            </div>
        </div>
        <div class="inp-area">
            <div class="label">휴대전화 *</div>
            <div class="inp-box">
                <div class="hp-box">
                    <input type="hidden" name="celltel" value="">
                    <input type="text" class="inp2" id="tel1" placeholder="" maxlength="3">
                    <span>-</span>
                    <input type="text" class="inp2" id="tel2" placeholder="" maxlength="4">
                    <span>-</span>
                    <input type="text" class="inp2" id="tel3" placeholder="" maxlength="4">
                </div>
                <button class="btn">휴대폰 인증</button>
            </div>
        </div>
        <div class="inp-area">
            <div class="label">인증번호 *</div>
            <div class="inp-box">
                <span class="time">남은시간 : 4분 59초</span>
                <input type="text" class="inp2" value="12345">
                <button class="btn">인증하기</button>
            </div>
        </div>
        <div class="inp-area">
            <div class="label">회사명 *</div>
            <div class="inp-box"><input type="text" class="inp2" name="businessname" placeholder="회사명"></div>
        </div>
        <div class="inp-area">
            <div class="label">사업자등록번호 *</div>
            <div class="inp-box"><input type="text" class="inp2" name="businessnumber" placeholder="'-'빼고 숫자만 입력하세요(10자리 체크)" maxlength="10"></div>
        </div>
        <div class="inp-area">
            <div class="label">등급선택 *</div>
            <div class="inp-box">
                <select class="select large" name="licensegrade">
                    <option value="1">Free</option>
                    <option value="2">Basic</option>
                    <option value="3">Pro</option>
                    <option value="4">Enterprise</option>
                </select>
            </div>
        </div>
        <h3 class="h3 mt20">세금계산서 발행 기관 정보</h3>
        <hr class="hr1">

        <div class="inp-area">
            <div class="label">법인(회사)명</div>
            <div class="inp-box"><input type="text" class="inp2" placeholder="회사명"></div>
        </div>
        <div class="inp-area">
            <div class="label">대표자명</div>
            <div class="inp-box"><input type="text" class="inp2" placeholder="대표자명"></div>
        </div>
        <div class="inp-area">
            <div class="label">사업자 등록 번호</div>
            <div class="inp-box">
                <div class="hp-box">
                    <input type="text" class="inp2" placeholder="" maxlength="3">
                    <span>-</span>
                    <input type="text" class="inp2" placeholder="" maxlength="4">
                    <span>-</span>
                    <input type="text" class="inp2" placeholder="" maxlength="4">
                </div>
            </div>
        </div>
        <div class="inp-area">
            <div class="label">전자세금계산서<br>발행메일</div>
            <div class="inp-box"><input type="text" class="inp2" placeholder="전자세금계산서 발행 메일을 입력하세요."></div>
        </div>
        <div class="inp-area">
            <div class="label">주소</div>
            <div class="inp-box">
                <input type="text" class="inp2" placeholder="우편번호를 검색하세요.">
                <button class="btn">우편번호검색</button>
            </div>
        </div>
        <div class="inp-area">
            <div class="label"></div>
            <div class="inp-box">
                <input type="text" class="inp2" placeholder="상세주소 등록">
            </div>
        </div>
        <div class="inp-area">
            <div class="label">업종</div>
            <div class="inp-box"><input type="text" class="inp2" placeholder="업종을 입력하세요"></div>
        </div>
        <div class="inp-area">
            <div class="label">업태</div>
            <div class="inp-box"><input type="text" class="inp2" placeholder="업태를 입력하세요"></div>
        </div>
        <div class="inp-area">
            <div class="label">결재수단</div>
            <div class="inp-box"><input type="text" class="inp2" placeholder="결재수단을 입력하세요"></div>
        </div>
        <div class="mb5">
            <label><input type="checkbox" class="checkbox"><div><em></em></div><span class="checkbox-txt">[필수] NETIS <a href="#" class="red bold" target="_blank">이용약관</a>과 <a href="#" class="blue bold" target="_blank">개인정보처리방침</a>에 동의합니다.</span></label>
        </div>
        <div class="mb15">
            <label><input type="checkbox" class="checkbox"><div><em></em></div><span class="checkbox-txt">[선택] <a href="#" class="red bold" target="_blank">마케팅 활용 및 정보 수신</a> 동의합니다.</span></label>
        </div>
        <div class="msg1">본 마케팅 활용 및 정보수신에 동의를 거부하실 수 있으며 이경우 회원가입은 가능하나 일부 서비스 이용 및 이벤트 안내 등의 서비스 제공이 제한 될 수 있습니다.</div>
        <button class="btn large block" id="insertMember">회원가입</button>
        <input type="hidden" name="companyphone" value="Hamonsoft">
        <input type="hidden" name="emailcertificationyn" value="0">
        <input type="hidden" name="withdrawalyn" value="1">
        <input type="hidden" name="withdrawaldate" value="20230901">
        <input type="hidden" name="joindate" value="20230901">
        <input type="hidden" name="updatedBy" value="test">
    </form>
</div>

<script>
    function send_mail(){
        var mailto = $('#mailto').val();
        window.open("mail/test_mail?mailto=" + mailto, "", "width=370, height=360, resizable=no, scrollbars=no, status=no");
    }

    $('#Email').change(function () {
        console.log($(this).val());

        if ($(this).val() == "선택" || $(this).val() == "직접입력") {
            $('#EmailInput').val('');
        } else {
            $('#EmailInput').val($(this).val());
        }
    });

    $("#insertMember").on("click",function(e){
        var formObj = $("form[role='form']");
        var id = $("#id").val();
        var emailInput = $("#EmailInput").val();
        var email = id + "@" + emailInput;

        $("input[name='email']").val(email);

        var tel1 = $("#tel1").val();
        var tel2 = $("#tel2").val();
        var tel3 = $("#tel3").val();
        var celltel = tel1 + tel2 + tel3;

        $("input[name='celltel']").val(celltel);
        // alert($("input[name='celltel']").val());

        formObj.submit();
    });
</script>

<%@include file="../include/footer.jsp" %>
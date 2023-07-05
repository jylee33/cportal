<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@include file="../include/header.jsp" %>

<%--<script type="text/javascript" src="https://cdn.iamport.kr/js/iamport.payment-1.2.0.js"></script>--%>
<script src="https://cdn.iamport.kr/v1/iamport.js"></script>

<!-- Main content -->
<section class="content">
	<form class="needs-validation" novalidate onsubmit="goPaymentAPI()">
		<div class="row">
			<div class="col-sm-6">
				<label for="firstName" class="form-label">PRODUCT</label>
				<input type="text" class="form-control" id="firstName" placeholder=""
					   value="NETIS CLOUD ENTERPRISE" name="name" readonly="readonly" required/>
				<%--				<div class="invalid-feedback">Your first name is required.</div>--%>
			</div>
			<div class="col-md-12">
				<label for="username" class="form-label">구매자</label>
				<div class="input-group has-validation">
					<%--					<span class="input-group-text">@</span>--%>
					<input type="text" class="form-control" id="username" value="hamonsoft" required/>
					<%--				<div class="invalid-feedback">Your username is required.</div>--%>
				</div>
			</div>

			<div class="col-md-12">
				<label for="mobile" class="form-label">전화번호</label>
				<div class="input-group has-validation">
					<input type="text" class="form-control" id="mobile" value="010-1234-5678" required/>
				</div>
			</div>

			<div class="col-md-12">
				<label for="pay_method" class="form-label">결제수단</label>
				<div class="input-group has-validation">
					<select id="pay_method" name="pay_method" disabled>
						<option value="card">card</option>
						<option value="cash">cash</option>
					</select>
				</div>
			</div>

			<div class="col-md-12">
				<label for="price" class="form-label">가격</label>
				<div class="input-group has-validation">
					<input type="text" class="form-control" id="price" value="1" required/>
				</div>
			</div>

			<div class="col-md-12">
				<label for="email" class="form-label">Email
					<span class="text-muted">(Optional)</span></label>
				<input type="email" class="form-control" id="email" placeholder="you@example.com" name="email"
					   value="jylee@hamonsoft.co.kr"/>
				<%--				<div class="invalid-feedback">Please enter a valid email address for shipping updates.</div>--%>
			</div>

			<%--			<input class="btn btn-info" type="button" onclick="goPopup();" value="findaddress"/>--%>
			<div class="col-md-12">
				<label for="address" class="form-label">Address</label>
				<input type="text" class="form-control" id="address" class="address" placeholder="1234 Main St"
					   value="서울특별시 금천구 가산동 60-5 갑을그레이트밸리" required/>
				<%--				<div class="invalid-feedback">Please enter your shipping address.</div>--%>
			</div>
			<div class="col-md-12">
				<button type="submit" id="btn_pay" class="btn btn-primary">결제하기</button>
<%--				<button type="submit" id="btn_cancel" class="btn btn-warning">환불하기</button>--%>
			</div>
		</div>
	</form>
</section>

<script>

	$(document).ready(function () {


	});

	$("#btn_pay").on("click", function (event) {
		event.preventDefault();
		let IMP = window.IMP;
		IMP.init("imp42261033");

		console.log($('#email').val());
		console.log($('#username').val());
		console.log($('#address').val());
		var now = new Date();
		console.log("현재 : ", now);

		var orderId = "ORD" + now.getFullYear() + "" + now.getMonth() + "" + now.getDate() + "_" + now.getHours() + "" + now.getMinutes() + "" + now.getSeconds();
		// orderId = "57008833-33004";
		console.log(orderId);

		IMP.request_pay({
			pg: "html5_inicis.INIBillTst",//"kcp.INIBillTst",
			// customer_uid: "RldZHse07tEdv7luguc4oh6bJdcWvLluhsbo8Jg3dIL94Azrw3BhDuFKDjLTavBHxeBNjgOgKdKwfqTy", // 카드(빌링키)와 1:1로 대응하는 값
			pay_method: $('#pay_method').val(),
			merchant_uid: orderId,   // 주문번호
			name: $('#firstName').val(),
			amount: $('#price').val(),                         // 숫자 타입
			buyer_email: $('#email').val(),
			buyer_name: $('#username').val(),
			buyer_tel: $('#mobile').val(),
			buyer_addr: $('#address').val(),
			buyer_postcode: "01181"
		}, function (rsp) { // callback
			//rsp.imp_uid 값으로 결제 단건조회 API를 호출하여 결제결과를 판단합니다.
			if (rsp.success) {
				alert("success");
				console.log(rsp);
				// axios로 HTTP 요청
				axios({
					url: "{서버의 결제 정보를 받는 endpoint}",
					method: "post",
					headers: { "Content-Type": "application/json" },
					data: {
						imp_uid: rsp.imp_uid,
						merchant_uid: rsp.merchant_uid
					}
				}).then((data) => {
					// 서버 결제 API 성공시 로직
				})
			} else {
				alert(`결제에 실패하였습니다. 에러 내용: ${rsp.error_msg}`);
			}
		});

	});

	$("#btn_cancel").on("click", function (event) {
		var orderId = "57008833-33004";
		alert('a');

		jQuery.ajax({
			// 예: http://www.myservice.com/payments/cancel
			"url": "http://localhost:8080/bill/pay",
			"type": "POST",
			"contentType": "application/json",
			"data": JSON.stringify({
				"merchant_uid": orderId, // 예: ORD20180131-0000011
				"cancel_request_amount": 1, // 환불금액
				"reason": "테스트 결제 환불", // 환불사유
				// [가상계좌 환불시 필수입력] 환불 수령계좌 예금주
				"refund_holder": $('#username').val(),
				// [가상계좌 환불시 필수입력] 환불 수령계좌 은행코드(예: KG이니시스의 경우 신한은행은 88번)
				"refund_bank": "88",
				// [가상계좌 환불시 필수입력] 환불 수령계좌 번호
				"refund_account": "56211105948400"
			}),
			"dataType": "json"
		});
		alert('b');

	});

	function goPaymentAPI() {
		// alert('bbb');
	}


</script>

<%@include file="../include/footer.jsp" %>
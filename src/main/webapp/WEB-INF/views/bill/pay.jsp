<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@include file="../include/header.jsp" %>

<%--<script type="text/javascript" src="https://cdn.iamport.kr/js/iamport.payment-1.2.0.js"></script>--%>
<script src="https://cdn.iamport.kr/v1/iamport.js"></script>

<!-- Main content -->
<div class="container">
	<form class="form-wrap" role="form" method="post" onsubmit="goPaymentAPI()">
		<div class="inp-area">
			<div class="label">PRODUCT</div>
			<div class="inp-box"><input type="text" class="inp2" id="firstName" name="name" placeholder="회사명" readonly="readonly" required value="NETIS CLOUD ENTERPRISE"></div>
		</div>
		<div class="inp-area">
			<div class="label">구매자</div>
			<div class="inp-box"><input type="text" class="inp2" id="username" name="username" placeholder="구매자" required value="hamonsoft"></div>
		</div>

		<div class="inp-area">
			<div class="label">전화번호</div>
			<div class="inp-box"><input type="text" class="inp2" id="mobile" name="mobile" placeholder="전화번호" required value="010-2801-3349"></div>
		</div>

		<div class="inp-area">
			<div class="label">결제수단</div>
			<div class="inp-box">
				<select class="select large" name="pay_method" id="pay_method">
					<option value="card">card</option>
					<option value="cash">cash</option>
				</select>
			</div>
		</div>

		<div class="inp-area">
			<div class="label">가격</div>
			<div class="inp-box"><input type="text" class="inp2" id="price" name="price" placeholder="가격" required value="1"></div>
		</div>

		<div class="inp-area">
			<div class="label">Email</div>
			<div class="inp-box"><input type="text" class="inp2" id="email" name="email" placeholder="you@example.com" required value="jylee@hamonsoft.co.kr"></div>
		</div>

		<%--			<input class="btn btn-info" type="button" onclick="goPopup();" value="findaddress"/>--%>
		<div class="inp-area">
			<div class="label">Address</div>
			<div class="inp-box"><input type="text" class="inp2" id="address" name="address" placeholder="1234 Main St" required value="서울특별시 금천구 가산동 60-5 갑을그레이트밸리"></div>
		</div>
		<div class="inp-area">
			<button class="btn large block" id="btn_pay">결제하기</button>
			<div class="label"> </div>
			<button class="btn large block" id="btn_cancel">환불하기</button>
		</div>
	</form>
</div>

<script>

	$(document).ready(function () {


		$("#btn_pay").on("click", function (event) {
			event.preventDefault();
			let IMP = window.IMP;
			IMP.init("imp42261033");

			console.log("email : " + $('#email').val());
			console.log("username : " + $('#username').val());
			console.log("address : " + $('#address').val());
			var now = new Date();
			console.log("현재 : ", now);

			var orderId = "ORD" + now.getFullYear() + "" + now.getMonth() + "" + now.getDate() + "_" + now.getHours() + "" + now.getMinutes() + "" + now.getSeconds();
			// orderId = "57008833-33004";
			console.log("ORD : " + orderId);

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
				buyer_postcode: "08512"
			}, function (rsp) { // callback
				//rsp.imp_uid 값으로 결제 단건조회 API를 호출하여 결제결과를 판단합니다.
				if (rsp.success) {
					// var msg = '결제가 완료되었습니다.';
					// msg += '\n고유ID : ' + rsp.imp_uid;
					// msg += '\n상점 거래ID : ' + rsp.merchant_uid;
					// msg += '\n결제 금액 : ' + rsp.paid_amount;
					// msg += '\n카드 승인번호 : ' + rsp.apply_num;
					//
					// alert(msg);
					$.ajax({
						url: "${path}/iamport/" + rsp.imp_uid,	//서버의 결제 정보를 받는 endpoint
						// beforeSend: function (xhr) {
						// 	xhr.setRequestHeader(header, token);
						// },
						type: 'POST',
						datatype: 'json',
						data: {
							// imp_uid: rsp.imp_uid,
							// merchant_uid: rsp.merchant_uid
						}
					}).done(function (result) {
						// if (everything_fine) {
						if(rsp.paid_amount === result.response.amount){
							var msg = '결제가 완료되었습니다.';
							msg += '\n고유ID : ' + rsp.imp_uid;
							msg += '\n상점 거래ID : ' + rsp.merchant_uid;
							msg += '\n결제 금액 : ' + rsp.paid_amount;
							msg += '\n카드 승인번호 : ' + rsp.apply_num;

							alert(msg);
						} else {
							alert("결제에 실패했습니다."+"\n에러코드 : " + rsp.error_code + "\n에러 메시지 : " + rsp.error_message);
						}
					}).fail(function(error){
						alert(JSON.stringify(error));
					});
				} else {
					var msg = "결제에 실패했습니다.\n에러 내용: " + rsp.error_msg;
					alert(msg);
				}
			});

		});

		$("#btn_cancel").on("click", function (event) {
			var orderId = "57008833-33004";
			alert('a');

			jQuery.ajax({
				// 예: http://www.myservice.com/payments/cancel
				"url": "${path}/bill/pay",
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

	});


	function goPaymentAPI() {
		// alert('bbb');
	}


</script>

<%@include file="../include/footer.jsp" %>
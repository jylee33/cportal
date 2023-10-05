package com.hamonsoft.cportal.controller;

import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.domain.TaxInformation;
import com.hamonsoft.cportal.service.BaroBillHMService;
import com.hamonsoft.cportal.service.MemberService;
import com.siot.IamportRestClient.Iamport;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.request.AgainPaymentData;
import com.siot.IamportRestClient.response.AccessToken;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/iamport")
public class IamportHMClientController {

    private final IamportClient iamportClient;
    private static final Logger logger = LoggerFactory.getLogger(BillController.class);

    MemberService memberService;
    BaroBillHMService baroBillHMService;

    protected Iamport iamport = null;

    String apiKey = "0534302583438521";
    String apiSecret = "RldZHse07tEdv7luguc4oh6bJdcWvLluhsbo8Jg3dIL94Azrw3BhDuFKDjLTavBHxeBNjgOgKdKwfqTy";

    @Autowired
    public IamportHMClientController(MemberService memberService, BaroBillHMService baroBillHMService) {
        logger.info("call IamportHMClientController constructor ......................");
        this.memberService = memberService;
        this.iamportClient = new IamportClient(this.apiKey, this.apiSecret);

        this.baroBillHMService = baroBillHMService;
    }

    public IamportResponse<AccessToken> getAuth() throws IamportResponseException, IOException {
        logger.info("call getAuth ......................");

        IamportResponse<AccessToken> auth_response = new IamportResponse<>();
        try {
            auth_response = iamportClient.getAuth();
            logger.info("token - " + auth_response.getResponse().getToken());

            return auth_response;
        } catch (IamportResponseException e) {
            logger.info(e.getMessage());
            switch (e.getHttpStatusCode()) {
                case 401:
                    break;
                case 500:
                    break;
            }
//            throw new IamportResponseException(e.getMessage(), new HttpException(auth_response.getResponse()));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return auth_response;

    }

    @PostMapping("/gettoken")
    public AccessToken getToken() throws IamportResponseException, IOException {
        logger.info("call gettoken ......................");
        AccessToken auth = getAuth().getResponse();
        return auth;
    }

    private String getRandomMerchantUid() {
        DateFormat df = new SimpleDateFormat("$$hhmmssSS");
        int n = (int) (Math.random() * 100) + 1;

        logger.info("getRandomMerchantUid - " + df.format(new Date()) + "_" + n);
        return df.format(new Date()) + "_" + n;
    }

    private IamportResponse<Payment> pay(String email) throws IamportResponseException, IOException {
        String customer_uid = "";
        Date dtNextPayDate = null;
        long paid_amount = 1;

        HashMap<String, Object> map = memberService.selectTaxByEmail(email);
        for( Map.Entry<String, Object> entry : map.entrySet() ){
            String key = entry.getKey();
            Object value = entry.getValue();
            switch (key) {
                case "customer_uid":
                    customer_uid = value.toString();
                    break;
                case "next_pay_date":
                    String dateStr = value.toString();
                    SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

                    try {
                        dtNextPayDate = df.parse(dateStr);
                    } catch (ParseException e) {
                        throw new RuntimeException(e);
                    }

                    break;
                case "paid_amount":
                    paid_amount = Long.parseLong(value.toString());
                    paid_amount *= 1.1; // VAT 추가
                    break;
            }
        }

        Date dtNow = new Date();
        logger.info("dtNow - " + dtNow);
        logger.info("dtNextPayDate - " + dtNextPayDate);
        int result = dtNextPayDate.compareTo(dtNow);

        if (result > 0) {
            logger.info("tbtaxinformation.next_pay_date 와 현재 시간 비교해서 결제가 필요하지 않아 그냥 return");
            return null;
        } else {
            AccessToken auth = getAuth().getResponse();
            AgainPaymentData againData = new AgainPaymentData(customer_uid, getRandomMerchantUid(), BigDecimal.valueOf(paid_amount));
            againData.setName("NETIS CLOUD");

            IamportResponse<Payment> response = iamportClient.againPayment(againData);

            if (response.getCode() == 0) {   // success
                logger.info("iamportClient.againPayment success -------------");
                String imp_uid = response.getResponse().getImpUid();
                logger.info("return imp_uid - " + imp_uid);

                // tbtaxinformation.next_pay_date update
//                DateFormat df = new SimpleDateFormat("yyyyMMdd");
//
//                Calendar cal=Calendar.getInstance();
//                cal.add(cal.MONTH, 1);
//                String sDate = df.format(cal.getTime());
//                Date dtNext = new Date(Integer.parseInt(sDate.substring(0, 4)) - 1900, Integer.parseInt(sDate.substring(4, 6)) - 1, 1);

                LocalDate ldNow = LocalDate.now();
                LocalDate ldNextMonth = ldNow.plusMonths(1).withDayOfMonth(1);
                Instant instant = ldNextMonth.atStartOfDay(ZoneId.systemDefault()).toInstant();
                Date dtNext = Date.from(instant);

                Map<String, Object> paramMap = new HashMap<>();
                paramMap.put("email", email);
                paramMap.put("customer_uid", customer_uid);
                paramMap.put("imp_uid", imp_uid);
                paramMap.put("paid_amount", paid_amount);
                paramMap.put("dtNext", dtNext);

                memberService.updatePayInformation(paramMap);
                memberService.insertPayHistory(paramMap);
            }

            return response;
        }
    }

    private void barobill(String email) {
        Date dtNextPayDate = null;
        long paid_amount = 1;

        HashMap<String, Object> map = memberService.selectTaxByEmail(email);
        for( Map.Entry<String, Object> entry : map.entrySet() ){
            String key = entry.getKey();
            Object value = entry.getValue();
            switch (key) {
                case "next_pay_date":
                    String dateStr = value.toString();
                    SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

                    try {
                        dtNextPayDate = df.parse(dateStr);
                    } catch (ParseException e) {
                        throw new RuntimeException(e);
                    }

                    break;
                case "paid_amount":
                    paid_amount = Long.parseLong(value.toString());
                    break;
            }
        }

        Date dtNow = new Date();
        logger.info("dtNow - " + dtNow);
        logger.info("dtNextPayDate - " + dtNextPayDate);
        int result = dtNextPayDate.compareTo(dtNow);

        if (result > 0) {
            logger.info("tbtaxinformation.next_pay_date 와 현재 시간 비교해서 결제가 필요하지 않아 그냥 return");
            return;
        } else {
            Member member = memberService.selectMember(email);
            TaxInformation tax = memberService.taxInfo(email);
            baroBillHMService.issue(member, tax);
        }
    }

    @PostMapping("/again")
    public IamportResponse<Payment> againPayment(String email) throws IamportResponseException, IOException {
        logger.info("call againPayment ......................");
        logger.info("email --- " + email);

        String means = memberService.selectSettlementmeans(email);

        if (means.equals("card")) {
            // 카드 결제
            IamportResponse<Payment> result = pay(email);
            return result;
        } else if (means.equals("cash")) {
            // 현금 결제, 세금계산서 발행
            barobill(email);
        } else {
            logger.info("settlementmeans is empty ============================");
        }
        return null;
    }

    @PostMapping("/payall")
    public void payAll() throws IamportResponseException, IOException {
        logger.info("call IamportHMClientController payAll ......................");

        ArrayList<HashMap<String, String>> list = memberService.selectEmails();
        String email = "";
        String means = "";

        for (HashMap<String, String> map:list) {
            for (Map.Entry<String, String> entry : map.entrySet()) {
                String key = entry.getKey();
                Object value = entry.getValue();
                logger.info(key + " : " + value);

                switch (key) {
                    case "email":
                        email = value.toString();
                        break;
                    case "settlementmeans":
                        means = value.toString();
                        break;
                }
            }
            logger.info("email --- " + email);
            if (means.equals("card")) {
                // 카드 결제
                IamportResponse<Payment> result = pay(email);
            } else if (means.equals("cash")) {
                // 현금 결제, 세금계산서 발행
                barobill(email);
            } else {
                logger.info("settlementmeans is empty ============================");
            }
        }
    }


    @PostMapping("/{imp_uid}")
    public IamportResponse<Payment> paymentByImpUid(@PathVariable String imp_uid) throws IamportResponseException, IOException {
        logger.info("paymentByImpUid 진입");
        return iamportClient.paymentByImpUid(imp_uid);
    }

}

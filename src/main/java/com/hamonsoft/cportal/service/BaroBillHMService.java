package com.hamonsoft.cportal.service;

import com.baroservice.api.BarobillApiService;
import com.baroservice.ws.ArrayOfTaxInvoiceTradeLineItem;
import com.baroservice.ws.InvoiceParty;
import com.baroservice.ws.TaxInvoice;
import com.baroservice.ws.TaxInvoiceTradeLineItem;
import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.domain.TaxInformation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

@Service
public class BaroBillHMService {

    @Autowired
    private BarobillApiService barobillApiService;

    private static final Logger logger = LoggerFactory.getLogger(BaroBillHMService.class);


    public void test() {
        String certKey = "DC632BA8-541F-48CC-B39E-7C5C2ACFAFB7";

        DateFormat df = new SimpleDateFormat("yyyyMMddhhmmssSS");
        String mgtNum = df.format(new Date());
        logger.info("mgtNum : " + mgtNum);

        DateFormat df2 = new SimpleDateFormat("yyyyMMdd");
        String today = df2.format(new Date());

        TaxInvoice taxInvoice = new TaxInvoice();

        taxInvoice.setIssueDirection(1);
        taxInvoice.setTaxInvoiceType(1);

        taxInvoice.setModifyCode("");

        taxInvoice.setTaxType(1);
        taxInvoice.setTaxCalcType(1);
        taxInvoice.setPurposeType(2);

        // 중간
        taxInvoice.setWriteDate(today);     //작성일자
        taxInvoice.setAmountTotal("100");   //공급가액
        taxInvoice.setTaxTotal("10");       //세액

        // 하단
        taxInvoice.setTotalAmount("110");   //합계금액
        taxInvoice.setCash("104");  //현금
        taxInvoice.setChkBill("1"); //수표
        taxInvoice.setNote("2");    //어음
        taxInvoice.setCredit("3");  //외상미수금

        taxInvoice.setRemark1("");  //비고1
        taxInvoice.setRemark2("");
        taxInvoice.setRemark3("");

        taxInvoice.setKwon("1111");   //책번호 - 권
        taxInvoice.setHo("2222");     //책번호 - 호
        taxInvoice.setSerialNum("123456789012345678901234567");//일련번호

        // 공급자 정보
        taxInvoice.setInvoicerParty(new InvoiceParty());
        taxInvoice.getInvoicerParty().setMgtNum(mgtNum);
        taxInvoice.getInvoicerParty().setCorpNum("1198604153");
        taxInvoice.getInvoicerParty().setTaxRegID("");
        taxInvoice.getInvoicerParty().setCorpName("(주)하몬소프트");
        taxInvoice.getInvoicerParty().setCEOName("강원석, 이석호");
        taxInvoice.getInvoicerParty().setAddr("서울특별시 금천구 디지털로9길 32, 비동 1201호");
        taxInvoice.getInvoicerParty().setBizType("서비스");
        taxInvoice.getInvoicerParty().setBizClass("소프트웨어");
        taxInvoice.getInvoicerParty().setContactID("hamoncloud");
        taxInvoice.getInvoicerParty().setContactName("홍지혜");
        taxInvoice.getInvoicerParty().setTEL("01067675597");
        taxInvoice.getInvoicerParty().setHP("01067675597");
        taxInvoice.getInvoicerParty().setEmail("wisd0m@hamonsoft.co.kr");

        //공급받는자 정보
        taxInvoice.setInvoiceeParty(new InvoiceParty());
        taxInvoice.getInvoiceeParty().setCorpNum("1198604153");
        taxInvoice.getInvoiceeParty().setTaxRegID("");
        taxInvoice.getInvoiceeParty().setCorpName("하몬공급받는회사");
        taxInvoice.getInvoiceeParty().setCEOName("강원석, 이석호");
        taxInvoice.getInvoiceeParty().setAddr("서울특별시 금천구 디지털로9길 32, 비동 1201호");
        taxInvoice.getInvoiceeParty().setBizType("서비스");
        taxInvoice.getInvoiceeParty().setBizClass("소프트웨어");
        taxInvoice.getInvoiceeParty().setContactID("hamoncloud");
        taxInvoice.getInvoiceeParty().setContactName("홍지혜");
//        taxInvoice.getInvoiceeParty().setTEL("01067675597");
//        taxInvoice.getInvoiceeParty().setHP("01067675597");
//        taxInvoice.getInvoiceeParty().setEmail("wisd0m@hamonsoft.co.kr");
        taxInvoice.getInvoiceeParty().setTEL("01028013349");
        taxInvoice.getInvoiceeParty().setHP("01028013349");
        taxInvoice.getInvoiceeParty().setEmail("jylee@hamonsoft.co.kr");

        // 수탁자 정보
        taxInvoice.setBrokerParty(new InvoiceParty());
        taxInvoice.getBrokerParty().setCorpNum("1198604153");
        taxInvoice.getBrokerParty().setTaxRegID("");
        taxInvoice.getBrokerParty().setCorpName("하몬");
        taxInvoice.getBrokerParty().setCEOName("강원석, 이석호");
        taxInvoice.getBrokerParty().setAddr("서울특별시 금천구 디지털로9길 32, 비동 1201호");
        taxInvoice.getBrokerParty().setBizType("서비스");
        taxInvoice.getBrokerParty().setBizClass("소프트웨어");
        taxInvoice.getBrokerParty().setContactID("hamoncloud");
        taxInvoice.getBrokerParty().setContactName("홍지혜");
        taxInvoice.getBrokerParty().setTEL("01067675597");
        taxInvoice.getBrokerParty().setHP("01067675597");
        taxInvoice.getBrokerParty().setEmail("wisd0m@hamonsoft.co.kr");

        // 품목
        taxInvoice.setTaxInvoiceTradeLineItems(new ArrayOfTaxInvoiceTradeLineItem());
        for (int i = 0; i < 1; i++) {
            TaxInvoiceTradeLineItem taxInvoiceTradeLineItem = new TaxInvoiceTradeLineItem();
            taxInvoiceTradeLineItem.setPurchaseExpiry(today);
            taxInvoiceTradeLineItem.setName("NETIS CLOUD"); // 품목
            taxInvoiceTradeLineItem.setInformation("Basic");// 규격
            taxInvoiceTradeLineItem.setChargeableUnit("1"); // 수량
            taxInvoiceTradeLineItem.setUnitPrice("100");    // 단가
            taxInvoiceTradeLineItem.setAmount("100");       // 공급가액
            taxInvoiceTradeLineItem.setTax("10");           // 세액
            taxInvoiceTradeLineItem.setDescription("");     // 비고

            taxInvoice.getTaxInvoiceTradeLineItems().getTaxInvoiceTradeLineItem().add(taxInvoiceTradeLineItem);
        }

        boolean sendSms = true;
        boolean forceIssue = true;
        String mailTitle = "세금계산서 발급";

        int result = barobillApiService.taxInvoice.registAndIssueTaxInvoice(certKey, taxInvoice.getInvoicerParty().getCorpNum(), taxInvoice, sendSms, forceIssue, mailTitle);

        logger.info("result : " + result);

        if (result < 0) { // API 호출 실패
            // 오류코드 내용에 따라 파라메터를 수정하여 다시 실행해주세요.
            String errMessage = barobillApiService.taxInvoice.getErrString(certKey, result);
            logger.info(errMessage);
        } else { // 성공
            // 파트너 프로그램의 후 처리
        }
    }

    public int issue(Member member, TaxInformation tax) {
        logger.info(tax.toString());
        String certKey = "DC632BA8-541F-48CC-B39E-7C5C2ACFAFB7";

        long paid_amount = tax.getPaid_amount();
        long vat = (long)(paid_amount * 0.1);
        long total = paid_amount + vat;

        DateFormat df = new SimpleDateFormat("yyyyMMddhhmmssSS");
        String mgtNum = df.format(new Date());
        logger.info("mgtNum : " + mgtNum);

        DateFormat df2 = new SimpleDateFormat("yyyyMMdd");
        String today = df2.format(new Date());

        TaxInvoice taxInvoice = new TaxInvoice();

        taxInvoice.setIssueDirection(1);
        taxInvoice.setTaxInvoiceType(1);

        taxInvoice.setModifyCode("");

        taxInvoice.setTaxType(1);
        taxInvoice.setTaxCalcType(1);
        taxInvoice.setPurposeType(2);

        // 중간
        taxInvoice.setWriteDate(today);     //작성일자
        taxInvoice.setAmountTotal(String.valueOf(paid_amount));   //공급가액
        taxInvoice.setTaxTotal(String.valueOf(vat));       //세액

        // 하단
        taxInvoice.setTotalAmount(String.valueOf(total));   //합계금액
        taxInvoice.setCash(String.valueOf(total));  //현금
        taxInvoice.setChkBill(""); //수표
        taxInvoice.setNote("");    //어음
        taxInvoice.setCredit("");  //외상미수금

        taxInvoice.setRemark1("");  //비고1
        taxInvoice.setRemark2("");
        taxInvoice.setRemark3("");

        taxInvoice.setKwon("");   //책번호 - 권
        taxInvoice.setHo("");     //책번호 - 호
        taxInvoice.setSerialNum("");//일련번호

        // 공급자 정보
        taxInvoice.setInvoicerParty(new InvoiceParty());
        taxInvoice.getInvoicerParty().setMgtNum(mgtNum);
        taxInvoice.getInvoicerParty().setCorpNum("1198604153");
        taxInvoice.getInvoicerParty().setTaxRegID("");
        taxInvoice.getInvoicerParty().setCorpName("(주)하몬소프트");
        taxInvoice.getInvoicerParty().setCEOName("강원석, 이석호");
        taxInvoice.getInvoicerParty().setAddr("서울특별시 금천구 디지털로9길 32, 비동 1201호");
        taxInvoice.getInvoicerParty().setBizType("서비스");
        taxInvoice.getInvoicerParty().setBizClass("소프트웨어");
        taxInvoice.getInvoicerParty().setContactID("hamoncloud");
        taxInvoice.getInvoicerParty().setContactName("홍지혜");
        taxInvoice.getInvoicerParty().setTEL("01067675597");
        taxInvoice.getInvoicerParty().setHP("01067675597");
        taxInvoice.getInvoicerParty().setEmail("wisd0m@hamonsoft.co.kr");

        //공급받는자 정보
        taxInvoice.setInvoiceeParty(new InvoiceParty());
        taxInvoice.getInvoiceeParty().setCorpNum(tax.getTaxcompanynumber());
        taxInvoice.getInvoiceeParty().setTaxRegID("");
        taxInvoice.getInvoiceeParty().setCorpName(tax.getCompanyname());
        taxInvoice.getInvoiceeParty().setCEOName(tax.getRepresentationname());
        taxInvoice.getInvoiceeParty().setAddr(tax.getAddress() + " " + tax.getDetailaddress());
        taxInvoice.getInvoiceeParty().setBizType(tax.getBusinesscondition());
        taxInvoice.getInvoiceeParty().setBizClass(tax.getBusinesskind());
        taxInvoice.getInvoiceeParty().setContactID("hamoncloud");
        taxInvoice.getInvoiceeParty().setContactName(member.getMembername());
//        taxInvoice.getInvoiceeParty().setTEL("01067675597");
//        taxInvoice.getInvoiceeParty().setHP("01067675597");
//        taxInvoice.getInvoiceeParty().setEmail("wisd0m@hamonsoft.co.kr");
        taxInvoice.getInvoiceeParty().setTEL(member.getCompanyphone());
        taxInvoice.getInvoiceeParty().setHP(member.getCelltel());
        taxInvoice.getInvoiceeParty().setEmail(tax.getTaxemail());

        // 수탁자 정보
        taxInvoice.setBrokerParty(new InvoiceParty());
        taxInvoice.getBrokerParty().setCorpNum("1198604153");
        taxInvoice.getBrokerParty().setTaxRegID("");
        taxInvoice.getBrokerParty().setCorpName("하몬");
        taxInvoice.getBrokerParty().setCEOName("강원석, 이석호");
        taxInvoice.getBrokerParty().setAddr("서울특별시 금천구 디지털로9길 32, 비동 1201호");
        taxInvoice.getBrokerParty().setBizType("서비스");
        taxInvoice.getBrokerParty().setBizClass("소프트웨어");
        taxInvoice.getBrokerParty().setContactID("hamoncloud");
        taxInvoice.getBrokerParty().setContactName("홍지혜");
        taxInvoice.getBrokerParty().setTEL("01067675597");
        taxInvoice.getBrokerParty().setHP("01067675597");
        taxInvoice.getBrokerParty().setEmail("wisd0m@hamonsoft.co.kr");

        // 품목
        taxInvoice.setTaxInvoiceTradeLineItems(new ArrayOfTaxInvoiceTradeLineItem());
        for (int i = 0; i < 1; i++) {
            TaxInvoiceTradeLineItem taxInvoiceTradeLineItem = new TaxInvoiceTradeLineItem();
            taxInvoiceTradeLineItem.setPurchaseExpiry(today);
            taxInvoiceTradeLineItem.setName("NETIS CLOUD"); // 품목
            taxInvoiceTradeLineItem.setInformation("");// 규격
            taxInvoiceTradeLineItem.setChargeableUnit("1"); // 수량
            taxInvoiceTradeLineItem.setUnitPrice(String.valueOf(paid_amount));    // 단가
            taxInvoiceTradeLineItem.setAmount(String.valueOf(paid_amount));       // 공급가액
            taxInvoiceTradeLineItem.setTax(String.valueOf(vat));           // 세액
            taxInvoiceTradeLineItem.setDescription("");     // 비고

            taxInvoice.getTaxInvoiceTradeLineItems().getTaxInvoiceTradeLineItem().add(taxInvoiceTradeLineItem);
        }

        boolean sendSms = true;
        boolean forceIssue = true;
        String mailTitle = "세금계산서 발급";

        int result = barobillApiService.taxInvoice.registAndIssueTaxInvoice(certKey, taxInvoice.getInvoicerParty().getCorpNum(), taxInvoice, sendSms, forceIssue, mailTitle);

        logger.info("result : " + result);

        if (result < 0) { // API 호출 실패
            // 오류코드 내용에 따라 파라메터를 수정하여 다시 실행해주세요.
            String errMessage = barobillApiService.taxInvoice.getErrString(certKey, result);
            logger.info(errMessage);
        } else { // 성공
            // 파트너 프로그램의 후 처리
        }
        return result;
    }

}

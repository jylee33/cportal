package com.hamonsoft.cportal.service;

import com.baroservice.api.BarobillApiService;
import com.baroservice.ws.ArrayOfTaxInvoiceTradeLineItem;
import com.baroservice.ws.InvoiceParty;
import com.baroservice.ws.TaxInvoice;
import com.baroservice.ws.TaxInvoiceTradeLineItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BaroBillHMService {

    @Autowired
    private BarobillApiService barobillApiService;

    private static final Logger logger = LoggerFactory.getLogger(BaroBillHMService.class);


    public void regist() {
        String certKey = "DC632BA8-541F-48CC-B39E-7C5C2ACFAFB7";

//        invoiceParty.setCorpNum("1198604153");
//        invoiceParty.setCorpName("하몬소프트");
//        invoiceParty.setContactID(invoicerBarobillID);

        TaxInvoice taxInvoice = new TaxInvoice();

        taxInvoice.setIssueDirection(1);
        taxInvoice.setTaxInvoiceType(1);

        taxInvoice.setModifyCode("");

        taxInvoice.setTaxType(1);
        taxInvoice.setTaxCalcType(1);
        taxInvoice.setPurposeType(2);

        taxInvoice.setWriteDate("20230926");

        taxInvoice.setAmountTotal("100");
        taxInvoice.setTaxTotal("10");
        taxInvoice.setTotalAmount("110");
        taxInvoice.setCash("110");
        taxInvoice.setChkBill("0");
        taxInvoice.setNote("0");
        taxInvoice.setCredit("0");

        taxInvoice.setRemark1("");
        taxInvoice.setRemark2("");
        taxInvoice.setRemark3("");

        taxInvoice.setKwon("");
        taxInvoice.setHo("");
        taxInvoice.setSerialNum("");

        // 공급자 정보
        taxInvoice.setInvoicerParty(new InvoiceParty());
        taxInvoice.getInvoicerParty().setMgtNum("000004");
        taxInvoice.getInvoicerParty().setCorpNum("1198604153");
        taxInvoice.getInvoicerParty().setTaxRegID("");
        taxInvoice.getInvoicerParty().setCorpName("(주)하몬소프트");
        taxInvoice.getInvoicerParty().setCEOName("강원석, 이석호");
        taxInvoice.getInvoicerParty().setAddr("서울특별시 금천구 디지털로9길 32, 비동 1201호");
        taxInvoice.getInvoicerParty().setBizType("");
        taxInvoice.getInvoicerParty().setBizClass("");
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
        taxInvoice.getInvoiceeParty().setBizType("");
        taxInvoice.getInvoiceeParty().setBizClass("");
        taxInvoice.getInvoiceeParty().setContactID("");
        taxInvoice.getInvoiceeParty().setContactName("홍지혜");
        taxInvoice.getInvoicerParty().setTEL("01067675597");
        taxInvoice.getInvoicerParty().setHP("01067675597");
        taxInvoice.getInvoicerParty().setEmail("wisd0m@hamonsoft.co.kr");

        // 수탁자 정보
        taxInvoice.setBrokerParty(new InvoiceParty());
        taxInvoice.getBrokerParty().setCorpNum("1198604153");
        taxInvoice.getBrokerParty().setTaxRegID("");
        taxInvoice.getBrokerParty().setCorpName("하몬");
        taxInvoice.getBrokerParty().setCEOName("강원석, 이석호");
        taxInvoice.getBrokerParty().setAddr("");
        taxInvoice.getBrokerParty().setBizType("");
        taxInvoice.getBrokerParty().setBizClass("");
        taxInvoice.getBrokerParty().setContactID("");
        taxInvoice.getBrokerParty().setContactName("");
        taxInvoice.getBrokerParty().setTEL("");
        taxInvoice.getBrokerParty().setHP("");
        taxInvoice.getBrokerParty().setEmail("");

        // 품목
        taxInvoice.setTaxInvoiceTradeLineItems(new ArrayOfTaxInvoiceTradeLineItem());
        for (int i = 0; i < 4; i++) {
            TaxInvoiceTradeLineItem taxInvoiceTradeLineItem = new TaxInvoiceTradeLineItem();
            taxInvoiceTradeLineItem.setPurchaseExpiry("");
            taxInvoiceTradeLineItem.setName("");
            taxInvoiceTradeLineItem.setInformation("");
            taxInvoiceTradeLineItem.setChargeableUnit("");
            taxInvoiceTradeLineItem.setUnitPrice("");
            taxInvoiceTradeLineItem.setAmount("");
            taxInvoiceTradeLineItem.setTax("");
            taxInvoiceTradeLineItem.setDescription("");

            taxInvoice.getTaxInvoiceTradeLineItems().getTaxInvoiceTradeLineItem().add(taxInvoiceTradeLineItem);
        }

        boolean sendSms = false;
        boolean forceIssue = false;
        String mailTitle = "";

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

}

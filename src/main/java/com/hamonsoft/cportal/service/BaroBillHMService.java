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
        taxInvoice.setTotalAmount("1");
        taxInvoice.setCash("100");
        taxInvoice.setChkBill("");
        taxInvoice.setNote("");
        taxInvoice.setCredit("");

        taxInvoice.setRemark1("");
        taxInvoice.setRemark2("");
        taxInvoice.setRemark3("");

        taxInvoice.setKwon("");
        taxInvoice.setHo("");
        taxInvoice.setSerialNum("");

        // 공급자 정보
        taxInvoice.setInvoicerParty(new InvoiceParty());
        taxInvoice.getInvoicerParty().setMgtNum("");
        taxInvoice.getInvoicerParty().setCorpNum("");
        taxInvoice.getInvoicerParty().setTaxRegID("");
        taxInvoice.getInvoicerParty().setCorpName("");
        taxInvoice.getInvoicerParty().setCEOName("");
        taxInvoice.getInvoicerParty().setAddr("");
        taxInvoice.getInvoicerParty().setBizType("");
        taxInvoice.getInvoicerParty().setBizClass("");
        taxInvoice.getInvoicerParty().setContactID("");
        taxInvoice.getInvoicerParty().setContactName("");
        taxInvoice.getInvoicerParty().setTEL("");
        taxInvoice.getInvoicerParty().setHP("");
        taxInvoice.getInvoicerParty().setEmail("");

        //공급받는자 정보
        taxInvoice.setInvoiceeParty(new InvoiceParty());
        taxInvoice.getInvoiceeParty().setCorpNum("");
        taxInvoice.getInvoiceeParty().setTaxRegID("");
        taxInvoice.getInvoiceeParty().setCorpName("");
        taxInvoice.getInvoiceeParty().setCEOName("");
        taxInvoice.getInvoiceeParty().setAddr("");
        taxInvoice.getInvoiceeParty().setBizType("");
        taxInvoice.getInvoiceeParty().setBizClass("");
        taxInvoice.getInvoiceeParty().setContactID("");
        taxInvoice.getInvoiceeParty().setContactName("");
        taxInvoice.getInvoiceeParty().setTEL("");
        taxInvoice.getInvoiceeParty().setHP("");
        taxInvoice.getInvoiceeParty().setEmail("");

        // 수탁자 정보
        taxInvoice.setBrokerParty(new InvoiceParty());
        taxInvoice.getBrokerParty().setCorpNum("");
        taxInvoice.getBrokerParty().setTaxRegID("");
        taxInvoice.getBrokerParty().setCorpName("");
        taxInvoice.getBrokerParty().setCEOName("");
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

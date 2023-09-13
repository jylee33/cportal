package com.hamonsoft.cportal.controller;

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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
@RequiredArgsConstructor
@RequestMapping("/iamport")
public class IamportHMClient {

    private final IamportClient iamportClient;
    private static final Logger logger = LoggerFactory.getLogger(BillController.class);

    protected Iamport iamport = null;

    String apiKey = "0534302583438521";
    String apiSecret = "RldZHse07tEdv7luguc4oh6bJdcWvLluhsbo8Jg3dIL94Azrw3BhDuFKDjLTavBHxeBNjgOgKdKwfqTy";

    public IamportHMClient() {
        logger.info("call IamportHMClient constructor ......................");
        this.iamportClient = new IamportClient(this.apiKey, this.apiSecret);
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

        logger.info(df.format(new Date()) + "_" + n);
        return df.format(new Date()) + "_" + n;
    }

    @PostMapping("/again")
    public IamportResponse<Payment> againPayment(String customer_uid, long paid_amount) throws IamportResponseException, IOException {
        logger.info("call againPayment ......................");
        logger.info("customer_uid - " + customer_uid);
        logger.info("paid_amount - " + paid_amount);

        AccessToken auth = getAuth().getResponse();
        AgainPaymentData againData = new AgainPaymentData(customer_uid, getRandomMerchantUid(), BigDecimal.valueOf(paid_amount));
        againData.setName("NETIS CLOUD");

        IamportResponse<Payment> response = iamportClient.againPayment(againData);

        return response;
    }


    @PostMapping("/{imp_uid}")
    public IamportResponse<Payment> paymentByImpUid(@PathVariable String imp_uid) throws IamportResponseException, IOException {
        logger.info("paymentByImpUid 진입");
        return iamportClient.paymentByImpUid(imp_uid);
    }

}

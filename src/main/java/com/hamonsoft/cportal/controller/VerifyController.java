package com.hamonsoft.cportal.controller;

import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
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

@RestController
@RequiredArgsConstructor
@RequestMapping("/verifyIamport")
public class VerifyController {

    private final IamportClient iamportClient;
    private static final Logger logger = LoggerFactory.getLogger(BillController.class);


    String apiKey = null;
    String apiSecret = null;

    public VerifyController() {
        this.iamportClient = new IamportClient("0534302583438521", "RldZHse07tEdv7luguc4oh6bJdcWvLluhsbo8Jg3dIL94Azrw3BhDuFKDjLTavBHxeBNjgOgKdKwfqTy");
    }

    @PostMapping("/{imp_uid}")
    public IamportResponse<Payment> paymentByImpUid(@PathVariable String imp_uid) throws IamportResponseException, IOException {
        logger.info("paymentByImpUid 진입");
        return iamportClient.paymentByImpUid(imp_uid);
    }

}

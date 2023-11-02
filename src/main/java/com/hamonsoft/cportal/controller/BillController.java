package com.hamonsoft.cportal.controller;

import com.hamonsoft.cportal.service.BoardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Controller
@RequestMapping("/bill")
public class BillController {

    private static final Logger logger = LoggerFactory.getLogger(BillController.class);

    BoardService boardService;

    @Autowired
    public BillController(BoardService boardService) {
        this.boardService = boardService;
    }

    @GetMapping(value = "pay")
    public String pay(Model model) {
        logger.info("call pay ---------------");

        return "bill/pay";
    }

    @GetMapping(value = "checkpay")
    public void checkPay(HttpServletRequest request, Model model) {
        logger.info("call checkPay ---------------");

        RestTemplate restTemplate = new RestTemplate();
        String reqUrl = request.getRequestURL().toString();
        String contextPath = request.getContextPath();
        String cpath = reqUrl.substring(0, reqUrl.indexOf(contextPath)) + contextPath;
        String port = String.valueOf(request.getServerPort());
        String url = "http://localhost:" + port + "/" + cpath + "/iamport/payall";
        logger.info("url - " + url);

        // Header set
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Body set
        Map<String, Object> body = new HashMap<>();

//        body.put("email", email);
//        body.put("customer_uid", customer_uid);
//        body.put("paid_amount", paid_amount);

        // Request Message
        HttpEntity<?> req = new HttpEntity<>(body, headers);

        // Request
        ResponseEntity<String> response = restTemplate.postForEntity(url, req, String.class);

        String resBody = response.getBody();
        logger.info("response - " + resBody);
    }

    @GetMapping(value = "again")
    public void againPayment(@RequestParam("email") String email, Model model) {
        logger.info("againPayment call --------------------------------");

        model.addAttribute("email", email);

    }

}

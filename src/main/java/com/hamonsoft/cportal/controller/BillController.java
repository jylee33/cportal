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

    @GetMapping(value = "forcedpayall")
    public void forcedPayAll(Model model) {
        logger.info("call forcedPayAll ---------------");

        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:8080/portal/iamport/payall";
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
        HttpEntity<?> request = new HttpEntity<>(body, headers);

        // Request
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
    }

    @GetMapping(value = "schedule")
    public void schedule(Model model) {
        logger.info("call schedule ---------------");
    }

    @PostMapping(value = "complete")
    public void complete(@RequestBody HashMap<String, Object> list) {
        logger.info("call complete ---------------");
        logger.info("customer_uid --- " + list);

    }
}

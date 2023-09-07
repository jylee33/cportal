package com.hamonsoft.cportal.controller;

import com.hamonsoft.cportal.service.BoardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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

    @GetMapping(value = "schedule")
    public void schedule(Model model) {
        logger.info("call schedule ---------------");

    }

    @PostMapping(value = "complete")
    public void complete(String imp_uid, String merchant_uid) {
//        int tmp = Integer.parseInt(amount);
//        int months = tmp/15000; //개월 수로 치환 -> 기간 갱신을 위함
//        Map<String, Object> map = new HashMap<>();
//        map.put("ID", ID);
//        map.put("months", months);
//
//        if(userService.paidCheck(ID) == "Y") {
//            userService.rePaid(map);
//        }
//        else {
//            userService.paid(map); //첫 결제시 : map에 ID, 개월 수 넣고 DB갱신
//        }
//
//        userService.paidUpdate(months);//관리자페이지 일 결제 조회를 위해 추가 - 02.19

        Map<String, Object> map = new HashMap<>();
        map.put("imp_uid", imp_uid);
        map.put("merchant_uid", merchant_uid);

    }
}

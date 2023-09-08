package com.hamonsoft.cportal.controller;

import com.hamonsoft.cportal.service.BoardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

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

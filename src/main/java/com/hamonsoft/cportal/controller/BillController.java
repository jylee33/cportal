package com.hamonsoft.cportal.controller;

import com.hamonsoft.cportal.service.BoardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


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
    public String list(Model model) {
        model.addAttribute("name", "test");
        return "thymeleaf/bill/pay";
    }

}

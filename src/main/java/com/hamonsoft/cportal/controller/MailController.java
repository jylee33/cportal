package com.hamonsoft.cportal.controller;

import com.hamonsoft.cportal.service.BoardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
@RequestMapping("/mail")
public class MailController {

    private static final Logger logger = LoggerFactory.getLogger(MailController.class);

    BoardService boardService;

    @Autowired
    public MailController(BoardService boardService) {
        this.boardService = boardService;
    }

    @GetMapping(value = "")
    public String mail(Model model) {
        model.addAttribute("name", "test");
        return "mail/mail";
    }

    @GetMapping(value = "test_mail")
    public String test_mail(@RequestParam("mailto") String mailto, Model model) {
        model.addAttribute("mailto", mailto);
        return "mail/test_mail";
    }

}

package com.hamonsoft.cportal.controller;

import com.hamonsoft.cportal.service.BaroBillHMService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/barobill")
public class BaroBillHMController {

    private static final Logger logger = LoggerFactory.getLogger(BaroBillHMController.class);

    BaroBillHMService baroBillHMService;

    @Autowired
    public BaroBillHMController(BaroBillHMService baroBillHMService) {
        this.baroBillHMService = baroBillHMService;
    }

    @GetMapping(value = "regist")
    public void regist(Model model) {
        logger.info("call regist ---------------");
        baroBillHMService.regist();
    }
}

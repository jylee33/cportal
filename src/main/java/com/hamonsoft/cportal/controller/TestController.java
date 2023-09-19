package com.hamonsoft.cportal.controller;

import com.hamonsoft.cportal.service.TestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/test")
public class TestController {

    private static final Logger logger = LoggerFactory.getLogger(TestController.class);

    TestService testService;

    @Autowired
    public TestController(TestService testService) {
        this.testService = testService;
    }

    @GetMapping(value = "jqgrid")
    public void jqgrid(Model model) {

    }
    @GetMapping(value = "jqgrid_002")
    public void jqgrid_002(Model model) {

    }

    @GetMapping(value = "jqxgrid")
    public void jqxgrid(Model model) {

    }

    @GetMapping(value = "again")
    public void againPayment(@RequestParam("email") String email, Model model) {
        logger.info("againPayment call --------------------------------");

        model.addAttribute("email", email);

    }

    @GetMapping(value = "billing")
    public void billing(Model model) {
        logger.info("call billing ---------------");
    }

    @GetMapping(value = "/test50") // memberinfo
    public void test50(HttpServletRequest request) throws Exception {
        logger.info("LicenseManageController 1111 test50 ---->");
    }
    @GetMapping(value = "/test53") // memberinfo
    public void test53(HttpServletRequest request) throws Exception {
        logger.info("LicenseManageController 1111 test50 ---->");
    }
}

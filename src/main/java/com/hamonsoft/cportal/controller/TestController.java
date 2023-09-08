package com.hamonsoft.cportal.controller;

import com.hamonsoft.cportal.service.TestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

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


}

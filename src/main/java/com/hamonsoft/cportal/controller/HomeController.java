package com.hamonsoft.cportal.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.text.DateFormat;
import java.util.Date;
import java.util.Locale;

@Controller
public class HomeController {

    private static final Logger logger = LoggerFactory.getLogger(HomeController.class);

    @GetMapping("/index")
    public String index(Model model) {
        logger.info("index --------------------------------------");

        model.addAttribute("data", "Hello, Spring from IntelliJ! :)");
        model.addAttribute("name", "Jay");
        return "index";
    }

    @GetMapping(value = "/")
    public String home(Locale locale, Model model) {
        logger.info("Welcome home! The client locale is {}.", locale);

        Date date = new Date();
        DateFormat dateFormat = DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG, locale);

        String formattedDate = dateFormat.format(date);

        model.addAttribute("serverTime", formattedDate);
        model.addAttribute("name", "Jay");

        return "thymeleaf/home";  // JSP 와 Thymeleaf 를 동시에 사용하기 위해서는 application.properties 에 설정하고, return "thymeleaf/home" 을 사용해야 한다.
//        return "home";    // JSP 에서 사용
    }
}

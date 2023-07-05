package com.hamonsoft.cportal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

import javax.servlet.ServletInputStream;

@SpringBootApplication
public class CportalApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(ServletInputStream.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(CportalApplication.class, args);
    }

}

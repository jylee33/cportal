package com.hamonsoft.cportal.config;

import com.baroservice.api.BarobillApiProfile;
import com.baroservice.api.BarobillApiService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.MalformedURLException;

@Configuration
public class BaroBillConfig {

    @Bean
    public BarobillApiService barobillApiService() throws MalformedURLException {
        return new BarobillApiService(BarobillApiProfile.TESTBED);
    }
}

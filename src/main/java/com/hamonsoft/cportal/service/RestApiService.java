package com.hamonsoft.cportal.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.dto.ResultDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@Component
public class RestApiService {

    @Value("${rest.url}")
    String url;

    private static final Logger logger = LoggerFactory.getLogger(RestApiService.class);


    public ResultDto addUser(Member member) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        url += "/user_manager/add_user";

        // Header set
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
//        headers.add("netis-route", "free1");
        headers.add("netis-route", member.getHostname());

        // Body set
        Map<String, Object> body = new HashMap<>();

        body.put("USER_ID", member.getEmail());
        body.put("PASSWORD", member.getPassword());
        body.put("USER_NAME", member.getMembername());
        body.put("GRP_NAME", member.getGrpname());
        body.put("EMAIL", member.getEmail());
        body.put("CELL_TEL", member.getCelltel());
        body.put("CLOUD_GRADE", member.getLicensegrade());

        // Request Message
        HttpEntity<?> request = new HttpEntity<>(body, headers);

        // Request
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        // Response 파싱
        ObjectMapper objectMapper = new ObjectMapper();
//        objectMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
//        objectMapper.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
//        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
//        objectMapper.configure(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES, false);
//        objectMapper.configure(DeserializationFeature.FAIL_ON_NUMBERS_FOR_ENUMS, false);
//        objectMapper.configure(DeserializationFeature.USE_JAVA_ARRAY_FOR_JSON_ARRAY, true);

        ResultDto dto = objectMapper.readValue(response.getBody(), ResultDto.class);

        return dto;
    }
}


package com.hamonsoft.cportal.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.domain.MemberTaxInformation;
import com.hamonsoft.cportal.domain.TaxInformation;
import com.hamonsoft.cportal.dto.ResultDto;
import com.hamonsoft.cportal.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
//@Transactional
public class UserService {

    @Value("${rest.url}")
    String restURL;

    UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Member memberInfo(Member member) {
        return userRepository.memberInfo(member);
    }

    public TaxInformation taxInfo(Member member) {
        return userRepository.taxInfo(member);
    }

    @Transactional(rollbackFor = {Exception.class})
    public ResultDto chgmember(Member member, TaxInformation taxInformation) {
        ResultDto resultDto = new ResultDto();
        try {
            resultDto = chgMemberInfo(member);
            if (resultDto.getTRAN_STATUS() != 1) {
                throw new RuntimeException();
            }

            userRepository.chgmember(member);
            userRepository.chgtaxinformation(taxInformation);

            resultDto = chgGrade(member);
            if (resultDto.getTRAN_STATUS() != 1) {
                throw new RuntimeException();
            }

            userRepository.chggrade(member);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        } catch (RuntimeException ex) {
            ex.printStackTrace();
        }

        return resultDto;
    }

    @Transactional(rollbackFor = {Exception.class})
    public ResultDto chgpw(Member member) {
        ResultDto resultDto = new ResultDto();
        try {
            resultDto = chgPassword(member);
            if (resultDto.getTRAN_STATUS() != 1) {
                throw new RuntimeException();
            }

            userRepository.chgpw(member);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        } catch (RuntimeException ex) {
            ex.printStackTrace();
        }

        return resultDto;

    }

    private ResultDto chgMemberInfo(Member member) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        String url = restURL + "/user_manager/change_info";
        logger.info("url - " + url);

        // Header set
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Body set
        Map<String, Object> body = new HashMap<>();

        body.put("USER_ID", member.getEmail());
        body.put("USER_NAME", member.getMembername());
        body.put("GRP_NAME", member.getGrpname());
        body.put("EMAIL", member.getEmail());
        body.put("CELL_TEL", member.getCelltel());
//        body.put("CLOUD_GRADE", member.getLicensegrade());

        // Request Message
        HttpEntity<?> request = new HttpEntity<>(body, headers);

        // Request
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        // Response 파싱
        ObjectMapper objectMapper = new ObjectMapper();

        ResultDto dto = objectMapper.readValue(response.getBody(), ResultDto.class);

        return dto;
    }

    private ResultDto chgGrade(Member member) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        String url = restURL + "/user_manager/change_grade";
        logger.info("url - " + url);

        // Header set
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Body set
        Map<String, Object> body = new HashMap<>();

        body.put("USER_ID", member.getEmail());
        body.put("CLOUD_GRADE", member.getLicensegrade());

        // Request Message
        HttpEntity<?> request = new HttpEntity<>(body, headers);

        // Request
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        // Response 파싱
        ObjectMapper objectMapper = new ObjectMapper();

        ResultDto dto = objectMapper.readValue(response.getBody(), ResultDto.class);

        return dto;
    }

    private ResultDto chgPassword(Member member) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        String url = restURL + "/user_manager/change_password";
        logger.info("url - " + url);

        // Header set
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Body set
        Map<String, Object> body = new HashMap<>();

        body.put("USER_ID", member.getEmail());
        body.put("PASSWORD", member.getPassword());

        // Request Message
        HttpEntity<?> request = new HttpEntity<>(body, headers);

        // Request
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        // Response 파싱
        ObjectMapper objectMapper = new ObjectMapper();

        ResultDto dto = objectMapper.readValue(response.getBody(), ResultDto.class);

        return dto;
    }


    @Transactional(rollbackFor = {Exception.class})
    public ResultDto withdrawal(Member member) {
        ResultDto resultDto = new ResultDto();
        try {
            resultDto = closeUser(member);
            if (resultDto.getTRAN_STATUS() != 1) {
                throw new RuntimeException();
            }

            userRepository.withdrawal(member);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        } catch (RuntimeException ex) {
            ex.printStackTrace();
        }

        return resultDto;
    }

    private ResultDto closeUser(Member member) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        String url = restURL + "/user_manager/close_user";
        logger.info("url - " + url);

        // Header set
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Body set
        Map<String, Object> body = new HashMap<>();

        body.put("USER_ID", member.getEmail());

        // Request Message
        HttpEntity<?> request = new HttpEntity<>(body, headers);

        // Request
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        // Response 파싱
        ObjectMapper objectMapper = new ObjectMapper();

        ResultDto dto = objectMapper.readValue(response.getBody(), ResultDto.class);

        return dto;
    }
    public ArrayList<HashMap<String, Object>> findAll() {
        return userRepository.findAll();
    }



}

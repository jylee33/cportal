package com.hamonsoft.cportal.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hamonsoft.cportal.domain.Authentication;
import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.domain.MemberLicense;
import com.hamonsoft.cportal.domain.TaxInformation;
import com.hamonsoft.cportal.dto.LoginDTO;
import com.hamonsoft.cportal.dto.MemberLicenseDto;
import com.hamonsoft.cportal.dto.RequestIPDTO;
import com.hamonsoft.cportal.dto.ResultDto;
import com.hamonsoft.cportal.repository.MemberRepository;
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

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Service
//@Transactional
public class MemberService {

    @Value("${rest.url}")
    String restURL;

    MemberRepository memberRepository;
    private static final Logger logger = LoggerFactory.getLogger(MemberService.class);

    @Autowired
    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public String getTime() {
        return memberRepository.getTime();
    }

    public Member selectMember(String email) {
        return memberRepository.selectMember(email);
    }

    public HashMap<String, Object> selectTaxByEmail(String email) {
        return memberRepository.selectTaxByEmail(email);
    }

    public TaxInformation taxInfo(String email) {
        return memberRepository.taxInfo(email);
    }

    public ArrayList<HashMap<String, String>> selectBaseLicense() {
        return memberRepository.selectBaseLicense();
    }

    public void updatePayInformation(Map<String, Object> paramMap) {
        memberRepository.updatePayInformation(paramMap);
    }

    public void insertPayHistory(Map<String, Object> paramMap) {
        memberRepository.insertPayHistory(paramMap);
    }

    public ArrayList<HashMap<String, String>> selectEmails() {
        return memberRepository.selectEmails();
    }

    public String selectSettlementmeans(String email) {
        return memberRepository.selectSettlementmeans(email);
    }

    @Transactional(rollbackFor = {Exception.class})
    public ResultDto insertMember(Member member, TaxInformation taxInformation, Authentication authentication, MemberLicense license) {
        ResultDto resultDto = new ResultDto();
        try {
            resultDto = addUser(member);
            if (resultDto.getTRAN_STATUS() != 1) {
                throw new RuntimeException();
            }

            LocalDate ldNow = LocalDate.now();
            int today = ldNow.getDayOfMonth();
            int endday = ldNow.lengthOfMonth();
            int dCount = endday - today + 1;
            long paid_amount2 = taxInformation.getPaid_amount() * dCount / endday;  // 일할 계산
            logger.info("일할 계산된 paid_amount2 - " + paid_amount2);
            taxInformation.setPaid_amount(paid_amount2);

            LocalDate ldNextMonth = ldNow.plusMonths(1).withDayOfMonth(1);
            Instant instant = ldNextMonth.atStartOfDay(ZoneId.systemDefault()).toInstant();
            Date dtNext = Date.from(instant);
            taxInformation.setNext_pay_date(dtNext);
            member.setMemberid(resultDto.getUUID());
            member.setHostname(resultDto.getHOST_NAME());
            memberRepository.insertMember(member);
            memberRepository.insertTaxInfomation(taxInformation);
            memberRepository.insertAuthentication(authentication);
            memberRepository.insertMemberLicense(license);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            resultDto.setTRAN_STATUS(-1);
            throw new RuntimeException(e);
        } catch (RuntimeException ex) {
            ex.printStackTrace();
            resultDto.setTRAN_STATUS(-1);
        }

        return resultDto;
    }

    private ResultDto addUser(Member member) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        String url = restURL + "/user_manager/add_user";
        logger.info("url - " + url);

        // Header set
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("netis-route", "free1");


        // Body set
        Map<String, Object> body = new HashMap<>();

        body.put("USER_ID", member.getEmail());
        body.put("PASSWORD", member.getPassword());
        body.put("USER_NAME", member.getMembername());
        body.put("GRP_NAME", member.getGrpname());
        body.put("EMAIL", member.getEmail());
        body.put("CELL_TEL", member.getCelltel());
        body.put("CLOUD_GRADE", member.getLicensegrade());
        int credit = 0;
        if(member.getLicensegrade() == 1){
            credit = 5;
        }else if(member.getLicensegrade() == 2) {
            credit = 25;

        }else if(member.getLicensegrade() == 3) {
            credit = 50;

        }else if(member.getLicensegrade() == 4) {
            credit = 100;
        }
        body.put("CREDIT",credit);
        member.setCredit(credit);

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

    public List<Member> listAll() {
        return memberRepository.listAll();
    }

    public ArrayList<HashMap<String, Object>> findAll() {
        return memberRepository.findAll();
    }

    public HashMap<String, Object> getIpAddress(String uuid) {
        return memberRepository.getIpAddress(uuid);
    }

    public Member login(LoginDTO dto) {
        return memberRepository.login(dto);
    }

    public void keepLogin(Map<String, Object> paramMap) {
        memberRepository.keepLogin(paramMap);
    }

    public Member checkUserWithSessionKey(Map<String, Object> paramMap) {
        return memberRepository.checkUserWithSessionKey(paramMap);
    }

    public String findId(Map<String, Object> paramMap) {
        return memberRepository.fineId(paramMap);
    }

    public void updatePw(Map<String, Object> paramMap) {
        memberRepository.updatePw(paramMap);
    }

    public void emailcertification(Map<String, Object> paramMap) {
        memberRepository.emailcertification(paramMap);
    }


    public int existsEmail(String email)  {
        return memberRepository.existsEmail(email);
    }

}

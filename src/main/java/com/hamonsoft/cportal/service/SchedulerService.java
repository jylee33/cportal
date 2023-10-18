package com.hamonsoft.cportal.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hamonsoft.cportal.ScheduleTaskClass;
import com.hamonsoft.cportal.domain.JsonUseVolume;
import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.dto.ChildResultDto;
import com.hamonsoft.cportal.dto.NetisUseServiceDto;
import com.hamonsoft.cportal.dto.ResultDto;
import com.hamonsoft.cportal.repository.MemberInfoRepository;
import com.hamonsoft.cportal.repository.MemberRepository;
import com.hamonsoft.cportal.repository.SchedulerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@ReadingConverter
public class SchedulerService {
    private static final Logger logger = LoggerFactory.getLogger(SchedulerService.class);

    @Value("${rest.url}")
    String restURL;

    @Autowired
    SchedulerRepository schedulerrepository;


    @Autowired
    MemberInfoRepository memberinfoRepository;

    @Autowired
    MemberRepository memberRepository;


    public String memberAllList() throws Exception{
        String msgtext = "";
        try {
            msgtext = "정상적으로 작업이 완료 되었습니다.";
            NetisUseServiceDto netisUseServiceDto = new NetisUseServiceDto();
            ArrayList <HashMap<String,Object>> memberList = schedulerrepository.memberAllList();
            ArrayList<JsonUseVolume> createUseDevice = new ArrayList<JsonUseVolume>();
            logger.info("memberList ==> "+memberList.size());
            String email = "";
            for(int i = 0; i < memberList.size(); i++){
                HashMap<String, Object> addmap = new HashMap<String,Object>();
                email = memberList.get(i).get("email").toString();
                addmap.put("email",email);
                logger.info("email  "+email);
                netisUseServiceDto = serviceInfo(email);
                String usedeviceid = memberinfoRepository.jsonUseDeviceCount(email);
                logger.info("usedeviceid  "+usedeviceid);
                JsonUseVolume jsonUseVolume = new JsonUseVolume();
                if (netisUseServiceDto.getTRAN_STATUS() != 1) {
                    jsonUseVolume.setUserid(email);
                    jsonUseVolume.setFlag("F");
                    jsonUseVolume.setInfo("");
                    jsonUseVolume.setReason("");
                    jsonUseVolume.setTranstatus(null);
                    jsonUseVolume.setNmscount(null);
                    jsonUseVolume.setSmscount(null);
                    jsonUseVolume.setDbmscount(null);
                    jsonUseVolume.setApcount(null);
                    jsonUseVolume.setFmscount(null);
                    jsonUseVolume.setUsedeviceid(usedeviceid);
                }else{
                    jsonUseVolume.setUserid(email);
                    jsonUseVolume.setFlag("S");
                    jsonUseVolume.setInfo(netisUseServiceDto.getINFO().toString());
                    jsonUseVolume.setReason(netisUseServiceDto.getREASON());;
                    jsonUseVolume.setTranstatus(netisUseServiceDto.getTRAN_STATUS());
                    jsonUseVolume.setNmscount(netisUseServiceDto.getINFO().getNMS_COUNT());
                    jsonUseVolume.setSmscount(netisUseServiceDto.getINFO().getSMS_COUNT());
                    jsonUseVolume.setDbmscount(netisUseServiceDto.getINFO().getDBMS_COUNT());
                    jsonUseVolume.setApcount(netisUseServiceDto.getINFO().getAP_COUNT());
                    jsonUseVolume.setFmscount(netisUseServiceDto.getINFO().getFMS_COUNT());
                    jsonUseVolume.setUsedeviceid(usedeviceid);
                    schedulerrepository.batchUseDeviceInsert(jsonUseVolume);
                }
                logger.info("list 순서 " + i + "번쨰  "+memberList.get(i).get("email").toString());
//                for( Map.Entry<String, Object> elem : memberList.get(i)..entrySet()){
//                    // list 각각 hashmap받아서 출력합니다.
//                    logger.info(String.format("키 : %s, 값 : %s", elem.getKey(), elem.getValue()));
//                }
            }
//            logger.info("createUseDevice --> "+createUseDevice);
//            schedulerrepository.batchUseDeviceInsert(createUseDevice);
            msgtext = "정상적으로 작업이 완료 되었습니다.";
        } catch (RuntimeException ex) {
            ex.printStackTrace();
            msgtext = "자료저장에 실패 했습니다.";
        }finally {
            return msgtext;
        }
    }


    private NetisUseServiceDto serviceInfo(String email) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        String url = restURL + "/user_manager/service_info";
        logger.info("url - " + url);

        Member member = memberRepository.selectMember(email);

        // Header set
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
//        headers.add("netis-route", "free1");
        headers.add("netis-route", member.getHostname());

        // Body set
        Map<String, Object> body = new HashMap<>();

        body.put("USER_ID", email);

        // Request Message
        HttpEntity<?> request = new HttpEntity<>(body, headers);

        // Request
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        // Response 파싱
        ObjectMapper objectMapper = new ObjectMapper();

        String resBody = response.getBody();
        logger.info("response - " + resBody);

        NetisUseServiceDto dto = objectMapper.readValue(resBody, NetisUseServiceDto.class);

        return dto;
    }
}




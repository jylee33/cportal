package com.hamonsoft.cportal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
public class ScheduleTaskClass {

    private static final Logger logger = LoggerFactory.getLogger(ScheduleTaskClass.class);

    @Scheduled(cron = "0 30 9 * * ?") // 초, 분, 일, 월 - 매일 오전 9시 30분에 실행
    @Scheduled(cron = "0 30 17 * * ?") // 초, 분, 일, 월 - 매일 오후 5시 30분에 실행
// @Scheduled(cron = "0 15 10 15 11 ?") // 11월 15일 오전 10시 15분에 실행
// @Scheduled(cron = "${cron.expression}")
// @Scheduled(cron = "0 15 10 15 * ?", zone = "Europe/Paris") // timezone 설정
    public void schedulerPayAll1() {
        /* 아래는 특정 url 을 get 방식으로 브라우저 없이 실행하기
        URL url;//URL 주소 객체
        URLConnection connection;//URL접속을 가지는 객체
        InputStream is;//URL접속에서 내용을 읽기위한 Stream
        InputStreamReader isr;
        BufferedReader br;

        try{
            //URL객체를 생성하고 해당 URL로 접속한다..
            url = new URL("http://localhost:8080/portal/bill/payall");
            connection = url.openConnection();

            //내용을 읽어오기위한 InputStream객체를 생성한다..
            is = connection.getInputStream();
            isr = new InputStreamReader(is);
            br = new BufferedReader(isr);

            //내용을 읽어서 화면에 출력한다..
            String buf = null;
            while(true){
                buf = br.readLine();
                if(buf == null) break;
                System.out.println(buf);
            }
        }catch(MalformedURLException mue){
            System.err.println("잘못되 URL입니다. 사용법 : java URLConn http://hostname/path]");
            System.exit(1);
        }catch(IOException ioe){
            System.err.println("IOException " + ioe);
            ioe.printStackTrace();
            System.exit(1);
        }*/

        // 아래는 POST 방식으로 전 멤버에 대해 pay 루틴을 타도록 한다.
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:8080/portal/iamport/payall";
        logger.info("url - " + url);

        // Header set
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Body set
        Map<String, Object> body = new HashMap<>();

//        body.put("email", email);
//        body.put("customer_uid", customer_uid);
//        body.put("paid_amount", paid_amount);

        // Request Message
        HttpEntity<?> request = new HttpEntity<>(body, headers);

        // Request
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        String resBody = response.getBody();
        logger.info("response - " + resBody);

        // Response 파싱
//        ObjectMapper objectMapper = new ObjectMapper();

    }
/*
    @Scheduled(cron = "0 58 16 * * ?") // 초, 분, 일, 월 - 매일 오전 10시 0분에 실행
    public void schedulerPayAll2() {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:8080/portal/iamport/payall";
        logger.info("url - " + url);

        // Header set
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Body set
        Map<String, Object> body = new HashMap<>();

//        body.put("email", email);
//        body.put("customer_uid", customer_uid);
//        body.put("paid_amount", paid_amount);

        // Request Message
        HttpEntity<?> request = new HttpEntity<>(body, headers);

        // Request
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        // Response 파싱
//        ObjectMapper objectMapper = new ObjectMapper();

    }*/

}

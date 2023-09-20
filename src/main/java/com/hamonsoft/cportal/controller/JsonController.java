package com.hamonsoft.cportal.controller;

import com.hamonsoft.cportal.domain.JsonUseVolume;
import com.hamonsoft.cportal.service.JsonUseVloumeService;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.io.FileReader;
import java.io.Reader;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@Controller
public class JsonController {

    private static final Logger logger = LoggerFactory.getLogger(ChargeGuideController.class);

    @Resource
    private JsonUseVloumeService jsonUseVloumeService;
    @RequestMapping(value = "/json", method = RequestMethod.GET)
    public String json() {
        logger.info("json.......................................");
        //NETIS CLOUD의 RESTAPI 서버 정보 125.141.17.60:60003/cloud/v1/user_manage/service_info
        return "json";
    }

    @ResponseBody
    @RequestMapping(value = "/test", method = RequestMethod.POST)
    public void init(@RequestBody HashMap<String, Object> map) {
        logger.info("init......................................."+map.toString());
        // {name=vita, age=25} 출력
    }

    @ResponseBody
//    @RequestMapping(value = "/jsonread", method = RequestMethod.GET)
    @RequestMapping(value = "/jsonread", produces = "application/text; charset=utf8") // produces내용 추가
    public Map<String, String> readJson() throws Exception {

        JSONParser parser = new JSONParser();
        // JSON 파일 읽기
        String fileName = "D:\\jsonfile\\11111.json";
        logger.info("fileName......................................."+fileName);

        Reader reader = new FileReader(fileName);

        JSONObject jsonMainObj = (JSONObject) parser.parse(reader);
        int objSize = jsonMainObj.size();
        logger.info("reader-->"+reader.toString()+"..."+(char)reader.read()+"........."+objSize);

        JSONObject jsonSubObj = (JSONObject)jsonMainObj.get("info");

        int tran_status = (Integer) jsonMainObj.get("tran_status");
        String reason = (String) jsonMainObj.get("reason");
        logger.info("tran_status -> "+tran_status+ " reason==> " + reason);
        Map<String, String> deviceUse = new HashMap<>();
        deviceUse.put("tran_status", tran_status+"");
        deviceUse.put("reason", reason);
        deviceUse.put("info", jsonSubObj.toJSONString());
        Iterator iterS = jsonSubObj.entrySet().iterator();
        while(iterS.hasNext()){
            Map.Entry<String, String> entryS = (Map.Entry<String, String>) iterS.next();
            deviceUse.put(entryS.getKey(), entryS.getValue());
            logger.info(iterS.getClass()+"............."+entryS.getKey() + "==> " + entryS.getValue());
        }
        logger.info("deviceUse -> "+deviceUse.toString());
        JsonUseVolume jsonUseVolume = new JsonUseVolume();

        jsonUseVolume.setNmscount(Integer.valueOf(deviceUse.get("nms_count")));
        jsonUseVolume.setSmscount(Integer.valueOf(deviceUse.get("sms_count")));
        jsonUseVolume.setDbmscount(Integer.valueOf(deviceUse.get("dbms_count")));
        jsonUseVolume.setApcount(Integer.valueOf(deviceUse.get("ap_count")));
        jsonUseVolume.setFmscount(Integer.valueOf(deviceUse.get("fms_count")));
        jsonUseVolume.setInfo(jsonSubObj.toString());
        jsonUseVolume.setTranstatus(tran_status);
        jsonUseVolume.setReason(reason);
        jsonUseVolume.setUserid("testmai10l@hamonsoft.com");
        jsonUseVloumeService.jsonUseDeviceInsert(jsonUseVolume);
      //  jsonUseVloumeService.jsonUseVolumeInsert(jsonUseVolume);

        return deviceUse;
    }

}

//
//3. JSON을 Map 형태로 변환
//
//@Controller
//public class MainController {
//
//    // home.jsp
//    @RequestMapping(value = "/", method = RequestMethod.GET)
//    public String home() {
//        return "home";
//    }
//
//    @ResponseBody
//    @RequestMapping(value = "/test", method = RequestMethod.POST)
//    public void init(@RequestBody HashMap<String, Object> map) {
//        System.out.println(map);
//        // {name=vita, age=25} 출력
//    }
//}


//4. JSON을 객체 형태로 변환
//
//@Controller
//public class MainController {
//
//    // home.jsp
//    @RequestMapping(value = "/", method = RequestMethod.GET)
//    public String home() {
//        return "home";
//    }
//
//    @ResponseBody
//    @RequestMapping(value = "/test", method = RequestMethod.POST)
//    public void init(@RequestBody UserVO userVO) {
//
//        userVO.getName(); // "vita"
//        userVO.getAge(); // 25
//    }
//}
//
//5. @ResponseBody로 JSON 정보 전달하기
//        Map 정보 전송하기
//
//@Controller
//public class MainController {
//
//    // home.jsp
//    @RequestMapping(value = "/", method = RequestMethod.GET)
//    public String home() {
//        return "home";
//    }
//
//    @ResponseBody
//    @RequestMapping(value = "/test", method = RequestMethod.POST)
//    public HashMap<String, Object> init(@RequestBody HashMap<String, Object> map) {
//
//        map.put("phone", "0000-0000");
//        return map;
//        // {"name": "vita", "age": 25, "phone": "0000-0000"}가 data로 바인딩
//    }
//}
//    @ResponseBody가 붙은 메서드에서 Map을 반환하면 자동으로 Map 정보가 JSON 객체로 변환되어 전송된다.

//
//6. 객체 정보를 전송
//
//@Controller
//public class MainController {
//
//    // home.jsp
//    @RequestMapping(value = "/", method = RequestMethod.GET)
//    public String home() {
//        return "home";
//    }
//
//    @ResponseBody
//    @RequestMapping(value = "/test", method = RequestMethod.POST)
//    public HashMap<String, Object> init(@RequestBody UserVO userVO) {
//
//        HashMap<String, Object> map = HashMap<String, Object>();
//        map.put("userVO", userVO);
//
//        return map;
//        // {"userVO": {name: "vita", age: 25}}가 data로 바인딩
//    }
//}
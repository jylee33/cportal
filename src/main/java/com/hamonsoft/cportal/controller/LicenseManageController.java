package com.hamonsoft.cportal.controller;

import com.hamonsoft.cportal.dto.ResponseDTO;
import com.hamonsoft.cportal.service.LicenseManageService;
//import com.hamonsoft.cportal.utils.GridUtil;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
//import java.util.*;

@Controller
@RequestMapping(value = "/license")
public class LicenseManageController {

    private static final Logger logger = LoggerFactory.getLogger(LicenseManageController.class);
    private static final String LOGIN = "login";

    @Resource
    private LicenseManageService licensemanageService;
    /*
        @Resource
        private GridUtil gridutin;
    */
    @GetMapping(value = "/licensemanage") // memberinfo
    public void licensemanage(HttpServletRequest request) throws Exception {
        logger.info("LicenseManageController 1111 licensemanage ---->");
    }


    @RequestMapping(value="/licensemanageview", method = RequestMethod.GET)
    public ResponseEntity<?> licensemanageview(@RequestParam Map<String,Object> param
            ,HttpServletRequest request) throws IOException {
        String solution =  request.getParameter("solutioncode");
        logger.info("LicenseManageController creditview---solution----->"+solution);
        if(solution == null || "".equals(solution)) {
            solution = "10";
        }

        ResponseDTO responseDTO = new ResponseDTO();
        responseDTO.setResultCode("S0001");
        responseDTO.setRes(licensemanageService.licensemanageview(solution));
        //logger.info("LicenseManageController licensemanageview ResponseDTO---->"+responseDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);//
    }



    @PostMapping(value = "/licensemanage") // memberinfo
    public ModelAndView licensemanage(@RequestParam("deviceid") String deviceid, HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("licensemanage9_15");
        HttpSession session = request.getSession();
//        Member member = (Member) session.getAttribute("login");
        String solution =  deviceid; // request.getParameter("deviceid");
//        }
//        logger.info("LicenseManageController licensemanage ---->"+member.getEmail());
//        logger.info("LicenseManageController licensemanage---->"+member.getEmailcertificationyn());
//        logger.info("LicenseManageController licensemanage ---->"+member.getBusinessname());
        logger.info("LicenseManageController 1111 licensemanage ---->"+solution);
        if(solution == null || "".equals(solution)) {
            solution = "10";
        }

        mav.addObject("license",licensemanageService.licensePolicyList(solution));


        return mav;
    }

    @PostMapping(value = "/licenseSave")
    @ResponseBody
    public void licenseSave(@RequestBody String licenseData) throws Exception {

        JSONParser jsonParser = new JSONParser();
        JSONArray insertParam = null;
        logger.info("licenseData.size-->"+licenseData.toString());
        try {
            insertParam = (JSONArray) jsonParser.parse(licenseData);
        } catch (ParseException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        logger.info("insertParam.size-->"+insertParam.size());
        for(int i=0; i<insertParam.size(); i++){
            //배열 안에 있는것도 JSON형식 이기 때문에 JSON Object 로 추출
            JSONObject insertData = (JSONObject) insertParam.get(i);
            logger.info("insertParam-->"+insertData);
            Map<String, Object> saveData = new HashMap<>();
            if (null == insertData.get("licensepolicyid") || insertData.get("licensepolicyid").equals("")) {
                licensemanageService.licenseInsert(insertData);
            }else{
                licensemanageService.licenseUpdate(insertData);
            }
        }

    }
//    @GetMapping(value = "/licensemanage") // memberinfo
//    public ModelAndView licensemanageget(HttpServletRequest request) throws Exception {
//        ModelAndView mav = new ModelAndView();
//        mav.setViewName("/license/licensemanage");
//        HttpSession session = request.getSession();
////        Member member = (Member) session.getAttribute("login");
//        String solution =  request.getParameter("deviceid");
////        }
////        logger.info("LicenseManageController licensemanage ---->"+member.getEmail());
////        logger.info("LicenseManageController licensemanage---->"+member.getEmailcertificationyn());
////        logger.info("LicenseManageController licensemanage ---->"+member.getBusinessname());
//        logger.info("LicenseManageController 1111 licensemanage ---->"+solution);
//        if(solution == null || "".equals(solution)) {
//            solution = "10";
//        }
//
//        mav.addObject("license",licensemanageService.licensePolicyList(solution));
//
//
//        return mav;
//    }

//    @GetMapping(value = "/creditinfo") // memberinfo
//    public ModelAndView creditList(Map<String, Object> map, HttpServletRequest request) throws Exception {
//        ModelAndView mav = new ModelAndView();
//        mav.setViewName("/license/creditinfo");
//
//        HttpSession session = request.getSession();
////        Member member = (Member) session.getAttribute("login");
//        // String solution = request.getParameter("solutioncode");
////        logger.info("LicenseManageController creditList ---->"+member.getEmail());
////        logger.info("LicenseManageController creditList ---->"+member.getEmailcertificationyn());
////        logger.info("LicenseManageController creditList ---->"+member.getBusinessname());
//        logger.info("LicenseManageController creditList ---->");
//        mav.addObject("credit",licensemanageService.creditList());
//
//
//        return mav;
//    }

    @RequestMapping(value = "/creditinfo") // memberinfo
    public void creditinfo(Map<String, Object> map, HttpServletRequest request) throws Exception {
//        ModelAndView mav = new ModelAndView();
//        mav.setViewName("/license/creditinfo");
//
//        HttpSession session = request.getSession();
//        Member member = (Member) session.getAttribute("login");
//        String diviceid = request.getParameter("diviceid");
//        logger.info("LicenseManageController creditList ---->"+member.getEmail());
//        logger.info("LicenseManageController creditList ---->"+member.getEmailcertificationyn());
//        logger.info("LicenseManageController creditList ---->"+member.getBusinessname());
        logger.info("LicenseManageController creditinfo ---->");
//        mav.addObject("credit",licensemanageService.creditList());
    }


    @RequestMapping(value="/creditview", method = RequestMethod.GET)
    public ResponseEntity<?> creditview(@RequestParam Map<String,Object> param
            ,HttpServletRequest request) throws IOException {
        logger.info("LicenseManageController creditview");
        String groupcode = "006";
        ResponseDTO responseDTO = new ResponseDTO();
        responseDTO.setResultCode("S0001");
        responseDTO.setRes(licensemanageService.creditView(groupcode));
        logger.info("LicenseManageController creditview ResponseDTO---->"+responseDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);//
    }

    @PostMapping(value = "/aidInfoSave")
    @ResponseBody
    public void AidFunctionSave(@RequestBody String aidData) throws Exception {

        JSONParser jsonParser = new JSONParser();
        JSONArray insertParam = null;
        try {
            insertParam = (JSONArray) jsonParser.parse(aidData);
        } catch (ParseException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        logger.info("insertParam.size-->"+insertParam.size());
        for(int i=0; i<insertParam.size(); i++){
            //배열 안에 있는것도 JSON형식 이기 때문에 JSON Object 로 추출
            JSONObject insertData = (JSONObject) insertParam.get(i);
            logger.info("insertParam-->"+insertData);
            Map<String, Object> saveData = new HashMap<>();
            if (null == insertData.get("functionno") || insertData.get("functionno").equals("")) {
                licensemanageService.aidfunctionInsert(insertData);
            }else{
                licensemanageService.aidfunctionUpdate(insertData);
            }
        }

    }


    @PostMapping(value = "/creditSave")
    @ResponseBody
    public void creditSave(@RequestBody String creditData) throws Exception {

        JSONParser jsonParser = new JSONParser();
        JSONArray insertParam = null;
        try {
            insertParam = (JSONArray) jsonParser.parse(creditData);
        } catch (ParseException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        logger.info("insertParam.size-->"+insertParam.size());
        for(int i=0; i<insertParam.size(); i++){
            //배열 안에 있는것도 JSON형식 이기 때문에 JSON Object 로 추출
            JSONObject insertData = (JSONObject) insertParam.get(i);
            logger.info("insertParam-->"+insertData);
            Map<String, Object> saveData = new HashMap<>();
            if ("I".equals(insertData.get("crudflg")) || "".equals(insertData.get("crudflg"))) {
                licensemanageService.creditInsert(insertData);
            }else{
                licensemanageService.creditUpdate(insertData);
            }
        }

    }


//    @RequestMapping("/aidcodeinfo")
//    public void aidcodeinfo(ResponseDTO responseDTO, HttpServletRequest request) throws Exception {
//        String functioncode = request.getParameter("sltcode");
//        HttpSession session = request.getSession();
//        if(functioncode == null || "".equals(functioncode)) {
//            functioncode = "00";
//        }
//        ResponseDTO responseDto = new ResponseDTO();
//        responseDTO.setResultCode("S0001");
//        responseDTO.setRes(licensemanageService.aidfunctionList2(functioncode));
//        logger.info("LicenseManageController  @RequestMapping functioncode ---->"+responseDTO);
//
//    }

//
    @RequestMapping("/aidcodeinfo")
    public void aidcodeinfo(Model model, HttpServletRequest request) throws Exception {
        HttpSession session = request.getSession();
//        Member member = (Member) session.getAttribute("login");
        String functioncode = request.getParameter("sltcode");
//        logger.info("LicenseManageController  @RequestMapping jqxgridgrid ---->"+member.getBusinessname());
        logger.info("LicenseManageController  @RequestMapping functioncode ---->"+functioncode);
        if(functioncode == null || "".equals(functioncode)) {
            functioncode = "10";
        }
        model.addAttribute("aidInfo",converthashToJson(licensemanageService.aidfunctionList2(functioncode)));
        logger.info("LicenseManageController licensemanageService ---->"+model.toString());

    }


//    @RequestParam("searchcode") String searchcode
    @RequestMapping(value="/aidcodeview", method = RequestMethod.GET)
    public ResponseEntity<?> aidcodeview(@RequestParam Map<String,Object> param
                                         ,HttpServletRequest request) throws IOException {
        String solution =  request.getParameter("solutioncode");
        logger.info("param----->"+param);
        if (solution == null || solution.isEmpty()) {
            solution = "10";
        }

        ResponseDTO responseDTO = new ResponseDTO();
        responseDTO.setResultCode("S0001");
        responseDTO.setRes(licensemanageService.aidfunctionList(solution));
        logger.info("LicenseManageController aidfunctionList ResponseDTO---->"+responseDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);//
    }


    @RequestMapping(value = "/settleinfo") // memberinfo
    public void settleinfo(Map<String, Object> map, HttpServletRequest request) throws Exception {
        logger.info("LicenseManageController settleinfo ---->");
    }

    @RequestMapping(value="/settleview", method = RequestMethod.GET)
    public ResponseEntity<?> settleview(@RequestParam Map<String,Object> param
                                        ,HttpServletRequest request) throws IOException {
        String stDate =  request.getParameter("stDate").replace("-","");
        String edDate =  request.getParameter("edDate").replace("-","");
        if(stDate == null || stDate.length() == 0){
            LocalDate date = LocalDate.now();
            DateTimeFormatter fm = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            edDate = date.format(fm).replace("-","");
            stDate = date.minusMonths(1).toString().replace("-","");
        }
        logger.info("stDate----->"+stDate+"........edDate-->"+edDate);
        logger.info("request----->"+request.getParameterMap().toString());

        ResponseDTO responseDTO = new ResponseDTO();
        responseDTO.setResultCode("S0001");
        responseDTO.setRes(licensemanageService.chargeSettleList(stDate, edDate));
        logger.info("LicenseManageController chargeSettleList ResponseDTO---->"+responseDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);//
    }

    @PostMapping(value = "/settleSave")
    @ResponseBody
    public void settleSave(@RequestBody String settleData) throws Exception {

        JSONParser jsonParser = new JSONParser();
        JSONArray insertParam = null;
        try {
            insertParam = (JSONArray) jsonParser.parse(settleData);
        } catch (ParseException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        logger.info("insertParam.size-->"+insertParam.size());
        for(int i=0; i<insertParam.size(); i++){
            //배열 안에 있는것도 JSON형식 이기 때문에 JSON Object 로 추출
            JSONObject insertData = (JSONObject) insertParam.get(i);
            logger.info("insertParam-->"+insertData+".........."+insertData.get("settlementmeans")+".............."+insertData.get("strsettlementdt").toString().length());
            Map<String, Object> saveData = new HashMap<>();
            if ("cash".equals(insertData.get("settlementmeans")) && insertData.get("strsettlementdt").toString().length() >= 8){
                String localDate = utcToLocaltime(insertData.get("strsettlementdt").toString());
                insertData.put("strsettlementdt",localDate);
                logger.info("settleUpdate-->"+insertData+"........");
                licensemanageService.settleUpdate(insertData);
            }
        }

    }

    /* UTC time to local time
     */
    public static String utcToLocaltime(String datetime) throws Exception {

        String formatTimeZone = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
        String koreaDate = "";
        try {
            // [UTC 형식 Date 값 정의 실시]
            String utcDateValue = datetime;

            // [UTC 값을 포맷 형식 지정해 Date 객체로 선언]
            Date date = new SimpleDateFormat(formatTimeZone).parse(utcDateValue);

            // [Date to Calendar 변환]
            Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("UTC"));
            calendar.setTime(date);


            // [한국형 시간은 UTC 시간보다 9시간 앞선다]
            calendar.add(Calendar.HOUR, 9);


            // [한국형 시간으로 변경된 값 저장 실시]
            SimpleDateFormat sdformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            koreaDate = sdformat.format(calendar.getTime());
        } catch(Exception e) {
            e.printStackTrace();
            throw new Exception(e);
        }

        return koreaDate;
    }

    @RequestMapping(value = "/jqgrid", method = RequestMethod.GET)
    public ModelAndView jqgrid (ModelAndView mav)
    {
        mav.setViewName("/license/jqgrid");
        return mav;
    }

//    @GetMapping(value = "/aidcodeinfo")
//    public void get_aidcodeinfo(Model model) {
//
//    }


    /* Map, List Map으로 작업하다가 json array 로 변환이 필요할때 */
    @SuppressWarnings({"unchecked"})
    public static JSONArray converthashToJson (List < HashMap < String, Object >> listMap){

        JSONArray jsonArray = new JSONArray();
        for (Map<String, Object> map : listMap) {
            jsonArray.add(convertMapToJson(map));
        }
        return jsonArray;

    }
    /* Map, List Map으로 작업하다가 json array 로 변환이 필요할때 */
    @SuppressWarnings({"unchecked"})
    public static JSONArray convertListToJson (List < Map < String, Object >> listMap){

        JSONArray jsonArray = new JSONArray();
        for (Map<String, Object> map : listMap) {
            jsonArray.add(convertMapToJson(map));
        }
        return jsonArray;

    }

    @SuppressWarnings({"unchecked"})
    public static JSONObject convertMapToJson (Map < String, Object > map){

        JSONObject json = new JSONObject();
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            json.put(key, value);

        }
        return json;
    }
    @GetMapping(value = "/aidtest") // memberinfo
    public void aidtest(HttpServletRequest request) throws Exception {
        logger.info("LicenseManageController 357 aidtest ---->");
    }

    @GetMapping(value = "/licensemanagetest") // memberinfo
    public void licensemanagetest(HttpServletRequest request) throws Exception {
        logger.info("LicenseManageController 1111 licensemanagetest ---->");
    }
}

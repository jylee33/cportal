package com.hamonsoft.cportal.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.hamonsoft.cportal.controller.LicenseManageController;
import com.hamonsoft.cportal.domain.*;
import com.hamonsoft.cportal.dto.AidFunctionDto;
import com.hamonsoft.cportal.dto.MemberLicenseDto;
import com.hamonsoft.cportal.dto.ResultDto;
import com.hamonsoft.cportal.repository.LicenseManageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@ReadingConverter
public class LicenseManageService {

    private static final Logger logger = LoggerFactory.getLogger(LicenseManageController.class);

    @Autowired
    LicenseManageRepository licensemanageRepository;

    @Autowired
    public LicenseManageService(LicenseManageRepository licensemanageMapper) {
        this.licensemanageRepository = licensemanageMapper;
    }


    public ArrayList<HashMap<String, Object>> licensePolicyList(String functioncode) {
       return licensemanageRepository.licensePolicyList(functioncode);
    }
    public ArrayList<HashMap<String, Object>> licensePolicyList1(String functioncode) {
        return licensemanageRepository.licensePolicyList1(functioncode);
    }

    public ArrayList<HashMap<String, Object>> aidfunctionList(String functioncode) {
        return licensemanageRepository.aidfunctionList(functioncode);
    }
    public List<HashMap<String, Object>> aidfunctionList2(String functioncode) {
        return licensemanageRepository.aidfunctionList2(functioncode);
    }

    public ArrayList<HashMap<String, Object>> creditList() {
        return licensemanageRepository.creditList();
    }


    public String aidfunctionInsert(Map<String, Object> insertData) {
        licensemanageRepository.aidfunctionInsert(insertData);
        return "저장완료";
    }

    public String aidfunctionUpdate(Map<String, Object> insertData) {
        licensemanageRepository.aidfunctionUpdate(insertData);
        return "저장완료";
    }


}

package com.hamonsoft.cportal.service;

import com.hamonsoft.cportal.dto.MemberLicenseDto;
import com.hamonsoft.cportal.repository.LicenseManageRepository;
import com.hamonsoft.cportal.utils.Pagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LicenseManageService {
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

    public ArrayList<HashMap<String, Object>> creditList() {
        return licensemanageRepository.creditList();
    }

}

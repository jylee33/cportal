package com.hamonsoft.cportal.service;

import com.hamonsoft.cportal.dto.MemberLicenseDto;
import com.hamonsoft.cportal.repository.LicenseManageRepository;
import com.hamonsoft.cportal.repository.MemberInfoRepository;
import com.hamonsoft.cportal.utils.Pagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@Primary
public class LicenseManageServiceImpl implements LicenseManageService {

    @Autowired
    LicenseManageRepository licensemanageRepository;
    @Override
    public List<Map<String, Object>> licensePolicyList(String solutioncode) throws Exception{
        return licensemanageRepository.licensePolicyList(solutioncode);
    };
    @Override
    public List<Map<String, Object>> aidfunctionList(String functioncode) throws Exception{
        return licensemanageRepository.aidfunctionList(functioncode);
    };
    @Override
    public List<Map<String, Object>> creditList() throws Exception{
        return licensemanageRepository.creditList();
    };
}

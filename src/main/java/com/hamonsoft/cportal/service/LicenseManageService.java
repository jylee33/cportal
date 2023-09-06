package com.hamonsoft.cportal.service;

import com.hamonsoft.cportal.dto.MemberLicenseDto;
import com.hamonsoft.cportal.utils.Pagination;

import java.util.List;
import java.util.Map;

public interface LicenseManageService {

    public List<Map<String, Object>> licensePolicyList(String solutioncode) throws Exception;

    public List<Map<String, Object>> aidfunctionList(String functioncode) throws Exception;

    public List<Map<String, Object>> creditList() throws Exception;
}

package com.hamonsoft.cportal.service;

import com.hamonsoft.cportal.controller.LicenseManageController;
import com.hamonsoft.cportal.domain.Member;
import com.hamonsoft.cportal.dto.MemberLicenseDto;
import com.hamonsoft.cportal.repository.LicenseManageRepository;
import com.hamonsoft.cportal.repository.MemberListInfoRepository;
import com.hamonsoft.cportal.utils.Pagination;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service
@ReadingConverter
public class MemberListInfoService {

    private static final Logger logger = LoggerFactory.getLogger(MemberListInfoService.class);


    @Autowired
    MemberListInfoRepository memberListInfoRepository;

    public ArrayList<HashMap<String, Object>> memberlistview(String membername) {
        return memberListInfoRepository.memberlistview(membername);
    }


    public ArrayList<HashMap<String, Object>> memberview(String email) {
        return memberListInfoRepository.memberview(email);
    }

    public ArrayList<HashMap<String, Object>> chargelistview(String email) {
        return memberListInfoRepository.chargelistview(email);
    }

    public ArrayList<HashMap<String, Object>> taxlistview(String email) {
        return memberListInfoRepository.taxlistview(email);
    }

}

package com.hamonsoft.cportal.repository;

import com.hamonsoft.cportal.dto.MemberLicenseDto;
import com.hamonsoft.cportal.utils.Pagination;
import org.apache.ibatis.annotations.Mapper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Mapper
public interface MemberListInfoRepository {
    ArrayList<HashMap<String, Object>> memberlistview(String membername);

    ArrayList<HashMap<String, Object>> memberview(String email);

    ArrayList<HashMap<String, Object>> chargelistview(String email);

    ArrayList<HashMap<String, Object>> taxlistview(String email);

}

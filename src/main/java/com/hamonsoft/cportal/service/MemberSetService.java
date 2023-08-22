package com.hamonsoft.cportal.service;

import com.hamonsoft.cportal.utils.Pagination;

import java.util.List;
import java.util.Map;

public interface MemberSetService {

    public int memberSetCount() throws Exception;

    public List<Map<String, Object>> memberSetList(Pagination pagination) throws Exception;

    public List<Map<String, Object>> memberSetList() throws Exception;
}

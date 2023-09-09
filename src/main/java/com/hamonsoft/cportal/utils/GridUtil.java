package com.hamonsoft.cportal.utils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GridUtil {
    public Map<String, Object> gridDataSet(List<Map<String, Object>> datalist, String page){
        Map<String, Object> resultmap = new HashMap<String, Object>();
        String totCnt = "0";
        if(null != datalist && 0 < datalist.size()){
            totCnt = String.valueOf(datalist.get(0).get("totCnt"));
            datalist.remove(0);
        }

        resultmap.put("rows", datalist);
        resultmap.put("records", totCnt);
        resultmap.put("page", page);

        return resultmap;
    }
}

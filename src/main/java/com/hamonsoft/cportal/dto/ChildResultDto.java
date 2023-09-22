package com.hamonsoft.cportal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

public class ChildResultDto extends ResultDto{ // ParentDTO를 부모 클래스로 상속받음 - 자식 DTO{

    @Data
    public static class INFO {
        @JsonProperty("FMS_COUNT")
        private int FMS_COUNT;
        @JsonProperty("AP_COUNT")
        private int AP_COUNT;
        @JsonProperty("DBMS_COUNT")
        private int DBMS_COUNT;
        @JsonProperty("SMS_COUNT")
        private int SMS_COUNT;
        @JsonProperty("NMS_COUNT")
        private int NMS_COUNT;
    }
}

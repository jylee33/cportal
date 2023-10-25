package com.hamonsoft.cportal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.UUID;

//등록된 장비 대수 요청
@Data
public class NetisUseServiceDto {

    @JsonProperty("INFO")
    private INFO INFO;
    @JsonProperty("REASON")
    private String REASON;
    @JsonProperty("ERROR_CODE")
    private String ERROR_CODE;
    @JsonProperty("HOST_NAME")
    private String HOST_NAME;
    @JsonProperty("UUID")
    private String UUID;
    @JsonProperty("TRAN_STATUS")
    private int TRAN_STATUS;

    @Data
    public static class INFO {
        @JsonProperty("USER_ID")
        private String USER_ID;
        @JsonProperty("NMS_COUNT")
        private int NMS_COUNT;
        @JsonProperty("SMS_COUNT")
        private int SMS_COUNT;
        @JsonProperty("DBMS_COUNT")
        private int DBMS_COUNT;
        @JsonProperty("AP_COUNT")
        private int AP_COUNT;
        @JsonProperty("FMS_COUNT")
        private int FMS_COUNT;
    }
}

package com.hamonsoft.cportal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
//등록된 장비 대수 요청
@Data
public class NetisUseServiceDto {

    @JsonProperty("INFO")
    private INFO INFO;
    @JsonProperty("REASON")
    private String REASON;
    @JsonProperty("ERROR_CODE")
    private String ERROR_CODE;
    @JsonProperty("SERVER_IP")
    private String SERVER_IP;
    @JsonProperty("TRAN_STATUS")
    private int TRAN_STATUS;

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

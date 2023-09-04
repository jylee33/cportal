package com.hamonsoft.cportal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ResultDto {

    @JsonProperty("TRAN_STATUS")
    int TRAN_STATUS;
    @JsonProperty("ERROR_CODE")
    String ERROR_CODE;
    @JsonProperty("REASON")
    String REASON;

    public int getTRAN_STATUS() {
        return TRAN_STATUS;
    }

    public void setTRAN_STATUS(int TRAN_STATUS) {
        this.TRAN_STATUS = TRAN_STATUS;
    }

    public String getERROR_CODE() {
        return ERROR_CODE;
    }

    public void setERROR_CODE(String ERROR_CODE) {
        this.ERROR_CODE = ERROR_CODE;
    }

    public String getREASON() {
        return REASON;
    }

    public void setREASON(String REASON) {
        this.REASON = REASON;
    }

    public ResultDto() {
    }

    public ResultDto(int TRAN_STATUS, String ERROR_CODE, String REASON) {
        this.TRAN_STATUS = TRAN_STATUS;
        this.ERROR_CODE = ERROR_CODE;
        this.REASON = REASON;
    }

    @Override
    public String toString() {
        return "ResultDto{" +
                "TRAN_STATUS='" + TRAN_STATUS + '\'' +
                ", ERROR_CODE='" + ERROR_CODE + '\'' +
                ", REASON='" + REASON + '\'' +
                '}';
    }

}

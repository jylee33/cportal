package com.hamonsoft.cportal.domain;

import lombok.Data;

@Data
public class JsonUseVolume {

    private String usedeviceid;
    private String userid;
    private String useday;
    private Integer transtatus;
    private String info;
    private Integer nmscount;
    private Integer smscount;
    private Integer dbmscount;
    private Integer apcount;
    private Integer fmscount;
    private String reason;
}

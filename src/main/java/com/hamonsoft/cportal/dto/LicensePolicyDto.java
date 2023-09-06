package com.hamonsoft.cportal.dto;

import lombok.Data;

import java.util.Date;

@Data
public class LicensePolicyDto {
    private String licensepolicyid;
    private String solutioncode;
    private String policycode;
    private String solutionname;
    private String policyname;
    private String licensecontent;
    private String licenseamount;
    private Integer licenseint;
    private String aidcode;
    private String stdate;
    private String eddate;
    private String useyn;
    private Integer sortno;
    private Date createdAt;
    private Date updatedAt;

}

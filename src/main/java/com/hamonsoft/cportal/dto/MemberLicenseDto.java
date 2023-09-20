package com.hamonsoft.cportal.dto;

import lombok.*;

@Data
public class MemberLicenseDto {
    private String email;
    private Integer addvolume;
    private Integer servicevolume;
    private Integer addcharge;
    private Integer datakeepterm;
    private String datakeepunit;
    private String serverdomainname;

}

package com.hamonsoft.cportal.domain;

import lombok.Data;
import lombok.ToString;

import javax.persistence.*;
import java.util.Date;

@Data
@ToString
public class Member {

    private String memberid;
    private String email;
    private String membername;
    private String grpname;
    private String celltel;
    private String password;
    private String businessname;
    private String businessnumber;
    private int prelicensegrade;
    private int licensegrade;
    private int credit;
    private String companyphone;
    private String administratoryn;
    private int emailcertificationyn;
    private String withdrawalyn;
    private String withdrawaldate;
    private String joindate;
    private String hostname;
    private Date createdAt;
    private String updatedBy;
    private String serverdomainname;
    private Date updatedAt;
    private MemberLicense memberLicenseVO;
    private MemberUseTax memberUseTaxVO;
    private String access_token;


//    @OneToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "member_info_idx", referencedColumnName = "email")
//    private MemberLicense memberLicense;
//
//    @OneToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "member_info_idx", referencedColumnName = "email")
//    private TaxInformation taxInformation;


    public MemberUseTax getMemberUseTaxVO() {
        return memberUseTaxVO;
    }
    public void setMemberUseTaxVO(MemberUseTax memberUseTaxVO){
        this.memberUseTaxVO = memberUseTaxVO;
    }

}

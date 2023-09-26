package com.hamonsoft.cportal.domain;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Data
public class Member {

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
    private Date createdAt;
    private String updatedBy;
    private String serverdomainname;
    private Date updatedAt;
    private MemberLicense memberLicenseVO;
    private MemberUseTax memberUseTaxVO;


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

    @Override
    public String toString() {
        return "Member{" +
                "email='" + email + '\'' +
                ", membername='" + membername + '\'' +
                ", grpname='" + grpname + '\'' +
                ", celltel='" + celltel + '\'' +
                ", password='" + password + '\'' +
                ", businessname='" + businessname + '\'' +
                ", businessnumber='" + businessnumber + '\'' +
                ", prelicensegrade=" + prelicensegrade +
                ", licensegrade=" + licensegrade +
                ", credit=" + credit +
                ", companyphone='" + companyphone + '\'' +
                ", administratoryn='" + administratoryn + '\'' +
                ", emailcertificationyn=" + emailcertificationyn +
                ", withdrawalyn='" + withdrawalyn + '\'' +
                ", withdrawaldate='" + withdrawaldate + '\'' +
                ", joindate='" + joindate + '\'' +
                ", createdAt=" + createdAt +
                ", updatedBy='" + updatedBy + '\'' +
                ", serverdomainname='" + serverdomainname + '\'' +
                ", updatedAt=" + updatedAt +
                ", memberLicenseVO=" + memberLicenseVO +
                ", memberUseTaxVO=" + memberUseTaxVO +
                '}';
    }
}

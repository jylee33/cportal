package com.hamonsoft.cportal.domain;

import javax.persistence.*;
import java.util.Arrays;
import java.util.Date;
import java.util.IdentityHashMap;

public class Member {

    private String email;
    private String membername;
    private String celltel;
    private String password;
    private String businessname;
    private String businessnumber;
    private int cloudgrade;
    private String companyphone;
    private int emailcertificationyn;
    private String withdrawalyn;
    private String withdrawaldate;
    private Date joindate;
    private Date createdAt;
    private String updatedBy;
    private Date updatedAt;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMembername() {
        return membername;
    }

    public void setMembername(String membername) {
        this.membername = membername;
    }

    public String getCelltel() {
        return celltel;
    }

    public void setCelltel(String celltel) {
        this.celltel = celltel;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getBusinessname() {
        return businessname;
    }

    public void setBusinessname(String businessname) {
        this.businessname = businessname;
    }

    public String getBusinessnumber() {
        return businessnumber;
    }

    public void setBusinessnumber(String businessnumber) {
        this.businessnumber = businessnumber;
    }

    public int getCloudgrade() {
        return cloudgrade;
    }

    public void setCloudgrade(int cloudgrade) {
        this.cloudgrade = cloudgrade;
    }

    public String getCompanyphone() {
        return companyphone;
    }

    public void setCompanyphone(String companyphone) {
        this.companyphone = companyphone;
    }

    public int getEmailcertificationyn() {
        return emailcertificationyn;
    }

    public void setEmailcertificationyn(int emailcertificationyn) {
        this.emailcertificationyn = emailcertificationyn;
    }

    public String getWithdrawalyn() {
        return withdrawalyn;
    }

    public void setWithdrawalyn(String withdrawalyn) {
        this.withdrawalyn = withdrawalyn;
    }

    public String getWithdrawaldate() {
        return withdrawaldate;
    }

    public void setWithdrawaldate(String withdrawaldate) {
        this.withdrawaldate = withdrawaldate;
    }

    public Date getJoindate() {
        return joindate;
    }

    public void setJoindate(Date joindate) {
        this.joindate = joindate;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "Member [email=" + email + ", membername=" + membername + ", celltel="
                + celltel + ", businessname=" + businessname + ", businessnumber=" + businessnumber
                + ", cloudgrade=" + cloudgrade + ", companyphone=" + companyphone
                + ", emailcertificationyn=" + emailcertificationyn + ", withdrawalyn=" + withdrawalyn
                + "]";
    }
}

package com.hamonsoft.cportal.domain;

import java.util.Date;

public class MemberTaxInformation {

    private String email;    //세금계산서발송기관메일
    private String companyname;
    private String membername;
    private String celltel;
    private String password;
    private String businessname;
    private String businessnumber;
    private int licensegrade;
    private String companyphone;
    private int emailcertificationyn;
    private String withdrawalyn;
    private String withdrawaldate;
    private String joindate;
    private String representationname;
    private String taxcompanynumber;
    private String taxemail;    //세금계산서발송기관메일
    private String postnumber;  //우편번호
    private String address;     //주소
    private String detailaddress;   //상세주소
    private String businesscondition;   //업태
    private String businesskind;    //업종
    private String settlementmeans; //결제방법
    private int baseamount; //기본금액
    private Date createdAt; //등록일시
    private String updatedBy;   //수정자
    private Date updatedAt; //수정일시

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCompanyname() {
        return companyname;
    }

    public void setCompanyname(String companyname) {
        this.companyname = companyname;
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

    public int getLicensegrade() {
        return licensegrade;
    }

    public void setLicensegrade(int licensegrade) {
        this.licensegrade = licensegrade;
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

    public String getJoindate() {
        return joindate;
    }

    public void setJoindate(String joindate) {
        this.joindate = joindate;
    }

    public String getRepresentationname() {
        return representationname;
    }

    public void setRepresentationname(String representationname) {
        this.representationname = representationname;
    }

    public String getTaxcompanynumber() {
        return taxcompanynumber;
    }

    public void setTaxcompanynumber(String taxcompanynumber) {
        this.taxcompanynumber = taxcompanynumber;
    }

    public String getTaxemail() {
        return taxemail;
    }

    public void setTaxemail(String taxemail) {
        this.taxemail = taxemail;
    }

    public String getPostnumber() {
        return postnumber;
    }

    public void setPostnumber(String postnumber) {
        this.postnumber = postnumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDetailaddress() {
        return detailaddress;
    }

    public void setDetailaddress(String detailaddress) {
        this.detailaddress = detailaddress;
    }

    public String getBusinesscondition() {
        return businesscondition;
    }

    public void setBusinesscondition(String businesscondition) {
        this.businesscondition = businesscondition;
    }

    public String getBusinesskind() {
        return businesskind;
    }

    public void setBusinesskind(String businesskind) {
        this.businesskind = businesskind;
    }

    public String getSettlementmeans() {
        return settlementmeans;
    }

    public void setSettlementmeans(String settlementmeans) {
        this.settlementmeans = settlementmeans;
    }

    public int getBaseamount() {
        return baseamount;
    }

    public void setBaseamount(int baseamount) {
        this.baseamount = baseamount;
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
        return "MemberTaxInformation{" +
                "email='" + email + '\'' +
                ", membername='" + membername + '\'' +
                ", celltel='" + celltel + '\'' +
                ", password='" + password + '\'' +
                ", businessname='" + businessname + '\'' +
                ", businessnumber='" + businessnumber + '\'' +
                ", licensegrade=" + licensegrade +
                ", companyphone='" + companyphone + '\'' +
                ", emailcertificationyn=" + emailcertificationyn +
                ", withdrawalyn='" + withdrawalyn + '\'' +
                ", withdrawaldate='" + withdrawaldate + '\'' +
                ", joindate='" + joindate + '\'' +
                ", representationname='" + representationname + '\'' +
                ", taxcompanynumber='" + taxcompanynumber + '\'' +
                ", taxemail='" + taxemail + '\'' +
                ", postnumber='" + postnumber + '\'' +
                ", address='" + address + '\'' +
                ", detailaddress='" + detailaddress + '\'' +
                ", businesscondition='" + businesscondition + '\'' +
                ", businesskind='" + businesskind + '\'' +
                ", settlementmeans='" + settlementmeans + '\'' +
                ", baseamount=" + baseamount +
                ", createdAt=" + createdAt +
                ", updatedBy='" + updatedBy + '\'' +
                ", updatedAt=" + updatedAt +
                '}';
    }
}

package com.hamonsoft.cportal.domain;

import java.util.Date;

public class Authentication {

    private String authenticationid;    //세금계산서발송기관메일
    private String email;
    private String authenticationcode;
    private String agreeyn;
    private Date createdAt; //등록일시

    public String getAuthenticationid() {
        return authenticationid;
    }

    public void setAuthenticationid(String authenticationid) {
        this.authenticationid = authenticationid;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAuthenticationcode() {
        return authenticationcode;
    }

    public void setAuthenticationcode(String authenticationcode) {
        this.authenticationcode = authenticationcode;
    }

    public String getAgreeyn() {
        return agreeyn;
    }

    public void setAgreeyn(String agreeyn) {
        this.agreeyn = agreeyn;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Authentication{" +
                "authenticationid='" + authenticationid + '\'' +
                ", email='" + email + '\'' +
                ", authenticationcode='" + authenticationcode + '\'' +
                ", agreeyn='" + agreeyn + '\'' +
                ", createdAt='" + createdAt + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}

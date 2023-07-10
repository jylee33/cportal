package com.hamonsoft.cportal.mail;

import javax.mail.*;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.Properties;

public class MailSend {
    public void MailSend() {
        Properties prop = System.getProperties();
        prop.put("mail.smtp.starttls.enable", "true");
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.port", "587");
        prop.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        prop.put("mail.smtp.ssl.protocols", "TLSv1.2");

        String mail_id = "yubbi33@gmail.com";
        String mail_pw = "dxoxmoxptbanvhvg";

        Authenticator auth = new MailAuth(mail_id, mail_pw);

        Session session = Session.getDefaultInstance(prop, auth);

        MimeMessage msg = new MimeMessage(session);

        try {
            msg.setSentDate(new Date());

            msg.setFrom(new InternetAddress("yubbi33@gmail.com", "이종엽"));
            InternetAddress to = new InternetAddress("jylee@hamonsoft.co.kr");
            msg.setRecipient(Message.RecipientType.TO, to);
            msg.setSubject("테스트 메일", "UTF-8");
            msg.setText("안녕하세요 테스트 메일입니다.", "UTF-8");

            Transport.send(msg);

        } catch(AddressException ae) {
            System.out.println("AddressException : " + ae.getMessage());
        } catch(MessagingException me) {
            System.out.println("MessagingException : " + me.getMessage());
        } catch(UnsupportedEncodingException e) {
            System.out.println("UnsupportedEncodingException : " + e.getMessage());
        }

    }

    // HTML 형식으로 메일 전송하기
    public void MailSend2() {
        Properties prop = System.getProperties();
        prop.put("mail.smtp.starttls.enable", "true");
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.port", "587");
        prop.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        prop.put("mail.smtp.ssl.protocols", "TLSv1.2");

        String mail_id = "yubbi33@gmail.com";
        String mail_pw = "dxoxmoxptbanvhvg";

        Authenticator auth = new MailAuth(mail_id, mail_pw);

        Session session = Session.getDefaultInstance(prop, auth);

        MimeMessage msg = new MimeMessage(session);

        try {
            msg.setSentDate(new Date());

            msg.setFrom(new InternetAddress("yubbi33@gmail.com", "HAMONSOFT"));
            InternetAddress to = new InternetAddress("jylee@hamonsoft.co.kr");
            msg.setRecipient(Message.RecipientType.TO, to);
            msg.setSubject("NETIS CLOUD 서비스 가입 안내", "UTF-8");
            String body = "<H1>안녕하세요. Hamonsoft NETIS CLOUD 서비스 가입 안내 메일입니다.</H1>"+ "<img src=\"http://hamonsoft.co.kr/wp-content/uploads/2019/07/it-specialist0.png\">"
                    + "<br><a href=\"http://hamonsoft.co.kr\">하몬소프트</a>";
            msg.setContent(body, "text/html;charset=utf-8");

            Transport.send(msg);

        } catch(AddressException ae) {
            System.out.println("AddressException : " + ae.getMessage());
        } catch(MessagingException me) {
            System.out.println("MessagingException : " + me.getMessage());
        } catch(UnsupportedEncodingException e) {
            System.out.println("UnsupportedEncodingException : " + e.getMessage());
        }

    }

}

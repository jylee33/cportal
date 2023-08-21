package com.hamonsoft.cportal.utils;

import com.hamonsoft.cportal.controller.ChargeGuideController;
import org.apache.tomcat.util.json.JSONParser;

import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.*;

public class CommUtils {

    private static final Logger logger = LoggerFactory.getLogger(ChargeGuideController.class);
    private static Base64.Encoder encoder = Base64.getEncoder();
    private static Base64.Decoder decoder = Base64.getDecoder();

    private static org.apache.commons.codec.binary.Base64 decoderBase64 = new org.apache.commons.codec.binary.Base64();

    public static final String EMPTY_STRING = "";

    /**
     * 객체의 Not Null 상태를 체크함. null = false, others = true.
     *
     * @param obj (Any Object)
     * @return boolean
     */
    public static boolean isPresent(Object obj) {
        return !isEmpty(obj);
    }

    /**
     * 객체의 Null 상태를 체크함. null = true, others = false.
     *
     * @param obj (Any Object)
     * @return boolean
     */
    public static boolean isEmpty(Object obj) {
        if (obj == null) {
            return true;
        }
        if ((obj instanceof String) && (((String) obj).trim().length() == 0)) {
            return true;
        }
        if (obj instanceof Map) {
            return ((Map<?, ?>) obj).isEmpty();
        }
        if (obj instanceof List) {
            return ((List<?>) obj).isEmpty();
        }
        if (obj instanceof Object[]) {
            return (((Object[]) obj).length == 0);
        }
        return false;
    }

    public static int elseOrZero(Object obj) {
        if (obj == null) {
            return 0;
        }
        try {
            Number value = (Number) obj;
            return value != null ? value.intValue() : 0;
        } catch (Exception e) {
            return 0;
        }
    }

    public static int elseOr(Object obj, int rtn) {
        if (obj == null) {
            return rtn;
        }
        try {
            Number value = (Number) obj;
            return value != null ? value.intValue() : rtn;
        } catch (Exception e) {
            return rtn;
        }
    }
    /**
     * 객체가 Null이 아니라면 toString한다.
     *
     * @param object
     * @return
     */
    public static String elseOrNull(Object object) {
        if (object != null) {
            return object.toString();
        } else {
            return null;
        }
    }

    /**
     * 객체가 Null 이면 "" 이 반환된다.
     *
     * @param object
     * @return
     */
    public static String elseOrEmpty(Object object) {
        if (object != null) {
            return object.toString();
        } else {
            return "";
        }
    }


    /**
     * 문서유통시스템에서 사용하며,
     * 파일을 문자열로 반환한다.
     * @param file
     * @return
     */
    public static String fileToString(File file) {
        try {
            return FileUtils.readFileToString(file);
        } catch (IOException e) {
            logger.debug(e.getMessage());
        }
        return null;
    }

    /**
     * JSON Object 하위 요소를 점검하여 null 로 인한 파싱 에러를 방지한다.
     * @sangdo.park
     * @param jsonObj
     * @param Key
     * @return JSONObject
     */
    public static JSONObject nullSafeCheck(JSONObject jsonObj, String key) {
        if (!jsonObj.keySet().contains(key)) {
            jsonObj.put(key, "");
        }
        return jsonObj;
    }

    /**
     * 좌항 prefix 문자열과 우항을 합치나, 데이터인 우항이 존재하지 않으면 빈값을 보낸다.
     */
    public static String appandOrEmpty(String prefix, String data) {
        if (isEmpty(data)) {
            return "";
        }
        return prefix + data;
    }


    /**
     * Base64 encoding
     * @param source
     * @return
     */
    public static String base64Encoding(String source) {
        try {
            return encoder.encodeToString(source.getBytes("euc-kr"));
        } catch (Exception e) {
        }
        return null;
    }



    /**
     * Base64 encoding  on Char-set
     * @param source
     * @return
     */
    public static String base64Encoding(String source, String charSet) {
        try {
            return encoder.encodeToString(source.getBytes(charSet));
        } catch (Exception e) {
        }
        return null;
    }

    /**
     * Base64 decoding
     * @param source
     * @return
     */
    public static String base64Decoding(String source) {
        try {
            return new String(decoder.decode(source.getBytes(StandardCharsets.UTF_8)), "euc-kr");
        } catch (Exception e) {
        }
        return null;
    }


    /**
     * URL 뒤에 "/" 가 없는 경우 추가한다.
     * @param url
     * @return
     */
    public static String urlAddSlash(String url) {
        if (url != null && !url.substring(url.length() - 1, url.length()).equals("/")) {
            url = url + "/";
        }
        return url;
    }


    /**
     * SHA-256으로 해싱하는 메소드
     *
     * @param bytes
     * @return
     * @throws NoSuchAlgorithmException
     */
    public static String sha256(String msg) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        md.update(msg.getBytes());
        return bytesToHex(md.digest());
    }

    /**
     * 바이트를 헥스값으로 변환한다
     *
     * @param bytes
     * @return
     */
    private static String bytesToHex(byte[] bytes) {
        StringBuilder builder = new StringBuilder();
        for (byte b: bytes) {
            builder.append(String.format("%02x", b));
        }
        return builder.toString();
    }

    /**
     * target 스트링의 앞 부분을 잘라낸다.
     * @param str
     * @param target
     * @return
     */
    public static String removePrefix(String str, String target) {
        // local 테스트때 오류 방지 /data 앞 삭제
        if (str.indexOf(target) != -1) {
            str = str.substring(str.indexOf(target), str.length());
        }
        return str;
    }


    /**
     * URL String encoding checker
     * @param passedUrl.
     * @return boolean.
     */
    public static boolean isUrlEncoded(String passedUrl) {
        boolean isEncoded = true;
        if (passedUrl.matches(".*[\\ \"\\<\\>\\{\\}|\\\\^~\\[\\]].*")) {
            isEncoded = false;
        }
        return isEncoded;
    }

    /**
     * xml 에 담을 긴 글에 대해 76 바이트 단위로 줄 바꿈 "\n"
     * @param string
     * @return string
     */
    public static String cut76(String contentString) {

        if(contentString == null) return EMPTY_STRING;

        if (contentString.length() < 76) {
            return contentString;
        }
        String returnString = contentString.substring(0, 76);
        return returnString + "\n" + cut76(contentString.substring(76, contentString.length()));
    }

    /**
     * 날짜 스트링을 가져온다.
     * @return yyyyMMdd
     */
    public static String getDateString() {
        Date date = new Date();
        String pattern = "yyyyMMddhhmmss";
        SimpleDateFormat format = new SimpleDateFormat(pattern);
        return format.format(date);
    }


    /**
     * 날짜 스트링을 포맷해서 가져온다.
     * @return yyyyMMdd
     */
    public static String getFormattedDate(String dateTime) {
        try {
            if (isEmpty(dateTime)) {
                return "";
            }
            if (dateTime.charAt('-') > 0 || dateTime.charAt(':') > 0 ) {
                return dateTime;
            }
            String pattern = "yyyy-MM-dd hh:mm:ss";
            SimpleDateFormat format = new SimpleDateFormat(pattern);
            return format.format(dateTime);
        } catch (Exception e) {
            return dateTime;
        }
    }


    /**
     * 랜덤 숫자 스트링을 가져온다.
     * cnt = 자릿수 ( 1 ~ max 7 )
     * @return randomized digit strings.
     */
    public static String getRandomDigit(int cnt){
        if(cnt > 7) cnt = 7;
        if(cnt < 2) cnt = 1;
        int num = (int) (Math.random() * (Math.pow(10, cnt)));
        String numString = String.valueOf(num);
        numString = padLeftZeros(numString, cnt);
        //return numString.substring(numString.length()-2);
        return numString;
    }


    public static String padLeftZeros(String inputString, int length) {
        if (inputString.length() >= length) {
            return inputString;
        }
        StringBuilder sb = new StringBuilder();
        while (sb.length() < length - inputString.length()) {
            sb.append('0');
        }
        sb.append(inputString);

        return sb.toString();
    }

    /**
     * Empty 면 다음 인자로 설정
     * @return String
     */
    public static String elseOr(String src, String insteadOf){
        if (isEmpty(src)) {
            return insteadOf;
        }
        return src;
    }

    /**
     * 문서 제목에 인코딩된
     * 태그 스트링 걸려 있는 경우 ( 대체 왜 ?? ...하.. )
     * 제거해주는 기능
     * @return String
     */
    public static String removeTagStringOnNormalText(String src){
        if (isEmpty(src)) {
            return "";
        }
        String content = src.replaceAll("(?s)(?<=&lt;).*?(?=&gt;)", "");
        content = content.replaceAll("<&lt;&gt;", "");
        // I Know... I hate this code. too.
        content = content.replaceAll("<span style=\"color: #000;\">", "");
        content = content.replaceAll("</span>", "");
        return content;
    }

    /**
     * @Java 9 -> inputStream.readAllBytes()
     * max bytes Integer.MAX_VALUE, 2147483647, which is 2G
     * @param inputStream
     * @return String
     */
    public static String convertInputStreamToString(InputStream inputStream) {
        try {
            String result = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
        }
        return null;
    }

    /**
     * JSONArray to StringArray
     * @param array
     * @return
     */
    public static String[] toStringArray(JSONArray array) {
        if(array==null)
            return null;
        String[] arr=new String[array.length()];
        for(int i=0; i<arr.length; i++) {
            arr[i]=array.optString(i);
        }
        return arr;
    }

    /**
     * String(JSONArray) to StringArray

     * @param array
     * @return
     */
    public static String[] toStringArray(String array, String key) {

        boolean isError = false;

        try {
            JSONArray arr = new JSONArray(array);
            String[] stringArray = null;
            int length = arr.length();
            stringArray = new String[length];
            for (int i = 0; i < length; i++) {
                stringArray[i] = arr.getJSONObject(i).getString(key);
            }
            return stringArray;
        } catch (Exception e) {
            isError = true;
        }

        if (isError) {
            // at Abnormal form JSON
            // 	 * Stupid method. Don't make me Using this. plz.
            String src = array.replaceAll("\\[" , "");
            src = src.replaceAll("]", "");
            src = src.replaceAll(",", "");
            src = src.replaceAll("\\{", "");
            src = src.replaceAll("}", "");
            String[] tempArr = src.split(key);
            // trim
            String[] rstArr = new String[tempArr.length];
            for (int i = 0; i < tempArr.length; i++) {
                rstArr[i] = tempArr[i].trim();
            }
            return rstArr;
        }
        logger.error("parsing error ::: " + array);
        return new String[0];
    }

    public static String readFile(String path, Charset encoding)
            throws IOException
    {
        byte[] encoded = Files.readAllBytes(Paths.get(path));
        return new String(encoded, encoding);
    }

    // get a file from the resources folder
    // works everywhere, IDEA, unit test and JAR file.
    public static InputStream getFileFromResourceAsStream(String fileName) {
        // The class loader that loaded the class
        ClassLoader classLoader = CommUtils.class.getClassLoader();
        InputStream inputStream = classLoader.getResourceAsStream(fileName);

        // the stream holding the file content
        if (inputStream == null) {
            throw new IllegalArgumentException("file not found! " + fileName);
        } else {
            return inputStream;
        }

    }

    /**
     * gson toJson 에서 객체생성 전환할 때 데이터준비 중 NumberFormatException 대응
     * @param str
     * @return
     */

    public static String setLPad( String strContext, int iLen, String strChar ) {

        String strResult = "";

        StringBuilder sbAddChar = new StringBuilder();
        for( int i = strContext.length(); i < iLen; i++ ) {
            sbAddChar.append( strChar );
        }

        strResult = sbAddChar + strContext;

        return strResult;
    }

}



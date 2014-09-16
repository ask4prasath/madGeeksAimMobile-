package com.akamai;

import org.apache.cordova.DroidGap;
import org.ksoap2.SoapEnvelope;
import org.ksoap2.serialization.SoapObject;
import org.ksoap2.serialization.SoapPrimitive;
import org.ksoap2.serialization.SoapSerializationEnvelope;
import org.ksoap2.transport.HttpTransportSE;
import org.kxml2.kdom.Element;
import org.kxml2.kdom.Node;

import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

public class CastIron {
	private WebView mAppView;
	private DroidGap mGap;

	public CastIron(DroidGap gap, WebView view) {
		mAppView = view;
		mGap = gap;
	}
	static {
	    //for localhost testing only
	    javax.net.ssl.HttpsURLConnection.setDefaultHostnameVerifier(
	    new javax.net.ssl.HostnameVerifier(){
 
	        public boolean verify(String hostname,
	                javax.net.ssl.SSLSession sslSession) {
	            if (hostname.equals("qa-ciron-app01.kendall.corp.akamai.com")) {
	                return true;
	            }
	            return false;
	        }
	    });
	}
	public static final String NAMESPACE= "http://www.approuter.com/schemas/2008/1/security";
	public static final String DEPNAMESPACE= "http://www.approuter.com/schemas/2008/1/deployment";
	private static Element buildAuthHeader(String sessionId) {
	    Element sessionElement = new Element().createElement(DEPNAMESPACE, "sessionId");
	    sessionElement.addChild(Node.TEXT, sessionId);
	    //System.out.println(sessionElement);
	    return sessionElement;
	}
	@JavascriptInterface
	public String getSessionId(){
		String userNameStr = "admin";
		String passwordStr = "ZSE45rdx";
		String sessionId="";
		if(userNameStr!=null && userNameStr.length() > 0 && passwordStr!= null && passwordStr.length()> 0 ){
			Log.d("Hello","Hello");
			SoapSerializationEnvelope envelope = new SoapSerializationEnvelope(SoapEnvelope.VER11);
			SoapObject req = new SoapObject(NAMESPACE, "login");
			Log.d("Hello","Hello");
			req.addProperty("username", "admin");
			req.addProperty("password", "ZSE45rdx");
			envelope.setOutputSoapObject(req);
			HttpTransportSE httpTransport = new HttpTransportSE("https://qa-ciron-app01.kendall.corp.akamai.com:443/ws/security");
			Log.d("Hello","Hello");
			httpTransport.debug = true;
			try {
				httpTransport.call(NAMESPACE + "login", envelope);
				SoapPrimitive response = (SoapPrimitive)envelope.getResponse();
				System.out.println(response.toString());
				sessionId = response.toString();
				
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		return sessionId;
	}
}

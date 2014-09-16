package org.apache.cordova.plugin;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

public class CastIronPlugin extends CordovaPlugin {
	public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
		if (action.equals("getSessionId")) {
			try {				
//				String username = args.getString(0);
//				String password = args.getString(1);
//				String ciurl = args.getString(2);
				
				callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK,"HelloFrom Cast"));
				return true;
			}catch(Exception e){
				e.printStackTrace();
			}
		}
		return false;
}
}

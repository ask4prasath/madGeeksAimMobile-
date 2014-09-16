var CastIronPlugin = function() {}
CastIronPlugin.prototype.getSessionId = function(message, successCallback,
        errorCallback) {
    try {
        cordova.exec(successCallback, errorCallback, 'CastIronPlugin',
                'getSessionId', message);
    } catch (e) {
        alert("Error: While contacting castiron server");
    }
}

PhoneGap.addConstructor(function() {
    PhoneGap.addPlugin("CastIronPlugin", new CastIronPlugin());
});

if (!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.CastIronPlugin) {
    window.plugins.CastIronPlugin = CastIronPlugin;
    console.log( window.plugins.CastIronPlugin);
}
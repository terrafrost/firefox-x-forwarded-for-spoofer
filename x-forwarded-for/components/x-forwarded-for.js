function XForwardedForProxy() // constructor
{
  prefs = Components.classes["@mozilla.org/preferences-service;1"].
    getService(Components.interfaces.nsIPrefService);
  this.prefs = prefs.getBranch("extensions.x-forwarded-for.");
}

XForwardedForProxy.prototype = {
  observe: function(subject, topic, data)
  {
    switch (topic) {
      case "http-on-modify-request":
        if (this.prefs.getBoolPref("enabled")) {
          var httpChannel = subject.QueryInterface(Components.interfaces.nsIHttpChannel);
          httpChannel.setRequestHeader("X-Forwarded-For", this.prefs.getCharPref("value"), false);
        }
        break;
      case "app-startup":
        var os = Components.classes["@mozilla.org/observer-service;1"]
                           .getService(Components.interfaces.nsIObserverService);
        os.addObserver(this, "http-on-modify-request", false);
    }
  },

  QueryInterface: function(iid) {
    if (!iid.equals(Components.interfaces.nsIObserver) && !iid.equals(Components.interfaces.nsISupports)) {
      throw Components.results.NS_ERROR_NO_INTERFACE;
    }
    return this;
  }
}

var XForwardedForModule = {
  aClassID: Components.ID("{f3bbf109-6d66-46ca-960e-4b78014023b3}"),
  aClassName: "X-Forwarded-For Proxy",
  aContractID: "@frostjedi.com/x-forwarded-for;1",

  registerSelf: function(compMgr, fileSpec, location, type) {
    var compMgr = compMgr.QueryInterface(Components.interfaces.nsIComponentRegistrar);
    compMgr.registerFactoryLocation(this.aClassID,
                                    this.aClassName,
                                    this.aContractID,
                                    fileSpec,
                                    location,
                                    type);
    var catMgr = Components.classes["@mozilla.org/categorymanager;1"].getService(Components.interfaces.nsICategoryManager);
    catMgr.addCategoryEntry("app-startup", this.aClassName, this.aContractID, true, true);
  },

  getClassObject: function(compMgr, cid, iid) {
    return this.factory;
  },

  factory: {
    QueryInterface: function (aIID) {
      if (!iid.equals(Components.interfaces.nsISupports) && !iid.equals(Components.interfaces.nsIFactory)) {
        throw Components.results.NS_ERROR_NO_INTERFACE;
      }
      return this;
    },

    createInstance: function(outer, iid) {
      return new XForwardedForProxy();
    }
  },

  canUnload: function(compMgr) {
    return true;
  }
};

function NSGetModule(compMgr, fileSpec) {
  return XForwardedForModule;
}
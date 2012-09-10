var XForwardedForDialog = {
  updateUI: function()
  {
    document.getElementById("XForwardedForValue").disabled = !document.getElementById("XForwardedForEnabled").checked;
  },

  popupWindow: function()
  {
    openDialog("chrome://x-forwarded-for/content/config.xul", "chrome,centerscreen,toolbar", null);
  }
};
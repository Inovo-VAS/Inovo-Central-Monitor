function getXmlHttpRequestObject() {  //Gets the browser specific XmlHttpRequest Object
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest(); 	//Not IE
    } else if (window.ActiveXObject) {
        return new ActiveXObject("Microsoft.XMLHTTP"); //IE
    } else {
        alert("Your browser doesn't want to use AJAX"); //Displays error message 
    }
}



var receiveSiteListTableReq = getXmlHttpRequestObject();
var receiveHostListADDTableReq = getXmlHttpRequestObject();
var receiveHostListTableReq = getXmlHttpRequestObject();
var receiveSiteListReq = getXmlHttpRequestObject();
var receiveHostListReq = getXmlHttpRequestObject();
var receivetEnableHostListReq = getXmlHttpRequestObject();


var receiveDisabledSiteListReq = getXmlHttpRequestObject();
var receiveDisabledHostListReq = getXmlHttpRequestObject();

// ------------------------------------------------------------------------------------------------------
// USER MANAGEMENT
// ------------------------------------------------------------------------------------------------------
var userManagementProfileReq = getXmlHttpRequestObject();
var userRelogProfileReq = getXmlHttpRequestObject();
var userProfilereq = getXmlHttpRequestObject();
var hostUpdateIDReq = getXmlHttpRequestObject();
var hostUpdateReq = getXmlHttpRequestObject();
var createUserlogReq = getXmlHttpRequestObject();


var serverURL = "/InovoCentralMonitorClient";
// var serverURL = "http://102.164.81.12:7080/InovoCentralMonitorClient";

var selectedDisableHostVAR;

var remoteVodaEXT = "?remotehost=https://41.0.203.210:8443/InovoCentralMonitorClient/MonitorData&action=runopenquery&query=";

function openMenu() {

    var menuWrapper = document.getElementById("wrapper")
    var wrapperStyleValue = menuWrapper.getAttribute("style")

    if (wrapperStyleValue == "display: none;") {
        menuWrapper.setAttribute("style", "")
    } else {
        menuWrapper.setAttribute("style", "display: none;")
    }
}

function startPage() {

    requestUserManagementList();
    var loggedIn;
    var userHash = window.location.hash;
    var key = userHash.replace('#&key=', '');


    if (key != "" && key != undefined) {
        var query = "SELECT InovoMonitor.tblUsers.id, InovoMonitor.tblUsers.username, InovoMonitor.tblUsers.userpassword,InovoMonitor.tblUsers.usersurname,InovoMonitor.tblUsers.userkey,InovoMonitor.tblUsers.userlogin,InovoMonitor.tblUsers.usertype,InovoMonitor.tblUsers.useractive,InovoMonitor.tblUserTypes.description FROM InovoMonitor.tblUsers INNER JOIN InovoMonitor.tblUserTypes ON InovoMonitor.tblUserTypes.id = InovoMonitor.tblUsers.usertype;";

        userRelogProfileReq.open("POST", serverURL + "/MonitorData", true);

        userRelogProfileReq.onreadystatechange = checkLoggedInUser;
        userRelogProfileReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        userRelogProfileReq.send("action=runopenquery&query=" + query);

    }
    else {
        var modalLogin = document.getElementById("modal-login");
        modalLogin.style.display = "block";
        document.getElementById('modal-login').addEventListener('keypress', function (e) {
            var key = e.which || e.keyCode;
            if (key === 13) {
                checkAuth();
            }
        });
    }


    // var toastMessage = date;
    // var toastObj = document.getElementById("toastMessage");
    // var newScheduleStartDate = document.getElementById("StartDate");
    // toastObj.innerHTML = toastMessage;
    // $(function () { $('#mainPageToastAlert').toast('show'); }, 15000);

}
// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------
//                                                         users Manage list
// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------
function requestUserManagementList() {
    var query = "SELECT InovoMonitor.tblUsers.id, InovoMonitor.tblUsers.username,InovoMonitor.tblUsers.usersurname,InovoMonitor.tblUsers.userkey,InovoMonitor.tblUsers.userlogin,InovoMonitor.tblUsers.usertype,InovoMonitor.tblUsers.useractive,InovoMonitor.tblUserTypes.description FROM InovoMonitor.tblUsers INNER JOIN InovoMonitor.tblUserTypes ON InovoMonitor.tblUserTypes.id = InovoMonitor.tblUsers.usertype WHERE InovoMonitor.tblUsers.useractive = 1;";
    // var query = "SELECT * FROM InovoMonitor.tblUsers"; // where InovoMonitor.tblUsers.userpassword = '" + passW + "' AND InovoMonitor.tblUsers.username = '" + userN + "';"

    // userManagementProfileReq.open("POST", serverURLDEV + "/MonitorData", true);
    userManagementProfileReq.open("POST", serverURL + "/MonitorData", true);
    userManagementProfileReq.onreadystatechange = checkLoggedInUser;
    userManagementProfileReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    userManagementProfileReq.send("action=runopenquery&query=" + query);

}
// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------
//                                            CHECK USER AUTHENTICATION
// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------

function checkLoggedInUser() {
    var loggedIn;
    var userLoggedIn;
    var userHash = window.location.hash;
    var userkey = userHash.replace('#&key=', '');

    if (userManagementProfileReq.readyState == 4 && userRelogProfileReq.readyState == 4) {

        // var dbData = JSON.parse(userManagementProfileReq.responseText);
        // userDetails = dbData['queryresult'];

        var userManagementProfileData = JSON.parse(userManagementProfileReq.responseText);
        allUserProfiles = userManagementProfileData['queryresult'];

        for (i = 0; i < allUserProfiles.length; i++) {

            var userK = allUserProfiles[i]['userkey'];

            // if( allUserProfiles[i]['username'] == uProfile['username'])
            if (userK == userkey) {
                loggedIn = true;
                userLoggedIn = allUserProfiles[i];
            }
        }

        if (loggedIn == undefined) {
            var modalLogin = document.getElementById("modal-login");
            modalLogin.style.display = "block";
            document.getElementById('modal-login').addEventListener('keypress', function (e) {
                var key = e.which || e.keyCode;
                if (key === 13) {
                    checkAuth();
                }
            });
        }
        else if (loggedIn == true && loggedIn != undefined) {
            checkLoggedInUserAuth(userLoggedIn);
        }
    }

}

// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------
//                                            CHECK USER AUTHENTICATION
// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------
function checkAuth() {
    // create request 

    //http://102.164.81.12:7080/InovoCentralMonitorClient/UserAuth?action=authenticate&username=esiwela&password=esiwela
    var userN = document.getElementById("username-login").value;
    var passW = document.getElementById("password-login").value;



    // var query = "SELECT * FROM InovoMonitor.tblUsers where InovoMonitor.tblUsers.userpassword = '" + passW + "' AND InovoMonitor.tblUsers.username = '" + userN + "';"
    // var query = "SELECT * FROM InovoMonitor.tblUsers"; // where InovoMonitor.tblUsers.userpassword = '" + passW + "' AND InovoMonitor.tblUsers.username = '" + userN + "';"

    userProfilereq.open("POST", serverURL + "/UserAuth?", true);
    userProfilereq.onreadystatechange = returnProfile;
    userProfilereq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    userProfilereq.send("action=authenticate&username=" + userN + "&password=" + passW)



}
// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------
//                                         USER SESSION 
// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------
function insertHashParam(value) {
    var query = window.location.search;
    var quer = window.location.href;
    var quy = window.location.pathname;
    var qery = window.location.hash;
    var key = "key";
    key = encodeURI(key);
    value = encodeURI(value);

    var kvp = document.location.hash.substr(1).split('&');

    var i = kvp.length; var x; while (i--) {
        x = kvp[i].split('=');

        if (x[0] == key) {
            x[1] = value;
            kvp[i] = x.join('=');
            break;
        }
    }

    if (i < 0) { kvp[kvp.length] = [key, value].join('='); }

    //this will reload the page, it's likely better to store this until finished
    document.location.hash = kvp.join('&');
}

// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------
//                                            CHECK Logged USER AUTHENTICATION
// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------

function checkLoggedInUserAuth(user) {
    var userN;
    var passW;
    // create request 
    if (userRelogProfileReq.readyState == 4) {

        var dbData = JSON.parse(userRelogProfileReq.responseText);
        userDetails = dbData['queryresult'];

        for (i = 0; i < userDetails.length; i++) {
            if ((userDetails[i]['userlogin'] == user['userlogin']) && (userDetails[i]['userkey'] == user['userkey'])) {
                userN = userDetails[i]['userlogin'];
                passW = userDetails[i]['userpassword'];
            }
        }


        // var query = "SELECT * FROM InovoMonitor.tblUsers where InovoMonitor.tblUsers.userpassword = '" + passW + "' AND InovoMonitor.tblUsers.username = '" + userN + "';"
        // var query = "SELECT * FROM InovoMonitor.tblUsers"; // where InovoMonitor.tblUsers.userpassword = '" + passW + "' AND InovoMonitor.tblUsers.username = '" + userN + "';"

        userProfilereq.open("POST", serverURL + "/UserAuth?", true);
        // userProfilereq.open("POST", serverURLDEV + "/UserAuth?", true);
        // userProfilereq.open("POST",   "/UserAuth?", true);
        userProfilereq.onreadystatechange = returnProfile;
        userProfilereq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        userProfilereq.send("action=authenticate&username=" + userN + "&password=" + passW)
    }
    //http://102.164.81.12:7080/InovoCentralMonitorClient/UserAuth?action=authenticate&username=esiwela&password=esiwela

}

// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------
//                                              RETURN USER PROFILE
// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------


function returnProfile() {
    var userProfile = "", allUserProfiles = "", userErrorData = "";
    if (userProfilereq.readyState == 4 && userManagementProfileReq.readyState == 4) {
        var uProfileMng;

        var userProfileData = JSON.parse(userProfilereq.responseText);
        userProfile = userProfileData['UserInfo'];

        userErrorData = userProfileData['Error'];
        userErrorCode = userErrorData['ErrorCode'];
        userErrorMessage = userErrorData['ErrorDescription'];

        var userManagementProfileData = JSON.parse(userManagementProfileReq.responseText);
        allUserProfiles = userManagementProfileData['queryresult'];

        var uProfile = userProfile;




        if (uProfile != undefined && userErrorCode == 0) {

            // var uKey = uProfile['userkey'];
            // var uType = uProfile['usertype'];
            // var uActive = uProfile['useractive'];
            for (i = 0; i < allUserProfiles.length; i++) {

                var name = allUserProfiles[i]['username'];
                var profile = uProfile['userName'];

                // if( allUserProfiles[i]['username'] == uProfile['username'])
                if (name == profile) {
                    uProfileMng = allUserProfiles[i];
                }
            }
            grantAccess(uProfile, uProfileMng);

        }
        else if ((uProfile == undefined && userErrorCode != 0) || userErrorCode == 99) {
            var userN = document.getElementById("username-login");
            var passW = document.getElementById("password-login");

            document.getElementById("errorMessage").innerHTML = "ERROR: " + userErrorMessage;

            document.getElementById("login-form").reset();
            passW.style.border = "1px solid #ff0000";
            userN.style.border = "1px solid #ff0000";
            userN.focus();
        }
    }
}


// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------
//                                              GRANT ACCESS
// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------



function grantAccess(loggedInProfile, loggedProfileDet) {
    // var newScheduleStartDate = document.getElementById("StartDate");
    var profile = loggedInProfile
    var type = loggedProfileDet['usertype'];
    var key = profile['userKey'];
    var active = loggedProfileDet['useractive'];
    var userlogin = profile['userLogin'];
    var userLevelDesc = loggedProfileDet['description'];
    insertHashParam(key);

    if (active == 1) {
        // if admin user
        if ((type == 1 && profile['userTypeDescription'] == "Administrator") || (type == 2 && profile['userTypeDescription'] == "User")) {
            var homeSiteLink = "<a href=\"index.html#&key=" + key + "\"><i class=\"fas fa-home\"></i> Monitoring Dashboard</a>"
            var hostMaintenanceSiteLink = "<a href=\"hostMaintenanceScheduler.html#&key=" + key + "\"><i class=\"fas fa-hammer\"></i> Maintenance Scheduling</a>";
            var serverMonitorThresholdLink = "<a href=\"ServerMonitorThresholds.html#&key=" + key + "\"><i class=\"fas fa-hdd\"></i> Server Monitor Threshold</a>";

            var modalLogin = document.getElementById("modal-login");
            var date = new Date().toISOString().slice(0, 10);

            getSiteList();

            getDisabledSitesTable();


            modalLogin.style.display = "none";
            document.getElementById("loginUserId").innerHTML = userlogin + "(" + userLevelDesc + ")";
            document.getElementById("homeSiteLink").innerHTML = homeSiteLink;
            document.getElementById("hostMaintenanceLink").innerHTML = hostMaintenanceSiteLink;
            document.getElementById("serverMonitorThresholdLink").innerHTML = serverMonitorThresholdLink;
            document.getElementById("login-form").reset();
            // makeMaintenanceTableScroll();
            // makeScheduleTableScroll();

        }
        else {
            var userN = document.getElementById("username-login");
            var passW = document.getElementById("password-login");

            document.getElementById("errorMessage").innerHTML = "ERROR: [" + userlogin + "] You are not an authorized user please contact Inovo for further details.";

            document.getElementById("login-form").reset();
            passW.style.border = "1px solid #ff0000";
            userN.style.border = "1px solid #ff0000";
            userN.focus();
        }
    } else {
        var userN = document.getElementById("username-login");
        var passW = document.getElementById("password-login");

        document.getElementById("errorMessage").innerHTML = "ERROR: [" + userlogin + "] You are not an active user please contact Inovo for further details.";

        document.getElementById("login-form").reset();
        passW.style.border = "1px solid #ff0000";
        userN.style.border = "1px solid #ff0000";
        userN.focus();
    }
}

// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// SITE Table 
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
function getDisabledSitesTable() {

    var queryDisabledHosts =
        "SELECT DISTINCT "
        + "InovoMonitor.tblSites.sitename, "
        + "InovoMonitor.tblHosts.siteid, "
        + "InovoMonitor.tblHosts.hostname, "
        + "InovoMonitor.tblHosts.hostintip, "
        + "COUNT(InovoMonitor.tblHosts.hostintip), "
        + "InovoMonitor.tblHosts.enabled "
        + "FROM InovoMonitor.tblHosts "
        + "INNER JOIN InovoMonitor.tblSites ON InovoMonitor.tblHosts.siteid = InovoMonitor.tblSites.id "
        + "INNER JOIN InovoMonitor.tblAgent ON InovoMonitor.tblHosts.agentid = InovoMonitor.tblAgent.id "
        + "WHERE InovoMonitor.tblSites.sitename != '' "
        + "AND InovoMonitor.tblHosts.hostname != '' "
        + "AND InovoMonitor.tblHosts.hostintip != '' "
        + "AND InovoMonitor.tblHosts.enabled = 0 "
        + "GROUP BY InovoMonitor.tblSites.sitename, "
        + "InovoMonitor.tblSites.id, "
        + "InovoMonitor.tblHosts.hostname, "
        + "InovoMonitor.tblHosts.hostintip, "
        + "InovoMonitor.tblHosts.enabled "
        + "ORDER BY InovoMonitor.tblSites.sitename Asc; ";

    var queryDisabledHostsAdditional =
        "SELECT "
        + "InovoMonitor.tblSites.sitename, "
        + "InovoMonitor.tblHosts.siteid, "
        + "InovoMonitor.tblHosts.hostname, "
        + "InovoMonitor.tblHosts.hostintip, "
        + "COUNT(InovoMonitor.tblHosts.hostname) "
        + "FROM InovoMonitor.tblHosts "
        + "INNER JOIN InovoMonitor.tblSites ON InovoMonitor.tblHosts.siteid = InovoMonitor.tblSites.id "
        + "INNER JOIN InovoMonitor.tblAgent ON InovoMonitor.tblHosts.agentid = InovoMonitor.tblAgent.id "
        + "WHERE InovoMonitor.tblSites.sitename != '' "
        + "AND InovoMonitor.tblHosts.hostname != '' "
        + "AND InovoMonitor.tblHosts.hostintip != '' "
        + "GROUP BY InovoMonitor.tblSites.sitename, "
        + "InovoMonitor.tblSites.id, "
        + "InovoMonitor.tblHosts.hostname, "
        + "InovoMonitor.tblHosts.hostintip "
        + "ORDER BY InovoMonitor.tblSites.sitename Asc; ";


    var queryDisabledSites =
        "SELECT "
        + "InovoMonitor.tblSites.sitename, "
        + "Max(InovoMonitor.tblHosts.enabled), "
        + "InovoMonitor.tblHosts.siteid "
        + "FROM InovoMonitor.tblHosts "
        + "INNER JOIN InovoMonitor.tblSites ON InovoMonitor.tblHosts.siteid = InovoMonitor.tblSites.id "
        + "WHERE InovoMonitor.tblSites.sitename != '' "
        + "group by InovoMonitor.tblHosts.siteid "
        + "order by InovoMonitor.tblSites.sitename asc; ";


    receiveSiteListTableReq.open("POST", serverURL + "/MonitorData", true);
    receiveHostListTableReq.open("POST", serverURL + "/MonitorData", true);
    receiveHostListADDTableReq.open("POST", serverURL + "/MonitorData", true);

    receiveSiteListTableReq.onreadystatechange = openDisabledSiteListTable;
    receiveHostListTableReq.onreadystatechange = openDisabledSiteListTable;
    receiveHostListADDTableReq.onreadystatechange = openDisabledSiteListTable;

    receiveSiteListTableReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    receiveHostListTableReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    receiveHostListADDTableReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    receiveSiteListTableReq.send("action=runopenquery&query=" + queryDisabledSites);
    receiveHostListTableReq.send("action=runopenquery&query=" + queryDisabledHosts);
    receiveHostListADDTableReq.send("action=runopenquery&query=" + queryDisabledHostsAdditional);
}


function openDisabledSiteListTable() {

    var filData = "";
    var siteIDArray = [];
    var tableArray = [];
    var hostArray = [];


    var siteTxtData = "";
    if (receiveSiteListTableReq.readyState == 4 && receiveHostListTableReq.readyState == 4 && receiveHostListADDTableReq.readyState == 4) {

        var dbSiteData = JSON.parse(showError(receiveSiteListTableReq.responseText, "Error Found"));
        var dbHostData = JSON.parse(showError(receiveHostListTableReq.responseText, "Error Found"));
        var dbHostAddData = JSON.parse(showError(receiveHostListADDTableReq.responseText, "Error Found"));

        if ((Object.entries(dbSiteData).length != 0) && (Object.entries(dbHostData).length != 0) && (Object.entries(dbHostAddData).length != 0)) {

            var hostDetails = dbHostData['queryresult'];
            var hostAddDetails = dbHostAddData['queryresult'];
            var siteDetails = dbSiteData['queryresult'];

            for (var iAlarm = 0; iAlarm < siteDetails.length; iAlarm++) {
                var rowData = siteDetails[iAlarm];

                if (rowData["Max(InovoMonitor.tblHosts.enabled)"] == 1) {
                    siteIDArray.push(rowData);
                }
                else {
                    tableArray.push(rowData);
                }
            }

            for (var i = 0; i < siteIDArray.length; i++) {
                var rowData = siteIDArray[i];

                for (var index = 0; index < hostDetails.length; index++) {
                    var hostData = hostDetails[index];
                    if (rowData['siteid'] == hostData['siteid']) {
                        hostArray.push(hostData);
                    }
                }

            }

            for (var index = 0; index < hostArray.length; index++) {
                var host = hostArray[index];

                var hostAdd;
                for (var indexAdd = 0; indexAdd < hostAddDetails.length; indexAdd++) {
                    hostAdd = hostAddDetails[indexAdd];
                    if (host['hostintip'] == hostAdd['hostintip'] && host['hostname'] == hostAdd['hostname']) {

                        if (host['COUNT(InovoMonitor.tblHosts.hostintip)'] == hostAdd['COUNT(InovoMonitor.tblHosts.hostname)']) {
                            filData = "<tr id=\"Warning\">"
                                + "<td width=\"17%\">" + host['sitename'] + "</td>"
                                + "<td width=\"17%\">" + host['hostname'] + "</td>"
                                + "<td width=\"17%\">" + host['hostintip'] + "</td>"
                                + "<td width=\"17%\">" + host['COUNT(InovoMonitor.tblHosts.hostintip)'] + " out of " + hostAdd['COUNT(InovoMonitor.tblHosts.hostname)'] + "</td>"
                                + "<td width=\"17%\">YES</td>"
                                + "<td width=\"15%\">"
                                + "<a class=\"infoModalPress\" data-toggle=\"modal\""
                                + "data-target=\".host-modal-lg\" onclick=\"getDisabledHostModal('" + host['hostname'] + "', " + host['siteid'] + ", '" + host['hostintip'] + "' );\""
                                + "title=\"Click for More Info\">"
                                + "<i class=\"fas fa-ellipsis-v\""
                                + "style=\"font-size: 25px;color: rgb(4,4,4);\"></i>"
                                + "</a></td></tr>";

                            siteTxtData += filData;
                        } else {
                            filData = "<tr>"
                                + "<td width=\"17%\">" + host['sitename'] + "</td>"
                                + "<td width=\"17%\">" + host['hostname'] + "</td>"
                                + "<td width=\"17%\">" + host['hostintip'] + "</td>"
                                + "<td width=\"17%\">" + host['COUNT(InovoMonitor.tblHosts.hostintip)'] + " out of " + hostAdd['COUNT(InovoMonitor.tblHosts.hostname)'] + "</td>"
                                + "<td width=\"17%\">NO</td>"
                                + "<td width=\"15%\">"
                                + "<a class=\"infoModalPress\" data-toggle=\"modal\""
                                + "data-target=\".host-modal-lg\" onclick=\"getDisabledHostModal('" + host['hostname'] + "', " + host['siteid'] + ", '" + host['hostintip'] + "' );\""
                                + "title=\"Click for More Info\">"
                                + "<i class=\"fas fa-ellipsis-v\""
                                + "style=\"font-size: 25px;color: rgb(4,4,4);\"></i>"
                                + "</a></td></tr>";

                            siteTxtData += filData;
                        }

                    }
                }






            }

            for (var indexTab = 0; indexTab < tableArray.length; indexTab++) {
                var tableData = tableArray[indexTab];

                filData = "<tr id=\"Error\">"
                    + "<td width=\"17%\">" + tableData['sitename'] + "</td>"
                    + "<td width=\"17%\">Site Down</td>"
                    + "<td width=\"17%\">All Hosts Disabled</td>"
                    + "<td width=\"17%\">---</td>"
                    + "<td width=\"17%\">---</td>"
                    + "<td width=\"15%\">"
                    + "<a class=\"infoModalPress\" data-toggle=\"modal\""
                    + "data-target=\".host-site-modal-lg\" onclick=\"getDisabledSiteModal(" + tableData['siteid'] + ");\""
                    + "title=\"Click for More Info\">"
                    + "<i class=\"fas fa-ellipsis-v\""
                    + "style=\"font-size: 25px;color: rgb(4,4,4);\"></i>"
                    + "</a></td></tr>";

                siteTxtData += filData;
            }

        }
        document.getElementById("enabledSites").innerHTML = siteTxtData;
    }
}
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
function getDisabledSiteModal(siteidVar) {

    var queryDisabledSites =
        "SELECT DISTINCT "
        + "InovoMonitor.tblSites.sitename, "
        + "InovoMonitor.tblHosts.hostname, "
        + "InovoMonitor.tblHosts.hostip, "
        + "InovoMonitor.tblHosts.hostintip, "
        + "InovoMonitor.tblHosts.enabled "
        + "FROM InovoMonitor.tblHosts "
        + "INNER JOIN InovoMonitor.tblSites ON InovoMonitor.tblHosts.siteid = InovoMonitor.tblSites.id "
        + "WHERE InovoMonitor.tblHosts.siteid = " + siteidVar + " "
        + "GROUP BY "
        + "InovoMonitor.tblSites.sitename, "
        + "InovoMonitor.tblHosts.hostname, "
        + "InovoMonitor.tblHosts.hostip, "
        + "InovoMonitor.tblHosts.hostintip, "
        + "InovoMonitor.tblHosts.enabled "
        + "order by InovoMonitor.tblHosts.hostname asc; ";


    receiveDisabledSiteListReq.open("POST", serverURL + "/MonitorData", true);
    receiveDisabledSiteListReq.onreadystatechange = showDisabledSiteModal;
    receiveDisabledSiteListReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    receiveDisabledSiteListReq.send("action=runopenquery&query=" + queryDisabledSites);
}
function showDisabledSiteModal() {
    var filData = "";
    var siteTxtData = "";

    if (receiveDisabledSiteListReq.readyState == 4) {

        var dbSiteData = JSON.parse(showError(receiveDisabledSiteListReq.responseText, "Error Found"));
        if (Object.entries(dbSiteData).length != 0) {


            var siteDetails = dbSiteData['queryresult'];

            for (index = 0; index < siteDetails.length; index++) {
                var siteData = siteDetails[index];

                if (siteData['enabled'] == 1) {
                    filData = "<tr>"
                        + "<td width=\"143px\">" + siteData['sitename'] + "</td>"
                        + "<td width=\"179px\">" + siteData['hostname'] + "</td>"
                        + "<td width=\"156px\">" + siteData['hostip'] + "</td>"
                        + "<td width=\"143px\">" + siteData['hostintip'] + "</td>"
                        + "<td width=\"127px\">NO</td></tr>";
                }
                else {
                    filData = "<tr>"
                        + "<td width=\"143px\">" + siteData['sitename'] + "</td>"
                        + "<td width=\"179px\">" + siteData['hostname'] + "</td>"
                        + "<td width=\"156px\">" + siteData['hostip'] + "</td>"
                        + "<td width=\"143px\">" + siteData['hostintip'] + "</td>"
                        + "<td width=\"127px\">YES</td></tr>";
                }
                siteTxtData += filData;
            }

            document.getElementById("sitenameData").innerHTML = siteDetails[0]['sitename'];
            document.getElementById("siteHosts").innerHTML = siteTxtData;




        }
    }

}
function getDisabledHostModal(hostname, siteid, hostintip) {



    var queryDisabledHosts =
        "SELECT "
        + "InovoMonitor.tblSites.sitename, "
        + "InovoMonitor.tblHosts.siteid, "
        + "InovoMonitor.tblAgent.agenttype, "
        + "InovoMonitor.tblHosts.hostname, "
        + "InovoMonitor.tblHosts.hostintip, "
        + "InovoMonitor.tblHosts.hostip, "
        + "InovoMonitor.tblHosts.enabled "
        + "FROM InovoMonitor.tblHosts "
        + "INNER JOIN InovoMonitor.tblSites ON InovoMonitor.tblHosts.siteid = InovoMonitor.tblSites.id "
        + "INNER JOIN InovoMonitor.tblAgent ON InovoMonitor.tblHosts.agentid = InovoMonitor.tblAgent.id "
        + "WHERE InovoMonitor.tblHosts.siteid = " + siteid + " "
        + "AND InovoMonitor.tblHosts.hostname = '" + hostname + "' "
        + "AND InovoMonitor.tblHosts.hostintip = '" + hostintip + "' "
        + "ORDER BY InovoMonitor.tblHosts.hostname; "


    receiveDisabledHostListReq.open("POST", serverURL + "/MonitorData", true);
    receiveDisabledHostListReq.onreadystatechange = showDisabledHostModal;
    receiveDisabledHostListReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    receiveDisabledHostListReq.send("action=runopenquery&query=" + queryDisabledHosts);
}
function showDisabledHostModal() {
    var filData = "";
    var siteTxtData = "";


    if (receiveDisabledHostListReq.readyState == 4) {

        var dbHostData = JSON.parse(showError(receiveDisabledHostListReq.responseText, "Error Found"));

        if (Object.entries(dbHostData).length != 0) {
            var hostDetails = dbHostData['queryresult'];


            for (index = 0; index < hostDetails.length; index++) {
                var hostData = hostDetails[index];

                if (hostData['enabled'] == 1) {
                    filData = "<tr>"
                        + "<td width=\"17%\">" + hostData['sitename'] + "</td>"
                        + "<td width=\"17%\">" + hostData['hostname'] + "</td>"
                        + "<td width=\"17%\">" + hostData['agenttype'] + "</td>"
                        + "<td width=\"17%\">" + hostData['hostip'] + "</td>"
                        + "<td width=\"17%\">" + hostData['hostintip'] + "</td>"
                        + "<td width=\"15%\">NO</td></tr>";
                }
                else {
                    filData = "<tr id=\"Warning\">"
                        + "<td width=\"17%\">" + hostData['sitename'] + "</td>"
                        + "<td width=\"17%\">" + hostData['hostname'] + "</td>"
                        + "<td width=\"17%\">" + hostData['agenttype'] + "</td>"
                        + "<td width=\"17%\">" + hostData['hostip'] + "</td>"
                        + "<td width=\"17%\">" + hostData['hostintip'] + "</td>"
                        + "<td width=\"15%\">YES</td></tr>";
                }
                siteTxtData += filData;
            }


            document.getElementById("hostnameData").innerHTML = hostDetails[0]['hostname'];
            document.getElementById("hostAgents").innerHTML = siteTxtData;

        }
    }
}


// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// Enable
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
function toggleEnableHost(siteid, hostname, hostintipVAR) {

    // receivetEnableHostListReq

    var name = sitename;
    var hostToggle = document.getElementById("enableHostToggle");
    var toggleValue;

    var filData = "";

    var siteTxtData = "";
    if (receiveSiteListTableReq.readyState == 4) {

        var dbData = JSON.parse(showError(receiveSiteListTableReq.responseText, "Error Found"));

        if (Object.entries(dbData).length != 0) {

            var siteDetails = dbData['queryresult'];
        }
    }

    if (hostToggle.checked == true) {
        toggleValue = "enabled";
    } else {
        toggleValue = "disabled";
    }

    var toastDelayTime = 15000;
    // set title
    var toastTitle = "TOGGLE SWITCHED!";
    //Set Message
    var toastMessage = "the '" + sitename + "' is set to: " + toggleValue + "" //"Please ensure the Site, Host and Schedule are selected before submitting to create a maintenance schedule.";
    showToastMessage(toastMessage, toastTitle, toastDelayTime);
}
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// SITE LIST FUNCTIONS 
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------


function getSiteList() {
    var query = "SELECT InovoMonitor.tblSites.id, InovoMonitor.tblSites.sitename "
        + "FROM InovoMonitor.tblSites "
        + "INNER JOIN InovoMonitor.tblHosts ON InovoMonitor.tblSites.id = InovoMonitor.tblHosts.siteid "
        + "WHERE InovoMonitor.tblSites.sitename != '' "
        + "group by InovoMonitor.tblSites.id, InovoMonitor.tblSites.sitename order by InovoMonitor.tblSites.sitename;"


    receiveSiteListReq.open("POST", serverURL + "/MonitorData", true);
    receiveSiteListReq.onreadystatechange = openSiteList;
    receiveSiteListReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    receiveSiteListReq.send("action=runopenquery&query=" + query);




}

//---------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------
//
//---------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------

function getEnableHostList() {
    var siteid = document.getElementById("selectSite").value;


    query =
        "SELECT DISTINCT "
        + "InovoMonitor.tblSites.sitename, "
        + "InovoMonitor.tblHosts.siteid, "
        + "InovoMonitor.tblHosts.hostname,   "
        + "InovoMonitor.tblHosts.hostintip, "
        + "InovoMonitor.tblHosts.enabled "
        + "FROM InovoMonitor.tblHosts "
        + "INNER JOIN InovoMonitor.tblSites ON InovoMonitor.tblHosts.siteid = InovoMonitor.tblSites.id "
        + "INNER JOIN InovoMonitor.tblAgent ON InovoMonitor.tblHosts.agentid = InovoMonitor.tblAgent.id "
        + "WHERE InovoMonitor.tblSites.sitename != ''  "
        + "AND InovoMonitor.tblHosts.siteid = " + siteid + " "
        + "AND InovoMonitor.tblHosts.hostname != '' "
        + "AND InovoMonitor.tblHosts.hostintip != '' "
        + "GROUP BY InovoMonitor.tblSites.sitename, "
        + "InovoMonitor.tblHosts.siteid, "
        + "InovoMonitor.tblHosts.hostname,   "
        + "InovoMonitor.tblHosts.hostintip, "
        + "InovoMonitor.tblHosts.enabled "
        + "ORDER BY InovoMonitor.tblHosts.hostintip Asc; ";

    receivetEnableHostListReq.open("POST", serverURL + "/MonitorData", true);
    receivetEnableHostListReq.onreadystatechange = showEnableHostList;
    receivetEnableHostListReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    receivetEnableHostListReq.send("action=runopenquery&query=" + query);

}

function showEnableHostList() {
    document.getElementById("rowDisableHost").hidden = false;


    var filData = "";

    var siteTxtData = "";
    if (receivetEnableHostListReq.readyState == 4) {

        var dbData = JSON.parse(showError(receivetEnableHostListReq.responseText));
        var siteDetails = dbData['queryresult'];


        if (Object.entries(siteDetails).length != 0) {


            for (var iAlarm = 0; iAlarm < siteDetails.length; iAlarm++) {
                var rowData = siteDetails[iAlarm];
                var isEnabled = rowData['enabled']
                if (isEnabled == 1) {
                    filData = "<tr><td>" + rowData['hostname'] + "</td>"
                        + "<td>" + rowData['hostintip'] + "</td>"
                        + "<td><label class=\"switch\">"
                        + "<input id=\"enableHostToggle\" onclick=\"updateHostManagement(" + rowData['siteid'] + ",'" + rowData['hostname'] + "','" + rowData['hostintip'] + "')\" type=\"checkbox\" checked>"
                        + "<span class=\"slider round\"></span>"
                        + "</label>"
                        + "</td></tr>";

                } else {
                    filData = "<tr><td>" + rowData['hostname'] + "</td>"
                        + "<td>" + rowData['hostintip'] + "</td>"
                        + "<td><label class=\"switch\">"
                        + "<input id=\"enableHostToggle\" onclick=\"updateHostManagement(" + rowData['siteid'] + ",'" + rowData['hostname'] + "','" + rowData['hostintip'] + "')\" type=\"checkbox\">"
                        + "<span class=\"slider round\"></span>"
                        + "</label>"
                        + "</td></tr>";

                }


                siteTxtData += filData;
            }
            document.getElementById("enabledHosts").innerHTML = siteTxtData;
        }
    }
}

//---------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------

function openSiteList() {
    var filData = "";

    var siteTxtData = "";
    if (receiveSiteListReq.readyState == 4) {

        var dbData = JSON.parse(showError(receiveSiteListReq.responseText));
        var siteDetails = dbData['queryresult'];
        if (Object.entries(siteDetails).length != 0) {
            // filData = "<option selected=\"\" value=\"undefined\">Choose Host Site to Enable/Disable Host</option>"

            // siteTxtData += filData;

            for (var iAlarm = 0; iAlarm < siteDetails.length; iAlarm++) {
                var rowData = siteDetails[iAlarm];

                filData = "<option  value=\"" + rowData['id'] + "\">" + rowData['sitename'] + "</option>";

                siteTxtData += filData;
            }
            document.getElementById("selectSite").innerHTML = siteTxtData;
            getEnableHostList();
        } else {
            var enable = $("#selectHostEnable option:selected").text();
            //set time 
            var toastDelayTime = 10000;
            // set title
            var toastTitle = "NOTE!";
            //Set Message
            var toastMessage = "Unfortunately there are no sites to " + enable + ". Please select another option.";

            //set objects
            var toastPopup = document.getElementById("mainPageToastAlert");
            var toastTITLEObj = document.getElementById("toastTitle");
            var toastMSGObj = document.getElementById("toastMessage");


            // run toast 
            toastPopup.setAttribute("data-delay", toastDelayTime);
            toastTITLEObj.innerHTML = toastTitle;
            toastMSGObj.innerHTML = toastMessage;
            $(function () { $('#mainPageToastAlert').toast('show'); });
            resetPage();
        }



    }

}




function showToastMessage(tstMessage, tstTitle, tstDelayTime) {
    //set time 
    var toastDelayTime = tstDelayTime;
    // set title
    var toastTitle = tstTitle;
    //Set Message
    var toastMessage = tstMessage;

    //set objects
    var toastPopup = document.getElementById("mainPageToastAlert");
    var toastTITLEObj = document.getElementById("toastTitle");
    var toastMSGObj = document.getElementById("toastMessage");


    // run toast 
    toastPopup.setAttribute("data-delay", toastDelayTime);
    toastTITLEObj.innerHTML = toastTitle;
    toastMSGObj.innerHTML = toastMessage;
    $(function () { $('#mainPageToastAlert').toast('show'); });
}

function showError(resp, errorlabel) {

    if (resp.indexOf("Exception :") == 0) {
        //alert((errorlabel == undefined ?'':(errorlabel+'\r\n')) + resp);
        //set time 

        var toastDelayTime = 15000;
        // set title
        var toastTitle = (errorlabel == undefined ? 'Error!' : errorlabel);
        //Set Message
        var toastMessage = resp //"Please ensure the Site, Host and Schedule are selected before submitting to create a maintenance schedule.";
        showToastMessage(resp, toastTitle, toastDelayTime);

        return "{}";
    }
    return resp;
}


// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// HOST LIST FUNCTIONS 
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------

function getHostList() {

    var siteId = document.getElementById("selectSite").value;
    var enableSite = document.getElementById("selectHostEnable").value;


    // var query = "SELECT DISTINCT InovoMonitor.tblHosts.hostname, InovoMonitor.tblHosts.enabled FROM InovoMonitor.tblHosts INNER JOIN InovoMonitor.tblAgent ON InovoMonitor.tblHosts.agentid = InovoMonitor.tblAgent.id INNER JOIN InovoMonitor.tblSites ON InovoMonitor.tblSites.id = InovoMonitor.tblHosts.siteid where InovoMonitor.tblHosts.siteid = '" + siteId + "'  AND InovoMonitor.tblHosts.enabled = 1 group by InovoMonitor.tblHosts.hostname, InovoMonitor.tblHosts.enabled;";
    var query = "SELECT DISTINCT "
        + "InovoMonitor.tblHosts.hostname, InovoMonitor.tblHosts.enabled "
        + "FROM InovoMonitor.tblHosts "
        + "INNER JOIN InovoMonitor.tblAgent "
        + "ON InovoMonitor.tblHosts.agentid = InovoMonitor.tblAgent.id "
        + "INNER JOIN InovoMonitor.tblSites "
        + "ON InovoMonitor.tblSites.id = InovoMonitor.tblHosts.siteid "
        + "where InovoMonitor.tblHosts.siteid = " + siteId + " "
        + "group by InovoMonitor.tblHosts.hostname, InovoMonitor.tblHosts.enabled;";

    receiveHostListReq.open("POST", serverURL + "/MonitorData", true);
    receiveHostListReq.onreadystatechange = openHostList;
    receiveHostListReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    receiveHostListReq.send("action=runopenquery&query=" + query);

}

function openHostList() {
    var filData = "";

    var hostTxtData = "";

    if (receiveHostListReq.readyState == 4) {

        var dbData = JSON.parse(receiveHostListReq.responseText);
        var hostDetails = dbData['queryresult'];

        filData = "<option selected=\"\" value=\"undefined\">Choose Host...</option>"

        hostTxtData += filData;
        if (hostDetails.length != 0) {


            for (var iAlarm = 0; iAlarm < hostDetails.length; iAlarm++) {
                var rowData = hostDetails[iAlarm];

                filData = "<option  value=\"" + rowData['hostname'] + "\">" + rowData['hostname'] + "</option>";

                hostTxtData += filData;
            }
            document.getElementById("selectHost").innerHTML = hostTxtData;
        } else {
            var site = $("#selectSite option:selected").text();
            var enableChoice = $("#selectHostEnable option:selected").text();
            //set time 
            var toastDelayTime = 10000;
            // set title
            var toastTitle = "NOTE!";
            //Set Message
            var toastMessage = "Unfortunately there are no hosts to be " + enableChoice + "d in this site(" + site + "). Please select another option.";

            //set objects
            var toastPopup = document.getElementById("mainPageToastAlert");
            var toastTITLEObj = document.getElementById("toastTitle");
            var toastMSGObj = document.getElementById("toastMessage");


            // run toast 
            toastPopup.setAttribute("data-delay", toastDelayTime);
            toastTITLEObj.innerHTML = toastTitle;
            toastMSGObj.innerHTML = toastMessage;
            $(function () { $('#mainPageToastAlert').toast('show'); });
            resetPage();
        }

    }
}




// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// HOST LIST FUNCTIONS 
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------




function retrieveHostIDsForUpdate() {
    // var displaySchedule = document.getElementById("selectScheduleDisplay");

    // var scheduleId = displaySchedule.getAttribute("data-scheduleid");;
    var selectedSite = document.getElementById("selectSite").value;
    var selectedHost = document.getElementById("selectHost").value;
    var selectedHostEnable = document.getElementById("selectHostEnable").value;
    // var metricvalue = "Running";

    if (selectedHostEnable != undefined && selectedHostEnable != "undefined" && selectedHost != undefined && selectedHost != "undefined" && selectedSite != undefined && selectedSite != "undefined") {

        var query = "SELECT InovoMonitor.tblHosts.id"
            + " FROM InovoMonitor.tblHosts "
            + "INNER JOIN InovoMonitor.tblAgent ON InovoMonitor.tblHosts.agentid = InovoMonitor.tblAgent.id "
            + "INNER JOIN InovoMonitor.tblSites ON InovoMonitor.tblSites.id = InovoMonitor.tblHosts.siteid  "
            + "where InovoMonitor.tblHosts.siteid = '" + selectedSite + "' "
            + "AND InovoMonitor.tblHosts.hostname = '" + selectedHost + "' "
            + "AND InovoMonitor.tblHosts.enabled = '" + selectedHostEnable + "' "
            + "order by InovoMonitor.tblHosts.id;"
        // document.getElementById("selectSource").disabled = false;
        hostUpdateIDReq.open("POST", serverURL + "/MonitorData", true);
        //Set the function that will be called when the XmlHttpRequest objects state changes.		
        hostUpdateIDReq.onreadystatechange = updateHostManagement;
        hostUpdateIDReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        hostUpdateIDReq.send("action=runopenquery&query=" + query);

    } else {
        //set time 
        var toastDelayTime = 10000;
        // set title
        var toastTitle = "WARNING!";
        //Set Message
        var toastMessage = "Please chose to enable/disable then ensure the SITE and HOST have been set/selected to proceed.";

        //set objects
        var toastPopup = document.getElementById("mainPageToastAlert");
        var toastTITLEObj = document.getElementById("toastTitle");
        var toastMSGObj = document.getElementById("toastMessage");


        // run toast 
        toastPopup.setAttribute("data-delay", toastDelayTime);
        toastTITLEObj.innerHTML = toastTitle;
        toastMSGObj.innerHTML = toastMessage;
        $(function () { $('#mainPageToastAlert').toast('show'); });
        resetPage();
    }

}




function updateHostManagement(siteid, hostname, hostintipVAR) {

    // if (hostUpdateIDReq.readyState == 4) {
    //     var selectedEnabler = document.getElementById("selectEnabler").value;
    //     var dbData = JSON.parse(hostUpdateIDReq.responseText);
    //     var idDetails = dbData['queryresult'];
    //     var finalIDList;
    //     var queryArr = [];
    //     for (var iAlarm = 0; iAlarm < idDetails.length; iAlarm++) {
    //         var rowData = idDetails[iAlarm];
    //         queryArr.push(rowData['id']);
    //     }



    //     finalIDList = createIDClause(queryArr);


    //     if (finalIDList != null && finalIDList.length != 0) {



    var dateNow = new Date();
    dateNow = dateNow.getFullYear() + '-' +
        ('00' + (dateNow.getMonth() + 1)).slice(-2) + '-' +
        ('00' + dateNow.getDate()).slice(-2) + ' ' +
        ('00' + dateNow.getHours()).slice(-2) + ':' +
        ('00' + dateNow.getMinutes()).slice(-2) + ':' +
        ('00' + dateNow.getSeconds()).slice(-2);



    var hostToggle = document.getElementById("enableHostToggle");
    var toggleValue;

    var filData = "";

    var siteTxtData = "";
    // if (receiveSiteListTableReq.readyState == 4) {

    //     var dbData = JSON.parse(showError(receiveSiteListTableReq.responseText, "Error Found"));

    //     if (Object.entries(dbData).length != 0) {

    //         var siteDetails = dbData['queryresult'];
    //     }
    // }

    if (hostToggle.checked == true) {
        toggleValue = 1;



    } else {
        toggleValue = 0;


    }

    selectedDisableHostVAR = "hostname: " + hostname + ",  hostintipVAR: " + hostintipVAR + ", siteid: " + siteid + ", set enabled to: " + toggleValue + "";

    query = "UPDATE InovoMonitor.tblHosts "
        + "SET InovoMonitor.tblHosts.enabled = " + toggleValue + ", "
        + "InovoMonitor.tblHosts.updated = '" + dateNow + "' "
        + "WHERE InovoMonitor.tblHosts.hostintip = '" + hostintipVAR + "' "
        + "AND InovoMonitor.tblHosts.siteid = " + siteid + " "
        + "AND InovoMonitor.tblHosts.hostname = '" + hostname + "' "


    hostUpdateReq.open("POST", serverURL + "/MonitorData", true);
    //Set the function that will be called when the XmlHttpRequest objects state changes.		
    hostUpdateReq.onreadystatechange = logUserUpdatingHost;
    hostUpdateReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    hostUpdateReq.send("action=runopenquery&query=" + query);

    // var toastDelayTime = 15000;
    // // set title
    // var toastTitle = "TOGGLE SWITCHED!";
    // //Set Message
    // var toastMessage = "the '" + sitename + "' is set to: " + toggleValue + "" //"Please ensure the Site, Host and Schedule are selected before submitting to create a maintenance schedule.";
    // showToastMessage(toastMessage, toastTitle, toastDelayTime);

    // }
    // else {

    //     var enable = $("#selectHostEnable option:selected").text();
    //     var host = $("#selectHost option:selected").text();
    //     var site = $("#selectSite option:selected").text();

    //     //set time 
    //     var toastDelayTime = 30000;
    //     // set title
    //     var toastTitle = "ERROR!";
    //     //Set Message
    //     var toastMessage = " The choice to " + enable + ", Site: " + site + " & Host: " + host + " has FAILED. Please contact Inovo Monitoring Immediately.";

    //     //set objects
    //     var toastPopup = document.getElementById("mainPageToastAlert");
    //     var toastTITLEObj = document.getElementById("toastTitle");
    //     var toastMSGObj = document.getElementById("toastMessage");


    //     // run toast 
    //     toastPopup.setAttribute("data-delay", toastDelayTime);
    //     toastTITLEObj.innerHTML = toastTitle;
    //     toastMSGObj.innerHTML = toastMessage;
    //     $(function () { $('#mainPageToastAlert').toast('show'); });
    // }

}



function createIDClause(idArray) {
    var clauseQuery = "";
    if (idArray.length >= 2) {
        var n = 0;
        for (i = 0; i < idArray.length - 1; i++) {
            n++;
            clauseQuery += idArray[i] + ", ";
        }

        clauseQuery += idArray[n];

    }
    else if (idArray.length == 1) {
        clauseQuery += idArray[0];
    }

    return clauseQuery;
}

function resetPage() {
    var siteTxtData = "<option selected=\"\" value=\"undefined\">Choose Site...</option>"
    var hostTxtData = "<option selected=\"\" value=\"undefined\">Choose Host...</option>"
    var enableHostTxtData = "<option  selected=\"\" value=\"undefined\">Do you want to Enable/Disable Host?</option>"
        + "<option id=\"Disabled\" value=\"0\">Enable</option>"
        + "<option id=\"Enabled\" value=\"1\">Disable</option>";
    document.getElementById("selectSite").innerHTML = siteTxtData;
    document.getElementById("selectHost").innerHTML = hostTxtData;
    document.getElementById("selectHostEnable").innerHTML = enableHostTxtData;
    document.getElementById("selectSite").disabled = true;
    document.getElementById("selectHost").disabled = true;
}

function completeHostManage() {
    if (hostUpdateReq.readyState == 4 && createUserlogReq.readyState == 4) {

        var dbData = JSON.parse(showError(hostUpdateReq.responseText, "Error Found"));

        // if ((Object.entries(dbData).length == 0)) {

        var Details = dbData['queryresult'];
        //set time 
        var toastDelayTime = 7000;
        // set title
        var toastTitle = "COMPLETE!";
        //Set Message
        var toastMessage = selectedDisableHostVAR;

        //set objects
        var toastPopup = document.getElementById("mainPageToastAlert");
        var toastTITLEObj = document.getElementById("toastTitle");
        var toastMSGObj = document.getElementById("toastMessage");


        // run toast 
        toastPopup.setAttribute("data-delay", toastDelayTime);
        toastTITLEObj.innerHTML = toastTitle;
        toastMSGObj.innerHTML = toastMessage;
        $(function () { $('#mainPageToastAlert').toast('show'); });

        getDisabledSitesTable();

        // resetPage();
        // }

    }

}


// ----------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------
//  LOG USERS
// ----------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------

function logUserUpdatingHost() {
    if (hostUpdateReq.readyState == 4) {

        // var enableChoice = $("#selectHostEnable option:selected").text();
        // var siteSelected = $("#selectSite option:selected").text();
        // var hostSelected = $("#selectHost option:selected").text();

        var dbHostUpdateData = JSON.parse(showError(hostUpdateReq.responseText, "Error Found"));
        //  if ((Object.entries(dbHostUpdateData).length == 0)) {

        var currentUser;
        var userProfileID = "";
        var dateNow;

        // var remoteVodaEXT = "?remotehost=https://41.0.203.210:8443/InovoCentralMonitorClient/MonitorData&action=runopenquery&query=";


        // var newUserId;

        var dbData = JSON.parse(showError(userManagementProfileReq.responseText, "Error Found"));
        var dbData = JSON.parse(showError(userManagementProfileReq.responseText, "Error Found"));
        var userDetails = dbData['queryresult'];


        var userProfileData = JSON.parse(showError(userProfilereq.responseText, "Error Found"));
        var userProfile = userProfileData['UserInfo'];

        currentUser = userProfile['userLogin']
        for (var iAlarm = 0; iAlarm < userDetails.length; iAlarm++) {

            var rowData = userDetails[iAlarm];
            if (currentUser == rowData['userlogin']) {
                userProfileID = rowData['id'];
            }
        }

        // // --------------------------------------------------------------------------------------------------------------------------------------------------
        // //  UPDATE USER LOG
        // // --------------------------------------------------------------------------------------------------------------------------------------------------    
        var updateReason = createReasonUserLog();
        // var query = "SELECT * FROM InovoMonitor.tblAlarms;"

        dateNow = new Date();
        dateNow = dateNow.getFullYear() + '-' +
            ('00' + (dateNow.getMonth() + 1)).slice(-2) + '-' +
            ('00' + dateNow.getDate()).slice(-2) + ' ' +
            ('00' + dateNow.getHours()).slice(-2) + ':' +
            ('00' + dateNow.getMinutes()).slice(-2) + ':' +
            ('00' + dateNow.getSeconds()).slice(-2);

        var insertLogquery = "INSERT INTO InovoMonitor.tblUserLog (userid, reason, datecreated, createdby)  VALUES ('" + userProfileID + "','" + String(updateReason) + "', '" + dateNow + "','" + currentUser + "');";

        createUserlogReq.open("POST", serverURL + "/MonitorData", true);
        createUserlogReq.onreadystatechange = completeHostManage;
        createUserlogReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        createUserlogReq.send("action=runopenquery&query=" + insertLogquery);

    }


}
// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------
//                                            INSERT INTO USER LOGS
// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------
function createReasonUserLog() {
    var currentUserProfile;



    if (userProfilereq.readyState == 4) {
        var userProfileData = JSON.parse(userProfilereq.responseText);
        currentUserProfile = userProfileData['UserInfo'];
    }

    // var setEnableChoice = "";
    // var setSiteSelected = "";
    // var setHostSelected = "";

    var loggedInUser = currentUserProfile['userLogin'];

    var setReason = "User: " + loggedInUser + ", made a change to a host with the following details: ";


    // setting reason



    var finalReason;
    // var intialQuery = "SELECT InovoMonitor.tblSites.sitename, InovoMonitor.tblAlarms.hostid, InovoMonitor.tblAlarms.id, InovoMonitor.tblHosts.hostName, InovoMonitor.tblAlarms.description, InovoMonitor.tblAlarms.severity, InovoMonitor.tblAlarms.Message, InovoMonitor.tblAlarms.currentstatus, InovoMonitor.tblAlarms.source, InovoMonitor.tblAlarms.category, InovoMonitor.tblAlarms.created, InovoMonitor.tblAlarms.updated, InovoMonitor.tblAlarms.updatedby FROM InovoMonitor.tblAlarms INNER JOIN InovoMonitor.tblHosts ON InovoMonitor.tblAlarms.hostid = InovoMonitor.tblHosts.id INNER JOIN InovoMonitor.tblSites ON InovoMonitor.tblSites.id = InovoMonitor.tblHosts.siteid ";
    //  var intialQuery = "UPDATE InovoMonitor.tblUsers SET ";
    //  + setNewUserName + ", " + setNewUserSurname + ", " + setNewUserPass + ", " + setNewUserActive + " , " + setNewUserAccess + " WHERE " + +";"

    var clauseQuery = selectedDisableHostVAR;
    // var queryArr = [];

    // queryArr.push(setEnableChoice);
    // queryArr.push(setSiteSelected);
    // queryArr.push(setHostSelected);


    // var n = 0;
    // for (i = 0; i < queryArr.length - 1; i++) {
    //     n++;
    //     clauseQuery += queryArr[i] + ", ";
    // }

    // clauseQuery += queryArr[n];


    finalReason = setReason + clauseQuery;


    return finalReason;
}

function logOutofDashboard() {
    var key = "";
    var sideMenu = document.getElementById("wrapper");
    var userN = document.getElementById("username-login");
    var passW = document.getElementById("password-login");

    var errMSG = document.getElementById("errorMessage");
    errMSG.innerHTML = "";

    passW.style.border = "1px solid rgba(0,0,0,.2)";
    userN.style.border = "1px solid rgba(0,0,0,.2)";

    sideMenu.style.display = "none";
    insertHashParam(key);
}
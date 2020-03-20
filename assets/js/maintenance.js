function getXmlHttpRequestObject() {  //Gets the browser specific XmlHttpRequest Object
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest(); 	//Not IE
    } else if (window.ActiveXObject) {
        return new ActiveXObject("Microsoft.XMLHTTP"); //IE
    } else {
        alert("Your browser doesn't want to use AJAX"); //Displays error message 
    }
}

var receiveSiteListReq = getXmlHttpRequestObject();
var receiveHostListReq = getXmlHttpRequestObject();
var receiveHostIDListReq = getXmlHttpRequestObject();
var receiveAgentListReq = getXmlHttpRequestObject();
var receiveSourceFilterReq = getXmlHttpRequestObject();
var receiveServiceListReq = getXmlHttpRequestObject();

// ------------------------------------------------------------------------------------------------------
// USER MANAGEMENT
// ------------------------------------------------------------------------------------------------------
var userManagementProfileReq = getXmlHttpRequestObject();
var userRelogProfileReq = getXmlHttpRequestObject();
var userProfilereq = getXmlHttpRequestObject();
var userLogReq = getXmlHttpRequestObject();
// ------------------------------------------------------------------------------------------------------
var receiveHostMSListReq = getXmlHttpRequestObject();
var receiveScheduleReq = getXmlHttpRequestObject();
var receiveScheduleListReq = getXmlHttpRequestObject();
var receiveEditScheduleListReq = getXmlHttpRequestObject();
var receiveUpdateScheduleListReq = getXmlHttpRequestObject();
//-------------------------------------------------------------------------------------------------------
var createScheduleReq = getXmlHttpRequestObject();
var createMaintenanceScheduleReq = getXmlHttpRequestObject();
var receiveAllHostsReq = getXmlHttpRequestObject();
var receiveMaintAffectedReq = getXmlHttpRequestObject();

//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------
var createScheduleUserlogReq = getXmlHttpRequestObject();
var updateScheduleUserlogReq = getXmlHttpRequestObject();
createHMUserlogReq = getXmlHttpRequestObject();
//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------
var createUserReq = getXmlHttpRequestObject();

//---------------------------------------------------------------------------------------------------

var deleteScheduleReq = getXmlHttpRequestObject();
var createDeleteScheduleLogReq = getXmlHttpRequestObject();


var sameHost = "";
var siteSelected;


var serverURL = "http://102.164.81.12:7080/InovoCentralMonitorClient";
// var serverURL = "/InovoCentralMonitorClient";

var remoteVodaEXT = "?remotehost=https://41.0.203.210:8443/InovoCentralMonitorClient/MonitorData&action=runopenquery&query=";

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
    // var newScheduleStartDate = document.getElementById("nStartDate");
    // toastObj.innerHTML = toastMessage;
    // $(function () { $('#mainPageToastAlert').toast('show'); }, 15000);




    // $(function () { $('#toastAlert').toast('hide'); }, 15000);

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


        var userManagementProfileData = JSON.parse(showErrorMain(userManagementProfileReq.responseText, "Error Found"));

        if (Object.entries(userManagementProfileData).length != 0) {
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
//                                              RETURN USER PROFILE
// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------


function returnProfile() {
    var userProfile = "", allUserProfiles = "", userErrorData = "";
    if (userProfilereq.readyState == 4 && userManagementProfileReq.readyState == 4) {
        var uProfileMng;

        var userProfileData = JSON.parse(showErrorMain(userProfilereq.responseText, "Error Found"));

        var userManagementProfileData = JSON.parse(showErrorMain(userManagementProfileReq.responseText, "Error Found"));


        if ((Object.entries(userManagementProfileData['queryresult']).length != 0) && (Object.entries(userProfileData['UserInfo']).length != 0)) {
            userProfile = userProfileData['UserInfo'];

            userErrorData = userProfileData['Error'];
            userErrorCode = userErrorData['ErrorCode'];
            userErrorMessage = userErrorData['ErrorDescription'];
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

}
// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------
//                                              GRANT ACCESS
// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------
function openMenu() {

    var menuWrapper = document.getElementById("wrapper")
    var wrapperStyleValue = menuWrapper.getAttribute("style")

    if (wrapperStyleValue == "display: none;") {
        menuWrapper.setAttribute("style", "")
    } else {
        menuWrapper.setAttribute("style", "display: none;")
    }
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


function grantAccess(loggedInProfile, loggedProfileDet) {
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
            var homeSiteLink = "<a href=\"index.html#&key=" + key + "\"><i class=\"fas fa-home\"></i> Monitoring Dashboard</a>";
            var hostManageSiteLink = "<a href=\"hostManagement.html#&key=" + key + "\"><i class=\"fas fa-server\"></i> Host Management</a>";
            var serverMonitorThresholdLink = "<a href=\"ServerMonitorThresholds.html#&key=" + key + "\"><i class=\"fas fa-hdd\"></i> Server Monitor Threshold</a>";


            var modalLogin = document.getElementById("modal-login");
            var date = new Date().toISOString().slice(0, 10);

            getSiteList();

            loadActiveSchedules();
            loadCurrentHostMaintenance();
            modalLogin.style.display = "none";
            document.getElementById("loginUserId").innerHTML = userlogin + "(" + userLevelDesc + ")";
            document.getElementById("homeSiteLink").innerHTML = homeSiteLink;
            document.getElementById("hostManageLink").innerHTML = hostManageSiteLink;
            document.getElementById("serverMonitorThresholdLink").innerHTML = serverMonitorThresholdLink;
            document.getElementById("login-form").reset();

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

        var dbData = JSON.parse(showErrorMain(userRelogProfileReq.responseText, "Error Found"));


        if (Object.entries(dbData['queryresult']).length != 0) {


            var userDetails = dbData['queryresult'];

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
    }
    //http://102.164.81.12:7080/InovoCentralMonitorClient/UserAuth?action=authenticate&username=esiwela&password=esiwela

}
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// SITE LIST FUNCTIONS 
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------


function getSiteList() {
    var query = "SELECT InovoMonitor.tblSites.id, InovoMonitor.tblSites.sitename FROM InovoMonitor.tblSites INNER JOIN InovoMonitor.tblHosts ON InovoMonitor.tblSites.id = InovoMonitor.tblHosts.siteid where InovoMonitor.tblHosts.enabled = 1 group by InovoMonitor.tblSites.id, InovoMonitor.tblSites.sitename order by InovoMonitor.tblSites.sitename;";

    receiveSiteListReq.open("POST", serverURL + "/MonitorData", true);
    receiveSiteListReq.onreadystatechange = openSiteList;
    receiveSiteListReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    receiveSiteListReq.send("action=runopenquery&query=" + query);

}


function openSiteList() {
    var filData = "";

    var siteTxtData = "";
    if (receiveSiteListReq.readyState == 4) {

        var dbData = JSON.parse(showErrorMain(receiveSiteListReq.responseText, "Error Found"));


        if (Object.entries(dbData['queryresult']).length != 0) {
            var siteDetails = dbData['queryresult'];

            filData = "<option selected=\"\" value=\"undefined\">Choose Schedule Site...</option>"

            siteTxtData += filData;

            for (var iAlarm = 0; iAlarm < siteDetails.length; iAlarm++) {
                var rowData = siteDetails[iAlarm];

                filData = "<option  value=\"" + rowData['id'] + "\">" + rowData['sitename'] + "</option>";

                siteTxtData += filData;
            }
            document.getElementById("selectSite").innerHTML = siteTxtData;
        }
    }

}
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// HOST LIST FUNCTIONS 
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------

function getHostList() {

    var siteId = document.getElementById("selectSite").value;

    if (siteId != undefined && siteId != "undefined") {

        if (siteSelected != siteId) {

            siteSelected = siteId


            document.getElementById("selectHostDiv").hidden = false;

            document.getElementById("selectHost").disabled = false;
            var query = "SELECT DISTINCT InovoMonitor.tblHosts.hostname, InovoMonitor.tblHosts.enabled FROM InovoMonitor.tblHosts INNER JOIN InovoMonitor.tblAgent ON InovoMonitor.tblHosts.agentid = InovoMonitor.tblAgent.id INNER JOIN InovoMonitor.tblSites ON InovoMonitor.tblSites.id = InovoMonitor.tblHosts.siteid where InovoMonitor.tblHosts.siteid = '" + siteId + "'  AND InovoMonitor.tblHosts.enabled = 1 group by InovoMonitor.tblHosts.hostname, InovoMonitor.tblHosts.enabled;";

            receiveHostListReq.open("POST", serverURL + "/MonitorData", true);
            receiveHostListReq.onreadystatechange = openHostList;
            receiveHostListReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            receiveHostListReq.send("action=runopenquery&query=" + query);

            // var hostReset = "<option selected=\"\" value=\"undefined\">Choose Host...</option>";
            // var hostIDReset = "<option selected=\"\" value=\"undefined\">Choose Host ID...</option>";
            var agentReset = "<option selected=\"\" value=\"undefined\">Choose Agent...</option>";
            var serviceReset = "<option selected=\"\" value=\"undefined\">Choose Service...</option>";
            var sourceReset = "<option selected=\"\" value=\"undefined\">Choose Source...</option>";


            // document.getElementById("selectScheduleDisplay");
            //document.getElementById("selectHost").innerHTML = hostReset;
            document.getElementById("selectSource").innerHTML = sourceReset;
            // document.getElementById("selectHostID").innerHTML = hostIDReset;
            document.getElementById("selectAgent").innerHTML = agentReset;
            document.getElementById("selectService").innerHTML = serviceReset;

            // document.getElementById("selectHost").disabled = true;
            document.getElementById("selectSource").disabled = true;
            // document.getElementById("selectHostID").disabled = true;
            document.getElementById("selectAgent").disabled = true;
            document.getElementById("selectService").disabled = true;

            //document.getElementById("selectHostDiv").hidden = true;
            document.getElementById("selectSourceDiv").hidden = true;
            document.getElementById("selectAgentDiv").hidden = true;
            document.getElementById("selectServiceDiv").hidden = true;

        }
        else if (siteSelected == undefined || siteSelected == "undefined") {
            document.getElementById("selectHostDiv").hidden = false;

            document.getElementById("selectHost").disabled = false;
            var query = "SELECT DISTINCT InovoMonitor.tblHosts.hostname, InovoMonitor.tblHosts.enabled FROM InovoMonitor.tblHosts INNER JOIN InovoMonitor.tblAgent ON InovoMonitor.tblHosts.agentid = InovoMonitor.tblAgent.id INNER JOIN InovoMonitor.tblSites ON InovoMonitor.tblSites.id = InovoMonitor.tblHosts.siteid where InovoMonitor.tblHosts.siteid = '" + siteId + "'  AND InovoMonitor.tblHosts.enabled = 1 group by InovoMonitor.tblHosts.hostname, InovoMonitor.tblHosts.enabled;";

            receiveHostListReq.open("POST", serverURL + "/MonitorData", true);
            receiveHostListReq.onreadystatechange = openHostList;
            receiveHostListReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            receiveHostListReq.send("action=runopenquery&query=" + query);

        }
        else {
            document.getElementById("selectHostDiv").hidden = false;

            document.getElementById("selectHost").disabled = false;
            var query = "SELECT DISTINCT InovoMonitor.tblHosts.hostname, InovoMonitor.tblHosts.enabled FROM InovoMonitor.tblHosts INNER JOIN InovoMonitor.tblAgent ON InovoMonitor.tblHosts.agentid = InovoMonitor.tblAgent.id INNER JOIN InovoMonitor.tblSites ON InovoMonitor.tblSites.id = InovoMonitor.tblHosts.siteid where InovoMonitor.tblHosts.siteid = '" + siteId + "'  AND InovoMonitor.tblHosts.enabled = 1 group by InovoMonitor.tblHosts.hostname, InovoMonitor.tblHosts.enabled;";

            receiveHostListReq.open("POST", serverURL + "/MonitorData", true);
            receiveHostListReq.onreadystatechange = openHostList;
            receiveHostListReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            receiveHostListReq.send("action=runopenquery&query=" + query);

        }
    }
    else {

        var hostReset = "<option selected=\"\" value=\"undefined\">Choose Host...</option>";
        // var hostIDReset = "<option selected=\"\" value=\"undefined\">Choose Host ID...</option>";
        var agentReset = "<option selected=\"\" value=\"undefined\">Choose Agent...</option>";
        var serviceReset = "<option selected=\"\" value=\"undefined\">Choose Service...</option>";
        var sourceReset = "<option selected=\"\" value=\"undefined\">Choose Source...</option>";


        // document.getElementById("selectScheduleDisplay");
        document.getElementById("selectHost").innerHTML = hostReset;
        document.getElementById("selectSource").innerHTML = sourceReset;
        // document.getElementById("selectHostID").innerHTML = hostIDReset;
        document.getElementById("selectAgent").innerHTML = agentReset;
        document.getElementById("selectService").innerHTML = serviceReset;

        document.getElementById("selectHost").disabled = true;
        document.getElementById("selectSource").disabled = true;
        // document.getElementById("selectHostID").disabled = true;
        document.getElementById("selectAgent").disabled = true;
        document.getElementById("selectService").disabled = true;

        document.getElementById("selectHostDiv").hidden = true;
        document.getElementById("selectSourceDiv").hidden = true;
        document.getElementById("selectAgentDiv").hidden = true;
        document.getElementById("selectServiceDiv").hidden = true;
    }
}

function openHostList() {
    var filData = "";

    var hostTxtData = "";

    if (receiveHostListReq.readyState == 4) {

        var dbData = JSON.parse(showErrorMain(receiveHostListReq.responseText, "Error Found"));

        if (Object.entries(dbData['queryresult']).length != 0) {
            var hostDetails = dbData['queryresult'];

            filData = "<option selected=\"\" value=\"allHosts\">All Hosts Selected...</option>"

            hostTxtData += filData;

            for (var iAlarm = 0; iAlarm < hostDetails.length; iAlarm++) {
                var rowData = hostDetails[iAlarm];

                filData = "<option  value=\"" + rowData['hostname'] + "\">" + rowData['hostname'] + "</option>";

                hostTxtData += filData;
            }
            document.getElementById("selectHost").innerHTML = hostTxtData;
            document.getElementById("AllHostWarning").hidden = false;
        }
    }
}
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// HOST ID LIST FUNCTIONS 
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------

// function getHostIDList() {

//     var hostName = document.getElementById("selectHost").value;

//     document.getElementById("selectHostID").disabled = false;
//     var query = "SELECT distinct InovoMonitor.tblHosts.id  FROM InovoMonitor.tblHosts  INNER JOIN InovoMonitor.tblAgent  ON InovoMonitor.tblHosts.agentid = InovoMonitor.tblAgent.id  INNER JOIN InovoMonitor.tblSites ON InovoMonitor.tblSites.id = InovoMonitor.tblHosts.siteid where InovoMonitor.tblHosts.hostname = '" + hostName + "' AND InovoMonitor.tblHosts.enabled = 1 group by InovoMonitor.tblHosts.id, InovoMonitor.tblHosts.hostname, InovoMonitor.tblHosts.enabled;";

//     receiveHostIDListReq.open("POST", serverURL + "/MonitorData", true);
//     receiveHostIDListReq.onreadystatechange = openHostIDList;
//     receiveHostIDListReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//     receiveHostIDListReq.send("action=runopenquery&query=" + query);

// }

// function openHostIDList() {
//     var filData = "";

//     var hostTxtData = "";

//     if (receiveHostIDListReq.readyState == 4) {

//         var dbData = JSON.parse(receiveHostIDListReq.responseText);
//         var hostDetails = dbData['queryresult'];

//         filData = "<option selected=\"\" value=\"undefined\">Choose Schedule Host...</option>"

//         hostTxtData += filData;

//         for (var iAlarm = 0; iAlarm < hostDetails.length; iAlarm++) {
//             var rowData = hostDetails[iAlarm];

//             filData = "<option  value=\"" + rowData['id'] + "\">" + rowData['id'] + "</option>";

//             hostTxtData += filData;
//         }
//         document.getElementById("selectHostID").innerHTML = hostTxtData;

//     }
// }
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// 
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
function toggleSelectedScheduleTable() {
    var scheduleTableDiv = document.getElementById("schedulesTableDiv");
    var scheduleIdSelected = document.getElementById("selectSchedule").value;


    if (scheduleTableDiv.hidden == true && scheduleIdSelected != "undefined") {
        scheduleTableDiv.hidden = false;
    } else {
        scheduleTableDiv.hidden = true
    }
}

function openEditScheduleModal() {
    receiveEditScheduleListReq.open("POST", serverURL + "/MonitorData", true);
    receiveEditScheduleListReq.onreadystatechange = showEditSchedulesDetails;
    receiveEditScheduleListReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    var query = "SELECT * FROM InovoMonitor.tblHostMaintenanceSchedule;";

    receiveEditScheduleListReq.send("action=runopenquery&query=" + query);
}
function reopenEditScheduleModal() {
    if (receiveUpdateScheduleListReq.readyState == 4 && updateScheduleUserlogReq.readyState == 4) {
        receiveEditScheduleListReq.open("POST", serverURL + "/MonitorData", true);
        receiveEditScheduleListReq.onreadystatechange = completeScheduleUpdate;
        receiveEditScheduleListReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        var query = "SELECT * FROM InovoMonitor.tblHostMaintenanceSchedule;";

        receiveEditScheduleListReq.send("action=runopenquery&query=" + query);
    }
}

function showEditSchedulesDetails() {



    var filData = "";
    var siteTxtData = "";
    var scheduleIdSelected = document.getElementById("selectSchedule").value;

    if (receiveEditScheduleListReq.readyState == 4) {
        var dbMaintData = JSON.parse(showErrorMain(receiveEditScheduleListReq.responseText, "Error Found"));


        if ((Object.entries(dbMaintData['queryresult']).length != 0)) {

            var scheduleDetails = dbMaintData['queryresult'];


            if (scheduleIdSelected == 'undefined') {

                var scheduleNameEdit = document.getElementById("editScheduleName");
                var startTimeEdit = document.getElementById("editStartTime");
                var startDateEdit = document.getElementById("editStartDate");
                var endDateEdit = document.getElementById("editEndDate");
                // var endDateDiv = document.getElementById("ScheduleEndDate");
                var endTimeEdit = document.getElementById("editEndTime");
                var radioEditOnce = document.getElementById("radioEditOnce");
                var radioEditDaily = document.getElementById("radioEditDaily");
                var radioEditWeekly = document.getElementById("radioEditWeekly");
                var radioEditDisable = document.getElementById("radioEditDisable");
                var radioEditEnable = document.getElementById("radioEditEnable");

                filData = "<option selected=\"\" value=\"undefined\">Choose Schedule...</option>"

                siteTxtData += filData;

                for (var iAlarm = 0; iAlarm < scheduleDetails.length; iAlarm++) {
                    var rowData = scheduleDetails[iAlarm];

                    filData = "<option  value=\"" + rowData['id'] + "\">" + rowData['schedulename'] + "</option>";

                    siteTxtData += filData;

                }


                scheduleNameEdit.value = "";
                scheduleNameEdit.setAttribute("placeholder", "");
                startTimeEdit.value = "";
                //endDateDiv.hidden = true;
                startDateEdit.value = "";
                endDateEdit.value = "";
                endTimeEdit.value = "";
                radioEditOnce.checked = false;
                radioEditDaily.checked = false;
                radioEditWeekly.checked = false;
                radioEditDisable.checked = false;
                radioEditEnable.checked = false;
                document.getElementById("selectEditSchedule").innerHTML = siteTxtData;
                document.getElementById("selectEditScheduleDIV").hidden = false;




                var specificSchedule = document.getElementById("btnUpdateSchedule");

                var val = specificSchedule.getAttribute("data-dismiss");

                if (val != null) {
                    specificSchedule.removeAttribute("data-dismiss");

                }




            } else {
                document.getElementById("selectEditScheduleDIV").hidden = true
                populateEditTextboxesPreselect(scheduleIdSelected);
            }

        }

    }

}


function populateEditTextboxesPreselect(selectedEditScheduleId) {


    if (receiveEditScheduleListReq.readyState == 4) {
        var dbMaintData = JSON.parse(showErrorMain(receiveEditScheduleListReq.responseText, "Error Found"));


        if ((Object.entries(dbMaintData['queryresult']).length != 0)) {
            var scheduleDetails = dbMaintData['queryresult'];

            for (var iAlarm = 0; iAlarm < scheduleDetails.length; iAlarm++) {
                var rowData = scheduleDetails[iAlarm];

                if (selectedEditScheduleId == rowData['id']) {



                    var radioEditOnce = document.getElementById("radioEditOnce");
                    var radioEditDaily = document.getElementById("radioEditDaily");
                    var radioEditWeekly = document.getElementById("radioEditWeekly");
                    var radioEditEnable = document.getElementById("radioEditEnable");
                    var radioEditDisable = document.getElementById("radioEditDisable");

                    if (rowData['frequency'] == 'ONCE') {

                        if (radioEditDaily.checked == true || radioEditWeekly.checked == true) {
                            radioEditDaily.checked = false;
                            radioEditWeekly.checked = false;
                            radioEditOnce.checked = true;

                        }
                        else {
                            radioEditOnce.checked = true;
                        }
                    }
                    else if (rowData['frequency'] == 'DAILY') {

                        if (radioEditOnce.checked == true || radioEditWeekly.checked == true) {
                            radioEditDaily.checked = true;
                            radioEditWeekly.checked = false;
                            radioEditOnce.checked = false;
                        }
                        else {
                            radioEditDaily.checked = true;
                        }
                    }
                    else if (rowData['frequency'] == 'WEEKLY') {

                        if (radioEditDaily.checked == true || radioEditOnce.checked == true) {
                            radioEditDaily.checked = false;
                            radioEditWeekly.checked = true;
                            radioEditOnce.checked = false;
                        }
                        else {
                            radioEditWeekly.checked = true;
                        }
                    }

                    if (rowData['enabled'] == 1) {
                        if (radioEditDisable.checked == true) {
                            radioEditDisable.checked = false;
                            radioEditEnable.checked = true;

                        }
                        else {
                            radioEditEnable.checked = true;
                        }
                    }
                    else if (rowData['enabled'] == 0) {
                        if (radioEditEnable.checked == true) {
                            radioEditDisable.checked = true;
                            radioEditEnable.checked = false;
                        }
                        else {
                            radioEditDisable.checked = true;
                        }
                    }

                    var editScheduleName = document.getElementById("editScheduleName");
                    var editScheduleStartDate = document.getElementById("editStartDate");
                    var editScheduleStartTime = document.getElementById("editStartTime");
                    var editScheduleEndDate = document.getElementById("editEndDate");
                    var editScheduleEndTime = document.getElementById("editEndTime");

                    var startDateTime = rowData['startdatetime'];
                    var endDateTime = rowData['enddatetime'];

                    var currentStartDate = startDateTime.split(" ");
                    var currentEndDate = endDateTime.split(" ");

                    editScheduleName.setAttribute("placeholder", rowData['schedulename']);
                    // editScheduleFrequency.value = rowData['frequency'];
                    // editScheduleEnabled.value = rowData['enabled'];
                    editScheduleStartDate.value = currentStartDate[0];
                    editScheduleStartTime.value = currentStartDate[1];
                    editScheduleEndDate.value = currentEndDate[0];
                    editScheduleEndTime.value = currentEndDate[1];


                    var specificSchedule = document.getElementById("btnUpdateSchedule");
                    specificSchedule.setAttribute("data-dismiss", "modal");



                }
            }
        }
    }

}

function populateEditTextboxesAfterSelect() {
    var selectedEditScheduleId = document.getElementById("selectEditSchedule").value;

    if (receiveEditScheduleListReq.readyState == 4 && selectedEditScheduleId != "undefined") {
        var dbMaintData = JSON.parse(showErrorMain(receiveEditScheduleListReq.responseText, "Error Found"));


        if ((Object.entries(dbMaintData['queryresult']).length != 0)) {
            var scheduleDetails = dbMaintData['queryresult'];

            for (var iAlarm = 0; iAlarm < scheduleDetails.length; iAlarm++) {
                var rowData = scheduleDetails[iAlarm];

                if (selectedEditScheduleId == rowData['id']) {

                    var editScheduleName = document.getElementById("editScheduleName");
                    var editScheduleFrequency = document.getElementById("editSelectScheduleFrequency");
                    var editScheduleEnabled = document.getElementById("editSelectScheduleEnabler");
                    var editScheduleStartDate = document.getElementById("editStartDate");
                    var editScheduleStartTime = document.getElementById("editStartTime");
                    var editScheduleEndDate = document.getElementById("editEndDate");
                    var editScheduleEndTime = document.getElementById("editEndTime");


                    var radioEditOnce = document.getElementById("radioEditOnce");
                    var radioEditDaily = document.getElementById("radioEditDaily");
                    var radioEditWeekly = document.getElementById("radioEditWeekly");
                    var radioEditEnable = document.getElementById("radioEditEnable");
                    var radioEditDisable = document.getElementById("radioEditDisable");




                    if (rowData['frequency'] == 'ONCE') {

                        if (radioEditDaily.checked == true || radioEditWeekly.checked == true) {
                            radioEditDaily.checked = false;
                            radioEditWeekly.checked = false;
                            radioEditOnce.checked = true;

                        }
                        else {
                            radioEditOnce.checked = true;
                        }
                    }
                    else if (rowData['frequency'] == 'DAILY') {

                        if (radioEditOnce.checked == true || radioEditWeekly.checked == true) {
                            radioEditDaily.checked = true;
                            radioEditWeekly.checked = false;
                            radioEditOnce.checked = false;
                        }
                        else {
                            radioEditDaily.checked = true;
                        }
                    }
                    else if (rowData['frequency'] == 'WEEKLY') {

                        if (radioEditDaily.checked == true || radioEditOnce.checked == true) {
                            radioEditDaily.checked = false;
                            radioEditWeekly.checked = true;
                            radioEditOnce.checked = false;
                        }
                        else {
                            radioEditWeekly.checked = true;
                        }
                    }

                    if (rowData['enabled'] == 1) {
                        if (radioEditDisable.checked == true) {
                            radioEditDisable.checked = false;
                            radioEditEnable.checked = true;

                        }
                        else {
                            radioEditEnable.checked = true;
                        }
                    }
                    else if (rowData['enabled'] == 0) {
                        if (radioEditEnable.checked == true) {
                            radioEditDisable.checked = true;
                            radioEditEnable.checked = false;
                        }
                        else {
                            radioEditDisable.checked = true;
                        }
                    }

                    var startDateTime = rowData['startdatetime'];
                    var endDateTime = rowData['enddatetime'];

                    var currentStartDate = startDateTime.split(" ");
                    var currentEndDate = endDateTime.split(" ");

                    editScheduleName.setAttribute("placeholder", rowData['schedulename']);
                    editScheduleStartDate.value = currentStartDate[0];
                    editScheduleStartTime.value = currentStartDate[1];
                    editScheduleEndDate.value = currentEndDate[0];
                    editScheduleEndTime.value = currentEndDate[1];

                }
            }
        }
    }
    else {
        var editScheduleName = document.getElementById("editScheduleName");
        var editScheduleFrequency = document.getElementById("editSelectScheduleFrequency");
        var editScheduleEnabled = document.getElementById("editSelectScheduleEnabler");
        var editScheduleStartDate = document.getElementById("editStartDate");
        var editScheduleStartTime = document.getElementById("editStartTime");
        var editScheduleEndDate = document.getElementById("editEndDate");
        var editScheduleEndTime = document.getElementById("editEndTime");

        // var startDateTime = rowData['startdatetime'];
        // var endDateTime = rowData['enddatetime'];

        // var currentStartDate = startDateTime.split(" ");
        // var currentEndDate = endDateTime.split(" ");

        editScheduleName.setAttribute("placeholder", "Edit Name of Schedule ...");
        editScheduleFrequency.value = "undefined";
        editScheduleEnabled.value = "undefined";
        editScheduleStartDate.value = "";
        editScheduleStartTime.value = "";
        editScheduleEndDate.value = "";
        editScheduleEndTime.value = "";
    }

}

function openCreateScheduleModal() {

    var dateNow = new Date();

    dateNow = dateNow.getFullYear() + '-' +
        ('00' + (dateNow.getMonth() + 1)).slice(-2) + '-' +
        ('00' + dateNow.getDate()).slice(-2);


    var newScheduleStartDate = document.getElementById("nStartDate");
    newScheduleStartDate.setAttribute("min", dateNow);
    newScheduleStartDate.setAttribute("value", dateNow);

    var scheduleName = document.getElementById("newScheduleName");
    var startTime = document.getElementById("StartTime");
    var endDate = document.getElementById("EndDate");
    var endDateDiv = document.getElementById("ScheduleEndDate");
    var endTime = document.getElementById("EndTime");
    var radioOnce = document.getElementById("radioOnce");
    var radioDaily = document.getElementById("radioDaily");
    var radioWeekly = document.getElementById("radioWeekly");
    var radioDisable = document.getElementById("radioDisable");
    var radioEnable = document.getElementById("radioEnable");
    var disableEndDateRadio = document.getElementById("disableEndDateRadio");
    var enableEndDateRadio = document.getElementById("enableEndDateRadio");

    scheduleName.value = "";
    startTime.value = "";
    endDateDiv.hidden = true;
    endDate.value = "";
    endTime.value = "";
    radioOnce.checked = false;
    radioDaily.checked = false;
    radioWeekly.checked = false;
    radioDisable.checked = false;
    radioEnable.checked = false;
    disableEndDateRadio.checked = false;
    enableEndDateRadio.checked = false;


}


function checkAffectedMaintenance() {

    receiveMaintAffectedReq.open("POST", serverURL + "/MonitorData", true);
    receiveMaintAffectedReq.onreadystatechange = showAffectedMaintenance;
    receiveMaintAffectedReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    var query = "SELECT * FROM InovoMonitor.tblHostMaintenanceSchedule;";

    receiveMaintAffectedReq.send("action=runopenquery&query=" + query);

}

function showAffectedMaintenance() {

}

function enableEndDate(verdict) {
    var endDateDiv = document.getElementById("ScheduleEndDate");
    var radioOnce = document.getElementById("radioOnce");

    var enableEndDateRadio = document.getElementById("enableEndDateRadio");
    var disableEndDateRadio = document.getElementById("disableEndDateRadio");
    if (verdict == 1) {
        endDateDiv.hidden = false;
        disableEndDateRadio.checked = false;
        enableEndDateRadio.checked = true;
    } else if (verdict == 0 && radioOnce.checked == true) {
        endDateDiv.hidden = true;
        disableEndDateRadio.checked = true;
        enableEndDateRadio.checked = false;
    } else {
        endDateDiv.hidden = true;
        disableEndDateRadio.checked = true;
        enableEndDateRadio.checked = false;
    }

}

function checkRadio(radioNumber) {
    var radioOnce = document.getElementById("radioOnce");
    var radioDaily = document.getElementById("radioDaily");
    var radioWeekly = document.getElementById("radioWeekly");
    var endDateDiv = document.getElementById("ScheduleEndDate");
    var enableEndDateRadio = document.getElementById("enableEndDateRadio");
    var disableEndDateRadio = document.getElementById("disableEndDateRadio");

    if (radioNumber == 1) {
        if (radioDaily.checked == true || radioWeekly.checked == true) {
            radioDaily.checked = false;
            radioWeekly.checked = false;
            radioOnce.checked = true;
            endDateDiv.hidden = false;

            disableEndDateRadio.checked = false;
            enableEndDateRadio.checked = true;


        }
        else {
            radioOnce.checked = true;
            endDateDiv.hidden = false;

            disableEndDateRadio.checked = false;
            enableEndDateRadio.checked = true;
        }

    } else if (radioNumber == 2) {
        if (radioOnce.checked == true || radioWeekly.checked == true) {
            radioDaily.checked = true;
            radioWeekly.checked = false;
            radioOnce.checked = false;
            endDateDiv.hidden = true;

            disableEndDateRadio.checked = true;
            enableEndDateRadio.checked = false;
        }
        else {
            radioDaily.checked = true;
            endDateDiv.hidden = true;

            disableEndDateRadio.checked = true;
            enableEndDateRadio.checked = false;
        }


    } else {
        if (radioDaily.checked == true || radioOnce.checked == true) {
            radioDaily.checked = false;
            radioWeekly.checked = true;
            radioOnce.checked = false;
            endDateDiv.hidden = true;


            disableEndDateRadio.checked = true;
            enableEndDateRadio.checked = false;
        }
        else {
            radioWeekly.checked = true;
            endDateDiv.hidden = true;


            disableEndDateRadio.checked = true;
            enableEndDateRadio.checked = false;
        }

    }
}

function checkEditRadio(radioEditNumber) {
    var radioEditOnce = document.getElementById("radioEditOnce");
    var radioEditDaily = document.getElementById("radioEditDaily");
    var radioEditWeekly = document.getElementById("radioEditWeekly");

    if (radioEditNumber == 1) {
        if (radioEditDaily.checked == true || radioEditWeekly.checked == true) {
            radioEditDaily.checked = false;
            radioEditWeekly.checked = false;
            radioEditOnce.checked = true;

        }
        else {
            radioEditOnce.checked = true;
        }

    } else if (radioEditNumber == 2) {
        if (radioEditOnce.checked == true || radioEditWeekly.checked == true) {
            radioEditDaily.checked = true;
            radioEditWeekly.checked = false;
            radioEditOnce.checked = false;
        }
        else {
            radioEditDaily.checked = true;
        }


    } else {
        if (radioEditDaily.checked == true || radioEditOnce.checked == true) {
            radioEditDaily.checked = false;
            radioEditWeekly.checked = true;
            radioEditOnce.checked = false;
        }
        else {
            radioEditWeekly.checked = true;
        }

    }
}


function checkEnableSchedule(enableSchedule) {
    var enableScheduleRadio = document.getElementById("radioEnable");
    var disableScheduleRadio = document.getElementById("radioDisable");


    if (enableSchedule == 1) {
        enableScheduleRadio.checked = true;
        disableScheduleRadio.checked = false;
    } else {
        enableScheduleRadio.checked = false;
        disableScheduleRadio.checked = true;
    }


}
function checkEnableEditSchedule(enableSchedule) {
    var enableScheduleRadio = document.getElementById("radioEditEnable");
    var disableScheduleRadio = document.getElementById("radioEditDisable");


    if (enableSchedule == 1) {
        enableScheduleRadio.checked = true;
        disableScheduleRadio.checked = false;
    } else {
        enableScheduleRadio.checked = false;
        disableScheduleRadio.checked = true;
    }


}

function editScheduleTemplate() {
    var currentScheduleId = document.getElementById("selectEditSchedule").value;
    var querySchArr = [];

    if (currentScheduleId == "" || currentScheduleId == undefined || currentScheduleId == "undefined") {
        var selectedEditScheduleId = document.getElementById("selectSchedule").value;
    }
    else {
        var selectedEditScheduleId = currentScheduleId;
    }


    var radioEditOnce = document.getElementById("radioEditOnce");
    var radioEditDaily = document.getElementById("radioEditDaily");
    var radioEditWeekly = document.getElementById("radioEditWeekly");
    var radioEditEnable = document.getElementById("radioEditEnable");
    var radioEditDisable = document.getElementById("radioEditDisable");




    if (radioEditOnce.checked == true) {

        var newScheduleFrequency = radioEditOnce.value;
    }
    else if (radioEditDaily.checked == true) {
        var newScheduleFrequency = radioEditDaily.value;
    }
    else if (radioEditWeekly.checked == true) {
        var newScheduleFrequency = radioEditWeekly.value;
    }

    if (radioEditEnable.checked == true) {
        var newScheduleEnabled = radioEditEnable.value;
    }
    else if (radioEditDisable.checked == true) {
        var newScheduleEnabled = radioEditDisable.value;
    }

    var newScheduleName = document.getElementById("editScheduleName").value;
    var newScheduleStartDate = document.getElementById("editStartDate").value;
    var newScheduleStartTime = document.getElementById("editStartTime").value;
    var newScheduleEndDate = document.getElementById("editEndDate").value;
    var newScheduleEndTime = document.getElementById("editEndTime").value;

    // var newStartDateTime = newScheduleStartDate + " " + newScheduleStartTime;
    // var newEndDateTime = newScheduleEndDate + " " + newScheduleEndTime;


    if (receiveEditScheduleListReq.readyState == 4) {
        var dbMaintData = JSON.parse(showErrorEdit(receiveEditScheduleListReq.responseText, "Error Found"));


        if ((Object.entries(dbMaintData['queryresult']).length != 0)) {
            var scheduleDetails = dbMaintData['queryresult'];

            for (var iAlarm = 0; iAlarm < scheduleDetails.length; iAlarm++) {
                var rowData = scheduleDetails[iAlarm];

                if (selectedEditScheduleId == rowData['id']) {

                    var editScheduleName = document.getElementById("editScheduleName");

                    var startDateTime = rowData['startdatetime'];
                    var endDateTime = rowData['enddatetime'];

                    var currentStartDate = startDateTime.split(" ");
                    var currentEndDate = endDateTime.split(" ");

                    var currentStartDate = startDateTime.split(" ");
                    var currentEndDate = endDateTime.split(" ");

                    var currentName = editScheduleName.getAttribute("placeholder");
                    var editScheduleFrequency = rowData['frequency'];
                    var editScheduleEnabled = rowData['enabled'];
                    var editScheduleStartDate = currentStartDate[0];
                    var editScheduleStartTime = currentStartDate[1];
                    var editScheduleEndDate = currentEndDate[0];
                    var editScheduleEndTime = currentEndDate[1];

                    // new name
                    if (currentName != newScheduleName && newScheduleName != "") {

                        var name = "schedulename = '" + newScheduleName + "'";
                        querySchArr.push(name);

                    }
                    //new frequency
                    if (newScheduleFrequency != editScheduleFrequency) {
                        var frequency = "frequency = '" + newScheduleFrequency + "'";
                        querySchArr.push(frequency);
                    }

                    //new enabled
                    if (newScheduleEnabled != editScheduleEnabled) {
                        var enabled = "enabled = " + newScheduleEnabled + "";
                        querySchArr.push(enabled);
                    }

                    // start time new, start date new  
                    if ((newScheduleStartTime != editScheduleStartTime) && (newScheduleStartDate != editScheduleStartDate)) {
                        var combo = newScheduleStartDate + " " + newScheduleStartTime;
                        var startdatetime = "startdatetime = '" + combo + "'";
                        querySchArr.push(startdatetime);
                    }// start time same, start date new
                    else if ((newScheduleStartTime == editScheduleStartTime) && (newScheduleStartDate != editScheduleStartDate)) {
                        var combo = newScheduleStartDate + " " + editScheduleStartTime;
                        var startdatetime = "startdatetime = '" + combo + "'";
                        querySchArr.push(startdatetime);
                    }//start time new, start date same
                    else if ((newScheduleStartTime != editScheduleStartTime) && (newScheduleStartDate == editScheduleStartDate)) {
                        var combo = editScheduleStartDate + " " + newScheduleStartTime;
                        var startdatetime = "startdatetime = '" + combo + "'";
                        querySchArr.push(startdatetime);
                    }




                    // end time new, end date new 
                    if ((newScheduleEndDate != editScheduleEndDate) && (newScheduleEndTime != editScheduleEndTime)) {

                        if (newScheduleEndDate == "") {
                            newScheduleEndDate = "2050-12-31";

                            var toastPopupVAR = "modalEditSchToastAlert";
                            var toastDelayTime = 10000;
                            // set title
                            var toastTitle = 'Error!';
                            //Set Message
                            var toastMessage = "End Date set to: " + newScheduleEndDate + ""; //"Please ensure the Site, Host and Schedule are selected before submitting to create a maintenance schedule.";


                            var toastTitleV = "toastTitleModalEditSch";
                            var toastMsgV = "toastMessageModalEditSch";

                            showToastMessage(toastPopupVAR, toastTitleV, toastMsgV, toastMessage, toastTitle, toastDelayTime);
                        }
                        var combo = newScheduleEndDate + " " + newScheduleEndTime;
                        var enddatetime = "enddatetime = '" + combo + "'";
                        querySchArr.push(enddatetime);
                    } // end time same, end date new
                    else if ((newScheduleEndDate != editScheduleEndDate) && (newScheduleEndTime == editScheduleEndTime)) {

                        if (newScheduleEndDate == "") {
                            newScheduleEndDate = "2050-12-31";


                            var toastPopupVAR = "modalEditSchToastAlert";
                            var toastDelayTime = 10000;
                            // set title
                            var toastTitle = 'Error!';
                            //Set Message
                            var toastMessage = "End Date set to: " + newScheduleEndDate + ""; //"Please ensure the Site, Host and Schedule are selected before submitting to create a maintenance schedule.";

                            var toastTitleV = "toastTitleModalEditSch";
                            var toastMsgV = "toastMessageModalEditSch";

                            showToastMessage(toastPopupVAR, toastTitleV, toastMsgV, toastMessage, toastTitle, toastDelayTime);
                        }

                        var combo = newScheduleEndDate + " " + editScheduleEndTime;
                        var enddatetime = "enddatetime = '" + combo + "'";
                        querySchArr.push(enddatetime);
                    } //end time new, end date same
                    else if ((newScheduleEndDate != editScheduleEndDate) && (newScheduleEndTime != editScheduleEndTime)) {
                        var combo = "'" + editScheduleEndDate + " " + newScheduleEndTime + "'";
                        var enddatetime = "enddatetime = '" + combo + "'";
                        querySchArr.push(enddatetime);
                    }
                }
            }

            if (querySchArr.length != 0) {
                var query = createScheduleUpdateQuery(querySchArr, selectedEditScheduleId);

                receiveUpdateScheduleListReq.open("POST", serverURL + "/MonitorData", true);
                receiveUpdateScheduleListReq.onreadystatechange = logUserScheduleUpdateDetails;
                receiveUpdateScheduleListReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                receiveUpdateScheduleListReq.send("action=runopenquery&query=" + query);
            } else {


                var specificSchedule = document.getElementById("btnUpdateSchedule");
                var val = specificSchedule.getAttribute("data-dismiss");
                // remove modal check
                if (val != null) {
                    var toastPopupVAR = "mainPageToastAlert";
                    var toastDelayTime = 10000;
                    // set title
                    var toastTitle = 'Error!';
                    //Set Message
                    var toastMessage = "No changes are made to the Schedule, no update committed"; //"Please ensure the Site, Host and Schedule are selected before submitting to create a maintenance schedule.";

                    var toastTitleV = "toastTitle";
                    var toastMsgV = "toastMessage";

                    showToastMessage(toastPopupVAR, toastTitleV, toastMsgV, toastMessage, toastTitle, toastDelayTime);
                } else {
                    var toastPopupVAR = "modalEditSchToastAlert";
                    var toastDelayTime = 10000;
                    // set title
                    var toastTitle = 'Error!';
                    //Set Message
                    var toastMessage = "No changes are made to the Schedule, no update committed"; //"Please ensure the Site, Host and Schedule are selected before submitting to create a maintenance schedule.";

                    var toastTitleV = "toastTitleModalEditSch";
                    var toastMsgV = "toastMessageModalEditSch";

                    showToastMessage(toastPopupVAR, toastTitleV, toastMsgV, toastMessage, toastTitle, toastDelayTime);
                }
                // resetScheduler();
            }
        }
    }

}

function createScheduleUpdateQuery(querySchArrNew, editScheduleId) {


    var finalQuery = "";
    // var intialQuery = "SELECT InovoMonitor.tblSites.sitename, InovoMonitor.tblAlarms.hostid, InovoMonitor.tblAlarms.id, InovoMonitor.tblHosts.hostName, InovoMonitor.tblAlarms.description, InovoMonitor.tblAlarms.severity, InovoMonitor.tblAlarms.Message, InovoMonitor.tblAlarms.currentstatus, InovoMonitor.tblAlarms.source, InovoMonitor.tblAlarms.category, InovoMonitor.tblAlarms.created, InovoMonitor.tblAlarms.updated, InovoMonitor.tblAlarms.updatedby FROM InovoMonitor.tblAlarms INNER JOIN InovoMonitor.tblHosts ON InovoMonitor.tblAlarms.hostid = InovoMonitor.tblHosts.id INNER JOIN InovoMonitor.tblSites ON InovoMonitor.tblSites.id = InovoMonitor.tblHosts.siteid ";
    var intialQuery = "UPDATE InovoMonitor.tblHostMaintenanceSchedule SET ";
    //  + setNewUserName + ", " + setNewUserSurname + ", " + setNewUserPass + ", " + setNewUserActive + " , " + setNewUserAccess + " WHERE " + +";"

    var clauseQuery = "";

    var selectedScheduleID = "InovoMonitor.tblHostMaintenanceSchedule.id = " + editScheduleId;
    var queryArr = querySchArrNew;




    if (queryArr.length >= 2) {
        var n = 0;
        for (i = 0; i < queryArr.length - 1; i++) {
            n++;
            clauseQuery += queryArr[i] + ", ";
        }

        clauseQuery += queryArr[n];

    }
    else if (queryArr.length == 1) {
        clauseQuery += queryArr[0];
    }
    else {
        clauseQuery += "No Clause";
    }


    if (clauseQuery.indexOf("No Clause") == -1) {
        finalQuery = intialQuery + clauseQuery + " WHERE " + selectedScheduleID;
    } else {

        finalQuery = "false";
    }


    return finalQuery;

}

function logUserScheduleUpdateDetails() {


    if (receiveUpdateScheduleListReq.readyState == 4) {



        var updateScheduleData = JSON.parse(showErrorEdit(receiveUpdateScheduleListReq.responseText, "Error Found"));

        if (Object.entries(updateScheduleData['queryresult']).length == 0) {

            var currentScheduleId = document.getElementById("selectEditSchedule").value;

            var querySchArr = [];

            if (currentScheduleId == "") {
                var selectedEditScheduleId = document.getElementById("selectSchedule").value;
            }
            else {
                var selectedEditScheduleId = currentScheduleId;
            }


            var radioEditOnce = document.getElementById("radioEditOnce");
            var radioEditDaily = document.getElementById("radioEditDaily");
            var radioEditWeekly = document.getElementById("radioEditWeekly");
            var radioEditEnable = document.getElementById("radioEditEnable");
            var radioEditDisable = document.getElementById("radioEditDisable");




            if (radioEditOnce.checked == true) {

                var newScheduleFrequency = radioEditOnce.value;
            }
            else if (radioEditDaily.checked == true) {
                var newScheduleFrequency = radioEditDaily.value;
            }
            else if (radioEditWeekly.checked == true) {
                var newScheduleFrequency = radioEditWeekly.value;
            }

            if (radioEditEnable.checked == true) {
                var newScheduleEnabled = radioEditEnable.value;
            }
            else if (radioEditDisable.checked == true) {
                var newScheduleEnabled = radioEditDisable.value;
            }



            var newScheduleName = document.getElementById("editScheduleName").value;

            if (newScheduleName == "") {
                newScheduleName = document.getElementById("editScheduleName").getAttribute("placeholder");
            }



            var newScheduleStartDate = document.getElementById("editStartDate").value;
            var newScheduleStartTime = document.getElementById("editStartTime").value;
            var newScheduleEndDate = document.getElementById("editEndDate").value;
            var newScheduleEndTime = document.getElementById("editEndTime").value;

            // -------------------------------------------------------------------------------------
            // -------------------------------------------------------------------------------------

            var newStartDateTime = newScheduleStartDate + " " + newScheduleStartTime;
            var newEndDateTime = newScheduleEndDate + " " + newScheduleEndTime;

            loadActiveSchedules();

            var currentUser;
            var userProfileID = "";
            var dateNow;

            // var remoteVodaEXT = "?remotehost=https://41.0.203.210:8443/InovoCentralMonitorClient/MonitorData&action=runopenquery&query=";


            // var newUserId;

            var dbData = JSON.parse(showErrorMain(userManagementProfileReq.responseText, "Error Found"));


            var userProfileData = JSON.parse(showErrorMain(userProfilereq.responseText, "Error Found"));

            if ((Object.entries(dbData['queryresult']).length != 0) && (Object.entries(userProfileData['UserInfo']).length != 0)) {
                var userDetails = dbData['queryresult'];
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
                var updateReason = createReasonUserLogForSchedule(newScheduleName, newScheduleFrequency, newScheduleEnabled, newStartDateTime, newEndDateTime);
                // var query = "SELECT * FROM InovoMonitor.tblAlarms;"

                dateNow = new Date();
                dateNow = dateNow.getFullYear() + '-' +
                    ('00' + (dateNow.getMonth() + 1)).slice(-2) + '-' +
                    ('00' + dateNow.getDate()).slice(-2) + ' ' +
                    ('00' + dateNow.getHours()).slice(-2) + ':' +
                    ('00' + dateNow.getMinutes()).slice(-2) + ':' +
                    ('00' + dateNow.getSeconds()).slice(-2);

                var insertLogquery = "INSERT INTO InovoMonitor.tblUserLog (userid, reason, datecreated, createdby)  VALUES ('" + userProfileID + "','" + String(updateReason) + "', '" + dateNow + "','" + currentUser + "');";

                updateScheduleUserlogReq.open("POST", serverURL + "/MonitorData", true);
                updateScheduleUserlogReq.onreadystatechange = reloadEditSchedule;
                updateScheduleUserlogReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                updateScheduleUserlogReq.send("action=runopenquery&query=" + insertLogquery);
            }
        }
    }

}


function reloadEditSchedule() {
    if (updateScheduleUserlogReq.readyState == 4) {



        var updateScheduleData = JSON.parse(showErrorEdit(updateScheduleUserlogReq.responseText, "Error Found"));

        if (Object.entries(updateScheduleData['queryresult']).length == 0) {
            receiveEditScheduleListReq.open("POST", serverURL + "/MonitorData", true);
            receiveEditScheduleListReq.onreadystatechange = completeScheduleUpdate;
            receiveEditScheduleListReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            var query = "SELECT * FROM InovoMonitor.tblHostMaintenanceSchedule;";

            receiveEditScheduleListReq.send("action=runopenquery&query=" + query);

        }
    }
}











// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// AGENT LIST FUNCTIONS 
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------


function getAgentList() {
    var hostName = document.getElementById("selectHost").value;
    if (hostName != "allHosts") {

        if (sameHost == hostName) {

            document.getElementById("selectAgentDiv").hidden = false;
            document.getElementById("AllHostWarning").hidden = true;

            document.getElementById("selectAgent").disabled = false;

            var query = "SELECT h.id as hostid, h.siteid, h.agentid, h.hostagentversion, h.hostname, h.hostip, h.hostintip, h.enabled, h.autoupdate, h.updated, a.agenttype, a.agentservice, a.agentversion, a.filelocation, a.packagename, a.agentdescription, a.updated FROM InovoMonitor.tblHosts h INNER JOIN InovoMonitor.tblAgent a on h.agentid=a.id WHERE h.hostname='" + hostName + "'  and enabled=1;"

            receiveAgentListReq.open("POST", serverURL + "/MonitorData", true);
            receiveAgentListReq.onreadystatechange = openAgentList;
            receiveAgentListReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            receiveAgentListReq.send("action=runopenquery&query=" + query);
        }
        else if (sameHost == "") {
            sameHost = hostName;
            document.getElementById("selectAgentDiv").hidden = false;
            document.getElementById("AllHostWarning").hidden = true;

            document.getElementById("selectAgent").disabled = false;

            var query = "SELECT h.id as hostid, h.siteid, h.agentid, h.hostagentversion, h.hostname, h.hostip, h.hostintip, h.enabled, h.autoupdate, h.updated, a.agenttype, a.agentservice, a.agentversion, a.filelocation, a.packagename, a.agentdescription, a.updated FROM InovoMonitor.tblHosts h INNER JOIN InovoMonitor.tblAgent a on h.agentid=a.id WHERE h.hostname='" + hostName + "'  and enabled=1;"

            receiveAgentListReq.open("POST", serverURL + "/MonitorData", true);
            receiveAgentListReq.onreadystatechange = openAgentList;
            receiveAgentListReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            receiveAgentListReq.send("action=runopenquery&query=" + query);
        }
        else if ((sameHost != hostName) ) {

            sameHost = hostName;
            var agentReset = "<option selected=\"\" value=\"undefined\">Choose Agent...</option>";
            var serviceReset = "<option selected=\"\" value=\"undefined\">Choose Service...</option>";
            var sourceReset = "<option selected=\"\" value=\"undefined\">Choose Source...</option>";
            document.getElementById("selectAgentDiv").hidden = false;
            document.getElementById("AllHostWarning").hidden = true;

            
            var query = "SELECT h.id as hostid, h.siteid, h.agentid, h.hostagentversion, h.hostname, h.hostip, h.hostintip, h.enabled, h.autoupdate, h.updated, a.agenttype, a.agentservice, a.agentversion, a.filelocation, a.packagename, a.agentdescription, a.updated FROM InovoMonitor.tblHosts h INNER JOIN InovoMonitor.tblAgent a on h.agentid=a.id WHERE h.hostname='" + hostName + "'  and enabled=1;"


            // document.getElementById("selectScheduleDisplay");
            // document.getElementById("selectHost").innerHTML = hostReset;
            document.getElementById("selectSource").innerHTML = sourceReset;
            // document.getElementById("selectHostID").innerHTML = hostIDReset;
            //document.getElementById("selectAgent").innerHTML = agentReset;
            document.getElementById("selectService").innerHTML = serviceReset;

            // document.getElementById("selectHost").disabled = true;
            document.getElementById("selectSource").disabled = true;
            // document.getElementById("selectHostID").disabled = true;
            // document.getElementById("selectAgent").disabled = true;
            document.getElementById("selectService").disabled = true;

            // document.getElementById("selectHostDiv").hidden = true;
            document.getElementById("selectSourceDiv").hidden = true;
            // document.getElementById("selectAgentDiv").hidden = true;
            document.getElementById("selectServiceDiv").hidden = true;



            receiveAgentListReq.open("POST", serverURL + "/MonitorData", true);
            receiveAgentListReq.onreadystatechange = openAgentList;
            receiveAgentListReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            receiveAgentListReq.send("action=runopenquery&query=" + query);

        }

    }
    else {
        document.getElementById("AllHostWarning").hidden = false;

        var agentReset = "<option selected=\"\" value=\"undefined\">Choose Agent...</option>";
        var serviceReset = "<option selected=\"\" value=\"undefined\">Choose Service...</option>";
        var sourceReset = "<option selected=\"\" value=\"undefined\">Choose Source...</option>";


        // document.getElementById("selectScheduleDisplay");
        // document.getElementById("selectHost").innerHTML = hostReset;
        document.getElementById("selectSource").innerHTML = sourceReset;
        // document.getElementById("selectHostID").innerHTML = hostIDReset;
        document.getElementById("selectAgent").innerHTML = agentReset;
        document.getElementById("selectService").innerHTML = serviceReset;

        // document.getElementById("selectHost").disabled = true;
        document.getElementById("selectSource").disabled = true;
        // document.getElementById("selectHostID").disabled = true;
        document.getElementById("selectAgent").disabled = true;
        document.getElementById("selectService").disabled = true;

        // document.getElementById("selectHostDiv").hidden = true;
        document.getElementById("selectSourceDiv").hidden = true;
        document.getElementById("selectAgentDiv").hidden = true;
        document.getElementById("selectServiceDiv").hidden = true;
    }

}

function openAgentList() {
    var filData = "";


    var agentTxtData = "";
    if (receiveAgentListReq.readyState == 4) {
        var dbData = JSON.parse(showErrorMain(receiveAgentListReq.responseText, "Error Found"));

        if (Object.entries(dbData['queryresult']).length != 0) {
            var agentDetails = dbData['queryresult'];

            filData = "<option selected=\"\" value=\"undefined\">Choose Agent...</option>"

            agentTxtData += filData;

            for (var iAlarm = 0; iAlarm < agentDetails.length; iAlarm++) {
                var rowData = agentDetails[iAlarm];

                filData = "<option  value=\"" + rowData['id'] + "\">" + rowData['agenttype'] + "</option>";

                agentTxtData += filData;
            }
            document.getElementById("selectAgent").innerHTML = agentTxtData;
        }
    }
}



// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// SOURCE LIST FUNCTIONS 
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------




// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// SERVICE LIST FUNCTIONS 
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------


function getServiceList() {
    var hostID = document.getElementById("selectAgent").value;
    // for
    var agentName = $("#selectAgent option:selected").text(); //document.getElementById("selectAgent")[index].text;
    if (agentName == "ServerMonitor") {

        receiveServiceListReq.open("POST", serverURL + "/MonitorData", true);

        receiveSourceFilterReq.open("POST", serverURL + "/MonitorData", true);
        //Set the function that will be called when the XmlHttpRequest objects state changes.		
        receiveServiceListReq.onreadystatechange = loadServiceAndSourceList;
        receiveServiceListReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        //Make the actual request.		
        // var query2 = "SELECT * FROM InovoMonitor.tblAlarms t WHERE currentstatus<>'RESET'";
        var queryService = "SELECT InovoMonitor.tblSvrServiceInfo.serviceDisplayName FROM InovoMonitor.tblSvrServiceInfo WHERE InovoMonitor.tblSvrServiceInfo.runid=(SELECT InovoMonitor.tblTransactionList.transactionid FROM InovoMonitor.tblTransactionList WHERE InovoMonitor.tblTransactionList.id=(SELECT MAX(InovoMonitor.tblTransactionList.id) FROM InovoMonitor.tblTransactionList where InovoMonitor.tblTransactionList.hostid=" + hostID + "));";
        receiveServiceListReq.send("action=runopenquery&query=" + queryService);
    } else {
        document.getElementById("selectServiceDiv").hidden = true;
        document.getElementById("selectSourceDiv").hidden = true;
        document.getElementById("selectService").disabled = true;
        document.getElementById("selectSource").disabled = true;
    }


}
function getServiceAndSourceList() {
    var hostID = document.getElementById("selectAgent").value;
    // for
    var agentName = $("#selectAgent option:selected").text(); //document.getElementById("selectAgent")[index].text;
    if (agentName == "ServerMonitor") {

        receiveServiceListReq.open("POST", serverURL + "/MonitorData", true);

        receiveSourceFilterReq.open("POST", serverURL + "/MonitorData", true);
        //Set the function that will be called when the XmlHttpRequest objects state changes.		
        receiveSourceFilterReq.onreadystatechange = loadServiceAndSourceList;
        receiveSourceFilterReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        //Set the function that will be called when the XmlHttpRequest objects state changes.		
        receiveServiceListReq.onreadystatechange = loadServiceAndSourceList;
        receiveServiceListReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        //Make the actual request.		
        // var query2 = "SELECT * FROM InovoMonitor.tblAlarms t WHERE currentstatus<>'RESET'";
        // var querySource = "SELECT DISTINCT InovoMonitor.tblAlarms.source FROM InovoMonitor.tblAlarms WHERE InovoMonitor.tblAlarms.hostid=" + hostID + ";";
        var querySource = "SELECT * FROM InovoMonitor.tblAlarmSources;";
        receiveSourceFilterReq.send("action=runopenquery&query=" + querySource);

        //Make the actual request.		
        // var query2 = "SELECT * FROM InovoMonitor.tblAlarms t WHERE currentstatus<>'RESET'";
        var queryService = "SELECT InovoMonitor.tblSvrServiceInfo.serviceDisplayName FROM InovoMonitor.tblSvrServiceInfo WHERE InovoMonitor.tblSvrServiceInfo.runid=(SELECT InovoMonitor.tblTransactionList.transactionid FROM InovoMonitor.tblTransactionList WHERE InovoMonitor.tblTransactionList.id=(SELECT MAX(InovoMonitor.tblTransactionList.id) FROM InovoMonitor.tblTransactionList where InovoMonitor.tblTransactionList.hostid=" + hostID + "));";
        receiveServiceListReq.send("action=runopenquery&query=" + queryService);
    } else {
        document.getElementById("selectServiceDiv").hidden = true;
        document.getElementById("selectSourceDiv").hidden = true;
        document.getElementById("selectService").disabled = true;
        document.getElementById("selectSource").disabled = true;
    }


}

function loadSourceList() {

    if (receiveSourceFilterReq.readyState == 4) {

        var siteSoTxtData = "", filSoData, filSerData;

        //Here we should have some JSON data !!
        var dbData = JSON.parse(showErrorMain(receiveSourceFilterReq.responseText, "Error Found"));
        var dbServiceData = JSON.parse(showErrorMain(receiveServiceListReq.responseText, "Error Found"));


        if ((Object.entries(dbData['queryresult']).length != 0)) {

            arrayAlarm = dbData['queryresult'];
            var siteSerTxtData = "", filSerData;
            //Here we should have some JSON data !!
            arrayServiceAlarm = dbServiceData['queryresult'];


            filSerData = "<div id=\"selectServiceList\"><div class=\"input-group mb-3\"><div class=\"input-group-prepend\"><label class=\"input-group-text\" for=\"searchGroupSelect01\">Service Selection</label></div><select class=\"custom-select\"  id=\"selectSearchService\"><option value=\"undefined\" selected>Choose Service...</option>";

            siteSerTxtData += filSerData;


            filSoData = "<div id=\"selectSourceList\"><div class=\"input-group mb-3\"><div class=\"input-group-prepend\"><label class=\"input-group-text\" for=\"searchGroupSelect01\">Source Selection</label></div><select class=\"custom-select\"  id=\"selectSearchSource\"><option value=\"undefined\" selected>Choose Source...</option>";

            siteSoTxtData += filSoData;

            if (arrayAlarm.length != 0) {

                // ------------------------------------------------------------------------------
                // source
                // ------------------------------------------------------------------------------

                for (var iAlarm = 0; iAlarm < arrayAlarm.length; iAlarm++) {
                    var rowData = arrayAlarm[iAlarm];

                    filSoData = "<option value=\"" + rowData['sourcename'] + "\">" + rowData['sourcename'] + "</option>";

                    siteSoTxtData += filSoData;
                }
                // document.getElementById("selectSource").innerHTML = siteSoTxtData;




                // document.getElementById("selectSource").innerHTML = siteSoTxtData;


                document.getElementById("selectSourceDiv").hidden = false;

                document.getElementById("selectSource").disabled = false;


            }
            // else if (arrayServiceAlarm.length == 0 && arrayAlarm.length != 0) {
            //     // ------------------------------------------------------------------------------
            //     // source
            //     // ------------------------------------------------------------------------------

            //     for (var iAlarm = 0; iAlarm < arrayAlarm.length; iAlarm++) {
            //         var rowData = arrayAlarm[iAlarm];

            //         filSoData = "<option value=\"" + rowData['sourcename'] + "\">" + rowData['sourcename'] + "</option>";

            //         siteSoTxtData += filSoData;
            //     }
            //     document.getElementById("selectSource").innerHTML = siteSoTxtData;


            //     document.getElementById("selectSourceDiv").hidden = false;
            //     document.getElementById("selectSource").disabled = false;

            // }
            else if (arrayAlarm.length == 0) {

                // ------------------------------------------------------------------------------
                // service
                // ------------------------------------------------------------------------------

                for (var iAlarm = 0; iAlarm < arrayServiceAlarm.length; iAlarm++) {
                    var rowData = arrayServiceAlarm[iAlarm];

                    filSerData = "<option value=\"" + rowData['serviceDisplayName'] + "\">" + rowData['serviceDisplayName'] + "</option>";

                    siteSerTxtData += filSerData;
                }
                document.getElementById("selectService").innerHTML = siteSerTxtData;


                document.getElementById("selectServiceDiv").hidden = false;
                document.getElementById("selectService").disabled = false;

            } else {
                document.getElementById("selectServiceDiv").hidden = true;
                document.getElementById("selectSourceDiv").hidden = true;
                document.getElementById("selectService").disabled = true;
                document.getElementById("selectSource").disabled = true;
            }
        }
    }

}

function loadServiceAndSourceList() {

    if (receiveServiceListReq.readyState == 4 && receiveSourceFilterReq.readyState == 4) {

        var siteSoTxtData = "", filSoData, filSerData;

        //Here we should have some JSON data !!
        var dbData = JSON.parse(showErrorMain(receiveSourceFilterReq.responseText, "Error Found"));
        var dbServiceData = JSON.parse(showErrorMain(receiveServiceListReq.responseText, "Error Found"));


        if ((Object.entries(dbData['queryresult']).length != 0) && (Object.entries(dbServiceData['queryresult']).length != 0)) {

            arrayAlarm = dbData['queryresult'];
            var siteSerTxtData = "", filSerData;
            //Here we should have some JSON data !!
            arrayServiceAlarm = dbServiceData['queryresult'];


            filSerData = "<div id=\"selectServiceList\"><div class=\"input-group mb-3\"><div class=\"input-group-prepend\"><label class=\"input-group-text\" for=\"searchGroupSelect01\">Service Selection</label></div><select class=\"custom-select\"  id=\"selectSearchService\"><option value=\"undefined\" selected>Choose Service...</option>";

            siteSerTxtData += filSerData;


            filSoData = "<div id=\"selectSourceList\"><div class=\"input-group mb-3\"><div class=\"input-group-prepend\"><label class=\"input-group-text\" for=\"searchGroupSelect01\">Source Selection</label></div><select class=\"custom-select\"  id=\"selectSearchSource\"><option value=\"undefined\" selected>Choose Source...</option>";

            siteSoTxtData += filSoData;

            if (arrayServiceAlarm.length != 0 && arrayAlarm.length != 0) {

                // ------------------------------------------------------------------------------
                // source
                // ------------------------------------------------------------------------------

                for (var iAlarm = 0; iAlarm < arrayAlarm.length; iAlarm++) {
                    var rowData = arrayAlarm[iAlarm];
                    if (rowData['sourcename'] == "ServiceStatus") {

                        filSoData = "<option value=\"" + rowData['sourcename'] + "\">" + rowData['sourcename'] + "</option>";

                        siteSoTxtData += filSoData;

                    }
                }
                document.getElementById("selectSource").innerHTML = siteSoTxtData;



                // ------------------------------------------------------------------------------
                // service
                // ------------------------------------------------------------------------------

                for (var iAlarm = 0; iAlarm < arrayServiceAlarm.length; iAlarm++) {
                    var rowData = arrayServiceAlarm[iAlarm];

                    filSerData = "<option value=\"" + rowData['serviceDisplayName'] + "\">" + rowData['serviceDisplayName'] + "</option>";

                    siteSerTxtData += filSerData;
                }
                document.getElementById("selectService").innerHTML = siteSerTxtData;
                // document.getElementById("selectSource").innerHTML = siteSoTxtData;


                document.getElementById("selectServiceDiv").hidden = false;
                document.getElementById("selectSourceDiv").hidden = false;
                document.getElementById("selectService").disabled = false;
                document.getElementById("selectSource").disabled = false;


            }
            else if (arrayServiceAlarm.length == 0 && arrayAlarm.length != 0) {
                // ------------------------------------------------------------------------------
                // source
                // ------------------------------------------------------------------------------

                for (var iAlarm = 0; iAlarm < arrayAlarm.length; iAlarm++) {
                    var rowData = arrayAlarm[iAlarm];
                    if (rowData['sourcename'] == "ServiceStatus") {

                        filSoData = "<option value=\"" + rowData['sourcename'] + "\">" + rowData['sourcename'] + "</option>";

                        siteSoTxtData += filSoData;

                    }
                }
                document.getElementById("selectSource").innerHTML = siteSoTxtData;


                document.getElementById("selectSourceDiv").hidden = false;
                document.getElementById("selectSource").disabled = false;

            }
            else if (arrayServiceAlarm.length != 0 && arrayAlarm.length == 0) {

                // ------------------------------------------------------------------------------
                // service
                // ------------------------------------------------------------------------------

                for (var iAlarm = 0; iAlarm < arrayServiceAlarm.length; iAlarm++) {
                    var rowData = arrayServiceAlarm[iAlarm];

                    filSerData = "<option value=\"" + rowData['serviceDisplayName'] + "\">" + rowData['serviceDisplayName'] + "</option>";

                    siteSerTxtData += filSerData;
                }
                document.getElementById("selectService").innerHTML = siteSerTxtData;


                document.getElementById("selectServiceDiv").hidden = false;
                document.getElementById("selectService").disabled = false;

            } else {
                document.getElementById("selectServiceDiv").hidden = true;
                document.getElementById("selectSourceDiv").hidden = true;
                document.getElementById("selectService").disabled = true;
                document.getElementById("selectSource").disabled = true;
            }
        }
    }

}


function showToastMessage(toastPopupVAR, toastTitleVAR, toastMessageVAR, tstMessage, tstTitle, tstDelayTime) {
    //set time 
    var toastDelayTime = tstDelayTime;
    // set title
    var toastTitle = tstTitle;
    //Set Message
    var toastMessage = tstMessage;
    var toastPopupID = '#' + toastPopupVAR + '';

    //set objects
    var toastPopup = document.getElementById(toastPopupVAR);
    var toastTITLEObj = document.getElementById(toastTitleVAR);
    var toastMSGObj = document.getElementById(toastMessageVAR);


    // run toast 
    toastPopup.setAttribute("data-delay", toastDelayTime);
    toastTITLEObj.innerHTML = toastTitle;
    toastMSGObj.innerHTML = toastMessage;
    $(function () { $(toastPopupID).toast('show'); });
}

function showErrorMain(resp, errorlabel) {

    if (resp.indexOf("Exception :") == 0) {
        //alert((errorlabel == undefined ?'':(errorlabel+'\r\n')) + resp);
        //set time 
        var toastPopV = "mainPageToastAlert";
        var toastTitleV = "toastTitle";
        var toastMsgV = "toastMessage";

        var toastDelayTime = 10000;
        // set title
        var toastTitle = (errorlabel == undefined ? 'Error!' : errorlabel);
        //Set Message
        var toastMessage = resp; //"Please ensure the Site, Host and Schedule are selected before submitting to create a maintenance schedule.";
        showToastMessage(toastPopV, toastTitleV, toastMsgV, toastMessage, toastTitle, toastDelayTime);

        return "{}";
    }
    return resp;
}
function showErrorEdit(resp, errorlabel) {

    if (resp.indexOf("Exception :") == 0) {
        //alert((errorlabel == undefined ?'':(errorlabel+'\r\n')) + resp);
        //set time 
        var toastPopV = "toastTitleModalEditSch";
        var toastTitleV = "toastTitleModalEditSch";
        var toastMsgV = "toastMessageModalEditSch";

        var toastDelayTime = 10000;
        // set title
        var toastTitle = (errorlabel == undefined ? 'Error!' : errorlabel);
        //Set Message
        var toastMessage = resp; //"Please ensure the Site, Host and Schedule are selected before submitting to create a maintenance schedule.";
        showToastMessage(toastPopV, toastTitleV, toastMsgV, toastMessage, toastTitle, toastDelayTime);

        return "{}";
    }
    return resp;
}
function showErrorCreate(resp, errorlabel) {


    if (resp.indexOf("Exception :") == 0) {
        //alert((errorlabel == undefined ?'':(errorlabel+'\r\n')) + resp);
        //set time 
        var toastPopV = "modalCreateSchToastAlert";
        var toastTitleV = "toastTitleModalSch";
        var toastMsgV = "toastMessageModalSch";

        var toastDelayTime = 10000;
        // set title
        var toastTitle = (errorlabel == undefined ? 'Error!' : errorlabel);
        //Set Message
        var toastMessage = resp; //"Please ensure the Site, Host and Schedule are selected before submitting to create a maintenance schedule.";
        showToastMessage(toastPopV, toastTitleV, toastMsgV, toastMessage, toastTitle, toastDelayTime);

        return "{}";
    }
    return resp;
}


function enableScheduleSelection() {
    //     document.getElementById("selectScheduleFrequency").disabled = false;
    document.getElementById("btnCompleteHostSchedule").disabled = false;
    //     document.getElementById("selectScheduleEnabler").disabled = false;
    //     document.getElementById("nStartDate").disabled = false;
    //     document.getElementById("StartTime").disabled = false;
    //     document.getElementById("EndDate").disabled = false;
    //     document.getElementById("EndTime").disabled = false;
}

function resetHostMaintenanceScheduler() {
    //     document.getElementById("selectScheduleFrequency").disabled = false;


    getSiteList();


    var hostReset = "<option selected=\"\" value=\"undefined\">Choose Host...</option>";
    // var hostIDReset = "<option selected=\"\" value=\"undefined\">Choose Host ID...</option>";
    var agentReset = "<option selected=\"\" value=\"undefined\">Choose Agent...</option>";
    var serviceReset = "<option selected=\"\" value=\"undefined\">Choose Service...</option>";
    var sourceReset = "<option selected=\"\" value=\"undefined\">Choose Source...</option>";


    // document.getElementById("selectScheduleDisplay");
    document.getElementById("selectHost").innerHTML = hostReset;
    document.getElementById("selectSource").innerHTML = sourceReset;
    // document.getElementById("selectHostID").innerHTML = hostIDReset;
    document.getElementById("selectAgent").innerHTML = agentReset;
    document.getElementById("selectService").innerHTML = serviceReset;

    document.getElementById("selectHost").disabled = true;
    document.getElementById("selectSource").disabled = true;
    // document.getElementById("selectHostID").disabled = true;
    document.getElementById("selectAgent").disabled = true;
    document.getElementById("selectService").disabled = true;
}

function resetMaintenance() {
    getSiteList();
    loadActiveSchedules();
    var scheduleTableDiv = document.getElementById("schedulesTableDiv");


    var hostReset = "<option selected=\"\" value=\"undefined\">Choose Host...</option>";
    // var hostIDReset = "<option selected=\"\" value=\"undefined\">Choose Host ID...</option>";
    var agentReset = "<option selected=\"\" value=\"undefined\">Choose Agent...</option>";
    var serviceReset = "<option selected=\"\" value=\"undefined\">Choose Service...</option>";
    var sourceReset = "<option selected=\"\" value=\"undefined\">Choose Source...</option>";



    // document.getElementById("selectScheduleDisplay");
    document.getElementById("selectHost").innerHTML = hostReset;
    document.getElementById("selectSource").innerHTML = sourceReset;
    // document.getElementById("selectHostID").innerHTML = hostIDReset;
    document.getElementById("selectAgent").innerHTML = agentReset;
    document.getElementById("selectService").innerHTML = serviceReset;

    document.getElementById("selectHost").disabled = true;
    document.getElementById("selectSource").disabled = true;
    // document.getElementById("selectHostID").disabled = true;
    document.getElementById("selectAgent").disabled = true;
    document.getElementById("selectService").disabled = true;

    scheduleTableDiv.hidden = true;
    document.getElementById("selectHostDiv").hidden = true;
    document.getElementById("selectSourceDiv").hidden = true;
    document.getElementById("selectAgentDiv").hidden = true;
    document.getElementById("selectServiceDiv").hidden = true;
}
function resetScheduler() {

    var scheduleSelect = document.getElementById("selectEditSchedule");
    var newScheduleName = document.getElementById("newScheduleName");
    var newScheduleFrequency = document.getElementById("selectScheduleFrequency");
    var newScheduleEnabled = document.getElementById("selectScheduleEnabler");
    //var newScheduleStartDate = document.getElementById("nStartDate");
    var newScheduleStartTime = document.getElementById("StartTime");
    var newScheduleEndDate = document.getElementById("EndDate");
    var newScheduleEndTime = document.getElementById("EndTime");

    var freqTxt = "<option selected value=\"undefined\">Choose Schedule Frequency...</option>"
        + "<option id=\"Once\" value=\"ONCE\">ONCE</option>"
        + "<option id=\"Daily\" value=\"DAILY\">Every Day</option>"
        + "<option id=\"Weekly\" value=\"WEEKLY\">Every Week</option>";

    var schedTxt = "<option selected value=\"undefined\">Choose to Enable Schedule...</option>"
        + "<option id=\"Enabled\" value=\"1\">Enabled</option>"
        + "<option id=\"Disabled\" value=\"0\">Disabled</option>";

    newScheduleName.value = "";
    scheduleSelect.value = "undefined";
    newScheduleFrequency.value = "undefined";
    newScheduleEnabled.value = "undefined";

    // newScheduleStartDate.value = "";
    openCreateScheduleModal();
    newScheduleStartTime.value = "";
    newScheduleEndDate.value = "";
    newScheduleEndTime.value = "";

}

// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// SCHEDULE LIST DATA FUNCTIONS 
// -----------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------------------

function getScheduleModal(scheduleId) {

    var query = "SELECT "
        + "InovoMonitor.tblHostMaintenance.id, "
        + "InovoMonitor.tblSites.sitename, "
        + "InovoMonitor.tblHostMaintenance.siteid, "
        + "InovoMonitor.tblHosts.hostname, "
        + "InovoMonitor.tblHostMaintenance.hostid, "
        + "InovoMonitor.tblHostMaintenance.source, "
        + "InovoMonitor.tblHostMaintenance.metric, "
        + "InovoMonitor.tblHostMaintenance.metricvalue, "
        + "InovoMonitor.tblHostMaintenanceSchedule.schedulename, "
        + "InovoMonitor.tblHostMaintenanceSchedule.frequency, "
        + "InovoMonitor.tblHostMaintenanceSchedule.enabled, "
        + "InovoMonitor.tblHostMaintenanceSchedule.startdatetime, "
        + "InovoMonitor.tblHostMaintenanceSchedule.enddatetime "
        + "FROM InovoMonitor.tblHostMaintenance "
        + "INNER JOIN InovoMonitor.tblHostMaintenanceSchedule ON InovoMonitor.tblHostMaintenance.scheduleid = InovoMonitor.tblHostMaintenanceSchedule.id "
        + "INNER JOIN InovoMonitor.tblSites ON InovoMonitor.tblHostMaintenance.siteid = InovoMonitor.tblSites.id "
        + "INNER JOIN InovoMonitor.tblHosts ON InovoMonitor.tblHostMaintenance.hostid = InovoMonitor.tblHosts.id "
        + "WHERE InovoMonitor.tblHostMaintenance.id  = " + scheduleId + ";";


    // document.getElementById("selectSource").disabled = false;
    receiveScheduleReq.open("POST", serverURL + "/MonitorData", true);
    //Set the function that will be called when the XmlHttpRequest objects state changes.		
    receiveScheduleReq.onreadystatechange = showSchedulesDetails;
    receiveScheduleReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    receiveScheduleReq.send("action=runopenquery&query=" + query);
}

function showSchedulesDetails() {
    if (receiveScheduleReq.readyState == 4) {
        var dbDataVAR = JSON.parse(showErrorMain(receiveScheduleReq.responseText, "Error Found"));


        if (Object.entries(dbDataVAR['queryresult']).length != 0) {
            var scheduleDetails = dbDataVAR['queryresult'];
            var newrowData = scheduleDetails[0];

            var idVar = newrowData['id'];

            var sitenameVAR = newrowData['sitename'];
            var hostnameVAR = newrowData['hostname'];
            var schedulenameVAR = newrowData['schedulename'];

            var frequencyVAR = newrowData['frequency'];
            var startDateVAR = newrowData['startdatetime'];
            var endDateVAR = newrowData['enddatetime'];

            var sourceVAR = newrowData['source'];
            var metricVAR = newrowData['metric'];
            var metricValueVAR = newrowData['metricvalue'];


            //for the active not active icon 
            // var isActiveVAR = newrowData['currentstatus']
            document.getElementById("idData").innerHTML = idVar;

            document.getElementById("sitenameData").innerHTML = sitenameVAR;
            document.getElementById("hostnameData").innerHTML = hostnameVAR;
            document.getElementById("scheduleNameData").innerHTML = schedulenameVAR;

            document.getElementById("frequencyData").innerHTML = frequencyVAR;
            document.getElementById("startDateData").innerHTML = startDateVAR;
            document.getElementById("endDateData").innerHTML = endDateVAR;

            document.getElementById("sourceData").innerHTML = sourceVAR;
            document.getElementById("metricData").innerHTML = metricVAR;
            document.getElementById("metricValueData").innerHTML = metricValueVAR;

            document.getElementById("btnDeleteSchedule").setAttribute("onclick", "deleteSchedule(" + idVar + ")")



        }
    }
}






function loadCurrentHostMaintenance() {

    // document.getElementById("selectSource").disabled = false;
    receiveHostMSListReq.open("POST", serverURL + "/MonitorData", true);
    //Set the function that will be called when the XmlHttpRequest objects state changes.		
    receiveHostMSListReq.onreadystatechange = showCurrentHostMaintenance;
    receiveHostMSListReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    var query = "SELECT InovoMonitor.tblHostMaintenance.id, "
        + "InovoMonitor.tblHostMaintenanceSchedule.schedulename, "
        + "InovoMonitor.tblHostMaintenance.scheduleid, "
        + "InovoMonitor.tblSites.sitename, "
        + "InovoMonitor.tblHostMaintenance.siteid, "
        + "InovoMonitor.tblHosts.hostname, "
        + "InovoMonitor.tblHostMaintenance.hostid, "
        + "InovoMonitor.tblHostMaintenance.metric, "
        + "InovoMonitor.tblHostMaintenance.source, "
        + "InovoMonitor.tblHostMaintenanceSchedule.frequency, "
        + "InovoMonitor.tblHostMaintenanceSchedule.startdatetime, "
        + "InovoMonitor.tblHostMaintenanceSchedule.enddatetime "
        + "FROM InovoMonitor.tblHostMaintenance "
        + "INNER JOIN InovoMonitor.tblHosts ON InovoMonitor.tblHosts.id = InovoMonitor.tblHostMaintenance.hostid "
        + "INNER JOIN InovoMonitor.tblSites ON InovoMonitor.tblSites.id = InovoMonitor.tblHostMaintenance.siteid "
        + "INNER JOIN InovoMonitor.tblHostMaintenanceSchedule ON InovoMonitor.tblHostMaintenanceSchedule.id = InovoMonitor.tblHostMaintenance.scheduleid;";

    receiveHostMSListReq.send("action=runopenquery&query=" + query);
}









function showCurrentHostMaintenance() {
    var filData = "";

    var dateNow = new Date();
    dateNow = dateNow.getFullYear() + '-' +
        ('00' + (dateNow.getMonth() + 1)).slice(-2) + '-' +
        ('00' + dateNow.getDate()).slice(-2) + ' ' +
        ('00' + dateNow.getHours()).slice(-2) + ':' +
        ('00' + dateNow.getMinutes()).slice(-2) + ':' +
        ('00' + dateNow.getSeconds()).slice(-2);
    var scheduleSelectedEndTime;


    var siteTxtData = "";
    if (receiveHostMSListReq.readyState == 4) {

        var dbData = JSON.parse(showErrorMain(receiveHostMSListReq.responseText, "Error Found"));

        if (Object.entries(dbData['queryresult']).length != 0) {
            var hostMSDetails = dbData['queryresult'];

            for (var iAlarm = 0; iAlarm < hostMSDetails.length; iAlarm++) {
                var rowData = hostMSDetails[iAlarm];
                scheduleSelectedEndTime = rowData['enddatetime']
                if (scheduleSelectedEndTime >= dateNow || scheduleSelectedEndTime == "") {
                    filSoData =
                        "<tr><td>" + rowData['sitename']
                        + "</td><td>" + rowData['hostname']
                        + "</td><td>" + rowData['metric']
                        + "</td><td>" + rowData['schedulename']
                        + "</td><td><a class=\"infoModalPress\" data-toggle=\"modal\" data-target=\".host-maintain-modal-lg\"  onclick=\"getScheduleModal(" + rowData['id'] + "); \" title=\"Click for More Info\">"
                        + "<i class=\"fas fa-ellipsis-v\" style=\"font-size: 20px;color: rgb(4,4,4);\"></i>"
                        + "</a>"
                        + "</td></tr>";


                    siteTxtData += filSoData;
                }

            }
            document.getElementById("hostMaintenanceTable").innerHTML = siteTxtData;


        }

    }
}
function loadActiveSchedules() {
    receiveScheduleListReq.open("POST", serverURL + "/MonitorData", true);
    receiveScheduleListReq.onreadystatechange = showActiveSchedules;
    receiveScheduleListReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    var query = "SELECT * FROM InovoMonitor.tblHostMaintenanceSchedule WHERE InovoMonitor.tblHostMaintenanceSchedule.enabled = 1;";

    receiveScheduleListReq.send("action=runopenquery&query=" + query);
}
function showActiveSchedules() {

    if (receiveScheduleListReq.readyState == 4) {
        var filData = "";
        var dateNow = new Date();
        dateNow = dateNow.getFullYear() + '-' +
            ('00' + (dateNow.getMonth() + 1)).slice(-2) + '-' +
            ('00' + dateNow.getDate()).slice(-2) + ' ' +
            ('00' + dateNow.getHours()).slice(-2) + ':' +
            ('00' + dateNow.getMinutes()).slice(-2) + ':' +
            ('00' + dateNow.getSeconds()).slice(-2);
        var scheduleSelectedEndTime;

        var siteTxtData = "";
        var dbData = JSON.parse(showErrorMain(receiveScheduleListReq.responseText, "Error Found"));


        if (Object.entries(dbData).length != 0) {

            var siteDetails = dbData['queryresult'];

            filData = "<option selected=\"\" value=\"undefined\">Choose Schedule...</option>"

            siteTxtData += filData;

            for (var iAlarm = 0; iAlarm < siteDetails.length; iAlarm++) {
                var rowData = siteDetails[iAlarm];
                scheduleSelectedEndTime = rowData['enddatetime']

                if (scheduleSelectedEndTime >= dateNow || scheduleSelectedEndTime == "") {

                    filData = "<option  value=\"" + rowData['id'] + "\">" + rowData['schedulename'] + "</option>";

                    siteTxtData += filData;
                }
            }
            document.getElementById("selectSchedule").innerHTML = siteTxtData;

        }

    }
}

function showScheduleSelected() {
    var scheduleTableDiv = document.getElementById("schedulesTableDiv");

    var scheduleId = document.getElementById("selectSchedule").value;
    var filData = "";
    var warningTXT = "";

    var siteTxtData = "";

    if (scheduleId != undefined && scheduleId != "undefined") {
        if (receiveScheduleListReq.readyState == 4) {

            var dbData = JSON.parse(showErrorEdit(receiveScheduleListReq.responseText, "Error Found"));

            if (Object.entries(dbData).length != 0) {
                var hostMSDetails = dbData['queryresult'];


                for (var iAlarm = 0; iAlarm < hostMSDetails.length; iAlarm++) {
                    var rowData = hostMSDetails[iAlarm];

                    if (rowData['id'] == scheduleId) {

                        if (rowData['enddatetime'] == "") {
                            filData =
                                "<tr style=\"border: 1px solid #ff0000; width: 10px;\"><td id=\"schNameTD\">" + rowData['schedulename']
                                // add data to 
                                + "</td><td>" + rowData['frequency']
                                + "</td><td>" + rowData['startdatetime']
                                + "</td><td  style=\"border: 2px solid #ff0000;\">" + rowData['enddatetime']
                                + "</td></tr>";

                            siteTxtData += filData;
                            warningTXT = "WARNING: The schedule you have chosen will not end."
                        }
                        else {
                            filData =
                                "<tr width: 10px; ><td id=\"schNameTD\">" + rowData['schedulename']
                                // add data to 
                                + "</td ><td>" + rowData['frequency']
                                + "</td><td>" + rowData['startdatetime']
                                + "</td><td>" + rowData['enddatetime']
                                + "</td></tr>";

                            siteTxtData += filData;
                        }

                    }
                }
                scheduleTableDiv.hidden = false;
                document.getElementById("schedulesTable").innerHTML = siteTxtData;
                document.getElementById("warningText").innerHTML = warningTXT;
            }
        }
    } else {
        scheduleTableDiv.hidden = true;
    }
}

// function addScheduleDataToMaintenance(scheduleId) {
//     var displaySchedule = document.getElementById("selectScheduleDisplay");
//     if (/*receiveHostMSListReq.readyState == 4 &&*/ receiveScheduleListReq.readyState == 4) {
//         var dbData = JSON.parse(receiveScheduleListReq.responseText);
//         var scheduleDetails = dbData['queryresult'];

//         // var dbData = JSON.parse(receiveHostMSListReq.responseText);
//         // var hostMSDetails = dbData['queryresult'];

//         for (var iAlarm = 0; iAlarm < scheduleDetails.length; iAlarm++) {
//             var rowData = scheduleDetails[iAlarm];

//             if (rowData['id'] == scheduleId) {
//                 var schID = rowData['id'];
//                 var schName = rowData['schedulename'];

//                 displaySchedule.setAttribute("data-", schID);
//                 displaySchedule.setAttribute("value", schName);
//             }
//         }
//     }
// }v

var deleteQueryLog = ""

function deleteSchedule(scheduleID) {
    var deleteQuery;

    deleteQuery = "DELETE "
        + "FROM InovoMonitor.tblHostMaintenance "
        + "WHERE InovoMonitor.tblHostMaintenance.id = " + scheduleID + ";";

    deleteQueryLog = "Host Maintenance ID: " + scheduleID;

    deleteScheduleReq.open("POST", serverURL + "/MonitorData", true);
    //Set the function that will be called when the XmlHttpRequest objects state changes.		
    deleteScheduleReq.onreadystatechange = logDeleteSchedule;
    deleteScheduleReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    deleteScheduleReq.send("action=runopenquery&query=" + deleteQuery);
}

function logDeleteSchedule() {
    if (deleteScheduleReq.readyState == 4) {

        if (Object.entries(JSON.parse(showErrorMain(deleteScheduleReq.responseText, "Error Found")).length != 0)) {

            var dbData = JSON.parse(showErrorMain(userManagementProfileReq.responseText, "Error Found"));
            var userProfileData = JSON.parse(showErrorMain(userProfilereq.responseText, "Error Found"));

            if ((Object.entries(dbData).length != 0) && (Object.entries(userProfileData).length != 0)) {
                var userDetails = dbData['queryresult'];
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
                var updateReason = deleteQueryLog + " is deleted";
                // var query = "SELECT * FROM InovoMonitor.tblAlarms;"

                dateNow = new Date();
                dateNow = dateNow.getFullYear() + '-' +
                    ('00' + (dateNow.getMonth() + 1)).slice(-2) + '-' +
                    ('00' + dateNow.getDate()).slice(-2) + ' ' +
                    ('00' + dateNow.getHours()).slice(-2) + ':' +
                    ('00' + dateNow.getMinutes()).slice(-2) + ':' +
                    ('00' + dateNow.getSeconds()).slice(-2);

                var insertLogquery = "INSERT INTO InovoMonitor.tblUserLog (userid, reason, datecreated, createdby)  VALUES ('" + userProfileID + "','" + String(updateReason) + "', '" + dateNow + "','" + currentUser + "');";



                createDeleteScheduleLogReq.open("POST", serverURL + "/MonitorData", true);
                createDeleteScheduleLogReq.onreadystatechange = completeDeleteSchedule;
                createDeleteScheduleLogReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                createDeleteScheduleLogReq.send("action=runopenquery&query=" + insertLogquery);
            }
            else {

                //set time 
                var toastDelayTime = 10000;
                // set title
                var toastTitle = "HOST MAINTENANCE DELETION INCOMPLETE!";
                //Set Message
                var toastMessage = The;
                var toastPopup = document.getElementById("mainPageToastAlert");
                var toastTITLEObj = document.getElementById("toastTitle");
                var toastMSGObj = document.getElementById("toastMessage");


                // run toast 
                toastPopup.setAttribute("data-delay", toastDelayTime);
                toastTITLEObj.innerHTML = toastTitle;
                toastMSGObj.innerHTML = toastMessage;
                $(function () { $('#mainPageToastAlert').toast('show'); });

            }


        } else {

            //set time 
            var toastDelayTime = 10000;
            // set title
            var toastTitle = "HOST MAINTENANCE DELETION INCOMPLETE!";
            //Set Message
            var toastMessage = deleteQueryLog + " is not  deleted.";
            var toastPopup = document.getElementById("mainPageToastAlert");
            var toastTITLEObj = document.getElementById("toastTitle");
            var toastMSGObj = document.getElementById("toastMessage");


            // run toast 
            toastPopup.setAttribute("data-delay", toastDelayTime);
            toastTITLEObj.innerHTML = toastTitle;
            toastMSGObj.innerHTML = toastMessage;
            $(function () { $('#mainPageToastAlert').toast('show'); });

        }

    }
}

function completeDeleteSchedule() {

    if (createDeleteScheduleLogReq.readyState == 4) {

        //set variables 


        //set time 
        var toastDelayTime = 10000;
        // set title
        var toastTitle = "HOST MAINTENANCE DELETION COMPLETE!";
        //Set Message
        var toastMessage = deleteQueryLog;
        var toastPopup = document.getElementById("mainPageToastAlert");
        var toastTITLEObj = document.getElementById("toastTitle");
        var toastMSGObj = document.getElementById("toastMessage");


        // run toast 
        toastPopup.setAttribute("data-delay", toastDelayTime);
        toastTITLEObj.innerHTML = toastTitle;
        toastMSGObj.innerHTML = toastMessage;
        $(function () { $('#mainPageToastAlert').toast('show'); });

        resetHostMaintenanceScheduler();

        loadActiveSchedules();
        loadCurrentHostMaintenance();

    }

}




function createNewScheduleTemplate() {
    var date = new Date().toISOString().slice(0, 10);

    var radioOnce = document.getElementById("radioOnce");
    var radioDaily = document.getElementById("radioDaily");
    var radioWeekly = document.getElementById("radioWeekly");
    var endDateDiv = document.getElementById("ScheduleEndDate");
    var enableEndDateRadio = document.getElementById("enableEndDateRadio");
    var disableEndDateRadio = document.getElementById("disableEndDateRadio");
    var radioEnable = document.getElementById("radioEnable");
    var radioDisable = document.getElementById("radioDisable");

    var newScheduleName = document.getElementById("newScheduleName").value;



    // frequency
    if (radioOnce.checked == true) {
        var newScheduleFrequency = radioOnce.value;
    } else if (radioDaily.checked == true) {

        var newScheduleFrequency = radioDaily.value;
    } else if (radioWeekly.checked == true) {

        var newScheduleFrequency = radioWeekly.value;
    }

    if (radioEnable.checked == true) {
        var newScheduleEnabled = radioEnable.value;
    } else if (radioDisable.checked == true) {
        var newScheduleEnabled = radioDisable.value;
    }

    // -----------------------------------------------------------------
    // end date
    // -----------------------------------------------------------------

    if (enableEndDateRadio.checked == true) {
        var newScheduleEndDate = document.getElementById("EndDate").value;
    } else {
        var newScheduleEndDate = "2050-12-31"


        var toastPopupVAR = "modalCreateSchToastAlert";

        var toastTitleV = "toastTitleModalSch";
        var toastMsgV = "toastMessageModalSch";
        var toastDelayTime = 10000;
        // set title
        var toastTitle = 'WARNING!';
        //Set Message
        var toastMessage = "No END DATE selected, therefore date set to: " + newScheduleEndDate + ""; //"Please ensure the Site, Host and Schedule are selected before submitting to create a maintenance schedule.";
        showToastMessage(toastPopupVAR, toastTitleV, toastMsgV, toastMessage, toastTitle, toastDelayTime);
    }


    var newScheduleStartDate = document.getElementById("nStartDate").value;
    var newScheduleStartTime = document.getElementById("StartTime").value;
    var newScheduleEndTime = document.getElementById("EndTime").value;

    var newStartDateTime = newScheduleStartDate + " " + newScheduleStartTime;
    var newEndDateTime = newScheduleEndDate + " " + newScheduleEndTime;

    var lengthName = newScheduleName.length;



    if (newScheduleName != "" && newScheduleName != "undefined") {
        if (lengthName <= 45) {
            if (newScheduleFrequency != "undefined") {
                if (newScheduleEnabled != "undefined") {
                    if (newScheduleStartDate >= date && newScheduleStartDate != "") {
                        if (newScheduleStartTime != "" && newScheduleStartTime != "undefined") {
                            if (newScheduleEndDate != "undefined") {
                                if (newScheduleEndTime != "undefined") {

                                    var query = "INSERT INTO InovoMonitor.tblHostMaintenanceSchedule (schedulename, enabled, startdatetime, enddatetime, frequency)  VALUES ('"
                                        + newScheduleName + "','" + newScheduleEnabled + "', '" + newStartDateTime + "','" + newEndDateTime + "','" + newScheduleFrequency + "');";

                                    createScheduleReq.open("POST", serverURL + "/MonitorData", true);
                                    createScheduleReq.onreadystatechange = logUserScheduleCreateDetails;
                                    createScheduleReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                    createScheduleReq.send("action=runopenquery&query=" + query);

                                }
                                else {
                                    // var newScheduleName = document.getElementById("newScheduleName");
                                    // var newScheduleFrequency = document.getElementById("selectScheduleFrequency");
                                    // var newScheduleEnabled = document.getElementById("selectScheduleEnabler");
                                    // var newScheduleStartDate = document.getElementById("nStartDate");
                                    // var newScheduleStartTime = document.getElementById("StartTime");
                                    // var newScheduleEndDate = document.getElementById("EndDate");
                                    // var newScheduleEndTime = document.getElementById("EndTime");

                                    // newScheduleName.value = "";
                                    // newScheduleFrequency.reset;
                                    // newScheduleFrequency.innerHTML =
                                    //     +"<option selected=\"\" value=\"undefined\">Choose Schedule Frequency...</option>"
                                    //     + "<option id=\"Once\" value=\"ONCE\">ONCE</option>"
                                    //     + "<option id=\"Daily\" value=\"DAILY\">Every Day</option>"
                                    //     + "<option id=\"Weekly\" value=\"WEEKLY\">Every Week</option>";
                                    // newScheduleEnabled.innerHTML =
                                    //     +"<option selected=\"\" value=\"undefined\">Choose to Enable Schedule...</option>"
                                    //     + "<option id=\"Enabled\" value=\"1\">Enabled</option>"
                                    //     + "<option id=\"Disabled\" value=\"0\">Disabled</option>";

                                    // newScheduleStartDate.value = "";
                                    // newScheduleStartTime.value = "";
                                    // newScheduleEndDate.value = "";
                                    // newScheduleEndTime.value = "";






                                    // set title
                                    var toastTitle = "WARNING!";
                                    //Set Message
                                    var toastMessage = "Ensure That All Parameters are filled in and ensure the date is set to " + date + ", or later. \n Ensure the name of the Schedule is 45 Characters or LESS";

                                    //set objects
                                    var toastPopupVAR = "modalCreateSchToastAlert";

                                    var toastTitleV = "toastTitleModalSch";
                                    var toastMsgV = "toastMessageModalSch";
                                    var toastDelayTime = 10000;

                                    showToastMessage(toastPopupVAR, toastTitleV, toastMsgV, toastMessage, toastTitle, toastDelayTime);


                                }
                            }
                            else {
                                // var newScheduleName = document.getElementById("newScheduleName");
                                // var newScheduleFrequency = document.getElementById("selectScheduleFrequency");
                                // var newScheduleEnabled = document.getElementById("selectScheduleEnabler");
                                // var newScheduleStartDate = document.getElementById("nStartDate");
                                // var newScheduleStartTime = document.getElementById("StartTime");
                                // var newScheduleEndDate = document.getElementById("EndDate");
                                // var newScheduleEndTime = document.getElementById("EndTime");

                                // newScheduleName.value = "";
                                // newScheduleFrequency.reset;
                                // newScheduleFrequency.innerHTML =
                                //     +"<option selected=\"\" value=\"undefined\">Choose Schedule Frequency...</option>"
                                //     + "<option id=\"Once\" value=\"ONCE\">ONCE</option>"
                                //     + "<option id=\"Daily\" value=\"DAILY\">Every Day</option>"
                                //     + "<option id=\"Weekly\" value=\"WEEKLY\">Every Week</option>";
                                // newScheduleEnabled.innerHTML =
                                //     +"<option selected=\"\" value=\"undefined\">Choose to Enable Schedule...</option>"
                                //     + "<option id=\"Enabled\" value=\"1\">Enabled</option>"
                                //     + "<option id=\"Disabled\" value=\"0\">Disabled</option>";

                                // newScheduleStartDate.value = "";
                                // newScheduleStartTime.value = "";
                                // newScheduleEndDate.value = "";
                                // newScheduleEndTime.value = "";




                                // set title
                                var toastTitle = "WARNING!";
                                //Set Message
                                var toastMessage = "Ensure That All Parameters are filled in and ensure the date is set to " + date + ", or later. \n Ensure the name of the Schedule is 45 Characters or LESS";

                                //set objects
                                var toastPopupVAR = "modalCreateSchToastAlert";

                                var toastTitleV = "toastTitleModalSch";
                                var toastMsgV = "toastMessageModalSch";
                                var toastDelayTime = 10000;

                                showToastMessage(toastPopupVAR, toastTitleV, toastMsgV, toastMessage, toastTitle, toastDelayTime);


                            }
                        }
                        else {
                            // var newScheduleName = document.getElementById("newScheduleName");
                            // var newScheduleFrequency = document.getElementById("selectScheduleFrequency");
                            // var newScheduleEnabled = document.getElementById("selectScheduleEnabler");
                            // var newScheduleStartDate = document.getElementById("nStartDate");
                            // var newScheduleStartTime = document.getElementById("StartTime");
                            // var newScheduleEndDate = document.getElementById("EndDate");
                            // var newScheduleEndTime = document.getElementById("EndTime");

                            // newScheduleName.value = "";
                            // newScheduleFrequency.reset;
                            // newScheduleFrequency.innerHTML =
                            //     +"<option selected=\"\" value=\"undefined\">Choose Schedule Frequency...</option>"
                            //     + "<option id=\"Once\" value=\"ONCE\">ONCE</option>"
                            //     + "<option id=\"Daily\" value=\"DAILY\">Every Day</option>"
                            //     + "<option id=\"Weekly\" value=\"WEEKLY\">Every Week</option>";
                            // newScheduleEnabled.innerHTML =
                            //     +"<option selected=\"\" value=\"undefined\">Choose to Enable Schedule...</option>"
                            //     + "<option id=\"Enabled\" value=\"1\">Enabled</option>"
                            //     + "<option id=\"Disabled\" value=\"0\">Disabled</option>";

                            // newScheduleStartDate.value = "";
                            // newScheduleStartTime.value = "";
                            // newScheduleEndDate.value = "";
                            // newScheduleEndTime.value = "";




                            // set title
                            var toastTitle = "WARNING!";
                            //Set Message
                            var toastMessage = "Ensure That All Parameters are filled in and ensure the date is set to " + date + ", or later. \n Ensure the name of the Schedule is 45 Characters or LESS";

                            //set objects
                            var toastPopupVAR = "modalCreateSchToastAlert";

                            var toastTitleV = "toastTitleModalSch";
                            var toastMsgV = "toastMessageModalSch";
                            var toastDelayTime = 10000;

                            showToastMessage(toastPopupVAR, toastTitleV, toastMsgV, toastMessage, toastTitle, toastDelayTime);


                        }
                    }
                    else {
                        // var newScheduleName = document.getElementById("newScheduleName");
                        // var newScheduleFrequency = document.getElementById("selectScheduleFrequency");
                        // var newScheduleEnabled = document.getElementById("selectScheduleEnabler");
                        // var newScheduleStartDate = document.getElementById("nStartDate");
                        // var newScheduleStartTime = document.getElementById("StartTime");
                        // var newScheduleEndDate = document.getElementById("EndDate");
                        // var newScheduleEndTime = document.getElementById("EndTime");

                        // newScheduleName.value = "";
                        // newScheduleFrequency.reset;
                        // newScheduleFrequency.innerHTML =
                        //     +"<option selected=\"\" value=\"undefined\">Choose Schedule Frequency...</option>"
                        //     + "<option id=\"Once\" value=\"ONCE\">ONCE</option>"
                        //     + "<option id=\"Daily\" value=\"DAILY\">Every Day</option>"
                        //     + "<option id=\"Weekly\" value=\"WEEKLY\">Every Week</option>";
                        // newScheduleEnabled.innerHTML =
                        //     +"<option selected=\"\" value=\"undefined\">Choose to Enable Schedule...</option>"
                        //     + "<option id=\"Enabled\" value=\"1\">Enabled</option>"
                        //     + "<option id=\"Disabled\" value=\"0\">Disabled</option>";

                        // newScheduleStartDate.value = "";
                        // newScheduleStartTime.value = "";
                        // newScheduleEndDate.value = "";
                        // newScheduleEndTime.value = "";



                        // set title
                        var toastTitle = "WARNING!";
                        //Set Message
                        var toastMessage = "Ensure That All Parameters are filled in and ensure the date is set to " + date + ", or later. \n Ensure the name of the Schedule is 45 Characters or LESS";

                        //set objects
                        var toastPopupVAR = "modalCreateSchToastAlert";

                        var toastTitleV = "toastTitleModalSch";
                        var toastMsgV = "toastMessageModalSch";
                        var toastDelayTime = 10000;

                        showToastMessage(toastPopupVAR, toastTitleV, toastMsgV, toastMessage, toastTitle, toastDelayTime);


                    }
                }
                else {
                    // var newScheduleName = document.getElementById("newScheduleName");
                    // var newScheduleFrequency = document.getElementById("selectScheduleFrequency");
                    // var newScheduleEnabled = document.getElementById("selectScheduleEnabler");
                    // var newScheduleStartDate = document.getElementById("nStartDate");
                    // var newScheduleStartTime = document.getElementById("StartTime");
                    // var newScheduleEndDate = document.getElementById("EndDate");
                    // var newScheduleEndTime = document.getElementById("EndTime");

                    // newScheduleName.value = "";
                    // newScheduleFrequency.reset;
                    // newScheduleFrequency.innerHTML =
                    //     +"<option selected=\"\" value=\"undefined\">Choose Schedule Frequency...</option>"
                    //     + "<option id=\"Once\" value=\"ONCE\">ONCE</option>"
                    //     + "<option id=\"Daily\" value=\"DAILY\">Every Day</option>"
                    //     + "<option id=\"Weekly\" value=\"WEEKLY\">Every Week</option>";
                    // newScheduleEnabled.innerHTML =
                    //     +"<option selected=\"\" value=\"undefined\">Choose to Enable Schedule...</option>"
                    //     + "<option id=\"Enabled\" value=\"1\">Enabled</option>"
                    //     + "<option id=\"Disabled\" value=\"0\">Disabled</option>";

                    // newScheduleStartDate.value = "";
                    // newScheduleStartTime.value = "";
                    // newScheduleEndDate.value = "";
                    // newScheduleEndTime.value = "";



                    // set title
                    var toastTitle = "WARNING!";
                    //Set Message
                    var toastMessage = "Ensure That All Parameters are filled in and ensure the date is set to " + date + ", or later. \n Ensure the name of the Schedule is 45 Characters or LESS";

                    //set objects
                    var toastPopupVAR = "modalCreateSchToastAlert";

                    var toastTitleV = "toastTitleModalSch";
                    var toastMsgV = "toastMessageModalSch";
                    var toastDelayTime = 10000;

                    showToastMessage(toastPopupVAR, toastTitleV, toastMsgV, toastMessage, toastTitle, toastDelayTime);


                }
            }
            else {
                // var newScheduleName = document.getElementById("newScheduleName");
                // var newScheduleFrequency = document.getElementById("selectScheduleFrequency");
                // var newScheduleEnabled = document.getElementById("selectScheduleEnabler");
                // var newScheduleStartDate = document.getElementById("nStartDate");
                // var newScheduleStartTime = document.getElementById("StartTime");
                // var newScheduleEndDate = document.getElementById("EndDate");
                // var newScheduleEndTime = document.getElementById("EndTime");

                // newScheduleName.value = "";
                // newScheduleFrequency.reset;
                // newScheduleFrequency.innerHTML =
                //     +"<option selected=\"\" value=\"undefined\">Choose Schedule Frequency...</option>"
                //     + "<option id=\"Once\" value=\"ONCE\">ONCE</option>"
                //     + "<option id=\"Daily\" value=\"DAILY\">Every Day</option>"
                //     + "<option id=\"Weekly\" value=\"WEEKLY\">Every Week</option>";
                // newScheduleEnabled.innerHTML =
                //     +"<option selected=\"\" value=\"undefined\">Choose to Enable Schedule...</option>"
                //     + "<option id=\"Enabled\" value=\"1\">Enabled</option>"
                //     + "<option id=\"Disabled\" value=\"0\">Disabled</option>";

                // newScheduleStartDate.value = "";
                // newScheduleStartTime.value = "";
                // newScheduleEndDate.value = "";
                // newScheduleEndTime.value = "";



                // set title
                var toastTitle = "WARNING!";
                //Set Message
                var toastMessage = "Ensure That All Parameters are filled in and ensure the date is set to " + date + ", or later. \n Ensure the name of the Schedule is 45 Characters or LESS";

                //set objects
                var toastPopupVAR = "modalCreateSchToastAlert";

                var toastTitleV = "toastTitleModalSch";
                var toastMsgV = "toastMessageModalSch";
                var toastDelayTime = 10000;

                showToastMessage(toastPopupVAR, toastTitleV, toastMsgV, toastMessage, toastTitle, toastDelayTime);


            }
        }
        else {
            // var newScheduleName = document.getElementById("newScheduleName");
            // var newScheduleFrequency = document.getElementById("selectScheduleFrequency");
            // var newScheduleEnabled = document.getElementById("selectScheduleEnabler");
            // var newScheduleStartDate = document.getElementById("nStartDate");
            // var newScheduleStartTime = document.getElementById("StartTime");
            // var newScheduleEndDate = document.getElementById("EndDate");
            // var newScheduleEndTime = document.getElementById("EndTime");

            // newScheduleName.value = "";
            // newScheduleFrequency.reset;
            // newScheduleFrequency.innerHTML =
            //     +"<option selected=\"\" value=\"undefined\">Choose Schedule Frequency...</option>"
            //     + "<option id=\"Once\" value=\"ONCE\">ONCE</option>"
            //     + "<option id=\"Daily\" value=\"DAILY\">Every Day</option>"
            //     + "<option id=\"Weekly\" value=\"WEEKLY\">Every Week</option>";
            // newScheduleEnabled.innerHTML =
            //     +"<option selected=\"\" value=\"undefined\">Choose to Enable Schedule...</option>"
            //     + "<option id=\"Enabled\" value=\"1\">Enabled</option>"
            //     + "<option id=\"Disabled\" value=\"0\">Disabled</option>";

            // newScheduleStartDate.value = "";
            // newScheduleStartTime.value = "";
            // newScheduleEndDate.value = "";
            // newScheduleEndTime.value = "";




            // set title
            var toastTitle = "WARNING!";
            //Set Message
            var toastMessage = "Ensure That All Parameters are filled in and ensure the date is set to " + date + ", or later. \n Ensure the name of the Schedule is 45 Characters or LESS";

            //set objects
            var toastPopupVAR = "modalCreateSchToastAlert";

            var toastTitleV = "toastTitleModalSch";
            var toastMsgV = "toastMessageModalSch";
            var toastDelayTime = 10000;

            showToastMessage(toastPopupVAR, toastTitleV, toastMsgV, toastMessage, toastTitle, toastDelayTime);


        }
    }
    else {
        // var newScheduleName = document.getElementById("newScheduleName");
        // var newScheduleFrequency = document.getElementById("selectScheduleFrequency");
        // var newScheduleEnabled = document.getElementById("selectScheduleEnabler");
        // var newScheduleStartDate = document.getElementById("nStartDate");
        // var newScheduleStartTime = document.getElementById("StartTime");
        // var newScheduleEndDate = document.getElementById("EndDate");
        // var newScheduleEndTime = document.getElementById("EndTime");

        // newScheduleName.value = "";
        // newScheduleFrequency.reset;
        // newScheduleFrequency.innerHTML =
        //     +"<option selected=\"\" value=\"undefined\">Choose Schedule Frequency...</option>"
        //     + "<option id=\"Once\" value=\"ONCE\">ONCE</option>"
        //     + "<option id=\"Daily\" value=\"DAILY\">Every Day</option>"
        //     + "<option id=\"Weekly\" value=\"WEEKLY\">Every Week</option>";
        // newScheduleEnabled.innerHTML =
        //     +"<option selected=\"\" value=\"undefined\">Choose to Enable Schedule...</option>"
        //     + "<option id=\"Enabled\" value=\"1\">Enabled</option>"
        //     + "<option id=\"Disabled\" value=\"0\">Disabled</option>";

        // newScheduleStartDate.value = "";
        // newScheduleStartTime.value = "";
        // newScheduleEndDate.value = "";
        // newScheduleEndTime.value = "";




        // set title
        var toastTitle = "WARNING!";
        //Set Message
        var toastMessage = "Ensure That All Parameters are filled in and ensure the date is set to " + date + ", or later. \n Ensure the name of the Schedule is 45 Characters or LESS";

        //set objects
        var toastPopupVAR = "modalCreateSchToastAlert";

        var toastTitleV = "toastTitleModalSch";
        var toastMsgV = "toastMessageModalSch";
        var toastDelayTime = 10000;

        showToastMessage(toastPopupVAR, toastTitleV, toastMsgV, toastMessage, toastTitle, toastDelayTime);


    }
}

function completeScheduleUpdate() {
    if (receiveUpdateScheduleListReq.readyState == 4 && updateScheduleUserlogReq.readyState == 4 && receiveEditScheduleListReq.readyState == 4) {
        // loadActiveSchedules();

        var siteTxtData = "";

        var dbMaintData = JSON.parse(showErrorMain(receiveEditScheduleListReq.responseText, "Error Found"));


        if ((Object.entries(dbMaintData['queryresult']).length != 0)) {

            var scheduleDetails = dbMaintData['queryresult'];



            var scheduleNameEdit = document.getElementById("editScheduleName");
            var startTimeEdit = document.getElementById("editStartTime");
            var startDateEdit = document.getElementById("editStartDate");
            var endDateEdit = document.getElementById("editEndDate");
            // var endDateDiv = document.getElementById("ScheduleEndDate");
            var endTimeEdit = document.getElementById("editEndTime");
            var radioEditOnce = document.getElementById("radioEditOnce");
            var radioEditDaily = document.getElementById("radioEditDaily");
            var radioEditWeekly = document.getElementById("radioEditWeekly");
            var radioEditDisable = document.getElementById("radioEditDisable");
            var radioEditEnable = document.getElementById("radioEditEnable");

            var filData = "<option selected=\"\" value=\"undefined\">Choose Schedule...</option>"

            siteTxtData += filData;

            for (var iAlarm = 0; iAlarm < scheduleDetails.length; iAlarm++) {
                var rowData = scheduleDetails[iAlarm];

                filData = "<option  value=\"" + rowData['id'] + "\">" + rowData['schedulename'] + "</option>";

                siteTxtData += filData;

            }


            scheduleNameEdit.value = "";
            scheduleNameEdit.setAttribute("placeholder", "");
            startTimeEdit.value = "";
            //endDateDiv.hidden = true;
            startDateEdit.value = "";
            endDateEdit.value = "";
            endTimeEdit.value = "";
            radioEditOnce.checked = false;
            radioEditDaily.checked = false;
            radioEditWeekly.checked = false;
            radioEditDisable.checked = false;
            radioEditEnable.checked = false;
            document.getElementById("selectEditSchedule").innerHTML = siteTxtData;
            // document.getElementById("selectEditScheduleDIV").hidden = false;


            //set time 
            var toastDelayTime = 10000;
            // set title
            var toastTitle = "COMPLETE!";
            //Set Message
            var toastMessage = "Schedule Update Request Completed";

            //set objects

            var toastPopupVAR = "modalEditSchToastAlert";

            var toastTitleV = "toastTitleModalEditSch";
            var toastMsgV = "toastMessageModalEditSch";
            var toastDelayTime = 10000;

            showToastMessage(toastPopupVAR, toastTitleV, toastMsgV, toastMessage, toastTitle, toastDelayTime);
        }

    }

}
function completeScheduleCreation() {
    if (createScheduleReq.readyState == 4 && createScheduleUserlogReq.readyState == 4) {
        var radioOnce = document.getElementById("radioOnce");
        var radioDaily = document.getElementById("radioDaily");
        var radioWeekly = document.getElementById("radioWeekly");
        var endDateDiv = document.getElementById("ScheduleEndDate");
        var enableEndDateRadio = document.getElementById("enableEndDateRadio");
        var disableEndDateRadio = document.getElementById("disableEndDateRadio");
        var radioEnable = document.getElementById("radioEnable");
        var radioDisable = document.getElementById("radioDisable");

        var newScheduleName = document.getElementById("newScheduleName").value;



        var newScheduleEndDate = document.getElementById("EndDate");
        var newScheduleStartDate = document.getElementById("nStartDate");
        var newScheduleStartTime = document.getElementById("StartTime");
        var newScheduleEndTime = document.getElementById("EndTime");



        radioOnce.checked = false;
        radioDaily.checked = false;
        radioWeekly.checked = false;
        endDateDiv.hidden = true;
        enableEndDateRadio.checked = false;
        disableEndDateRadio.checked = false;
        radioEnable.checked = false;
        radioDisable.checked = false;

        newScheduleName.value = "";



        newScheduleEndDate.value = "";
        // newScheduleStartDate.value = "";
        newScheduleStartTime.value = "";
        newScheduleEndTime.value = "";



        loadActiveSchedules();

        //set time 
        var toastDelayTime = 10000;
        // set title
        var toastTitle = "COMPLETE!";
        //Set Message
        var toastMessage = "Schedule Creation Request Completed";

        //set objects
        // var toastPopup = document.getElementById("mainPageToastAlert");
        // var toastTITLEObj = document.getElementById("toastTitle");
        // var toastMSGObj = document.getElementById("toastMessage");


        // run toast 
        var toastPopupVAR = "modalEditSchToastAlert";

        var toastTitleV = "toastTitleModalEditSch";
        var toastMsgV = "toastMessageModalEditSch";

        showToastMessage(toastPopupVAR, toastTitleV, toastMsgV, toastMessage, toastTitle, toastDelayTime);



    }

}

function retrieveAllHostsForMaintenance() {

    var selectedSite = document.getElementById("selectSite").value;

    query = "SELECT InovoMonitor.tblHosts.id as hostid, "
        + "InovoMonitor.tblHosts.siteid, "
        + "InovoMonitor.tblSites.sitename "
        + "FROM InovoMonitor.tblHosts "
        + "INNER JOIN InovoMonitor.tblAgent on InovoMonitor.tblHosts.agentid = InovoMonitor.tblAgent.id "
        + "INNER JOIN InovoMonitor.tblSites on InovoMonitor.tblHosts.siteid = InovoMonitor.tblSites.id "
        + "WHERE InovoMonitor.tblHosts.siteid =" + selectedSite + " and enabled=1 "
        + "ORDER BY InovoMonitor.tblHosts.hostname asc;";


    receiveAllHostsReq.open("POST", serverURL + "/MonitorData", true);
    //Set the function that will be called when the XmlHttpRequest objects state changes.		
    receiveAllHostsReq.onreadystatechange = createAllHostsMaintenance;
    receiveAllHostsReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    receiveAllHostsReq.send("action=runopenquery&query=" + query);

}


function createAllHostsMaintenance() {

    if (receiveAllHostsReq.readyState == 4) {

        query = createAllHostQuery();


        //document.getElementById("selectSource").disabled = false;
        createMaintenanceScheduleReq.open("POST", serverURL + "/MonitorData", true);
        //Set the function that will be called when the XmlHttpRequest objects state changes.		
        createMaintenanceScheduleReq.onreadystatechange = logUserHostMaintainDetails;
        createMaintenanceScheduleReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        createMaintenanceScheduleReq.send("action=runopenquery&query=" + query);
    }

}

function createAllHostQuery() {
    // var intialSMQuery = "INSERT INTO inovomonitor.tblusersitemap (userid, siteid, enabled, updated)  VALUES ";
    var intialQuery = "INSERT INTO InovoMonitor.tblHostMaintenance (siteid, hostid, source, metric, metricvalue, scheduleid)  VALUES";
    var clauseQuery = "", queryValue, finalQuery;
    var allHostArr = [];

    var scheduleId = document.getElementById("selectSchedule").value;
    var selectedSite = document.getElementById("selectSite").value;
    // var selectedHost = document.getElementById("selectAgent").value;
    // var selectedAgent = document.getElementById("selectAgent").value;
    var selectedService = "";// document.getElementById("selectService").value;
    var selectedSource = "";//document.getElementById("selectSource").value;
    var metricvalue = "Running";

    // ---------------------------------------------------------------------------
    // set query
    // ---------------------------------------------------------------------------


    if (receiveAllHostsReq.readyState == 4) {

        var dbData = JSON.parse(showErrorMain(receiveAllHostsReq.responseText, "Error Found"));

        if (Object.entries(dbData).length != 0) {
            var hostDetails = dbData['queryresult'];


            for (var iAlarm = 0; iAlarm < hostDetails.length; iAlarm++) {
                var selectedHost = hostDetails[iAlarm]['id'];
                // queryValue = "(" + selectedSite + "," + selectedHost + ", '" + selectedSource + "','" + selectedService + "','" + metricvalue + "'," + scheduleId == undefinded ? 0 : scheduleId + ")";
                queryValue = "(" + selectedSite + "," + selectedHost + ", '" + selectedSource + "','" + selectedService + "','" + metricvalue + "'," + scheduleId + ")";
                allHostArr.push(queryValue);

            }

            if (allHostArr.length >= 2) {
                var n = 0;
                for (i = 0; i < allHostArr.length - 1; i++) {
                    n++;
                    clauseQuery += allHostArr[i] + " , ";
                }

                clauseQuery += allHostArr[n];

            }
            else if (allHostArr.length == 1) {
                clauseQuery += clauseQuery[0];
            }
            else {
                clauseQuery += "No Clause";
            }




            if (clauseQuery.indexOf("No Clause") == -1) {
                finalQuery = intialQuery + clauseQuery;
            } else {

                finalQuery = "false";
            }

            return finalQuery
        }
    }

}

function createHostMaintenanceSchedule() {
    // var displaySchedule = document.getElementById("selectScheduleDisplay");

    var scheduleId = document.getElementById("selectSchedule").value;
    var selectedSite = document.getElementById("selectSite").value;
    var selectedHost = document.getElementById("selectAgent").value;
    var sHost = document.getElementById("selectHost").value;
    // var selectedAgent = document.getElementById("selectAgent").value;
    var selectedService = document.getElementById("selectService").value;
    var selectedSource = document.getElementById("selectSource").value;
    var metricvalue = document.getElementById("selectMetricValue").value;

    dateNow = new Date();
    dateNow = dateNow.getFullYear() + '-' +
        ('00' + (dateNow.getMonth() + 1)).slice(-2) + '-' +
        ('00' + dateNow.getDate()).slice(-2) + ' ' +
        ('00' + dateNow.getHours()).slice(-2) + ':' +
        ('00' + dateNow.getMinutes()).slice(-2) + ':' +
        ('00' + dateNow.getSeconds()).slice(-2);
    // var metricvalue = "Running";

    var scheduleSelectedEndTime;

    if (receiveScheduleListReq.readyState == 4 && (scheduleId != undefined || scheduleId != "undefined")) {
        var dbData = JSON.parse(showErrorMain(receiveScheduleListReq.responseText, "Error Found"));

        if (Object.entries(dbData).length != 0) {
            var hostMSDetails = dbData['queryresult'];


            for (var iAlarm = 0; iAlarm < hostMSDetails.length; iAlarm++) {
                var rowData = hostMSDetails[iAlarm];

                if (rowData['id'] == scheduleId) {

                    scheduleSelectedEndTime = rowData['enddatetime'];
                }
            }
        }
    }
    else {

        //set time 
        var toastDelayTime = 10000;
        // set title
        var toastTitle = "ERROR!";
        //Set Message
        var toastMessage = "Please ensure the Site, Host and Schedule are selected before submitting to create a maintenance schedule.";

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


    if (scheduleSelectedEndTime >= dateNow || scheduleSelectedEndTime == "") {

        if ((sHost == "allHosts")) {
            retrieveAllHostsForMaintenance();
        }
        else {
            if ((scheduleId != undefined && scheduleId != "undefined" && scheduleId != null) && (selectedSite != undefined || selectedSite != "undefined") && (selectedHost != undefined && selectedHost != "undefined")) {

                //when source and service are not selected
                if ((selectedSource == undefined || selectedSource == "undefined") && (selectedService == undefined || selectedService == "undefined")) {

                    selectedService = "";
                    selectedSource = "";
                    metricvalue = "";
                    var query = "INSERT INTO InovoMonitor.tblHostMaintenance (siteid, hostid, source, metric, metricvalue, scheduleid)  VALUES "
                        + "(" + selectedSite + "," + selectedHost + ", '" + selectedSource + "','" + selectedService + "','" + metricvalue + "'," + scheduleId + ")";

                    //document.getElementById("selectSource").disabled = false;
                    createMaintenanceScheduleReq.open("POST", serverURL + "/MonitorData", true);
                    //Set the function that will be called when the XmlHttpRequest objects state changes.		
                    createMaintenanceScheduleReq.onreadystatechange = logUserHostMaintainDetails;
                    createMaintenanceScheduleReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');


                    createMaintenanceScheduleReq.send("action=runopenquery&query=" + query);
                }
                else if ((selectedSource != undefined && selectedSource != "undefined") && (selectedService == undefined || selectedService == "undefined")) {

                    selectedService = "";
                    // selectedSource = "";
                    metricvalue = "";
                    var query = "INSERT INTO InovoMonitor.tblHostMaintenance (siteid, hostid, source, metric, metricvalue, scheduleid)  VALUES "
                        + "(" + selectedSite + "," + selectedHost + ", '" + selectedSource + "','" + selectedService + "','" + metricvalue + "'," + scheduleId + ")";

                    //document.getElementById("selectSource").disabled = false;
                    createMaintenanceScheduleReq.open("POST", serverURL + "/MonitorData", true);
                    //Set the function that will be called when the XmlHttpRequest objects state changes.		
                    createMaintenanceScheduleReq.onreadystatechange = logUserHostMaintainDetails;
                    createMaintenanceScheduleReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');


                    createMaintenanceScheduleReq.send("action=runopenquery&query=" + query);
                }
                else if ((selectedSource != undefined && selectedSource != "undefined") && (selectedService != undefined && selectedService != "undefined") && (metricvalue == undefined || metricvalue == "undefined")) {

                    //     selectedService = "";
                    //    // selectedSource = "";
                    //     metricvalue = "";
                    //     var query = "INSERT INTO InovoMonitor.tblHostMaintenance (siteid, hostid, source, metric, metricvalue, scheduleid)  VALUES "
                    //         + "(" + selectedSite + "," + selectedHost + ", '" + selectedSource + "','" + selectedService + "','" + metricvalue + "'," + scheduleId + ")";

                    //     //document.getElementById("selectSource").disabled = false;
                    //     createMaintenanceScheduleReq.open("POST", serverURL + "/MonitorData", true);
                    //     //Set the function that will be called when the XmlHttpRequest objects state changes.		
                    //     createMaintenanceScheduleReq.onreadystatechange = logUserHostMaintainDetails;
                    //     createMaintenanceScheduleReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');


                    //     createMaintenanceScheduleReq.send("action=runopenquery&query=" + query);

                    //set time 
                    var toastDelayTime = 10000;
                    // set title
                    var toastTitle = "ERROR!";
                    //Set Message
                    var toastMessage = "Please ensure that Metric Value is selected WHEN a Service is SELECTED before submitting to create a maintenance schedule.";

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
                else {
                    var query = "INSERT INTO InovoMonitor.tblHostMaintenance (siteid, hostid, source, metric, metricvalue, scheduleid)  VALUES "
                        + "(" + selectedSite + "," + selectedHost + ", '" + selectedSource + "','" + selectedService + "','" + metricvalue + "'," + scheduleId + ")";
                    // document.getElementById("selectSource").disabled = false;
                    createMaintenanceScheduleReq.open("POST", serverURL + "/MonitorData", true);
                    //Set the function that will be called when the XmlHttpRequest objects state changes.		
                    createMaintenanceScheduleReq.onreadystatechange = logUserHostMaintainDetails;
                    createMaintenanceScheduleReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                    createMaintenanceScheduleReq.send("action=runopenquery&query=" + query);
                }

            }
            else if ((scheduleId != undefined && scheduleId != "undefined" && scheduleId != null) && (selectedSite != undefined && selectedSite != "undefined")) {

                if ((selectedSource == undefined || selectedSource == "undefined") && (selectedService == undefined && selectedService == "undefined") && (selectedHost == undefined || selectedHost == "undefined")) {

                    selectedService = "";
                    selectedSource = "";
                    selectedHost = "";
                    var query = "INSERT INTO InovoMonitor.tblHostMaintenance (siteid, hostid, source, metric, metricvalue, scheduleid)  VALUES "
                        + "(" + selectedSite + "," + selectedHost + ", '" + selectedSource + "','" + selectedService + "','" + metricvalue + "'," + scheduleId + ")";



                    //document.getElementById("selectSource").disabled = false;
                    createMaintenanceScheduleReq.open("POST", serverURL + "/MonitorData", true);
                    //Set the function that will be called when the XmlHttpRequest objects state changes.		
                    createMaintenanceScheduleReq.onreadystatechange = logUserHostMaintainDetails;
                    createMaintenanceScheduleReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');


                    createMaintenanceScheduleReq.send("action=runopenquery&query=" + query);
                }
                else {
                    var query = "INSERT INTO InovoMonitor.tblHostMaintenance (siteid, hostid, source, metric, metricvalue, scheduleid)  VALUES "
                        + "(" + selectedSite + "," + selectedHost + ", '" + selectedSource + "','" + selectedService + "','" + metricvalue + "'," + scheduleId + ")";
                    // document.getElementById("selectSource").disabled = false;
                    createMaintenanceScheduleReq.open("POST", serverURL + "/MonitorData", true);
                    //Set the function that will be called when the XmlHttpRequest objects state changes.		
                    createMaintenanceScheduleReq.onreadystatechange = logUserHostMaintainDetails;
                    createMaintenanceScheduleReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                    createMaintenanceScheduleReq.send("action=runopenquery&query=" + query);
                }

            }
            else {

                //set time 
                var toastDelayTime = 10000;
                // set title
                var toastTitle = "ERROR!";
                //Set Message
                var toastMessage = "Please ensure the Site, Host and Schedule are selected before submitting to create a maintenance schedule.";

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
        }
    } else {

        //set time 
        var toastDelayTime = 10000;
        // set title
        var toastTitle = "ERROR!";
        //Set Message
        var toastMessage = "Please ensure the Site, Host and Schedule are selected before submitting to create a maintenance schedule.";

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
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//  LOG USER FOR SCHEDULE not MAINTENANCE
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------


function logUserScheduleCreateDetails() {
    if (createScheduleReq.readyState == 4) {

        var dbData = JSON.parse(showErrorCreate(userManagementProfileReq.responseText, "Error Found"));
        var userDetails = dbData['queryresult'];


        var userProfileData = JSON.parse(showErrorCreate(userProfilereq.responseText, "Error Found"));
        var userProfile = userProfileData['UserInfo'];

        if ((Object.entries(dbData).length != 0) && (Object.entries(userProfileData).length != 0)) {
            var newScheduleName = document.getElementById("newScheduleName").value;


            var radioOnce = document.getElementById("radioOnce");
            var radioDaily = document.getElementById("radioDaily");
            var radioWeekly = document.getElementById("radioWeekly");
            var radioEnable = document.getElementById("radioEnable");
            var radioDisable = document.getElementById("radioDisable");

            var newScheduleName = document.getElementById("newScheduleName").value;



            // frequency
            if (radioOnce.checked == true) {
                var newScheduleFrequency = radioOnce.value;
            } else if (radioDaily.checked == true) {

                var newScheduleFrequency = radioDaily.value;
            } else if (radioWeekly.checked == true) {

                var newScheduleFrequency = radioWeekly.value;
            }

            if (radioEnable.checked == true) {
                var newScheduleEnabled = radioEnable.value;
            } else if (radioDisable.checked == true) {
                var newScheduleEnabled = radioDisable.value;
            }


            var newScheduleStartDate = document.getElementById("nStartDate").value;
            var newScheduleStartTime = document.getElementById("StartTime").value;
            var newScheduleEndDate = document.getElementById("EndDate").value;
            var newScheduleEndTime = document.getElementById("EndTime").value;

            var newStartDateTime = newScheduleStartDate + " " + newScheduleStartTime;
            var newEndDateTime = newScheduleEndDate + " " + newScheduleEndTime;

            loadActiveSchedules();

            var currentUser;
            var userProfileID = "";
            var dateNow;

            // var remoteVodaEXT = "?remotehost=https://41.0.203.210:8443/InovoCentralMonitorClient/MonitorData&action=runopenquery&query=";


            var newUserId;

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
            var updateReason = createReasonUserLogForSchedule(newScheduleName, newScheduleFrequency, newScheduleEnabled, newStartDateTime, newEndDateTime);
            // var query = "SELECT * FROM InovoMonitor.tblAlarms;"

            dateNow = new Date();
            dateNow = dateNow.getFullYear() + '-' +
                ('00' + (dateNow.getMonth() + 1)).slice(-2) + '-' +
                ('00' + dateNow.getDate()).slice(-2) + ' ' +
                ('00' + dateNow.getHours()).slice(-2) + ':' +
                ('00' + dateNow.getMinutes()).slice(-2) + ':' +
                ('00' + dateNow.getSeconds()).slice(-2);

            var insertLogquery = "INSERT INTO InovoMonitor.tblUserLog (userid, reason, datecreated, createdby)  VALUES ('" + userProfileID + "','" + String(updateReason) + "', '" + dateNow + "','" + currentUser + "');";

            createScheduleUserlogReq.open("POST", serverURL + "/MonitorData", true);
            createScheduleUserlogReq.onreadystatechange = completeScheduleCreation;
            createScheduleUserlogReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            createScheduleUserlogReq.send("action=runopenquery&query=" + insertLogquery);
        }
    }

}

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//  LOG USER FOR MAINTENANCE not schedule
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------


function logUserHostMaintainDetails() {
    if (createMaintenanceScheduleReq.readyState == 4) {

        var createMaintenanceScheduleReqdbData = JSON.parse(showErrorCreate(createMaintenanceScheduleReq.responseText, "Error Found"));

        if (Object.entries(createMaintenanceScheduleReqdbData).length != 0) {



            var scheduleId = document.getAttribute("selectSchedule").value;
            var selectedSite = document.getElementById("selectSite").value;
            var selectedHost = document.getElementById("selectAgent").value;

            // var selectedAgent = document.getElementById("selectAgent").value;
            var selectedService = document.getElementById("selectService").value;
            var selectedSource = document.getElementById("selectSource").value;


            var currentUser;
            var userProfileID = "";
            var dateNow;

            // var remoteVodaEXT = "?remotehost=https://41.0.203.210:8443/InovoCentralMonitorClient/MonitorData&action=runopenquery&query=";


            var newUserId;

            var dbData = JSON.parse(showErrorMain(userManagementProfileReq.responseText, "Error Found"));


            var userProfileData = JSON.parse(showErrorMain(userProfilereq.responseText, "Error Found"));
            if ((Object.entries(dbData).length != 0) && (Object.entries(userProfileData).length != 0)) {
                var userDetails = dbData['queryresult'];
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
                var updateReason = createUserLogReasonForHostMaintenance(scheduleId, selectedSite, selectedHost, selectedService, selectedSource);
                // var query = "SELECT * FROM InovoMonitor.tblAlarms;"

                dateNow = new Date();
                dateNow = dateNow.getFullYear() + '-' +
                    ('00' + (dateNow.getMonth() + 1)).slice(-2) + '-' +
                    ('00' + dateNow.getDate()).slice(-2) + ' ' +
                    ('00' + dateNow.getHours()).slice(-2) + ':' +
                    ('00' + dateNow.getMinutes()).slice(-2) + ':' +
                    ('00' + dateNow.getSeconds()).slice(-2);

                var insertLogquery = "INSERT INTO InovoMonitor.tblUserLog (userid, reason, datecreated, createdby)  VALUES ('" + userProfileID + "','" + String(updateReason) + "', '" + dateNow + "','" + currentUser + "');";



                createHMUserlogReq.open("POST", serverURL + "/MonitorData", true);
                createHMUserlogReq.onreadystatechange = completeHostMaintain;
                createHMUserlogReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                createHMUserlogReq.send("action=runopenquery&query=" + insertLogquery);
            }


        }
    }
    else {
        //set variables 
        var newScheduleName = document.getElementById("selectScheduleDisplay").value;
        var selectedSite = document.getElementById("selectSite").value;
        var selectedHost = document.getElementById("selectAgent").value;

        //set time 
        var toastDelayTime = 10000;
        // set title
        var toastTitle = "ERROR!HOST MAINTENANCE SCHEDULE CREATION COMPLETE!";
        //Set Message
        var toastMessage = "FAILED to set the Schedule:  " + newScheduleName + ", for the Site: " + selectedSite + ", Host: " + selectedHost + ". Please Contact Inovo for assistance. ";

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


}


function completeHostMaintain() {
    if (createMaintenanceScheduleReq.readyState == 4 && createHMUserlogReq.readyState == 4) {

        //set variables 
        var newScheduleName = document.getElementById("selectScheduleDisplay").value;
        var selectedSite = document.getElementById("selectSite").value;
        var selectedHost = document.getElementById("selectAgent").value;

        //set time 
        var toastDelayTime = 10000;
        // set title
        var toastTitle = "HOST MAINTENANCE SCHEDULE CREATION COMPLETE!";
        //Set Message
        var toastMessage = " The Schedule:  " + newScheduleName + ", has been set for the Site: " + selectedSite + ", Host: " + selectedHost + " ";

        //set objects
        var toastPopup = document.getElementById("mainPageToastAlert");
        var toastTITLEObj = document.getElementById("toastTitle");
        var toastMSGObj = document.getElementById("toastMessage");


        // run toast 
        toastPopup.setAttribute("data-delay", toastDelayTime);
        toastTITLEObj.innerHTML = toastTitle;
        toastMSGObj.innerHTML = toastMessage;
        $(function () { $('#mainPageToastAlert').toast('show'); });

        resetHostMaintenanceScheduler();

        loadActiveSchedules();
        loadCurrentHostMaintenance();

    }
}




// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------
//                                            INSERT INTO USER LOGS
// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------
function createUserLogReasonForHostMaintenance(scheduleId, selectedSite, selectedHost, selectedService, selectedSource) {
    var currentUserProfile;

    if (userProfilereq.readyState == 4) {
        var userProfileData = JSON.parse(showErrorMain(userProfilereq.responseText, "Error Found"));

        if (Object.entries(userProfileData).length != 0) {
            currentUserProfile = userProfileData['UserInfo'];
            var setChosenScheduleId = ""

            var setSelectedSite = "";
            var setSelectedHost = "";
            var setSelectedService = "";
            var setSelectedSource = "";

            var loggedInUser = currentUserProfile['userLogin'];

            var setReason = "User: " + loggedInUser + ", created a HOST MAINTENANCE SCHEDULE with the following details: ";


            // setting reason

            setChosenScheduleId = "Schedule ID : " + scheduleId + "";
            setSelectedSite = "Site: " + selectedSite + "";
            setSelectedHost = "Host: " + selectedHost + "";



            if (selectedService != "" && selectedService != undefined) {
                setSelectedService = "Service:  " + selectedService + "";
            }
            if (selectedSource != "" && selectedSource != undefined) {
                setSelectedSource = "Source: " + selectedSource + "";
            }
            // selectedUserID = "InovoMonitor.tblUsers.ID=" + selectUserID;



            var finalReason;
            // var intialQuery = "SELECT InovoMonitor.tblSites.sitename, InovoMonitor.tblAlarms.hostid, InovoMonitor.tblAlarms.id, InovoMonitor.tblHosts.hostName, InovoMonitor.tblAlarms.description, InovoMonitor.tblAlarms.severity, InovoMonitor.tblAlarms.Message, InovoMonitor.tblAlarms.currentstatus, InovoMonitor.tblAlarms.source, InovoMonitor.tblAlarms.category, InovoMonitor.tblAlarms.created, InovoMonitor.tblAlarms.updated, InovoMonitor.tblAlarms.updatedby FROM InovoMonitor.tblAlarms INNER JOIN InovoMonitor.tblHosts ON InovoMonitor.tblAlarms.hostid = InovoMonitor.tblHosts.id INNER JOIN InovoMonitor.tblSites ON InovoMonitor.tblSites.id = InovoMonitor.tblHosts.siteid ";
            //  var intialQuery = "UPDATE InovoMonitor.tblUsers SET ";
            //  + setNewUserName + ", " + setNewUserSurname + ", " + setNewUserPass + ", " + setNewUserActive + " , " + setNewUserAccess + " WHERE " + +";"

            var clauseQuery = "";
            var queryArr = [];

            queryArr.push(setChosenScheduleId);
            queryArr.push(setSelectedSite);
            queryArr.push(setSelectedHost);



            if (setSelectedService != "") {
                queryArr.push(setSelectedService);
            }

            if (setSelectedSource != "") {
                queryArr.push(setSelectedSource);
            }



            if (queryArr.length >= 2) {
                var n = 0;
                for (i = 0; i < queryArr.length - 1; i++) {
                    n++;
                    clauseQuery += queryArr[i] + ", ";
                }

                clauseQuery += queryArr[n];

            }
            else if (queryArr.length == 1) {
                clauseQuery += queryArr[0];
            }

            finalReason = setReason + clauseQuery;



            return finalReason;
        }
    }
}


// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------
//                                            INSERT INTO USER LOGS
// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------
function createReasonUserLogForSchedule(newScheduleName, newScheduleFrequency, newScheduleEnabled, newStartDateTime, newEndDateTime) {
    var currentUserProfile;


    if (userProfilereq.readyState == 4) {
        var userProfileData = JSON.parse(showErrorMain(userProfilereq.responseText, "Error Found"));

        if (Object.entries(userProfileData).length != 0) {


            currentUserProfile = userProfileData['UserInfo'];


            var setNewScheduleName = "";
            var setNewScheduleFrequency = "";
            var setNewScheduleEnabled = "";
            var setNewStartDateTime = "";
            var setNewEndDateTime = "";
            //var selectedUserID = "";

            var loggedInUser = currentUserProfile['userLogin'];

            var setReason = "User: " + loggedInUser + ", set the SCHEDULE TEMPLATE  with the following details: ";


            // setting reason

            setNewScheduleName = "ScheduleName: " + newScheduleName + "";


            setNewScheduleFrequency = "newScheduleFrequency: " + newScheduleFrequency + "";

            setNewScheduleEnabled = "newScheduleEnabled: " + newScheduleEnabled + "";


            setNewStartDateTime = "new Start DateTime: " + newStartDateTime + "";


            setNewEndDateTime = "newEndDateTime:  " + newEndDateTime + "";


            var finalReason;
            // var intialQuery = "SELECT InovoMonitor.tblSites.sitename, InovoMonitor.tblAlarms.hostid, InovoMonitor.tblAlarms.id, InovoMonitor.tblHosts.hostName, InovoMonitor.tblAlarms.description, InovoMonitor.tblAlarms.severity, InovoMonitor.tblAlarms.Message, InovoMonitor.tblAlarms.currentstatus, InovoMonitor.tblAlarms.source, InovoMonitor.tblAlarms.category, InovoMonitor.tblAlarms.created, InovoMonitor.tblAlarms.updated, InovoMonitor.tblAlarms.updatedby FROM InovoMonitor.tblAlarms INNER JOIN InovoMonitor.tblHosts ON InovoMonitor.tblAlarms.hostid = InovoMonitor.tblHosts.id INNER JOIN InovoMonitor.tblSites ON InovoMonitor.tblSites.id = InovoMonitor.tblHosts.siteid ";
            //  var intialQuery = "UPDATE InovoMonitor.tblUsers SET ";
            //  + setNewUserName + ", " + setNewUserSurname + ", " + setNewUserPass + ", " + setNewUserActive + " , " + setNewUserAccess + " WHERE " + +";"

            var clauseQuery = "";
            var queryArr = [];

            queryArr.push(setNewScheduleName);
            queryArr.push(setNewScheduleFrequency);
            queryArr.push(setNewScheduleEnabled);
            queryArr.push(setNewStartDateTime);
            queryArr.push(setNewEndDateTime);


            if (queryArr.length >= 2) {
                var n = 0;
                for (i = 0; i < queryArr.length - 1; i++) {
                    n++;
                    clauseQuery += queryArr[i] + ", ";
                }

                clauseQuery += queryArr[n];

            }

            finalReason = setReason + clauseQuery;


            return finalReason;
        }
    }
}



function getXmlHttpRequestObject() {  //Gets the browser specific XmlHttpRequest Object
	if (window.XMLHttpRequest) {
		return new XMLHttpRequest(); 	//Not IE
	} else if (window.ActiveXObject) {
		return new ActiveXObject("Microsoft.XMLHTTP"); //IE
	} else {
		alert("Your browser doesn't want to use AJAX"); //Displays error message
	}
}

var userManagementProfileReq = getXmlHttpRequestObject();
var userRelogProfileReq = getXmlHttpRequestObject();
var userProfilereq = getXmlHttpRequestObject();
var userLogReq = getXmlHttpRequestObject();
var createUserlogReq = getXmlHttpRequestObject();

var receiveReq = getXmlHttpRequestObject();
var receiveSitesReq = getXmlHttpRequestObject();
var serverURL = "http://102.164.81.12:7080/InovoCentralMonitorClient";
//var serverURL = "https://41.0.203.210:8443/InovoCentralMonitorClient";
// var serverURL = "/InovoCentralMonitorClient";


function getSites() {
var query = "SELECT InovoMonitor.tblSites.id, "
	+"InovoMonitor.tblSites.sitename "
	+"FROM InovoMonitor.tblSites "
	+"INNER JOIN InovoMonitor.tblHosts ON InovoMonitor.tblSites.id = InovoMonitor.tblHosts.siteid "
	+"WHERE  InovoMonitor.tblHosts.enabled = 1 "
	+"GROUP BY InovoMonitor.tblSites.id, InovoMonitor.tblSites.sitename "
	+"ORDER BY InovoMonitor.tblSites.sitename;";

	receiveSitesReq.open("POST", serverURL + "/MonitorData", true);
	receiveSitesReq.onreadystatechange = getSitesResult;
	receiveSitesReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');	
	receiveSitesReq.send("action=runopenquery&query=" + query);

}

function getSitesResult() {
	var siteTxtData, filData;
	if (receiveSitesReq.readyState == 4) {
		var siteData = JSON.parse(showError(receiveSitesReq.responseText, "Error Found"));

		if (Object.entries(siteData).length != 0) {
			siteProfile = siteData['queryresult'];

			filData = "<option selected=\"\" value=\"" + siteProfile[0]['id'] + "\">"+siteProfile[0]['sitename']+"</option>";
			siteTxtData += filData;
			for (i = 1; i < siteProfile.length; i++) {
				var rowData = siteProfile[i];

				filData = "<option  value=\"" + rowData['id'] + "\">" + rowData['sitename'] + "</option>";

				siteTxtData += filData;
			}
			document.getElementById("siteInfo").innerHTML = siteTxtData;

			getHosts();
		}
	}
}




function getHosts() {
	//	alert("getHosts");
	var siteId = document.getElementById("siteInfo").value;
	var query = "SELECT  "
		+ "InovoMonitor.tblHosts.hostname, "
		+ "InovoMonitor.tblHosts.hostagentversion, "
		+ "InovoMonitor.tblHosts.hostintip, "
		+ "InovoMonitor.tblHosts.hostip, "
		+ "InovoMonitor.tblHosts.id, "
		+ "InovoMonitor.tblHosts.siteid, "
		+ "InovoMonitor.tblHosts.agentid, "
		+ "InovoMonitor.tblAgent.agenttype "
		+ "FROM InovoMonitor.tblHosts "
		+ "INNER JOIN InovoMonitor.tblAgent ON InovoMonitor.tblHosts.agentid = InovoMonitor.tblAgent.id "
		+ "INNER JOIN InovoMonitor.tblSites ON InovoMonitor.tblSites.id = InovoMonitor.tblHosts.siteid  "
		+ "WHERE InovoMonitor.tblHosts.enabled = 1 AND  InovoMonitor.tblAgent.agenttype in ('ServerMonitor','OpenGateMonitor') AND InovoMonitor.tblSites.id = " + siteId + " "
		+ "ORDER BY InovoMonitor.tblHosts.hostname asc;";
	receiveReq.open("POST", serverURL + "/MonitorData", true);
	// receiveReq.open("GET", serverURL + "/ThresholdConfig?action=gethosts&agenttype=ServerMonitor,OpengateMonitor", true);
	//Set the function that will be called when the XmlHttpRequest objects state changes.
	receiveReq.onreadystatechange = getHostsResult;
	receiveReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	//Make the actual request.

	receiveReq.send("action=runopenquery&query=" + query);
}
function getHostsResult() {
	var filData = "";

	var hostTxtData = "";
	//Check to see if the XmlHttpRequests state is finished.
	if (receiveReq.readyState == 4) {
		var hostData = JSON.parse(showError(receiveReq.responseText, "Error Found"));

		if (Object.entries(hostData).length != 0) {
			var hostDetails = hostData['queryresult'];
			var agenttypeFil = hostDetails[0]['agenttype']

		if(agenttypeFil == "OpenGateMonitor"){

			filData = "<select class=\"custom-select\" onchange=\"hostselected()\" id=\"hostInfo\"><option  selected=\"\" value=\"" + hostDetails[0]['id'] + "\">" + hostDetails[0]['hostname'] +" ("+ hostDetails[0]['hostintip']+")"+" [OG]" +"</option>";
		}
		else {
			filData = "<select class=\"custom-select\" onchange=\"hostselected()\" id=\"hostInfo\"><option  selected=\"\" value=\"" + hostDetails[0]['id'] + "\">" + hostDetails[0]['hostname'] +" ("+ hostDetails[0]['hostintip']+")"+ "</option>";
		}
		hostTxtData += filData;

		for (var iAlarm = 1; iAlarm < hostDetails.length; iAlarm++) {
			var rowData = hostDetails[iAlarm];
			var agenttypeFil2 = rowData['agenttype']

			if(agenttypeFil2 == "OpenGateMonitor"){

			filData = "<option  value=\"" + rowData['id'] + "\">" + rowData['hostname'] +"("+rowData['hostintip']+")"+" [OG]" +"</option>";
			}
			else{
				filData = "<option  value=\"" + rowData['id'] + "\">" + rowData['hostname'] +" ("+rowData['hostintip']+")"+"</option>";
			}

			hostTxtData += filData;
		}

		hostTxtData += "</select>"

		document.getElementById("hosts").innerHTML = hostTxtData;

		hostselected();
		//		var jsonObj = JSON.parse(receiveReq.responseText);
		//		var jsonLastUpdate = jsonObj['lastUpdate'];
	}
}
}


function setDiskThresholds(hostid, thresholds) {
	//	alert("setDiskThresholds");
	//	alert(thresholds);
	receiveReq.open("POST", serverURL + "/ThresholdConfig", true);
	//Set the function that will be called when the XmlHttpRequest objects state changes.
	receiveReq.onreadystatechange = logUserUpdatingHostThreshold;
	receiveReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	//Make the actual request.
	receiveReq.send("action=updatediskthresholds&thresholds=" + JSON.stringify(thresholds));
}
// ----------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------
//  LOG USERS
// ----------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------

function logUserUpdatingHostThreshold() {
	if (receiveReq.readyState == 4) {

		var btnVar = document.getElementById("updateHostBTN");
		var hostUpdated = btnVar.getAttribute("onclick");
		var str = hostUpdated.replace('updateHost(', "");
		var host = str.split(',');

		var hostNumber = host[0];


		var currentUser;
		var userProfileID = "";
		var dateNow;

		// var remoteVodaEXT = "?remotehost=https://41.0.203.210:8443/InovoCentralMonitorClient/MonitorData&action=runopenquery&query=";


		var newUserId;

		var dbData = JSON.parse(userManagementProfileReq.responseText);
		var userDetails = dbData['queryresult'];


		var userProfileData = JSON.parse(userProfilereq.responseText);
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
		var updateReason = createReasonUserLog(hostNumber);

		dateNow = new Date();
		dateNow = dateNow.getFullYear() + '-' +
			('00' + (dateNow.getMonth() + 1)).slice(-2) + '-' +
			('00' + dateNow.getDate()).slice(-2) + ' ' +
			('00' + dateNow.getHours()).slice(-2) + ':' +
			('00' + dateNow.getMinutes()).slice(-2) + ':' +
			('00' + dateNow.getSeconds()).slice(-2);

		var insertLogquery = "INSERT INTO InovoMonitor.tblUserLog (userid, reason, datecreated, createdby)  VALUES ('" + userProfileID + "','" + String(updateReason) + "', '" + dateNow + "','" + currentUser + "');";

		createUserlogReq.open("POST", serverURL + "/MonitorData", true);
		createUserlogReq.onreadystatechange = setDiskThresholdsReturn;
		createUserlogReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		createUserlogReq.send("action=runopenquery&query=" + insertLogquery);
	}
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

		//set objects
		var toastPopup = document.getElementById("mainPageToastAlert");
		var toastTITLEObj = document.getElementById("toastTitle");
		var toastMSGObj = document.getElementById("toastMessage");


		// run toast 
		toastPopup.setAttribute("data-delay", toastDelayTime);
		toastTITLEObj.innerHTML = toastTitle;
		toastMSGObj.innerHTML = toastMessage;
		$(function () { $('#mainPageToastAlert').toast('show'); });
		return "{}";
	}
	return resp;
}

// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------
//                                            INSERT INTO USER LOGS
// --------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------
function createReasonUserLog(hostSelected) {
	var currentUserProfile;


	if (userProfilereq.readyState == 4) {
		var userProfileData = JSON.parse(userProfilereq.responseText);
		currentUserProfile = userProfileData['UserInfo'];
	}

	var setHostSelected = "";

	var loggedInUser = currentUserProfile['userLogin'];

	var setReason = "User: " + loggedInUser + ", made a change to a host threshold with the following details: ";


	// setting reason


	setHostSelected = "Host: " + hostSelected + "";



	var finalReason;


	finalReason = setReason + setHostSelected;


	return finalReason;
}

function setDiskThresholdsReturn() {
	if (receiveReq.readyState == 4) {
		var dbData = JSON.parse(receiveReq.responseText);
		var Details = dbData['queryresult'];
		if (Details.length == 0) {

			var btnVar = document.getElementById("updateHostBTN");
			var hostUpdated = btnVar.getAttribute("onclick");
			var str = hostUpdated.replace('updateHost(', "");
			var host = str.split(',');

			var hostNumber = host[0];

			//set time
			var toastDelayTime = 7000;
			// set title
			var toastTitle = "COMPLETE!";
			//Set Message
			var toastMessage = "Host: " + hostNumber + " has a threshold change completed successfully";

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
}
function setServiceMaintenance(hostid, maint) {
	//	alert("setDiskThresholds");
	//	alert(thresholds);
	receiveReq.open("POST", serverURL + "/ThresholdConfig", true);
	//Set the function that will be called when the XmlHttpRequest objects state changes.
	receiveReq.onreadystatechange = setServiceMaintenanceReturn;
	receiveReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	//Make the actual request.
	receiveReq.send("action=updateserivcemaintenance&maintenance=" + JSON.stringify(maint));
}
function setServiceMaintenanceReturn() {
	if (receiveReq.readyState == 4) {

	}
}
function getDiskInfo(hostid) {
	//	alert("getDiskInfo");
	document.getElementById('diskTable').innerHTML = "Waiting for threshold data to load...";
	//	document.body.style.cursor  = 'wait';
	receiveReq.open("GET", serverURL + "/ThresholdConfig?action=getdiskinfo&hostid=" + hostid, true);
	//Set the function that will be called when the XmlHttpRequest objects state changes.
	receiveReq.onreadystatechange = getDiskInfoResult;
	receiveReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	//Make the actual request.
	// 	var query = "SELECT * FROM InovoMonitor.tblAlarms t WHERE currentstatus<>'RESET'";
	receiveReq.send();
}
function getDiskInfoResult() {
	//Check to see if the XmlHttpRequests state is finished.
	if (receiveReq.readyState == 4) {
		//		document.body.style.cursor  = default';
		//Here we should have some JSON data !!
		//		alert("Disk : " + receiveReq.responseText);
		var jsonObj = JSON.parse(receiveReq.responseText);
		var diskArr = jsonObj['DiskInfo'];
		//		alert(diskArr.length);
		var hostid = "0";
		var entrycnt = 0;
		var diskOption = "<select id=\"diskid\">";
		var diskUsage = "<select id=\"diskusage\">";
		var thresTable = "<h3>Alert Thresholds for disk usage</h3><table border='1'><tr><th width=\"10%\">Device</th><th width=\"30%\">MountPoint</th><th width=\"20%\">Current %</th><th  width=\"20%\">Warning %</th><th  width=\"20%\">Critical %</th></tr>";
		var thresTable2 = "" + "<table class=\"table\"><thead style=\"background-color: rgb(255, 255, 255);\">" + "<tr><th style=\"color: rgb(0,0,0);\">Device</th>" + "<th style=\"color: rgb(0,0,0);\">MountPoint</th><th style=\"color: black;\">Current %</th><th style=\"color: black;\">Warning %</th><th style=\"color: black;\">Critical %</th></tr></thead><tbody>"
		for (var i = 0; i < diskArr.length; i++) {
			var obj = diskArr[i];
			entrycnt = i + 1;
			hostid = obj['hostid'];
			thresTable2 += "<tr><td><center>" + obj['diskdevice'] + "</center></td><td>" + obj['mountpoint'] + "</td><td><center>" + obj['persUsed'] + "</center></td><td><center><input name=\"" + obj['diskdevice'] + "\" type=\"number\" id=\"warning_" + i + "\" value=\"" + obj['threswarning'] + "\" maxlength=\"3\" size=\"2\" placeholder=\"80\"></center></td><td><center><input name=\"" + hostid + "\" type=\"number\" id=\"critical_" + i + "\" value=\"" + obj['threscritical'] + "\" maxlength=\"3\" size=\"2\"  placeholder=\"90\"></center></td></tr>";
			thresTable += "<tr><td><center>" + obj['diskdevice'] + "</center></td><td>" + obj['mountpoint'] + "</td><td><center>" + obj['persUsed'] + "</center></td><td><center><input name=\"" + obj['diskdevice'] + "\" type=\"number\" id=\"warning_" + i + "\" value=\"" + obj['threswarning'] + "\" maxlength=\"3\" size=\"2\"></center></td><td><center><input name=\"" + hostid + "\" type=\"number\" id=\"critical_" + i + "\" value=\"" + obj['threscritical'] + "\" maxlength=\"3\" size=\"2\"></center></td></tr>";
			diskOption += "<option value=\"" + obj['id'] + "\">" + obj['diskdevice'] + " (" + obj['persUsed'] + " % Used)" + "</option>";
			diskUsage += "<option value=\"" + obj['id'] + "\">" + obj['persUsed'] + "</option>";
		}
		thresTable += "<tr><td colspan='4'></td><td><button  onclick=\"updateHost(" + hostid + "," + entrycnt + ")\">Update Host</button></td></tr>";
		thresTable2 += "<tr><td colspan='4'></td><td><button id=\"updateHostBTN\" class=\"btn btn-dark\" onclick=\"updateHost(" + hostid + "," + entrycnt + ")\">Update Host</button></td></tr>";
		thresTable += "</table>";
		thresTable2 += "</tbody></table>";
		diskOption += "</select>";
		diskUsage += "</select>";

		//		alert(diskOption);
		//		document.getElementById('disks').innerHTML = diskOption;
		document.getElementById('diskTable').innerHTML = thresTable2;
		// getServiceInfo(hostid);
		//		var jsonLastUpdate = jsonObj['lastUpdate'];


	}
}
function getServiceInfo(hostid) {
	//	alert("getServiceInfo");
	document.getElementById('serviceTable').innerHTML = "Waiting for service data to load...";
	//	document.body.style.cursor  = 'wait';
	receiveReq.open("GET", serverURL + "/ThresholdConfig?action=getserviceinfo&hostid=" + hostid, true);
	//Set the function that will be called when the XmlHttpRequest objects state changes.
	receiveReq.onreadystatechange = getServiceInfoResult;
	receiveReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	//Make the actual request.
	// 	var query = "SELECT * FROM InovoMonitor.tblAlarms t WHERE currentstatus<>'RESET'";
	receiveReq.send();
}
function getServiceInfoResult() {
	if (receiveReq.readyState == 4) {
		//		document.body.style.cursor  = default';
		//Here we should have some JSON data !!
		//		alert("Service : " + receiveReq.responseText);
		var hostid = "0";
		var entrycnt = 0;
		var jsonObj = JSON.parse(receiveReq.responseText);
		var svcArr = jsonObj['ServiceInfo'];
		if (svcArr.length == 0) {
			document.getElementById('serviceTable').innerHTML = "No monitored services";
			return;
		}
		var thresTable2 = "" + "<table class=\"table\"><thead style=\"background-color: rgb(255, 255, 255);\">" + "<tr><th style=\"color: rgb(0,0,0);\">Service</th>" + "<th style=\"color: rgb(0,0,0);\">Service Display</th><th style=\"color: black;\">Status</th><th style=\"color: black;\">Ignore Service</th><th style=\"color: black;\">Start</th><th style=\"color: black;\">End</th></tr></thead><tbody>"
		for (var i = 0; i < svcArr.length; i++) {
			var obj = svcArr[i];
			entrycnt = i + 1;
			hostid = obj['hostid'];
			var checkBox = "";
			if (obj['maintId'] == '0') {
				checkBox = "<input type=\"checkbox\" id=check_" + i + " onclick=\"checkClicked(" + i + ")\" value=\"" + obj['serviceDisplayName'] + "\" name=\"" + hostid + "\">";
			} else {
				checkBox = "<input type=\"checkbox\" id=check_" + i + " onclick=\"checkClicked(" + i + ")\" value=\"" + obj['serviceDisplayName'] + "\" name=\"" + hostid + "\" checked>";
			}

			//			var startDate = "<input class=\"form-control\" id=\"startdate_" + hostid + "_" + obj['serviceName'] + "\" name=\"startdate_" + hostid + "_" + obj['serviceName'] + "\" placeholder=\"MM/DD/YYY\" type=\"text\"/>"
			//			              + "<input class=\"form-control\" id=\"starttime_" + hostid + "_" + obj['serviceName'] + "\" value=\"\" data-default=\"20:48\">";
			var startDate = "<input class=\"form-control\" value=\"" + obj['maintStart'] + "\" id=\"startdate_" + i + "\" name=\"startdate_" + i + "\" placeholder=\"yyyy-MM-dd hh:mm\" type=\"text\" onfocusout=\"checkDateTime(this)\"/>";
			var endDate = "<input class=\"form-control\" value=\"" + obj['maintEnd'] + "\" id=\"enddate_" + i + "\" name=\"enddate_" + i + "\" placeholder=\"yyyy-MM-dd hh:mm\" type=\"text\" onfocusout=\"checkDateTime(this)\"/>";

			var datetime = "<div class='input-group date' id='datetimepicker1'> <input type='text' class=\"form-control\" placeholder=\"dd/mm/yyy\" />";
			datetime += "<span class=\"input-group-addon\"> <span class=\"glyphicon glyphicon-calendar\"></span></span></div>";

			//thresTable2 += "<tr><td>" + obj['serviceName'] + "</td><td>" + obj['serviceDisplayName'] + "</td><td>" + obj['serviceStatus'] + "</td><td><center>" + checkBox + "</center></td><td><center>" + obj['maintStart'] + "</center></td><td><center>" + datetime + "</center></td></tr>";
			thresTable2 += "<tr><td>" + obj['serviceName'] + "</td><td>" + obj['serviceDisplayName'] + "</td><td>" + obj['serviceStatus'] + "</td><td><center>" + checkBox + "</center></td><td><center>" + startDate + "</center></td><td><center>" + endDate + "</center></td></tr>";

		}
		thresTable2 += "<tr><td colspan='5'></td><td><button class=\"btn btn-primary\" onclick=\"updateHostMaintenance(" + hostid + "," + entrycnt + ")\">Update Maint</button></td></tr>";
		thresTable2 += "</tbody></table>";
		//		alert(thresTable2);
		document.getElementById('serviceTable').innerHTML = thresTable2;
	}
}

function updateHost(host, entries) {
	var thresholds = { thresholds: [] };
	//	alert(host + " : " + entries);
	for (var i = 0; i < entries; i++) {
		var war = document.getElementById('warning_' + i).value;
		var cri = document.getElementById('critical_' + i).value;
		thresholds.thresholds.push({
			"dev": document.getElementById('warning_' + i).name,
			"host": document.getElementById('critical_' + i).name,
			"warning": war,
			"critical": cri
		});
		//		thresholds.critical.push({ document.getElementById('warning_'+i).name :  cri});
		//		alert('thres_'+i + ' : ' + war + '-' + cri + '-' + document.getElementById('warning_'+i).name);
	}
	setDiskThresholds(host, thresholds);
}




function updateHostMaintenance(host, entries) {
	//	alert("Update host maintenance");
	var maintenance = { maintenance: [] };
	for (var i = 0; i < entries; i++) {
		/*		if(document.getElementById('check_'+i).checked) {
					var maintStart = document.getElementById('startdate_'+i).value;
					var maintEnd = document.getElementById('enddate_'+i).value;
					var service = document.getElementById('check_'+i).value;
					maintenance.maintenance.push({ "host" : document.getElementById('check_'+i).name,
													"maintMetric" : service,
													"maintSource" : "ServiceStatus",
													"maintMetricValue" : "Stopped",
													"maintStart" : maintStart,
													"maintEnd" : maintEnd,
													});
				} */
		var maintStart = "";
		var maintEnd = "";
		if (!document.getElementById('check_' + i).checked) {
			maintStart = document.getElementById('startdate_' + i).value;
			maintEnd = document.getElementById('enddate_' + i).value;
		}
		var service = document.getElementById('check_' + i).value;
		maintenance.maintenance.push({
			"host": document.getElementById('check_' + i).name,
			"maintMetric": service,
			"maintSource": "ServiceStatus",
			"maintMetricValue": "Stopped",
			"maintStart": maintStart,
			"maintEnd": maintEnd,
		});

	}
	setServiceMaintenance(host, maintenance);
	//	alert(JSON.stringify(maintenance));
}

function hostselected() {
	//	alert("hostselected");
	d = document.getElementById("hostInfo").value;
	//get the disk info for this
	//	alert(d);
	getDiskInfo(d);
}
function getHostSelect(test) {
	//	alert("getHostSelect");
	d = document.getElementById("hostInfo").value;
	//get the disk info for this
	//	alert(d);
	getDiskInfo(d);
}

function checkDateTime(datetimefiled) {
	var datetime = datetimefiled.value;
	if (datetime.length > 0) {
		var dt = datetime.split(' ');
		if (dt.length < 2) {
			alert("The field must contain the date and time !");
			return;
		}
		//Now the date will be in dt[0] and the time in dt[1]
		//Check the date and time are both there
		var dateVal = dateValid(dt[0]);
		if (dateVal != null) {
			//Then the date is cool
			var timeVal = timeValid(dt[1]);
			if (timeVal != null) {
				datetimefiled.value = dateVal + " " + timeVal;
				return;
			}
			alert("Invalid time : " + dt[1]);
		} else {
			alert("Invalid date : " + dt[0]);
		}

	}
	//	var date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/ ;
	//	if(!(date_regex.test(datetimefiled)))
	//	{
	//		return false;
	//	}
}
function dateValid(datevar) {
	var temp = datevar.split('-');
	var d = new Date(temp[0] + '/' + temp[1] + '/' + temp[2]);
	//    return (d && (d.getMonth() + 1) == Number(temp[1]) && d.getDate() == Number(temp[2]) && d.getFullYear() == Number(temp[0]));
	if ((d && (d.getMonth() + 1) == Number(temp[1]) && d.getDate() == Number(temp[2]) && d.getFullYear() == Number(temp[0]))) {
		var retVal = d.getFullYear() + "-";
		if (temp[1].length < 2)
			retVal += "0" + temp[1] + "-";
		else
			retVal += temp[1] + "-";
		if (temp[2].length < 2)
			retVal += "0" + temp[2];
		else
			retVal += temp[2];
		return retVal;
	} else {
		return null;
	}
}
function timeValid(timevar) {
	var temp = timevar.split(':');
	if (temp.length >= 2) {
		if (temp[0].length > 0 && temp[1].length > 0) {
			if ((Number(temp[0]) >= 0 && Number(temp[0]) <= 23)
				&& (Number(temp[1]) >= 0 && Number(temp[1]) <= 59)) {
				var retVal = "";
				if (temp[0].length < 2)
					retVal = "0" + temp[0] + ":";
				else
					retVal = temp[0] + ":";
				if (temp[1].length < 2)
					retVal += "0" + temp[1];
				else
					retVal += temp[1];
				return retVal + ":00";
			}
		}
	}
	return false;
}
function getNow(offset) {
	var d = new Date();
	var n = d.getTime();

	if (offset != null)
		d = new Date(d.getTime() + offset * 60000);

	var retVal = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes();
	var dateNow = dateValid(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());
	var timeNow = timeValid(d.getHours() + ":" + d.getMinutes());
	return dateNow + " " + timeNow;
}

function checkClicked(checkpos) {
	if (document.getElementById('check_' + checkpos).checked) {
		//Lets see if there is something in the start datetime box
		if (document.getElementById('startdate_' + checkpos).value == '') {
			document.getElementById('startdate_' + checkpos).value = getNow();
			document.getElementById('enddate_' + checkpos).value = getNow(10);
		}
	} /*else {
		if(document.getElementById('startdate_'+checkpos).value != '')
			document.getElementById('startdate_'+checkpos).value = "";
	}*/
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
	var newScheduleStartDate = document.getElementById("StartDate");
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
			var hostMaintenanceSiteLink = "<a href=\"hostMaintenanceScheduler.html#&key=" + key + "\"><i class=\"fas fa-hammer\"></i> Maintenance Scheduling</a>";
			var hostManageSiteLink = "<a href=\"hostManagement.html#&key=" + key + "\"><i class=\"fas fa-server\"></i> Host Management</a>";

			var modalLogin = document.getElementById("modal-login");
			var date = new Date().toISOString().slice(0, 10);

			getSites();
			// getHosts();



			modalLogin.style.display = "none";
			document.getElementById("loginUserId").innerHTML = userlogin + "(" + userLevelDesc + ")";
			document.getElementById("homeSiteLink").innerHTML = homeSiteLink;
			document.getElementById("hostMaintenanceLink").innerHTML = hostMaintenanceSiteLink;
			document.getElementById("hostManageLink").innerHTML = hostManageSiteLink;
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

		var dbData = JSON.parse(userRelogProfileReq.responseText);
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
	//http://102.164.81.12:7080/InovoCentralMonitorClient/UserAuth?action=authenticate&username=esiwela&password=esiwela

}
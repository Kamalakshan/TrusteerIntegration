/**
* Copyright 2015 IBM Corp.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function wlCommonInit(){
	WL.App.hideSplashScreen();
	
	//Get the Trusteer Risk assessment from the client-side
	var busyInd = new WL.BusyIndicator ("content", {text: "Please wait..."});
	busyInd.show();
	WL.Trusteer.getRiskAssessment(function(items){
		//Trusteer SDK was loaded
		if(items && !jQuery.isEmptyObject(items)){
			$('#trusteerStatus').html('Trusteer SDK Loaded!');
			if(items["os.rooted"]["value"] != 0){
				$('#trusteerStatus').append('<br/> ... and it seems this device is rooted/jailbroken');
			}
			else{
				$('#trusteerStatus').append('<br/> ... and it seems this device is NOT rooted/jailbroken');
			}
		}
		busyInd.hide();
	}, function(error){
		//Trusteer SDK FAILED to load
		busyInd.hide();
	});
	
	//Registering a WLChallengeHandler
	var trusteerChallengeHandler = WL.Client.createWLChallengeHandler("wl_basicTrusteerFraudDetectionRealm");
	//Handle "block" events
	trusteerChallengeHandler.handleFailure = function(error) {            
		$('#adapterResult').append("Senstitive data could not be retrieved because: " + error.reason + "\n<br/>"); 
		busyInd.hide();
	};
	//Handle "alert" events
	trusteerChallengeHandler.processSuccess = function(identity)  {
        var alerts = identity.attributes.alerts;  //Array of alerts codes
        if(alerts.length > 0) { 
        	$('#adapterResult').append("Please note that your device is : " + alerts); 
        	$('#adapterResult').append('<br/>');
        } 
        busyInd.hide();
	};
	
	//Invoke a sensitive procedure
	$('#adapterCall').on('click', function(){
		$('#adapterResult').html('');
		busyInd.show();
		
		var resourceRequest = new WLResourceRequest(
			    "/adapters/MyAdapter/getData",
			    WLResourceRequest.GET
			);
		
		resourceRequest.send().then(
				function(result){
					$('#adapterResult').append(result.responseJSON.data);
					busyInd.hide();
				},
				function(result){
					$('#adapterResult').append(result.errorMsg);
					busyInd.hide();
				}
			);
		
	});

	
}

/*
*
    COPYRIGHT LICENSE: This information contains sample code provided in source code form. You may copy, modify, and distribute
    these sample programs in any form without payment to IBM® for the purposes of developing, using, marketing or distributing
    application programs conforming to the application programming interface for the operating platform for which the sample code is written.
    Notwithstanding anything to the contrary, IBM PROVIDES THE SAMPLE SOURCE CODE ON AN "AS IS" BASIS AND IBM DISCLAIMS ALL WARRANTIES,
    EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, ANY IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, SATISFACTORY QUALITY,
    FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND ANY WARRANTY OR CONDITION OF NON-INFRINGEMENT. IBM SHALL NOT BE LIABLE FOR ANY DIRECT,
    INDIRECT, INCIDENTAL, SPECIAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR OPERATION OF THE SAMPLE SOURCE CODE.
    IBM HAS NO OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS OR MODIFICATIONS TO THE SAMPLE SOURCE CODE.

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

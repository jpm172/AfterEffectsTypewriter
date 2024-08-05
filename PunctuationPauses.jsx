
var window = new Window("palette", "Punctuation Pauses", undefined);
window.orientation = "column";

var group = window.add("group", undefined, "");
group.orientation = "row";

var button1 = group.add("button", undefined, "Generate Keyframes");


var panel = window.add("panel", undefined, "Settings");
panel.orientation = "column";

//Create Characters/Second Slider Group
var CPSGroup = panel.add("group", undefined, "");
CPSGroup.orientation = "row";
var text = CPSGroup.add("statictext", undefined, "Characters/Second: ");

var CPSslider = CPSGroup.add("slider", undefined);
CPSslider.minvalue = 1;
CPSslider.maxvalue = 100;
CPSslider.value = 20;

var CPSsliderValueText = CPSGroup.add("edittext", undefined, "20");
CPSsliderValueText.characters = 4;

CPSsliderValueText.onChange = function() 
{
    var num =  Math.max(1, parseInt(CPSsliderValueText.text));
    CPSsliderValueText.text = num;
    CPSslider.value = num;
}

CPSslider.onChanging = function() 
{
    CPSsliderValueText.text = CPSslider.value.toFixed();
}


//Create Pause Duration Slider Group
var pauseGroup = panel.add("group", undefined, "");
pauseGroup.orientation = "row";
var pauseText = pauseGroup.add("statictext", undefined, "Pause Duration: ");

var pauseSlider = pauseGroup.add("slider", undefined);
pauseSlider.minvalue = 0;
pauseSlider.maxvalue = 2;
pauseSlider.value = 1;

var pauseSliderValueText = pauseGroup.add("edittext", undefined, "1");
pauseSliderValueText.characters = 4;

pauseSliderValueText.onChange = function() 
{
    var num =  Math.max(0, parseFloat(pauseSliderValueText.text));
    pauseSliderValueText.text = num;
    pauseSlider.value = num;
}

pauseSlider.onChanging = function() 
{
    pauseSliderValueText.text = pauseSlider.value;
}



window.center();
window.show();


button1.onClick = function() { modifyLayers(); }

//##############################################################################

function modifyLayers()
{
    // if no item selected or its not a composition, alert the user and return
    if( app.project.activeItem == null || !(app.project.activeItem instanceof CompItem) ) 
    {
        alert("No Active Item"); 
        return false;
    }


    
    var comp = app.project.activeItem;
    var layer = comp.selectedLayers[0];

    var sourceText = layer.property("ADBE Text Properties").property("ADBE Text Document");


    var start = layer.selectedProperties[0].property("ADBE Text Animators").property(1).property("ADBE Text Selectors").property(1).property("ADBE Text Index Start");

    var advancedSettings = layer.selectedProperties[0].property("ADBE Text Animators").property(1).property("ADBE Text Selectors").property(1).property("ADBE Text Range Advanced");
    var basedOn = advancedSettings.property("ADBE Text Range Type2").value;
    //alert(layer.selectedProperties[0].matchName);

    
    
    var punctuation = ".,!?;";


    //remove the newline characters from the string
    var plainText = sourceText.value.text.replace(/\r/g,"");

    //if the type writter is using characters excluding spaces setting
    if(basedOn == 2)
    {
        plainText = plainText.replace(/\s/g,"");
    }


    

    var framesPerPause = pauseSlider.value * comp.frameRate;

    var indices = [];
    var offsets = [];
    var totalOffset = 0;
    
    for(var i=0; i < plainText.length;i++) 
    {
        if (containsPunctuation( punctuation, plainText[i] ))
        {
            indices.push(i+1);
            offsets.push(totalOffset); //For future functionality of customizable pause lengths
            totalOffset += framesPerPause;
        } 
            
    }
    
    var charsPerSec = Math.round(CPSslider.value);

    //create beginnign keyframe
    var keyIndex = start.addKey(0);
    start.setValueAtKey(keyIndex, 0);
    start.setInterpolationTypeAtKey(keyIndex, KeyframeInterpolationType.LINEAR);

    
    //create ending keyframe
    /*
    alert("Plaintext Length = " + plainText.length +"\nDuration without pauses = " + (plainText.length/ charsPerSec)
    + "\nThere are " + indices.length + " pauses for a total of " + indices.length*pauseSlider.value + " seconds"
    + "The final keyframe should be at " + ((plainText.length / charsPerSec)+ indices.length*pauseSlider.value) );
    */

    keyIndex = start.addKey( (plainText.length / charsPerSec)+ indices.length*pauseSlider.value ); 
    start.setValueAtKey(keyIndex, plainText.length);
    start.setInterpolationTypeAtKey(keyIndex, KeyframeInterpolationType.LINEAR);

    for(var i = 0; i < indices.length; i++)
    {
        var headPos = (indices[i]/charsPerSec) + pauseSlider.value*i;
        var tailPos = ( (indices[i])/charsPerSec)  + pauseSlider.value*(i+1);

        //alert("head should be at time " + indices[i]/charsPerSec 
        //+ "\ntail should be at time " + (( (indices[i] + offsets[i])/charsPerSec)  + pauseSlider.value));

        var key1 = start.addKey( headPos  );
        start.setValueAtKey(key1, indices[i]);
        start.setInterpolationTypeAtKey(key1, KeyframeInterpolationType.LINEAR);     

        var key2 = start.addKey( tailPos );
        start.setValueAtKey(key2, indices[i] );
        start.setInterpolationTypeAtKey(key2, KeyframeInterpolationType.LINEAR);

    }
    
/*
    var headPos = (indices[i] + offsets[i])/charsPerSec;
    var tailPos = ( (indices[i] + offsets[i])/charsPerSec)  + pauseSlider.value;

    var key1 = start.addKey( headPos  );
    start.setValueAtKey(key1, indices[i]);
    start.setInterpolationTypeAtKey(key1, KeyframeInterpolationType.LINEAR);     

    var key2 = start.addKey( tailPos );
    start.setValueAtKey(key2, indices[i] );
    start.setInterpolationTypeAtKey(key2, KeyframeInterpolationType.LINEAR);
*/


    /* BRUTE FORCE VERSION - WORKS
    //this places a hold keyframe at every index in the string, and will skip forward when it hits punctuation to create the "pause"
    var delayOffset = 0;
    for(var i = 0; i < plainText.length; i++)
    {
        var keyIndex = start.addKey(comp.frameDuration*(i+delayOffset));

        start.setValueAtKey(keyIndex, i);
        start.setInterpolationTypeAtKey(keyIndex, KeyframeInterpolationType.HOLD);

        if ( i > 0 && contains( puncuation, plainText[i-1] ) )
        {
            delayOffset += 20;
        }

    }
    */
}

function containsPunctuation(punctuation, str  )
{
    for(var i = 0; i < punctuation.length; i++)
    {
        if(punctuation[i] == str)
        {
            return true;
        }
    }
    return false;
}
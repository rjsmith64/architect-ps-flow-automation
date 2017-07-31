'use strict';
var _         = require('underscore');
var commander = require('commander');

// *************************************************************************************************
//
// This file provides functionality for extracting values from command line parameters submitted to
// the examples in the Architect-Scripting-Examples repo.  We have this functionality in its own
// file to cut down on the clutter in the actual JavaScript examples so you can focus on the
// Architect scripting bits rather than command line processing code.
//
// In a nutshell, the way this works is that the parameters for examples pass them in
// in a key / value pair.  If the value is not undefined, that is the default value to
// use if not passed in.
//
// Some command line parameters are common across all examples such as location, clientId and
// clientSecret.  The rest of the parameters example dependent.  There is one parameter that is
// common across all examples called scriptingPath.  We ( the Architect development team ) use this
// parameter for example testing prior to release.  As such, when running this examples in the
// Architect-Scripting-Examples repo, you shouldn't need to specify a path to the Architect Scripting
// bundle with the scriptingPath command line option but if you want to specify a path to the scripting
// bundle explicitly, you can specify it like this as a command line parameter:
//
//   --scriptingPath ../../../../build-scripting/release/scripting.bundle
//       or ( the next one is redundant since architect-scripting is the default )
//   --scriptingPath architect-scripting
//
// When running in the Architect repo ( Architect developers only ), the following values may
// be used:
//
//   --scriptingPath ../../../../build-scripting/release/scripting.bundle
//   --scriptingPath ../../../../build-scripting/debug/scripting.bundle
//   --scriptingPath ../../../scripting/index
//
// *************************************************************************************************
function CommandLineHelper(exampleSpecificRequiredParameters) {

    // Default common command line parameters
    var exampleCommandLineParameters = {
        location: 'dev',
        scriptingPath: 'architect-scripting',
        configFile: './config.json'
    };

    // Did the caller pass in any additional parameters?  If so, add them.
    if (exampleSpecificRequiredParameters)  {
        exampleCommandLineParameters = _.extend(exampleCommandLineParameters, exampleSpecificRequiredParameters);
    }

    commander.version('0.0.1');

    _.each(exampleCommandLineParameters, function(parameterDefaultValue, parameterName)  {
        switch (parameterName)  {
            case 'clientId':
                commander.option('-c, --clientId <clientId>',
                                 'Specifies the OAuth client identifier that should be used.');
                break;
            case 'clientSecret':
                commander.option('-s, --clientSecret <clientSecret>',
                                 'Specifies the OAuth client secret that should be used.');
                break;
            case 'dataPlaybackConfigFile':
                commander.option('-v, --dataPlaybackConfigFile <fileName>',
                                 'Specifies the file that contains configuration and test values to play back.');
                break;
            case 'dataPlaybackScriptsDirectory':
                commander.option('-d, --dataPlaybackScriptsDirectory <directoryPath>',
                                 'Specifies the directory where listening scripts should be written.');
                break;
            case 'expressionFile':
                commander.option('-e, --expressionFile <fileName>',
                                 'Specifies the file to use that supplies boolean expressions for processing ( 1 per line )');
                break;
            case 'flowName':
                commander.option('-f, --flowName <flowName>]',
                                 'Specifies the flow name to create.');
                break;
            case 'location':
                commander.option('-l, --location [location]',
                                 'Specifies the location where this script is to run.  Optional - defaults to dev.  Valid values are dev, test, stage, prod_ap_northeast_1, prod_ap_southeast_2, prod_eu_west_1 or prod_us_east_1.');
                break;
            case 'scriptingPath':
                commander.option('-p, --scriptingPath [scriptingPath]',
                                 'Specifies the require path to use for the Architect Scripting library.  Optional - defaults to architect-scripting.');
                break;
            case 'token':
                commander.option('-t, --token [token]',
                                 'Specifies the optional OAuth token that should be used.');
                break;
            case 'configFile':
                commander.option('-g, --configFile [configFile]',
                                 'Specifies the optional config filename that should be used.');
                break;
                
            default:
                throw new Error('The command line parameter \'' + parameterName + '\' is not supported.');
        }
    }.bind(this));

    commander.parse(process.argv);

    console.log('************************************************************************************************************');
    console.log('          Command Line Parameters');
    console.log('          -----------------------');
    _.each(exampleCommandLineParameters, function(parameterDefaultValue, parameterName)  {
        this[parameterName] = commander[parameterName] ? commander[parameterName] : parameterDefaultValue;
        var traceParameterName = '\''+parameterName + '\'';
        while(traceParameterName.length<30)  {
            traceParameterName += ' ';
        }
        console.log('Parameter ' + traceParameterName + ' -> \'' + this[parameterName] + '\'');
    }.bind(this));
    console.log('************************************************************************************************************\n');
}

module.exports = CommandLineHelper;
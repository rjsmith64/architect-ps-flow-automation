'use strict';

// *************************************************************************************************
// This example helper code will get the following command line parameter values:
//   --clientId
//   --clientSecret
//   --flowName
//   --location      ( defaults to 'dev' )
//   --scriptingPath ( defaults to 'architect-scripting' )
// *************************************************************************************************
// var CommandLineHelper     = require('../utility/commandLineHelper');
var CommandLineHelper   = require('../common/commandLineHelper');

var commandLineParameters = new CommandLineHelper({ 
    clientId: undefined,
    clientSecret: undefined,
    token: undefined,
    flowName: undefined
    });

var config = require(commandLineParameters.configFile); 


// *************************************************************************************************
//                               Architect Scripting Helper Variables
// *************************************************************************************************
var scripting     = require(commandLineParameters.scriptingPath);
var actionFactory = scripting.factories.archFactoryActions;  // Factory to create actions
var flowFactory   = scripting.factories.archFactoryFlows;    // Factory to create flows
var languages     = scripting.languages.archLanguages;       // Language support
var logger        = scripting.services.archLogging;          // Logging support
var menuFactory   = scripting.factories.archFactoryMenus;    // Factory to create menus
var session       = scripting.environment.archSession;       // Session support ( i.e. login, script runtime startup and end )
var taskFactory   = scripting.factories.archFactoryTasks;    // Factory to create tasks
var archEnums     = scripting.enums.archEnums;

var taskFunctions = {};

taskFunctions.createPlayAudioTTSTask = function(flow, taskConfig) {
    var params = taskConfig.parameters;
    var task = taskFactory.addTask(flow, taskConfig.name, taskConfig.isStartingAction);
    var playAudioAction = actionFactory.addActionPlayAudio(task, taskConfig.name, params.message);
    
    actionFactory.addActionDisconnect(task, 'Disconnect - Goodbye', playAudioAction);
    return task;
}

function scriptMain() {
    var flowName = commandLineParameters.flowName;
    var flowDescription = config.flowDescription;
    
    return flowFactory.createFlowInboundCallAsync(flowName, flowDescription, languages.englishUnitedStates, function (archInboundCallFlow) {

        archInboundCallFlow.initialAudio.setDefaultCaseLiteralTTS(config.flowInitialAudio);
                
        taskFunctions[config.tasks[0].template](archInboundCallFlow, config.tasks[0]);
        
        // Publish the flow.  This will also validate the flow as part of the publish operation.
        return archInboundCallFlow.checkInAsync(true);

   
        /*
        var decisionAction = actionFactory.addActionDecision(exampleTask, 'check equality', '5==3');
        // Add a switch action to the no output on the decision
        var switchAction = actionFactory.addActionSwitch(decisionAction.outputNo, 'check more');
        // On the default output for the switch action, add a disconnect action
        actionFactory.addActionDisconnect(switchAction.outputDefault, 'default disconnect');
        // On the first output for the switch, add a jump to menu action that will go to the support menu
        actionFactory.addActionJumpToMenu(switchAction.getOutputByIndex(0), 'jump to support menu', supportMenu);
        // for the yes output on the decision, add a disconnect with the name "5 equals 3 ? ;-)"
        actionFactory.addActionDisconnect(decisionAction.outputYes, '5 equals 3');
        // now add a disconnect action at the end of the task.
        actionFactory.addActionDisconnect(exampleTask, 'all done');
        */
        

        // Create a menu and make it the starting menu for the flow.
        //var mainMenu = menuFactory.addMenu(archInboundCallFlow, 'top menu', 'this is the top menu.  press 2 for support, 3 or 8 for the jump task, 6 for bob or 9 to disconnect', true);
        //var transferAction = menuFactory.addMenuTransferToUser(mainMenu, 'transfer to R. J.', '7', 'now transferring to R. J.');

        /*
        transferAction .actionTransferToUser.targetUser.setLiteralByUserNameAsync('rj.smith@genesys.com', function(targetUserVal) {
            // You could do additional work here.  The target user value from the transfer to user action will be passed
            // in as a parameter since the setLiteralByUserNameAsync method was called on it.
            logger.logNote('The user rj.smith@genesys.com was successfully set for the user value ' + targetUserVal.logStr);
        });
        

        transferAction.actionTransferToUser.preTransferAudio.setDefaultCaseExpression('ToAudioTTS("Hi!")');

        //transferAction.actionTransferToUser.failureTransferAudio.setDefaultCaseExpression('ToAudioTTS("Bye!")');

        // Add a disconnect to main menu
        menuFactory.addMenuDisconnect(mainMenu, 'bye!', '9');

        // Add a sub menu called support
        var supportMenu = menuFactory.addMenuSubMenu(mainMenu, 'support menu', '2', 'this is the support menu.  press 2 for the foo submenu or 9 to disconnect');

        // Add a disconnect to the support sub menu
        menuFactory.addMenuDisconnect(supportMenu, 'support menu disconnect', '9');

        // Add another submenu to the support sub menu
        var fooSubMenu = menuFactory.addMenuSubMenu(supportMenu, 'foo submenu', '2', 'this is the supportsub menu.  press 1 to go to the top menu or 7 to disconnect');

        // and them some menus for the foo submenu
        menuFactory.addMenuJumpToMenu(fooSubMenu, 'back to top menu', '1', mainMenu);

        // Add a Transfer to ACD Action to the fooSubMenu, also sets skill and queue
        var acdMenu = menuFactory.addMenuTransferToAcd(fooSubMenu, 'sales queue transfer', '3', 'now transferring to the sales queue');
        acdMenu.actionTransferToAcd.skills.addLiteralBySkillNameAsync('CSS');
        acdMenu.actionTransferToAcd.setLiteralByQueueNameAsync('0123');

        // Finally add a disconnect to the sub menu
        menuFactory.addMenuDisconnect(fooSubMenu, 'bye', '7');

        // Create the example task.
        // Add a play audio action that says 'going to check equality'
        var exampleTask = taskFactory.addTask(archInboundCallFlow, 'example task');
        actionFactory.addActionPlayAudio(exampleTask, 'initial task audio', 'going to check equality');
        var decisionAction = actionFactory.addActionDecision(exampleTask, 'check equality', '5==3');
        // Add a switch action to the no output on the decision
        var switchAction = actionFactory.addActionSwitch(decisionAction.outputNo, 'check more');
        // On the default output for the switch action, add a disconnect action
        actionFactory.addActionDisconnect(switchAction.outputDefault, 'default disconnect');
        // On the first output for the switch, add a jump to menu action that will go to the support menu
        actionFactory.addActionJumpToMenu(switchAction.getOutputByIndex(0), 'jump to support menu', supportMenu);
        // for the yes output on the decision, add a disconnect with the name "5 equals 3 ? ;-)"
        actionFactory.addActionDisconnect(decisionAction.outputYes, '5 equals 3 ? ;-)');
        // now add a disconnect action at the end of the task.
        actionFactory.addActionDisconnect(exampleTask, 'all done');

        // now that we have the task set up, we'll hook it up to the menu
        var jumpToTask = menuFactory.addMenuJumpToTask(mainMenu, 'go to jumping task', '3');
        jumpToTask.actionJumpToTask.targetTask = exampleTask;
        */

        
    });
    
}

function initialize() {
    session.startWithAuthToken(commandLineParameters.location, scriptMain, commandLineParameters.token);        
}

initialize();

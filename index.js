const { Command } = require('commander');
const program = new Command();


const featureFlags = {

};

const regions = ['region1,region2,region3'];

let users = [];
(function (){
  for(let i=0;i<100;i++){
    if(i<=30){
      users.push({id:i, region:"region1"});
    }
   else if(i<=60){
      users.push({id:i, region:"region2"});
    }
    else if(i<=60){
      users.push({id:i, region:"region2"});
    }
    else {
      users.push({id:i, region:"region3"});
    }
  }
  // console.log(users)
})()



program
  .name('my-cli')
  .description('A CLI with multiple commands');


program.command('CREATE-FLAG')
  .description('Initializes a new flag. Default state is OFF.')
  .argument('<string>', 'name of the feature flag')
  .action((str) => {
        console.log(`Flag ${str} created with default state OFF.`);
        featureFlags[str]={
          globalStatus : 'OFF',
          enabledForRegions: [],
          ROLLOUT : 0,
          enabledForUsers : []
        };
        console.log(featureFlags);
  });




program.command('ENABLE')
.description('Explicitly enables a flag for a specific user (Highest Priority).')
.argument('<string>','name of the feature flag to enable')
.option('--user', 'if want to enable feature for the specific user with userId')
.argument('<int>','id for the user')
.action((str,id)=>{

  if(id && str){
      featureFlags[str]={
        globalStatus : 'OFF',
        enabledForRegions : featureFlags[str].enabledForRegions,
        ROLLOUT : featureFlags[str].ROLLOUT,
        enabledForUsers : [...featureFlags[str].enabledForUsers , id]
      }
  }
})


program.command('DISABLE')
.description('Explicitly disables a flag for an entire region.')
.argument('<string>','name of the feature flag to disable')
.options('--region', 'if want to disable for the specific feature')
.argument('<string>', 'name of the region for which want to disable the feature')
.action((flag,region)=>{
  if(!options.region){
    console.log('As region not provided disabling feature for the all the regions...');
    featureFlags[flag]={
      globalStatus : featureFlags[flag].globalStatus,
      enabledForRegions: [],
      ROLLOUT:0,
      enabledUsers: featureFlags[flag].enabledForUsers
    }
  }
  else if(options.region && options.flag){
    console.log('Disabling feature :' + flag + ' for the region : ' + region);
    featureFlags[flag]={
        enabledForRegions = enabledForRegions.filter(reg => reg != region)
    }
  }
})


program.command('ROLLOUT')
.argument('<string>','name of the feature flag')
.argument('<int>',' Roll out %')
.action((flag, rollout)=>{
  featureFlags[flag]={
    globalStatus : featureFlags[flag].globalStatus,
    enabledForRegions: featureFlags[flag].enabledForRegions,
    ROLLOUT : rollout,
    enabledForUsers : featureFlags[flag].enabledForUsers,
  }
})

program.command('EVALUATE')
.description('Returns true or false based on precedence logic.')
.argument('<string>','name of the feature flag')
.options('--user' , 'if want to check for the specific user')
.argument('<int>', ' id of the user')
.options('--region', ' if want to specify the region')
.argument('<string>', ' name of the region')
.action((flag, userid, region)=>{
    if(userid){
      if(featureFlags[flag].enabledForUsers.include(userid))
        console.log('Eval ans:', true);
      else{
        console.log('Eval ans:' , false)
      }
    }

    else if(region){
      if(featureFlags[flag].enabledForRegions.include(region))
        console.log('Eval ans:', true);
      else {
        console.log('Eval ans:', false);
      }
    }

    else if(featureFlags[flag].globalStatus)
    {
      console.log('Eval ans:', true);
    }
    else console.log('Eval ans:', false);
})


program.command('FLUSH')
.description('Clears all flags and rules from memory.')
.action(()=>{
  featureFlags = {};
  console.log('All flags and rules cleared from the memory')
})


program.command('LIST-FLAGS')
.description('Returns all flags and their current configuration')
.action(()=>{

})

program.parse();
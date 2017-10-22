Game.stargaze = (function(){

	var instance = {};

	instance.entries = {};
	instance.categoryEntries = {};
	instance.navCount = 0;

	instance.upgradeEntries = {};
	
	instance.rebirthStart = [];				// Things you start with
	instance.rebirthUnlocked = [];			// Things that start unhidden
	instance.rebirthChildUnlocked = [];		// Things that have children that start unhidden

	instance.rebirthNeedsUpdate = true;

	instance.unlocked = false;

	instance.initialise = function(){
		for (var id in Game.stargazeData) {
			var data = Game.stargazeData[id];
			
			this.navCount++;
			this.entries[id] = $.extend({}, data, {
				id: id,
				htmlId: 'stargazeNav' + id,
				displayNeedsUpdate: true
			});
		}
		console.log("Loaded " + this.navCount + " Stargaze Navs");

		for (var id in Game.prestigeData) {
			var data = Game.prestigeData[id];
			
			this.navCount++;
			this.upgradeEntries[id] = $.extend({}, {
				id: id,
				htmlId: 'stargazeUpg' + id,
				displayNeedsUpdate: true,
				onApply: null,
				rebirthUnlocked: [],
				rebirthChildUnlocked: [],
				rebirthStart: {}
			}, data);
		}
	};

	instance.resetVars = function(){
		researchUnlocked=!1,researched=[],available=[],explored=[],tabsUnlocked=[],resourcesUnlocked=[],noBorder=[],rocketLaunched=!1,buttonsHidden=[],activated=[],techUnlocked=!1,meteoriteUnlocked=!1,globalEnergyLock=!1,heaterToggled=!0,plasmaticToggled=!0,battery=0,batteryMetalCost=5e4,batteryGemCost=5e4,batteryLunariteCost=3e4,batteryT2=0,batteryT2MetalCost=55e4,batteryT2GemCost=55e4,batteryT2LunariteCost=33e4,batteryT3=0,batteryT3MetalCost=55e5,batteryT3GemCost=55e5,batteryT3LunariteCost=33e5,batteryT4=0,batteryT4MetalCost=55e6,batteryT4GemCost=55e6,batteryT4LunariteCost=33e6,PSU=0,PSUSilverCost=77e4,PSUGoldCost=77e4,PSUUraniumCost=55e4,PSUT2=0,PSUT2SilverCost=93e5,PSUT2GoldCost=93e5,PSUT2UraniumCost=68e5,charcoalToggled=!0,meteoriteToggled=!0,rocketFuelToggled=!0,dyson=0,dysonTitaniumCost=3e5,dysonGoldCost=1e5,dysonSiliconCost=2e5,dysonMeteoriteCost=1e3,dysonIceCost=1e5,ring=0,swarm=0,sphere=0,antimatter=0,antimatterps=0,antimatterToggled=!0;
	};

	instance.hideMachines = function(){
		document.getElementById("labTier2").className="hidden",document.getElementById("labTier3").className="hidden",document.getElementById("labTier4").className="hidden",document.getElementById("labTier5").className="hidden",document.getElementById("oilTier2").className="hidden",document.getElementById("metalTier2").className="hidden",document.getElementById("gemTier2").className="hidden",document.getElementById("charcoalTier2").className="hidden",document.getElementById("woodTier2").className="hidden";for(var i=3;i<=4;i++)document.getElementById("uraniumTier"+i).className="hidden",document.getElementById("lavaTier"+i).className="hidden",document.getElementById("oilTier"+i).className="hidden",document.getElementById("metalTier"+i).className="hidden",document.getElementById("gemTier"+i).className="hidden",document.getElementById("charcoalTier"+i).className="hidden",document.getElementById("woodTier"+i).className="hidden",document.getElementById("siliconTier"+i).className="hidden",document.getElementById("lunariteTier"+i).className="hidden",document.getElementById("methaneTier"+i).className="hidden",document.getElementById("titaniumTier"+i).className="hidden",document.getElementById("goldTier"+i).className="hidden",document.getElementById("silverTier"+i).className="hidden",document.getElementById("hydrogenTier"+i).className="hidden",document.getElementById("heliumTier"+i).className="hidden",document.getElementById("iceTier"+i).className="hidden";
	};

	instance.rebirth = function(){
		if(sphere < 1)return;
		var check = confirm("Are you sure? This is non-reversible after you reset and save.");
		if(check){
			Game.stargaze.entries.darkMatter.count += Game.stargaze.entries.darkMatter.current;
			Game.notifySuccess("Dark Matter!", "You have gained " + Game.stargaze.entries.darkMatter.current + " Dark Matter from rebirthing into your new life!");

			for(var i = 0; i < resourcesUnlocked.length; i++){
				document.getElementById(resourcesUnlocked[i]).className = "hidden";
				if(resourcesUnlocked[i].indexOf("Nav") != -1)document.getElementById(resourcesUnlocked[i]).className = "sideTab hidden";
			}
			for(var i = 0; i < buttonsHidden.length; i++){
				if(buttonsHidden[i].indexOf("Progress") != -1){
					document.getElementById(buttonsHidden[i]).className = "progress";
				} else {
					document.getElementById(buttonsHidden[i]).className = "btn btn-default";
				}
			}
			for(var i = 0; i < explored.length; i++){
				document.getElementById(explored[i]).className = "inner sideTab hidden";
				if(explored[i] != "moon", explored[i] != "venus", explored[i] != "mars", explored[i] != "asteroidBelt")document.getElementById(explored[i]).className = "outer sideTab hidden";
			}
			document.getElementById("spaceRocket").className = "sideTab";
			document.getElementById("mercury").className = "sideTab hidden";
			document.getElementById("collapseInner").className = "collapseInner sideTab hidden";
			document.getElementById("collapseOuter").className = "collapseOuter sideTab hidden";
			for(var i = 0; i < tabsUnlocked.length; i++){
				document.getElementById(tabsUnlocked[i]).className = "hidden";
			}
			for(var i = 0; i < activated.length; i++){
				$(document.getElementById(activated[i] + "Activation")).text("Dormant");
				document.getElementById(activated[i] + "Activation").className = "red";
			}
			Game.tech.reset();
			Game.interstellar.initialise();
			Game.buildings.reset();
			Game.resources.reset();

			this.resetVars();
			this.hideMachines();

			updateCost();
			updateDysonCost();

			Game.settings.entries.gainButtonsHidden = false;
			for(var i = 0; i < document.getElementsByClassName("gainButton").length; i ++){
                document.getElementsByClassName("gainButton")[i].className = "gainButton";
            }
            $('#gainButtonsHidden').prop('checked', false);

			// Refreshing Interstellar Tab
			var objects = ["comms", "rocket", "rocketParts", "antimatter", "military"];
			for(var i = 0; i < objects.length; i++){
				var object = Game.interstellar[objects[i]];
				for(var entry in object.entries){
					$('#' + object.entries[entry].htmlId + 'Count').text(object.entries[entry].count);
				}
			}
			for(var star in Game.interstellar.stars.entries){
				Game.interstellar.stars.entries[star].unlocked = false;
				Game.interstellar.stars.entries[star].explored = false;
				document.getElementById('star_' + star).className = "";
				document.getElementById('star_' + star + '_conquer').className = "hidden";
			}
			for(var achiev in Game.achievements.entries){
				var data = Game.achievements.entries[achiev]
				data.unlocked = -1;
				data.displayNeedsUpdate = true;
				document.getElementById(data.id + '_bg').style = "width: 50px; height: 40px; background: url(" + data.iconPath + data.iconName + "." + data.iconExtension + ") no-repeat center; -webkit-background-size: contain;background-size: contain; margin-left: 5px;opacity: 0.2";
			}
			Game.achievements.rank = 0;
			for(var upgrade in Game.stargaze.upgradeEntries){
				Game.stargaze.upgradeEntries[upgrade].achieved = false;
				Game.stargaze.upgradeEntries[upgrade].displayNeedsUpdate = true;
			}
			for(nav in this.entries){
				if(this.entries[nav].opinion){
					this.entries[nav].opinion = 0;
					this.entries[nav].displayNeedsUpdate = true;
				}
			}
		}
	};

	instance.upgrade = function(id){
		if(id == 'rebirth'){
			this.rebirth();
		}
		var upgradeData = this.upgradeEntries[id];
		if(!upgradeData) {
			console.log('"' + id + '" is not a recognised upgrade.');
			return;
		}
		if(upgradeData.achieved == false){
			if(this.entries.darkMatter.count >= upgradeData.cost){
				this.entries.darkMatter.count -= upgradeData.cost;
				this.applyUpgradeEffect(id);
				if(upgradeData.category != "intro" || "darkMatter")this.entries[upgradeData.category].opinion += upgradeData.opinion;
				this.entries[upgradeData.category].displayNeedsUpdate = true;
				upgradeData.achieved = true;
			}
		}
	};

	instance.applyUpgradeEffect = function(id) {
		var data = this.upgradeEntries[id];
		for(var i = 0; i < data.rebirthUnlocked.length; i++){
			this.rebirthUnlocked.push(data.rebirthUnlocked[i]);
		}
		for(var i = 0; i < data.rebirthChildUnlocked.length; i++){
			this.rebirthChildUnlocked.push(data.rebirthChildUnlocked[i]);
		}
		for(var object in data.rebirthStart){
			this.rebirthStart.push(data.rebirthStart[object]);
		}
		if(data.onApply !== null) {
			data.onApply();
		}
		this.rebirthNeedsUpdate = true;
	};

	instance.save = function(data){
		data.stargaze = {entries: {}, upgradeEntries: {}, rebirthStart: {}, rebirthUnlocked: {}, rebirthChildUnlocked: {}, unlocked: this.unlocked};
		for(var id in this.entries){
			data.stargaze.entries[id] = this.entries[id];
		}
		for(var id in this.upgradeEntries){
			data.stargaze.upgradeEntries[id] = {achiev: this.upgradeEntries[id].achieved};
		}
		for(var id in this.rebirthStart){
			data.stargaze.rebirthStart[id] = this.rebirthStart[id];
		}
		for(var id in this.rebirthUnlocked){
			data.stargaze.rebirthUnlocked[id] = this.rebirthUnlocked[id];
		}
		for(var id in this.rebirthChildUnlocked){
			data.stargaze.rebirthChildUnlocked[id] = this.rebirthChildUnlocked[id];
		}
	};

	instance.load = function(data){
		if(data.stargaze){
			if(typeof data.stargaze.entries !== 'undefined'){
                for(id in data.stargaze.entries){
                    this.entries[id] = data.stargaze.entries[id];
                    this.entries[id].displayNeedsUpdate = true;
                }
            }
            if(typeof data.stargaze.upgradeEntries !== 'undefined'){
                for(id in data.stargaze.upgradeEntries){
                    this.upgradeEntries[id].achieved = data.stargaze.upgradeEntries[id].achiev;
                    this.upgradeEntries[id].displayNeedsUpdate = true;
                }
            }
            if(typeof data.stargaze.rebirthStart !== 'undefined'){
                for(id in data.stargaze.rebirthStart){
                    this.rebirthStart[id] = data.stargaze.rebirthStart[id];
                }
            }
            if(typeof data.stargaze.rebirthUnlocked !== 'undefined'){
                for(id in data.stargaze.rebirthUnlocked){
                    this.rebirthUnlocked[id] = data.stargaze.rebirthUnlocked[id];
                }
            }
            if(typeof data.stargaze.rebirthChildUnlocked !== 'undefined'){
                for(id in data.stargaze.rebirthChildUnlocked){
                    this.rebirthChildUnlocked[id] = data.stargaze.rebirthChildUnlocked[id];
                }
            }
            this.unlocked = data.stargaze.unlocked;
		}
		for(var id in this.upgradeEntries){
			var data = this.upgradeEntries[id];
			if(data.achieved == true){
				if(data.onApply)data.onApply();
			}
		}
	};

	instance.getStargazeData = function(id) {
		return this.entries[id];
	};

	return instance;

}());
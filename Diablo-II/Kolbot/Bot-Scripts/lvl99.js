//
//	@filename 	lvl99.js
//
// 
// config nicks are CaSe SensitivE
// NickKiller must have NickDia, NickBaal, NickNith, NickShrine in Config.QuitList
// all chars must have NickKiller in Config.QuitList
//
// run NickKiller with D2BotLead
// all others with D2BotFollow
//
// free script
// minimum = 7/8 chars into same game (8 chars for max exp)
// char must be fully geared. Can be used with any class
// lvl99 char must have these wps: stony, river of flames, ancients wp, frigid
// sequence = kill shenk, go leech throne, kill diablo, leech baal, kill nits
// make sure to set maxgame time for all chars to 3 minutes and 15 seconds = 195 sec

var NickDia 	=	"DonaldDuck";					//diablo prep char nick		MUST
var NickDiaHlp	=	"TheLight";					//diahelper					OPTIONAL
var hurtDia		=	30;							//leave at x %		 14-15% for shitty dmg chars, can be higher for high dmg chars

var NickNith 	=	"Snuif";			//nitha charnick			MUST
var hurtNith	=	2;							//leave at x %
var hurtShenk	=	66;							//leave at x %

var NickBaal 	=	"TheKnight";					//baalchar prep				MUST
var NickBaalHlp =	"TheQueen";				//baalhelper				OPTIONAL
var hurtBaal	=	15;							//leave at x %  

var NickShrine 	=	"TheEnergy";					//shrine finder - sorc?		MUST

var NickKiller	=	"ZZP";					//char what is leeching to lvl99			MUST

//messages
var msgShenk	=	"shenk";					//msg on shenk ready
var msgDia		=	"diablo";					//msg on dia ready
var msgNith		=	"nith";						//msg on nith ready
var msgBeforeB	=	"town"						//msg for wait
var msgBaal		=	"baal up";					//msg on baal ready
var msgShrineY	=	"shrine";					//msg if shrine found
var msgShrineN	=	"skip";						//msg if shrine not found
var msgShrineGo	=	"find shrine"				//msg if you dont use shrine finder

var msgSeal1	=	"s1";
var msgSeal2	=	"s2";
var msgSeal3	=	"s3";

// scripts
function lvl99 () {
	switch(me.name){				//case sensitive !
		case NickDia:
			prepDia();
			break;
		
		case NickDiaHlp:
			prepDiaHelp();
			break;
			
		case NickNith:
			prepNith();
			break;
		
		case NickBaal:
		case NickBaalHlp:
			prepBaal();
			break;
			
		case NickShrine:
			prepShrine();
			while(true) delay(1000);
			break;
			
		case NickKiller: 
			killemAll();
			break;
			
		default:
			//idlers chars
			while (true) delay(1000);
			
			break;
	}
	
	return true;
}

	this.playersInGame = function () {
			var party, z;
			party = getParty();
	 
			z = 0;
	 
			do {
					z += 1;
			} while (party.getNext());
	 
			return z;
	}
	
	if (this.playersInGame() >= 5) { 
			var p;
			for (p = 0; p < 60; p += 1) {
				if (this.playersInGame() >= 5) { // If 5 or more players in game, continue 
				break;
			}
		
		if (p == 59) { // If we've reached the last cycle (2 minutes has elapsed) exit the game
			D2Bot.printToConsole("party not found :(", 9);
			delay(2e3);
			scriptBroadcast("quit");
		}
		
		delay (1e3); // Wait two seconds per loop. 60 loops x1 sec delay = 1 minutes.
		}
	}	
	
	this.playerIn = function (area) {
		if (!area) {
			area = me.area;
		}

		var party = getParty();

		if (party) {
			do {
				if (party.name !== me.name && party.area === area) {
					return true;
				}
			} while (party.getNext());
		}

		return false;
	};
	
function prepDia() {
	this.getLayout = function (seal, value) {
		var sealPreset = getPresetUnit(108, 2, seal);

		if (!seal) {
			throw new Error("Seal preset not found");
		}

		if (sealPreset.roomy * 5 + sealPreset.y === value || sealPreset.roomx * 5 + sealPreset.x === value) {
			return 1;
		}

		return 2;
	};

	this.initLayout = function () {
		this.vizLayout = this.getLayout(396, 5275);
		this.seisLayout = this.getLayout(394, 7773);
		this.infLayout = this.getLayout(392, 7893);
	};

	this.getBoss = function (name) {
		var i, boss,
			glow = getUnit(2, 131);

		for (i = 0; i < 24; i += 1) {
			boss = getUnit(1, name);

			if (boss) {
				switch (name) {
					case getLocaleString(2851):
						if(NickDiaHlp != "") {
							Pather.makePortal(false);
							delay(200);
							say(msgSeal1);
						}
						break;
					case getLocaleString(2852):
						if(NickDiaHlp != "") {
							Pather.makePortal(false);
							delay(200);
							say(msgSeal2);
						}
						break;
					case getLocaleString(2853):
						if(NickDiaHlp != "") {
							Pather.makePortal(false);
							delay(200);
						}
						say(msgSeal3);
						break;
					default:
						break;
					
				}
				this.chaosPreattack(name, 8);

				try {
					Attack.kill(name);
					Pickit.pickItems();
				} catch (e) {
					Attack.clear(10, 0, name);
				}

				Pickit.pickItems();

				return true;
			}

			delay(250);
		}

		return !!glow;
	};

	this.chaosPreattack = function (name, amount) {
		var i, n, target, positions;

		switch (me.classid) {
		case 0:
			break;
		case 1:
			break;
		case 2:
			break;
		case 3:
			target = getUnit(1, name);

			if (!target) {
				return;
			}

			positions = [[6, 11], [0, 8], [8, -1], [-9, 2], [0, -11], [8, -8]];

			for (i = 0; i < positions.length; i += 1) {
				if (Attack.validSpot(target.x + positions[i][0], target.y + positions[i][1])) { // check if we can move there
					Pather.moveTo(target.x + positions[i][0], target.y + positions[i][1]);
					Skill.setSkill(Config.AttackSkill[2], 0);

					for (n = 0; n < amount; n += 1) {
						Skill.cast(Config.AttackSkill[1], 1);
					}

					break;
				}
			}

			break;
		case 4:
			break;
		case 5:
			break;
		case 6:
			break;
		}
	};

	this.diabloPrep = function () {
		var trapCheck,
			tick = getTickCount();

		while (getTickCount() - tick < 17500) {
			if (getTickCount() - tick >= 8000) {
				switch (me.classid) {
				case 1: // Sorceress
					if ([56, 59, 64].indexOf(Config.AttackSkill[1]) > -1) {
						if (me.getState(121)) {
							delay(500);
						} else {
							Skill.cast(Config.AttackSkill[1], 0, 7793, 5293);
						}

						break;
					}

					delay(500);

					break;
				case 3: // Paladin
					Skill.setSkill(Config.AttackSkill[2]);
					Skill.cast(Config.AttackSkill[1], 1);

					break;
				case 5: // Druid
					if (Config.AttackSkill[1] === 245) {
						Skill.cast(Config.AttackSkill[1], 0, 7793, 5293);

						break;
					}

					delay(500);

					break;
				case 6: // Assassin
					if (Config.UseTraps) {
						trapCheck = ClassAttack.checkTraps({x: 7793, y: 5293});

						if (trapCheck) {
							ClassAttack.placeTraps({x: 7793, y: 5293, classid: 243}, trapCheck);

							break;
						}
					}

					delay(500);

					break;
				default:
					delay(500);
				}
			} else {
				delay(500);
			}

			if (getUnit(1, 243)) {
				return true;
			}
		}

		throw new Error("Diablo not found");
	};

	this.openSeal = function (classid) {
		var i, j, seal;

		for (i = 0; i < 5; i += 1) {
			Pather.moveToPreset(108, 2, classid, classid === 394 ? 5 : 2, classid === 394 ? 5 : 0);

			if (i > 1) {
				Attack.clear(10);
			}

			for (j = 0; j < 3; j += 1) {
				seal = getUnit(2, classid);

				if (seal) {
					break;
				}

				delay(100);
			}

			if (!seal) {
				throw new Error("Seal not found (id " + classid + ")");
			}

			if (seal.mode) {
				return true;
			}

			sendPacket(1, 0x13, 4, 0x2, 4, seal.gid);
			delay(classid === 394 ? 1000 : 500);

			if (!seal.mode) {
				if (classid === 394 && Attack.validSpot(seal.x + 15, seal.y)) { // de seis optimization
					Pather.moveTo(seal.x + 15, seal.y);
				} else {
					Pather.moveTo(seal.x - 5, seal.y - 5);
				}

				delay(500);
			} else {
				return true;
			}
		}

		throw new Error("Failed to open seal (id " + classid + ")");
	};

	Town.doChores();
	Pather.useWaypoint(107);
	Precast.doPrecast(true);
	this.initLayout();
	this.openSeal(395);
	this.openSeal(396);

	if (this.vizLayout === 1) {
		Pather.moveTo(7691, 5292);
	} else {
		Pather.moveTo(7695, 5316);
	}
	
	if (!this.getBoss(getLocaleString(2851))) {
		throw new Error("Failed to kill Vizier");
	}

	this.openSeal(394);

	if (this.seisLayout === 1) {
		Pather.moveTo(7771, 5196);
	} else {
		Pather.moveTo(7798, 5186);
	}

	if (!this.getBoss(getLocaleString(2852))) {
		throw new Error("Failed to kill de Seis");
	}

	this.openSeal(392);
	this.openSeal(393);
	
	if (NickShrine === "") say(msgShrineGo);

	if (this.infLayout === 1) {
		delay(1);
	} else {
		Pather.moveTo(7928, 5295); // temp
	}
	
	if (!this.getBoss(getLocaleString(2853))) {
		throw new Error("Failed to kill Infector");
	}

	Pather.moveTo(7788, 5292);
	
	this.diabloPrep();
	Pather.makePortal();
	if (me.name == NickDia) say(msgDia);
	Attack.hurt(243, hurtDia); // Diablo
	Town.goToTown();
	while (true) delay(1000);
	return true;
}

function prepNith() {
	Town.doChores();
	//shenk part 
	Pather.useWaypoint(111);  //frigid
	Precast.doPrecast(true);
	Pather.moveTo(3876, 5130);
	Attack.hurt(getLocaleString(22435), hurtShenk); // Shenk the Overseer
	Town.goToTown();  
	say("shenk");
	delay(20e3);
	
	//nithprep part
	Pather.useWaypoint(123);
	Precast.doPrecast(false);

	if (!Pather.moveToExit(124, true)) {
		throw new Error("Failed to go to Nihlathak");
	}

	Pather.moveToPreset(me.area, 2, 462, 0, 0, false, true);

	if (Config.Nihlathak.ViperQuit && getUnit(1, 597)) {
		print("Tomb Vipers found.");

		return true;
	}
	
	//Config.ClearType = 0;

	//Attack.clearList(Attack.getMob([472, 635], 0, 40));
	
	Attack.hurt(526, hurtNith); // Nihlathak
	Town.goToTown();
	say(msgNith);
	Pickit.pickItems();
	while (true) delay(1000);
	return true;
}

function prepBaal() {
	var portal, tick;

	this.preattack = function () {
		var check;

		switch (me.classid) {
		case 1: // Sorceress
			switch (Config.AttackSkill[3]) {
			case 49:
			case 53:
			case 56:
			case 59:
			case 64:
				if (me.getState(121)) {
					while (me.getState(121)) {
						delay(100);
					}
				} else {
					return Skill.cast(Config.AttackSkill[1], 0, 15094 + rand(-1, 1), 5028);
				}

				break;
			}

			break;
		case 3: // Paladin
			if (Config.AttackSkill[3] === 112) {
				if (Config.AttackSkill[4] > 0) {
					Skill.setSkill(Config.AttackSkill[4], 0);
				}

				return Skill.cast(Config.AttackSkill[3], 1);
			}

			break;
		case 5: // Druid
			if (Config.AttackSkill[3] === 245) {
				return Skill.cast(Config.AttackSkill[3], 0, 15094 + rand(-1, 1), 5028);
			}

			break;
		case 6: // Assassin
			if (Config.UseTraps) {
				check = ClassAttack.checkTraps({x: 15094, y: 5028});

				if (check) {
					return ClassAttack.placeTraps({x: 15094, y: 5028}, 5);
				}
			}

			if (Config.AttackSkill[3] === 256) { // shock-web
				return Skill.cast(Config.AttackSkill[3], 0, 15094, 5028);
			}

			break;
		}

		return false;
	};

	this.checkThrone = function () {
		var monster = getUnit(1);

		if (monster) {
			do {
				if (Attack.checkMonster(monster) && monster.y < 5080) {
					switch (monster.classid) {
					case 23:
					case 62:
						return 1;
					case 105:
					case 381:
						return 2;
					case 557:
						return 3;
					case 558:
						return 4;
					case 571:
						return 5;
					default:
						Attack.getIntoPosition(monster, 10, 0x4);
						Attack.clear(15);

						return false;
					}
				}
			} while (monster.getNext());
		}

		return false;
	};

	this.clearThrone = function () {
		var i, monster,
			monList = [],
			pos = [15094, 5022, 15094, 5041, 15094, 5060, 15094, 5041, 15094, 5022];

		if (Config.AvoidDolls) {
			monster = getUnit(1, 691);

			if (monster) {
				do {
					if (monster.x >= 15072 && monster.x <= 15118 && monster.y >= 5002 && monster.y <= 5079 && Attack.checkMonster(monster) && Attack.skipCheck(monster)) {
						monList.push(copyUnit(monster));
					}
				} while (monster.getNext());
			}

			if (monList.length) {
				Attack.clearList(monList);
			}
		}

		for (i = 0; i < pos.length; i += 2) {
			Pather.moveTo(pos[i], pos[i + 1]);
			Attack.clear(25);
		}
	};

	this.checkHydra = function () {
		var monster = getUnit(1, "hydra");
		if (monster) {
			do {
				if (monster.mode !== 12 && monster.getStat(172) !== 2) {
					Pather.moveTo(15072, 5002);
					while (monster.mode !== 12) {
						delay(500);
						if (!copyUnit(monster).x) {
							break;
						}
					}

					break;
				}
			} while (monster.getNext());
		}

		return true;
	};

	this.announce = function () {
		var count, string, souls, dolls,
			monster = getUnit(1);

		if (monster) {
			count = 0;

			do {
				if (Attack.checkMonster(monster) && monster.y < 5094) {
					if (getDistance(me, monster) <= 40) {
						count += 1;
					}

					if (!souls && monster.classid === 641) {
						souls = true;
					}

					if (!dolls && monster.classid === 691) {
						dolls = true;
					}
				}
			} while (monster.getNext());
		}

		if (count > 30) {
			string = "DEADLY!!!" + " " + count + " monster" + (count > 1 ? "s " : " ") + "nearby.";
		} else if (count > 20) {
			string = "Lethal!" + " " + count + " monster" + (count > 1 ? "s " : " ") + "nearby.";
		} else if (count > 10) {
			string = "Dangerous!" + " " + count + " monster" + (count > 1 ? "s " : " ") + "nearby.";
		} else if (count > 0) {
			string = "Warm" + " " + count + " monster" + (count > 1 ? "s " : " ") + "nearby.";
		} else {
			string = "Cool TP. No immediate monsters.";
		}

		if (souls) {
			string += " Souls ";

			if (dolls) {
				string += "and Dolls ";
			}

			string += "in area.";
		} else if (dolls) {
			string += " Dolls in area.";
		}

		say(string);
	};

	Town.doChores();
	Pather.useWaypoint(Config.RandomPrecast ? "random" : 129);
	Precast.doPrecast(true);

	if (me.area !== 129) {
		Pather.useWaypoint(129);
	}

	if (!Pather.moveToExit([130, 131], true)) {
		throw new Error("Failed to move to Throne of Destruction.");
	}

	Pather.moveTo(15095, 5029);

	if(me.name === NickBaal) {
	Pather.moveTo(15118, 5045);
	Pather.makePortal();
	}
	
	this.clearThrone();
	say("Safe TP");


	tick = getTickCount();
	Pather.moveTo(15094, me.classid === 3 ? 5029 : 5038);

MainLoop:
	while (true) {
		if (getDistance(me, 15094, me.classid === 3 ? 5029 : 5038) > 3) {
			Pather.moveTo(15094, me.classid === 3 ? 5029 : 5038);
		}

		if (!getUnit(1, 543)) {
			break MainLoop;
		}

		switch (this.checkThrone()) {
		case 1:
			Attack.clear(40);

			tick = getTickCount();

			Precast.doPrecast(true);

			break;
		case 2:
			Attack.clear(40);

			tick = getTickCount();

			break;
		case 4:
			Attack.clear(40);

			tick = getTickCount();

			break;
		case 3:
			Attack.clear(40);
			this.checkHydra();

			tick = getTickCount();

			break;
		case 5:
			Attack.clear(40);

			break MainLoop;
		default:
			if (getTickCount() - tick < 7e3) {
				if (me.getState(2)) {
					Skill.setSkill(109, 0);
				}

				break;
			}

			if (!this.preattack()) {
				delay(100);
			}

			break;
		}

		delay(10);
	}

	if (me.name == NickBaal) say(msgBeforeB);
	Pather.moveTo(15090, 5008);
	delay(5000);
	Precast.doPrecast(true);
	
	while (getUnit(1, 543)) {
		delay(500);
	}

	portal = getUnit(2, 563);

	if (portal) {
		Pather.usePortal(null, null, portal);
	} else {
		throw new Error("Couldn't find portal.");
	}

	if (me.name == NickBaal) {
		Pather.moveTo(15177, 5952);
		Pather.makePortal();
		delay(200);
		say(msgBaal);
	}

	//Attack.hurt(544, hurtBaal); // Baal
	//Town.goToTown();
	Pather.moveTo(15133, 5942);
	delay(7e3);
	while (!this.playerIn()) {
		delay(250);
	}
	Pather.moveTo(15134, 5923);
	Attack.kill(544); // killbaal
	Pickit.pickItems();
	delay(1e3);
	while (true) delay(1000);
	//scriptBroadcast("quit");
	return true;

}

function prepDiaHelp() {
	this.messenger = function(name, msg) {
		if (msg === msgSeal1) {
			canKill1 = true;
			id = getLocaleString(2851);
		}
		if (msg === msgSeal2) {
			canKill2 = true;
			id = getLocaleString(2852);
		}
		if (msg === msgSeal3) {
			canKill3 = true;
			id = getLocaleString(2853);
		}
		if (msg === msgDia) {
			canKill4 = true;
			id = getLocaleString(3060);
		}
		if (msg === msgBeforeB) {
			canKill5 = true;
			id = "";
		}
	};
	var canKill1 = false, canKill2 = false, canKill3 = false, canKill4 = false, canKill5 = false;
	var id="";

	addEventListener("chatmsg", this.messenger);

	Town.doChores()
	Town.move("waypoint");
	Pather.useWaypoint(4);
	Precast.doPrecast(true);
	Pather.useWaypoint(103);
	Town.move("portalspot");
	
	while(!canKill1) delay(100);
	
	Pather.usePortal(null, NickDia);
	try { Attack.kill(id); } catch (e) { Attack.clear(10, 0, id); }
	Town.goToTown();
	
	while(!canKill2) delay(100);
	
	Pather.usePortal(null, NickDia);
	try { Attack.kill(id); } catch (e) { Attack.clear(10, 0, id); }
	Town.goToTown();
	
	while(!canKill3) delay(100);
	
	Pather.usePortal(null, NickDia);
	try { Attack.kill(id); } catch (e) { Attack.clear(10, 0, id); }
	Town.goToTown();
	
	while(!canKill4) delay(100);
	
	Pather.usePortal(null, NickDia);
	Attack.hurt(243, hurtDia);
	
	Town.goToTown(5);
	Pather.usePortal(null, NickBaal);
	while (!canKill5) {
		Pather.moveTo(15093, me.classid === 3 ? 5029 : 5039);
		Attack.clear(40);
		Precast.doPrecast();
	}
	Town.goToTown(5);
	Pickit.pickItems();
	//delay(6e3);
	//quit();
	while (true) delay(1000);
}

function prepShrine() {
	var noschrine = true, i;
	
	Town.doChores();
	Town.goToTown(1);
	Pather.useWaypoint(4);
	for (i = 4; i > 1; i -= 1) {
		if (Misc.getShrinesInArea(i, 15, me.name == NickShrine ? false : true)) {
			if (me.name == NickShrine) {
				say(msgShrineY);
				Attack.securePosition(me.x, me.y, 10, 10);
				delay(3e3);
				Attack.securePosition(me.x, me.y, 10, 10);
				noschrine = false;
			}
			break;
		}
	}
	if (i === 1) {
		Town.goToTown();
		Pather.useWaypoint(5);
		for (i = 5; i < 36; i += 1) {
			if (Misc.getShrinesInArea(i, 15, me.name == NickShrine ? false : true)) {
				if (me.name == NickShrine) {
					say(msgShrineY);
					Attack.securePosition(me.x, me.y, 10, 10);
					delay(3e3);
					Attack.securePosition(me.x, me.y, 10, 10);
					noschrine = false;
				}
				break;
			}
		}
	}
	if (noschrine && me.name == NickShrine){
		say(msgShrineN);
	}
	
	if (me.name === NickKiller) Precast.doPrecast(true);
	
	Town.goToTown();
}

function killemAll() {
	var readyDia, readyNith, readyBaal, readyShenk, readyWaves;
	var shrineWait = NickShrine == "" ? false : true;
	var goForShrine = false;
	var goFindShrine = false;
	
	this.messenger = function(name, msg) {
		if (msg === msgDia) {
			readyDia = true;	
		}
		if (msg === msgBeforeB) {
			readyWaves = true;	
		}
		if (msg === msgBaal) {
			readyBaal = true;	
		}
		if (msg === msgShrineY) {
			shrineWait = false;	
			goForShrine = true;
		}
		if (msg === msgShrineN) {
			shrineWait = false;
		}
		if (msg === msgShrineGo) {
			goFindShrine = true;
		}
		if (msg === msgNith) {
			readyNith = true;	
		}	
		if (msg === msgShenk) {
			readyShenk = true;	
		}					
	};
	
	addEventListener("chatmsg", this.messenger);
		
		Town.doChores();
		Town.move("waypoint");
		Pather.useWaypoint(4);
		Precast.doPrecast(true);
		Pather.useWaypoint(118); //ancients wp
		Town.goToTown();

		while (!readyShenk) delay(100);
		readyShenk = false;	
		readyDia = false;
		
		if(NickShrine === "") {
			while (!goFindShrine) delay(100);
			prepShrine();
			Town.goToTown(5);
			Town.move("portalspot");	
		}		

		while(!Pather.usePortal(110, NickNith)); {  //110 = bloody foothill
			delay(100);
		}	
		Attack.kill(getLocaleString(22435)); //kill Shenk
		Pickit.pickItems();
		Town.goToTown(); 
		Pather.moveTo(5104, 5039); 
		Packet.teleWalk(5114, 5069); // tp spot 
       
        while(shrineWait) delay(100);
       
        if (goForShrine) {
                Pather.useWaypoint(4);  // go to cold stone  
				Town.goToTown();
                Pather.usePortal(null, NickShrine);
                delay(200);
                Misc.getShrinesInArea(me.area, 15, true);
                Pather.usePortal(null, NickShrine);
                Pather.usePortal(null, me.name);
				Pather.useWaypoint(118); //ancients
				Town.goToTown();       
        }		

		while(!Pather.usePortal(131, NickBaal)); { 
			delay(100);
		}
		Pather.moveTo(15117, 5044);
		Attack.securePosition(me.x, me.y, 10, 10);
		Pather.moveTo(15117, 5044);
		Precast.doPrecast(); 
		
 	//baal part
		while (!readyWaves) {
			delay(1e3);
		}
		
		Town.goToTown();   
		Pather.moveTo(5105, 5039); //a5 walking halfway point
		Packet.teleWalk(5114, 5069); // tp spot 
        Pather.useWaypoint(107); //RoF
		Town.goToTown();      

        while(!Pather.usePortal(108, NickDia)) {                        //if cannot use portal wait
                delay(100);
        }
       
        try {
                Attack.kill(243); // Diablo
				Pickit.pickItems();
        }
        catch (e) {
                say(e);
        }
        finally {
                Pather.usePortal(103, NickDia);
				//Packet.teleWalk(5045, 5020); // wp spot    
                //Town.move("waypoint");
				Pather.usePortal(107, me.name);
                Pather.useWaypoint(118);  //ancients
				Town.goToTown();
				delay(50);
        }
		
	while (!readyBaal) delay(1e3);
	while(!Pather.usePortal(132, NickBaal)) {			//if cannot use portal wait
		delay(100);
	}
	
	Pather.moveTo(15177, 5952);
	
		var baal;
						
		baal = getUnit(1, 544);
		while (baal) {
			delay(2e3);
			if (baal && (baal.mode === 0 || baal.mode === 12)) {
				delay(1e3);
				Town.goToTown();
				break;
			}  
		}

	//nith part
	//while (!readyNith) delay(100);
	//readyNith = false;

	while(!Pather.usePortal(124, NickNith)) {			//if cannot use portal wait
		delay(100);
	}
	
	try {
		Attack.kill(526); // Nihlathak
		Pickit.pickItems();
	}
	catch (e) {
		say(e);
	}
	finally {
		delay(1e3);
		scriptBroadcast("quit");
	}
}
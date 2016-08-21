function RusheeBumperNorm() {
	
	var andydone = false;
	var travdone = false;
	var converter = {};
	var quester, leader, target,
		leaderName = "",
		action = "";

	this.findLeader = function (name) {
		var party = getParty(name);

		if (party) {
			return party;
		}

		return false;
	};

	this.getQuestItem = function (classid, chestid) {
		var chest, item;

		chest = getUnit(2, chestid);

		if (!chest) {
			return false;
		}

		Misc.openChest(chest);

		item = getUnit(4, classid);

		if (!item) {
			return false;
		}

		return Pickit.pickItem(item);
	};

	this.checkQuestMonster = function (classid) {
		var monster = getUnit(1, classid);

		if (monster) {
			while (monster.mode !== 12) {
				delay(500);
			}

			return true;
		}

		return false;
	};
	

this.Wakka = function () {
	var i, safeTP, portal, vizClear, seisClear, infClear, tick, diablo,
		timeout = 1, // minutes
		minDist = 50,
		maxDist = 80,
		leaderUnit = null,
		leaderPartyUnit = null,
		leader = "";
	var stopLvl = 99;

	this.checkMonsters = function (range, dodge) {
		var monList = [],
			monster = getUnit(1);

		if (monster) {
			do {
				if (monster.y < 5565 && Attack.checkMonster(monster) && getDistance(me, monster) <= range) {
					if (!dodge) {
						return true;
					}

					monList.push(copyUnit(monster));
				}
			} while (monster.getNext());
		}

		if (!monList.length) {
			return false;
		}

		monList.sort(Sort.units);

		if (getDistance(me, monList[0]) < 25 && !checkCollision(me, monList[0], 0x4)) {
			Attack.deploy(monList[0], 25, 5, 15);
		}

		return true;
	};

	this.getLayout = function (seal, value) {
		var sealPreset = getPresetUnit(108, 2, seal);

		if (!seal) {
			throw new Error("Seal preset not found. Can't continue.");
		}

		switch (seal) {
		case 396:
			if (sealPreset.roomy * 5 + sealPreset.y === value) {
				return 1;
			}

			break;
		case 394:
		case 392:
			if (sealPreset.roomx * 5 + sealPreset.x === value) {
				return 1;
			}

			break;
		}

		return 2;
	};

	this.getCoords = function () {
		this.vizCoords = this.getLayout(396, 5275) === 1 ? [7707, 5274] : [7708, 5298];
		this.seisCoords = this.getLayout(394, 7773) === 1 ? [7812, 5223] : [7809, 5193];
		this.infCoords = this.getLayout(392, 7893) === 1 ? [7868, 5294] : [7882, 5306];
	};

	this.checkBoss = function (name) {
		var i, boss,
			glow = getUnit(2, 131);

		if (glow) {
			for (i = 0; i < 10; i += 1) {
				if (me.getStat(12) >= stopLvl) {
					D2Bot.stop();
				}

				boss = getUnit(1, name);

				if (boss && boss.mode === 12) {
					return true;
				}

				delay(500);
			}

			return true;
		}

		return false;
	};

	this.getCorpse = function () {
		if (me.mode === 17) {
			me.revive();
		}

		var corpse,
			rval = false;

		corpse = getUnit(0, me.name, 17);

		if (corpse) {
			do {
				if (getDistance(me, corpse) <= 15) {
					Pather.moveToUnit(corpse);
					corpse.interact();
					delay(500);

					rval = true;
				}
			} while (corpse.getNext());
		}

		return rval;
	};

	this.followPath = function (dest) {
		var path = getPath(me.area, me.x, me.y, dest[0], dest[1], 0, 10);

		if (!path) {
			throw new Error("Failed go get path");
		}

		while (path.length > 0) {
			if (me.getStat(12) >= stopLvl) {
				D2Bot.stop();
			}

			if (me.mode === 17 || me.inTown) {
				return false;
			}

			if (!leaderUnit || !copyUnit(leaderUnit).x) {
				leaderUnit = getUnit(0, leader);
			}

			if (leaderUnit) {
				if (this.checkMonsters(45, true) && getDistance(me, leaderUnit) <= maxDist) { // monsters nearby - don't move
					path = getPath(me.area, me.x, me.y, dest[0], dest[1], 0, 15);

					delay(200);

					continue;
				}

				if (getDistance(me, leaderUnit) <= minDist) { // leader within minDist range - don't move
					delay(200);

					continue;
				}
			} else {
				// leaderUnit out of getUnit range but leader is still within reasonable distance - check party unit's coords!
				leaderPartyUnit = getParty(leader);

				if (leaderPartyUnit) {
					if (leaderPartyUnit.area !== me.area) { // leader went to town - don't move
						delay(200);

						continue;
					}

					// if there's monsters between the leecher and leader, wait until monsters are dead or leader is out of maxDist range
					if (this.checkMonsters(45, true) && getDistance(me, leaderPartyUnit.x, leaderPartyUnit.y) <= maxDist) {
						path = getPath(me.area, me.x, me.y, dest[0], dest[1], 0, 15);

						delay(200);

						continue;
					}
				}
			}

			if (Pather.moveTo(path[0].x, path[0].y)) {
				path.shift();
			}

			this.getCorpse();
		}

		return true;
	};

	// start
	Town.goToTown(4);
	Town.move("portalspot");

	if (leaderName) {
		leader = leaderName;

		for (i = 0; i < 30; i += 1) {
			if (Misc.inMyParty(leader)) {
				break;
			}

			delay(1000);
		}

		if (i === 30) {
			throw new Error("Wakka: Leader not partied");
		}
	}

	//autoLeaderDetect(108);
	Town.doChores();

	if (leader) {
		while (Misc.inMyParty(leader)) {
			if (me.getStat(12) >= stopLvl) {
				D2Bot.stop();
			}

			switch (me.area) {
			case 103:
				//portal = Pather.getPortal(108, leader);
				portal = Pather.getPortal(108, null);

				if (portal) {
					if (!safeTP) {
						delay(5000);
					}

					//Pather.usePortal(108, leader);
					Pather.usePortal(108, null);
				}

				break;
			case 108:
				if (!safeTP) {
					if (this.checkMonsters(25, false)) {
						me.overhead("hot tp");
						//Pather.usePortal(103, leader);
						Pather.usePortal(103, null);
						this.getCorpse();

						break;
					} else {
						this.getCoords();

						safeTP = true;
					}
				}

				if (!vizClear) {
					if (!this.followPath(this.vizCoords)) {
						break;
					}

					if (tick && getTickCount() - tick >= 5000) {
						vizClear = true;
						tick = false;

						break;
					}

					if (this.checkBoss(getLocaleString(2851))) {
						if (!tick) {
							tick = getTickCount();
						}

						me.overhead("vizier dead");
					}

					break;
				}

				if (!seisClear) {
					if (!this.followPath(this.seisCoords)) {
						break;
					}

					if (tick && getTickCount() - tick >= 7000) {
						seisClear = true;
						tick = false;

						break;
					}

					if (this.checkBoss(getLocaleString(2852))) {
						if (!tick) {
							tick = getTickCount();
						}

						me.overhead("seis dead");
					}

					break;
				}

				if (!infClear) {
					if (!this.followPath(this.infCoords)) {
						break;
					}

					if (tick && getTickCount() - tick >= 2000) {
						infClear = true;
						tick = false;

						break;
					}

					if (this.checkBoss(getLocaleString(2853))) {
						if (!tick) {
							tick = getTickCount();
						}

						me.overhead("infector dead");
					}

					break;
				}

				Pather.moveTo(7767, 5263);

				diablo = getUnit(1, 243);

				if (diablo && (diablo.mode === 0 || diablo.mode === 12)) {
					return true;
				}

				break;
			}

			if (me.mode === 17) {
				me.revive();
			}

			delay(200);
		}
	} else {
		throw new Error("Empty game.");
	}

	return true;
};

	this.tyraelTalk = function () {
		var i,
			npc = getUnit(1, "tyrael");

		if (!npc) {
			return false;
		}

		for (i = 0; i < 5; i += 1) {
			if (getDistance(me, npc) > 3) {
				Pather.moveToUnit(npc);
			}

			npc.interact();
			delay(500);
			me.cancel();
			delay(500);
			me.cancel();
			delay(500);
			me.cancel();

			if (Pather.usePortal(null)) {
				return true;
			}
		}

		return false;
	};

	this.cubeStaff = function () {
		var staff = me.getItem("vip"),
			amulet = me.getItem("msf");

		if (!staff || !amulet) {
			return false;
		}

		Storage.Cube.MoveTo(amulet);
		Storage.Cube.MoveTo(staff);
		Cubing.openCube();
		transmute();
		delay(750 + me.ping);
		Cubing.emptyCube();
		me.cancel();

		return true;
	};

	this.placeStaff = function () {
		var staff, item,
			tick = getTickCount(),
			orifice = getUnit(2, 152);

		if (!orifice) {
			return false;
		}

		Misc.openChest(orifice);

		staff = me.getItem(91);

		if (!staff) {
			if (getTickCount() - tick < 500) {
				delay(500);
			}

			return false;
		}

		staff.toCursor();
		submitItem();
		delay(750 + me.ping);

		// unbug cursor
		item = me.findItem(-1, 0, 3);

		if (item && item.toCursor()) {
			Storage.Inventory.MoveTo(item);
		}

		return true;
	};

	this.changeAct = function (act) {
		var npc,
			preArea = me.area;

		switch (act) {
		case 2:
			if (me.act >= 2) {
				break;
			}

			Town.move("warriv");

			npc = getUnit(1, "warriv");

			if (!npc || !npc.openMenu()) {
				return false;
			}

			Misc.useMenu(0x0D36);

			break;
		case 3:
			if (me.act >= 3) {
				break;
			}

			var npc,
			preArea = me.area;

		if (me.mode === 17) {
			me.revive();

			while (!me.inTown) {
				delay(500);
			}
		}

		if (me.act === act) {
			return true;
		}
		delay(200);
		Pather.usePortal(50, leaderName);
				Pather.moveToExit(40, true);

				npc = getUnit(1, "jerhyn");

				if (!npc || !npc.openMenu()) {
					Town.goToTown(1);
					delay(3000);
					Town.goToTown(2);
					Pather.moveTo(5078, 5151);
					npc = getUnit(1, "jerhyn");
					if (!npc || !npc.openMenu())
						quit();
				}

				me.cancel();
				Pather.moveToExit(50, true);
				Pather.usePortal(40, leaderName);
				Town.move("meshif");

				npc = getUnit(1, "meshif");

				if (!npc || !npc.openMenu()) {
					return false;
				}
				
				Misc.useMenu(0x0D38);
				delay(50);
		
			break;
		case 4:
			if (me.act >= 4) {
				break;
			}

			if (me.inTown) {
				Town.move("cain");

				npc = getUnit(1, "deckard cain");

				if (!npc || !npc.openMenu()) {
					return false;
				}

				me.cancel();
				Pather.usePortal(102, null);
			}

			Pather.usePortal(null);
			break;
		case 5:
			if (me.act >= 5) {
					break;
				}

				Town.move("tyrael");

				npc = getUnit(1, "tyrael");

				if (!npc || !npc.openMenu()) {
					return false;
				}

				delay(me.ping + 1);

				if (getUnit(2, 566)) {
					me.cancel();
					Pather.useUnit(2, 566, 109);
				} else {
					Misc.useMenu(0x58D2);
				}
			break;
		}

		delay(2000 + me.ping);

		while (!me.area) {
			delay(500);
		}

		if (me.area === preArea) {
			me.cancel();
			Town.move("portalspot");
			say("Act change failed.");

			return false;
		}

		Town.move("portalspot");
		say("Act change done.");

		return true;
	};

	// Talk to a NPC
	this.talk = function (name) {
		if (!me.inTown) {
			say("I'm not in town!");

			return false;
		}

		if (typeof name === "string") {
			name = name.toLowerCase();
		} else {
			say("No NPC name given.");

			return false;
		}

		var npc, names;

		switch (me.act) {
		case 1:
			names = ["gheed", "charsi", "akara", "kashya", "cain", "warriv"];

			break;
		case 2:
			names = ["fara", "lysander", "greiz", "elzix", "jerhyn", "meshif", "drognan", "atma", "cain"];

			break;
		case 3:
			names = ["alkor", "asheara", "ormus", "hratli", "cain"];

			break;
		case 4:
			names = ["halbu", "tyrael", "jamella", "cain"];

			break;
		case 5:
			names = ["larzuk", "malah", "qual-kehk", "anya", "nihlathak", "cain"];

			break;
		}

		if (names.indexOf(name) === -1) {
			//say("Invalid NPC.");

			return false;
		}

		if (!Town.move(name === "jerhyn" ? "palace" : name)) {
			Town.move("portalspot");
			//say("Failed to move to town spot.");

			return false;
		}

		npc = getUnit(1);

		if (npc) {
			do {
				if (npc.name.replace(/ /g, "").toLowerCase().indexOf(name) > -1) {
					npc.openMenu();
					me.cancel();
					Town.move("portalspot");
					//say("Done talking.");

					return true;
				}
			} while (npc.getNext());
			if (name == "malah") {
				scroll = me.getItem(646);

				if (scroll) {
					clickItem(1, scroll);
				}
			}
		}

		//say("NPC not found.");
		Town.move("portalspot");

		return false;
	};
	
	addEventListener("chatmsg",
		function (who, msg) {
			if ((msg === 'rusher') || (msg === 'I need a crushee')) {
				leaderName = who;
				//say("crushee");
			}
			if(msg == "tell level")
				say("level " + me.charlvl);
			if(msg == "tell ancients"){
				if (me.getQuest(39, 0))
					say("ancients done");
				else
					say("ancients not done");
			}
			if(msg == "andydone")
				andydone = true;
			if(msg == "travdone")
				travdone = true;
			if (who == leaderName) {
				action = msg;
			}
			if(msg == me.name + " quest"){
			quester = true;
			action = "";
			}

		}
		);

	delay(10000);
	Town.move("portalspot");
	while (!leader) {
		delay(2000);
		say("rushee");
		leader = this.findLeader(leaderName);
	}

	say("Leader found.");
	
	var overrideDifficulty = "Normal";
	if (me.diff == 1) {
		overrideDifficulty = "Nightmare";
	}
	if (me.diff == 2) {
		overrideDifficulty = "Hell";
	}
	scriptBroadcast("override" + overrideDifficulty);
	while (true) {
		
		var object = JSON.parse(FileTools.readText("logs/accounts.json"));
		switch(me.diff)
		{
			case 0:
				object.counter = 0;
				break;
			case 1:
				object.counter = 1;
				break;
			case 2:
				object.counter = 2;
				break;
		}
		FileTools.writeText("logs/accounts.json", JSON.stringify(object));
		
		//print("current action : " + action);
		switch (action) {
		case "ready":
			//print("in ready switch");
			if(quester){
				
			while (!leader.area) {
				leader = this.findLeader(leaderName);
				delay(500);
				//print("waiting on leader Area");
			}
			
			print(leader.area);

			switch (leader.area) {
				case 37: // Catacombs level 4
					Pather.usePortal(37, leaderName);
					while(!andydone)
					delay(2000);

					if (me.mode == 17) {
						me.revive();
						
						while (!me.inTown) {
							delay(500);
						}
					} else {
						while (me.area != 1){
						Pather.usePortal(1, leaderName);
						delay(1000);
						}
					}

					this.changeAct(2);

					action = "";

					break;
				case 49: // Sewers Level 3
					Pather.usePortal(49, leaderName);
					
					var book, atma;
					book = getUnit(4, 552);

					if (book) {
						Pickit.pickItem(book);
						delay(300);
						clickItem(1, book);
					}

					Town.goToTown();
					Town.move("atma");

					atma = getUnit(1, "atma");

					atma.openMenu();
					me.cancel();
					
					Town.move("portalspot");
					
					action = "";
					
					break;
				case 60: // Halls of the Dead level 3
					Pather.usePortal(60, leaderName);
					this.getQuestItem(549, 354);
					Pather.usePortal(40, leaderName);

					action = "";

					break;
				case 61: // Claw Viper Temple level 2
					Pather.usePortal(61, leaderName);
					this.getQuestItem(521, 149);
					Pather.usePortal(40, leaderName);
					Town.move("drognan");

					target = getUnit(1, "drognan");

					if (target) {
						target.openMenu();
						me.cancel();
					}

					Town.move("portalspot");

					action = "";

					break;
				case 64: // Maggot Lair level 3
					Pather.usePortal(64, leaderName);
					this.getQuestItem(92, 356);
					Pather.usePortal(40, leaderName);
					this.cubeStaff();

					action = "";

					break;
				case 74: // Arcane Sanctuary
					Pather.usePortal(74, leaderName);
					this.checkQuestMonster(250);

					if (me.mode === 17) {
						me.revive();
						
						while (!me.inTown) {
							delay(500);
						}
					} else {
						Pather.usePortal(40, leaderName);
					}

					Town.move("atma");

					target = getUnit(1, "atma");

					if (target) {
						target.openMenu();
						me.cancel();
					}

					Town.move("portalspot");

					action = "";

					break;
				case 66: // Tal Rasha's Tombs
				case 67:
				case 68:
				case 69:
				case 70:
				case 71:
				case 72:
					Pather.usePortal(null, leaderName);
					this.placeStaff();
					Pather.usePortal(40, leaderName);

					action = "";

					break;
				case 73: // Duriel's Lair
					Pather.usePortal(73, leaderName);
					this.tyraelTalk();
					//this.changeAct(3);

					action = "";

					break;
				case 83: // Travincal
					Pather.usePortal(83, leaderName);
					this.checkQuestMonster(getLocaleString(2863));
					this.checkQuestMonster(getLocaleString(2862));
					this.checkQuestMonster(getLocaleString(2860));

					while(!travdone)
					delay(2000);
					if (me.mode === 17) {
						me.revive();
						
						while (!me.inTown) {
							delay(500);
						}
					} else {
						while(me.area != 75){
						Pather.usePortal(75, leaderName);
						delay(500);
						}
					}

					Town.move("cain");

					target = getUnit(1, "deckard cain");

					if (target) {
						target.openMenu();
						me.cancel();
					}

					Town.move("portalspot");

					action = "";

					break;
				case 94: // Ruined Temple
					Pather.usePortal(94, leaderName);
					
					var stand;
					stand = getUnit(2, 193);

					Misc.openChest(stand);
					delay(300);

					book = getUnit(4, 548);

					Pickit.pickItem(book);
					Pather.usePortal(75, leaderName);
					Town.move("alkor");

					alkor = getUnit(1, "alkor");

					alkor.openMenu();
					me.cancel();
					
					Town.move("portalspot");
					
					action = "";
					
					break;
				case 102: // Durance of Hate level 3
					Pather.usePortal(102, leaderName);
					this.checkQuestMonster(242);

					if (me.mode === 17) {
						me.revive();
						
						while (!me.inTown) {
							delay(500);
						}
						
						Town.move("portalspot");
						Pather.usePortal(102, leaderName);
					}

					this.changeAct(4);

					action = "";

					break;
				case 105: // Plains of Despair
					Pather.usePortal(105, leaderName);
					
					this.checkQuestMonster(256);
					
					if (me.mode === 17) {
						me.revive();
						
						while (!me.inTown) {
							delay(500);
						}
					} else {
						Pather.usePortal(103, leaderName);
					}
					var tyrael;
					
					Town.move("tyrael");

					tyrael = getUnit(1, "tyrael");

					tyrael.openMenu();
					me.cancel();

					Town.move("portalspot");
					
					action = "";
					
					break;
				case 108: // Chaos Sanctuary
				while (me.area !=108){
					Pather.usePortal(108, leaderName);
					delay(300);
				}					
				delay(500);
					Pather.moveTo(7763,5267);

					while (!getUnit(1, 243)) {
						delay(500);
					}

					this.checkQuestMonster(243);
					if (me.gametype === 0) {
							D2Bot.restart();
					} else {
						if (me.mode === 17) {
							me.revive();
							
							while (!me.inTown) {
								delay(500);
							}
						}
						
						Pather.usePortal(103, leaderName);
						if (me.gametype == 1) {
						}else {
							if (me.diff == 0) {
								overrideDifficulty = "Nightmare";
							}
							if (me.diff == 1) {
								overrideDifficulty = "Hell";
							}
							if (me.diff == 2) {
								overrideDifficulty = "Normal";
							}
							scriptBroadcast("override" + overrideDifficulty);
							quit();
						}
					}

					Pather.usePortal(103, leaderName);
					delay(1000);
				this.changeAct(5);
					
					action = "";

					break;
				case 110: // Bloody Foothills
					Pather.usePortal(110, leaderName);
					
					this.checkQuestMonster(getLocaleString(22435));
					
					if (me.mode === 17) {
						me.revive();
						
						while (!me.inTown) {
							delay(500);
						}
					} else {
						Pather.usePortal(109, leaderName);
					}
					
					Town.move("portalspot");
					
					action = "";
					
					break;
				case 114: // Frozen River
					Pather.usePortal(114, leaderName);
					
					anya = getUnit(2, 558);

					Pather.moveToUnit(anya);
					anya.interact();
					delay(300);
					me.cancel();
					Pather.usePortal(109, leaderName);
					Town.move("malah");

					malah = getUnit(1, "malah");

					malah.openMenu();
					me.cancel();
					Town.move("portalspot");
					Pather.usePortal(114, leaderName);
					anya.interact();
					delay(300);
					me.cancel();
					Pather.usePortal(109, leaderName);
					Town.move("malah");
					malah.openMenu();
					me.cancel();
					delay(500);

					scroll = me.getItem(646);

					if (scroll) {
						clickItem(1, scroll);
					}
					
					Town.move("portalspot");
					
					action = "";
					
					break;
				case 120: // Ancients Way
					Pather.usePortal(120, null);
					
					while (!getUnit(1, 542)) {
						delay(250);
					}
					
					this.checkQuestMonster(540);
					this.checkQuestMonster(541);
					this.checkQuestMonster(542);
					
					say("ancients done!!");
					action = "";
					
					break;
				case 132: // Worldstone Chamber
					Pather.usePortal(132, leaderName);
					
					this.checkQuestMonster(544);
					
					if (me.mode === 17) {
						me.revive();
						
						while (!me.inTown) {
							delay(500);
						}
					} else {
						Pather.usePortal(109, leaderName);
					}
					
					if (me.diff == 0) {
						overrideDifficulty = "Nightmare";
					}
					if (me.diff == 1) {
						overrideDifficulty = "Hell";
					}
					if (me.diff == 2) {
						overrideDifficulty = "Normal";
					}
					scriptBroadcast("override" + overrideDifficulty);
					quit();
					
					action = "";
					
					break;
			}
			
			if(me.hp/me.hpmax < 0.5)
				Town.doChores();

			}
			
			break;
		case me.name + " quest":
			say("I am quester.");

			quester = true;
			action = "";

			break;
		case "quit":
			quit();
			break;
		case "leveling":
			this.Wakka();
			break;
		case "exit":
		if(me.charlvl > 39){
		var object = JSON.parse(FileTools.readText("logs/accounts.json"));
		switch(me.diff)
		{
			case 0:
				object.counter = 1;
				break;
			case 1:
				object.counter = 2;
				break;
			case 2:
				object.counter = 3;
				break;
		}
		FileTools.writeText("logs/accounts.json", JSON.stringify(object));

		}
		
		if(me.charlvl < 40){
			quit();
			return true;
		}
		
			D2Bot.restart();
			break;
		case "BaalReady":
			Pather.moveToExit(128, true);
			Pather.moveToExit(129, true);
			Pather.moveToExit(130, true);
			Pather.moveToExit(131, true);
			
			Pather.moveTo(15092, 5011);

			delay(500);
			var portal = getUnit(2, 563);

		if (portal) {
			Pather.usePortal(null, null, portal);
		} else {
			throw new Error("Couldn't find portal.");
		}
			delay(200);
			Pather.moveTo(15189, 5917);
			break;
		case "a2":
			if (!quester && me.act !== 2) {
				this.changeAct(2);
			}

			action = "";

			break;
		case "a3":
			if(me.act !== 3){
		delay(rand(1,10)*1000);
					Town.move("atma");
					target = getUnit(1, 176); // Atma
					if (target && target.openMenu()) {
							me.cancel();
						} else {
							break;
						}
					Town.move("portalspot");
					if (!this.changeAct(3)) {
						break;
					}

					Town.move("portalspot");

					break;

		}
			action = "";

			break;
		case "a4":
			if (!quester && me.act !== 4) {
				this.changeAct(4);
			}

			action = "";

			break;
		case "a5":
			if (!quester && me.act !== 5) {
				this.changeAct(5);
			}
			
			action = "";
			
			break;
		}
		
		if (action.indexOf("talk") > -1) {
			this.talk(action.split(" ")[1]);
		}

		action = "";
		delay(500);
	}
	

	return true;
}
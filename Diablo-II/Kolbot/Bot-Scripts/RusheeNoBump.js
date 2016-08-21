function RusheeNoBump() {
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

			Town.move("palace");

			npc = getUnit(1, "jerhyn");

			if (!npc || !npc.openMenu()) {
				return false;
			}

			me.cancel();
			Town.move("meshif");

			npc = getUnit(1, "meshif");

			if (!npc || !npc.openMenu()) {
				return false;
			}

			Misc.useMenu(0x0D38);

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
			if (who == leaderName) {
				action = msg;
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
				object.counter = 1;
				break;
			case 1:
				object.counter = 2;
				break;
			case 2:
				object.counter = 3;
				object.reset = 1;
				break;
		}
		FileTools.writeText("logs/accounts.json", JSON.stringify(object));
		//print("current action : " + action);
		switch (action) {
		case "ready":
			//print("in ready switch");
			while (!leader.area) {
				leader = this.findLeader(leaderName);
				delay(500);
				//print("waiting on leader Area");
			}

			switch (leader.area) {
				case 37: // Catacombs level 4
					Pather.usePortal(37, leaderName);
					this.checkQuestMonster(156);

					if (me.mode == 17) {
						me.revive();
						
						while (!me.inTown) {
							delay(500);
						}
					} else {
						Pather.usePortal(1, leaderName);
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
					this.changeAct(3);

					action = "";

					break;
				case 83: // Travincal
					Pather.usePortal(83, leaderName);
					this.checkQuestMonster(getLocaleString(2863));
					this.checkQuestMonster(getLocaleString(2862));
					this.checkQuestMonster(getLocaleString(2860));

					delay(10000);
					if (me.mode === 17) {
						me.revive();
						
						while (!me.inTown) {
							delay(500);
						}
					} else {
						Pather.usePortal(75, leaderName);
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
					Pather.usePortal(108, leaderName);
						Pather.moveTo(7762, 5268);

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
					Pather.usePortal(120, leaderName);
					
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

			break;
		case me.name + " quest":
			say("I am quester.");

			quester = true;
			action = "";

			break;
		case "quit":
			quit();
			break;
		case "exit":
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
			if (!quester && me.act !== 3) {
				this.changeAct(3);
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
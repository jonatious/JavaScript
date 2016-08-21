function FullRushelp() {
	var i, j, stop, leader, leaderUnit, charClass, piece, skill, result, unit, player,
		commanders = [Config.Leader],
		attack = true,
		openContainers = true,
		classes = ["amazon", "sorceress", "necromancer", "paladin", "barbarian", "druid", "assassin"],
		action = "";

	// Get leader's Party Unit
	this.getLeader = function (name) {
		var player = getParty();

		if (player) {
			do {
				if (player.name === name) {
					return player;
				}
			} while (player.getNext());
		}

		return false;
	};

	// Get leader's Unit
	this.getLeaderUnit = function (name) {
		var player = getUnit(0, name);

		if (player) {
			do {
				if (!player.dead) {
					return player;
				}
			} while (player.getNext());
		}

		return false;
	};

	// Get leader's act from Party Unit
	this.checkLeaderAct = function (unit) {
		if (unit.area <= 39) {
			return 1;
		}

		if (unit.area >= 40 && unit.area <= 74) {
			return 2;
		}

		if (unit.area >= 75 && unit.area <= 102) {
			return 3;
		}

		if (unit.area >= 103 && unit.area <= 108) {
			return 4;
		}

		return 5;
	};

	// Change areas to where leader is
	this.checkExit = function (unit, area) {
		if (unit.inTown) {
			return false;
		}

		var i, target,
			exits = getArea().exits;

		for (i = 0; i < exits.length; i += 1) {
			if (exits[i].target === area) {
				return 1;
			}
		}

		if (unit.inTown) {
			target = getUnit(2, "waypoint");

			if (target && getDistance(me, target) < 20) {
				return 3;
			}
		}

		target = getUnit(2, "portal");

		if (target) {
			do {
				if (target.objtype === area) {
					Pather.usePortal(null, null, target);

					return 2;
				}
			} while (target.getNext());
		}

		// Arcane<->Cellar portal
		if ((me.area === 74 && area === 54) || (me.area === 54 && area === 74)) {
			Pather.usePortal(null);

			return 4;
		}

		// Tal-Rasha's tomb->Duriel's lair
		if (me.area >= 66 && me.area <= 72 && area === 73) {
			Pather.useUnit(2, 100, area);

			return 4;
		}

		// Throne->Chamber
		if (me.area === 131 && area === 132) {
			target = getUnit(2, 563);

			if (target) {
				Pather.usePortal(null, null, target);

				return 4;
			}
		}

		return false;
	};

	// Talk to a NPC
	this.talk = function (name) {
		if (!me.inTown) {
			//say("I'm not in town!");

			return false;
		}

		if (typeof name === "string") {
			name = name.toLowerCase();
		} else {
			//say("No NPC name given.");

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
		}

		//say("NPC not found.");
		Town.move("portalspot");

		return false;
	};

	// Change act after completing last act quest
	this.changeAct = function (act) {
		var npc, preArea, target;

		preArea = me.area;

		switch (act) {
		case 2:
			if (me.area >= 40) {
				break;
			}

			Pather.useWaypoint(40);
			
			break;
		case 3:
			if (me.area >= 75) {
				break;
			}

			Pather.useWaypoint(75);

			break;
		case 4:
			if (me.area >= 103) {
				break;
			}

			if (me.inTown) {
				Pather.useWaypoint(103);
			} else {
				delay(1500);

				target = getUnit(2, 342);

				if (target) {
					Pather.moveTo(target.x - 3, target.y - 1);
				}

				Pather.usePortal(null);
			}

			break;
		case 5:
			if (me.area >= 109) {
				break;
			}

			Pather.useWaypoint(109);

			break;
		}

		delay(2000);

		while (!me.area) {
			delay(500);
		}

		if (me.area === preArea) {
			me.cancel();
			Town.move("portalspot");
			//say("Act change failed.");

			return false;
		}

		Town.move("portalspot");
		//say("Act change successful.");

		if (act === 2) {
			//say("Don't forget to talk to Drognan after getting the Viper Amulet!");
		}

		return true;
	};

	this.pickPotions = function (range) {
		if (me.dead) {
			return false;
		}

		Town.clearBelt();

		while (!me.idle) {
			delay(40);
		}

		var status,
			pickList = [],
			item = getUnit(4);

		if (item) {
			do {
				if ((item.mode === 3 || item.mode === 5) && item.itemType >= 76 && item.itemType <= 78 && getDistance(me, item) <= range) {
					pickList.push(copyUnit(item));
				}
			} while (item.getNext());
		}

		pickList.sort(Pickit.sortItems);

		while (pickList.length > 0) {
			item = pickList.shift();

			if (item && copyUnit(item).x) {
				status = Pickit.checkItem(item).result;

				if (status && Pickit.canPick(item)) {
					Pickit.pickItem(item, status);
				}
			}
		}

		return true;
	};

	this.openContainers = function (range) {
		var unit, ox, oy,
			unitList = [],
			containers = ["chest", "loose rock", "hidden stash", "loose boulder", "corpseonstick", "casket", "armorstand", "weaponrack", "barrel", "holeanim",
							"roguecorpse", "ratnest", "corpse", "goo pile", "largeurn", "urn", "chest3", "jug", "skeleton", "guardcorpse", "sarcophagus",
							"cocoon", "basket", "stash", "hollow log", "hungskeleton", "pillar", "skullpile", "skull pile", "jar3", "jar2", "jar1", "bonechest", "woodchestl",
							"woodchestr", "barrel wilderness", "burialchestr", "burialchestl", "explodingchest", "chestl", "chestr", "icecavejar1", "icecavejar2",
							"icecavejar3", "icecavejar4", "deadperson", "deadperson2", "evilurn", "tomb1l", "tomb3l", "tomb2", "tomb3", "object2", "groundtomb", "groundtombl"
						];

		ox = me.x;
		oy = me.y;
		unit = getUnit(2);

		if (unit) {
			do {
				if (containers.indexOf(unit.name.toLowerCase()) > -1 && unit.mode === 0 && getDistance(me, unit) <= range) {
					unitList.push(copyUnit(unit));
				}
			} while (unit.getNext());
		}

		while (unitList.length > 0) {
			unitList.sort(Sort.units);

			unit = unitList.shift();

			if (unit) {
				Misc.openChest(unit);
				Pickit.pickItems();
			}
		}

		return true;
	};

	this.chatEvent = function (nick, msg) {
		if (msg && nick === Config.Leader) {
			switch (msg) {
			case "quit":
			case me.name + " quit":
				quit();

				break;
			case "r":
				if (me.mode === 17) {
					me.revive();
				}

				break;
			default:
				if (me.classid === 3 && msg.indexOf("aura ") > -1) {
					piece = msg.split(" ")[0];

					if (piece === me.name || piece === "all") {
						skill = parseInt(msg.split(" ")[2], 10);

						if (me.getSkill(skill, 1)) {
							//say("Active aura is: " + skill);

							Config.AttackSkill[2] = skill;
							Config.AttackSkill[4] = skill;

							Skill.setSkill(skill, 0);
							Attack.init();
						} else {
							//say("I don't have that aura.");
						}
					}

					break;
				}

				if (msg.indexOf("skill ") > -1) {
					piece = msg.split(" ")[0];

					if (charClass.indexOf(piece) > -1 || piece === me.name || piece === "all") {
						skill = parseInt(msg.split(" ")[2], 10);

						if (me.getSkill(skill, 1)) {
							//say("Attack skill is: " + skill);

							Config.AttackSkill[1] = skill;
							Config.AttackSkill[3] = skill;

							Attack.init();
						} else {
							//say("I don't have that skill.");
						}
					}

					break;
				}

				action = msg;

				break;
			}
		}

		if (msg && msg.split(" ")[0] === "leader" && commanders.indexOf(nick) > -1) {
			piece = msg.split(" ")[1];

			if (typeof piece === "string") {
				if (commanders.indexOf(piece) === -1) {
					commanders.push(piece);
				}

				//say("Switching leader to " + piece);

				Config.Leader = piece;
				leader = this.getLeader(Config.Leader);
				leaderUnit = this.getLeaderUnit(Config.Leader);
			}
		}
	};

	addEventListener("chatmsg", this.chatEvent);

	// Override config values that use TP
	Config.TownCheck = false;
	Config.TownHP = 0;
	Config.TownMP = 0;
	charClass = classes[me.classid];

	for (i = 0; i < 20; i += 1) {
		leader = this.getLeader(Config.Leader);

		if (leader) {
			break;
		}

		delay(1000);
	}

	if (!leader) {
		//say("Leader not found.");
		delay(1000);
		quit();
	} else {
		//say("Leader found.");
	}

	while (!Misc.inMyParty(Config.Leader)) {
		delay(500);
	}

	//say("Partied.");
	Town.doChores();
	Town.move("portalspot");
	// Main Loop
	while (Misc.inMyParty(Config.Leader)) {
		if (me.mode === 17) {
			while (!me.inTown) {
				me.revive();
				delay(1000);
			}
			Town.doChores();
			Town.move("portalspot");
			//say("I'm alive!");
		}

		while (stop) {
			delay(500);
		}

		if (!me.inTown) {
			if (!leaderUnit || !copyUnit(leaderUnit).x) {
				leaderUnit = this.getLeaderUnit(Config.Leader);

				if (leaderUnit) {
					//say("Leader unit found.");
				}
			}

			if (!leaderUnit) {
				player = getUnit(0);

				if (player) {
					do {
						if (player.name !== me.name) {
							Pather.moveToUnit(player);

							break;
						}
					} while (player.getNext());
				}
			}
			
			if (attack) {
				if (me.classid === 4) {
					Skill.cast(130);
					delay(1750);
				}else {
					Attack.clear(10, false, false, false, false);
				}
				this.pickPotions(20);
			}
			
			if (leaderUnit && getDistance(me.x, me.y, leaderUnit.x, leaderUnit.y) <= 60) {
				if (getDistance(me.x, me.y, leaderUnit.x, leaderUnit.y) > 4) {
					Pather.moveToUnit(leaderUnit);
				}
			}

			if (me.classid === 3 && Config.AttackSkill[2] > 0) {
				Skill.setSkill(Config.AttackSkill[2], 0);
			}

			if (leader.area !== me.area && !me.inTown) {
				while (leader.area === 0) {
					delay(100);
				}

				result = this.checkExit(leader, leader.area);

				switch (result) {
				case 1:
					//say("Taking exit.");
					delay(500);
					Pather.moveToExit(leader.area, true);

					break;
				case 2:
					//say("Taking portal.");

					break;
				case 3:
					//say("Taking waypoint.");
					delay(500);
					Pather.useWaypoint(leader.area, true);

					break;
				case 4:
					//say("Special transit.");

					break;
				}

				while (me.area === 0) {
					delay(100);
				}

				leaderUnit = this.getLeaderUnit(Config.Leader);
			}
		}

		switch (action) {
		case "move":
			Pather.moveTo(me.x + rand(-5, 5), me.y + rand(-5, 5));

			break;
		case "c":
			if (!me.inTown) {
				Town.getCorpse();
			}

			break;
		case "p":
			//say("!Picking items.");
			Pickit.pickItems();

			if (openContainers) {
				this.openContainers(20);
			}

			//say("!Done picking.");

			break;
		case "1":
			if (me.inTown && leader.inTown && this.checkLeaderAct(leader) !== me.act) {
				//say("Going to leader's town.");
				Town.goToTown(this.checkLeaderAct(leader));
				Town.move("portalspot");
			} else if (me.inTown) {
				//say("Going outside.");
				Town.goToTown(this.checkLeaderAct(leader));
				Town.move("portalspot");

				if (!Pather.usePortal(null, leader.name)) {
					break;
				}

				//while (!this.getLeaderUnit(Config.Leader) && !me.dead) {
					Attack.clear(30);
					delay(200);
					Pather.makePortal();
					Pather.usePortal(null, me.name);
				//}
			}

			break;
		case "2":
			//attack = false;
			if (!me.inTown) {
				delay(150);
				//say("Going to town.");
				//if (!Pather.usePortal(null, leader.name)) {
					Pather.makePortal();
					Pather.usePortal(null, me.name);
				//}
			}

			if(me.inTown) {
			delay(250);
				Town.doChores();
				Town.move("portalspot");
			}
			//attack = true;
			break;
		case "bo":
		if (me.inTown)
		Pather.usePortal(null, leader.name)
			if (me.classid === 4) {
				Precast.doPrecast(true);
			}
					Pather.makePortal();
					Pather.usePortal(null, me.name);
			break;
		case "a2":
			if (me.act !== 2) {
				this.changeAct(2);
			}

			action = "";
		case "a3":
			if (me.act !== 3) {
				this.changeAct(3);
			}

			action = "";
		case "a4":
			if (me.act !== 4) {
				this.changeAct(4);
			}

			action = "";
		case "a5":
			if (me.act !== 5) {
				this.changeAct(5);
			}

			action = "";
		}

		action = "";

		delay(100);
	}

	return true;
}
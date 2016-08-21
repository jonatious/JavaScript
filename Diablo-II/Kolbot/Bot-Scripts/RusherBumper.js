//me.gametype -> 1 = expansion || 0 = classic
//me.diff -> 0 = normal || 1 = nightmare || 2 = hell
//Config.RusherNoBump.Quests -> true = do stat/skill quests || false = NO STAT/SKILL QUESTS
//Config.RusherNoBump.Helper -> true = has a helper || false = there is no helper

function RusherBumper() {
	var charlevel = 0;
	//Change this for quests
	var quests = false;
	
	// find crushee
	var crushee;
	var helperr = true;
	this.chatEvent = function(nick, msg) {
		if (msg == 'rushee') {
			crushee = nick;
			//say("crusher");
		}
		if(msg.indexOf("level") != -1){
			msg = msg.split(" ");
			charlevel = msg[1]*1;
		}
	};

	this.callHelp = function() {
		if (helperr) {
			say("1");
		}
	}
	
	this.dismissHelp = function() {
		if (helperr) {
			//say("2");
			delay(2000);
		}
	}
	
	this.callLeech = function(clear, x, y) {
		var count = 0;
		say("ready");
		while (!this.playerIn()) {
			if (count > 4) {
				say("ready");
				count = 0;
			}
			if (clear) {
				Attack.clear(15);
			}
			if (x && y) {
				Pather.moveTo(x, y);
			}
			delay(250);
			count++;
		}
	}
	
	this.protectLeech = function(opp) {
		while (this.playerIn()) {
			if (!opp) {
				Attack.clear(15);
			}
			delay(250);
		}
	}
	
	this.playerIn = function (area) {
		if (!area) {
			area = me.area;
		}

		var party = getParty();

		if (party) {
			do {
				if (party.name === crushee && party.area === area) {
					return true;
				}
			} while (party.getNext());
		}

		return false;
	};

	this.playersInAct = function (act) {
		var area, party,
			areas = [0, 1, 40, 75, 103, 109];

		if (!act) {
			////print("no act specified");
			act = me.act;
		}

		area = areas[act];
		party = getParty();

		if (party) {
			do {
				if (party.name == crushee && party.area != area) {
					////print("not right act" + act);
					return false;
				}
			} while (party.getNext());
		}
		//print("must be right act");
		return true;
	};
	
	// den of evil : not going to try and add a leech to this, rusher has to be able to complete
	this.clearDen = function () {
		if (!me.getQuest([1, "clearDen"], 0)  ) {
			return false;
		}
		Town.doChores();
		var akara;

		if (!Town.goToTown(1) || !Pather.moveToExit([2, 8], true)) {
			throw new Error();
		}

		Pather.makePortal();
		this.callHelp();
		Precast.doPrecast(true);
		Attack.clearLevel();
		Town.goToTown();
		this.dismissHelp();
		
		say("talk akara");

		return true;
	};
	// andariel
	this.andariel = function () {
		
		Town.doChores();
		Pather.useWaypoint(35);
		Pather.makePortal();
		say("bo");
		delay(5000);
		Precast.doPrecast(true);
		
		var tpx = 22593;
		var tpy = 9578;
		if (!Pather.moveToExit([36, 37], true) || !Pather.moveTo(tpx, tpy)) {
			throw new Error("andy failed");
		}

		Pather.makePortal();
		this.callHelp();
		Attack.clear(25);
	
		this.callLeech(true, tpx, tpy);
		
		Pather.moveTo(22546, 9563);
		Pather.makePortal();
		this.callHelp();
		Attack.kill(156);
		
		Pather.moveTo(tpx, tpy);
		Pather.makePortal();
		say("andydone");
		Town.goToTown(2);
		delay(1000);
		say("a2");
		while (!this.playersInAct(2)) {
			delay(250);
		}

		return true;
	};
	// radament
	this.killRadament = function () {
		if (!Pather.accessToAct(2)  ) {
			return false;
		}

		var book, atma;

		if (!Town.goToTown() || !Pather.useWaypoint(48, true)) {
			throw new Error();
		}

		Precast.doPrecast(true);

		if (!Pather.moveToExit(49, true) || !Pather.moveToPreset(me.area, 2, 355)) {
			throw new Error();
		}
		
		Pather.makePortal();
		this.callHelp();
		Attack.kill(229); // Radament

		this.callLeech(true, me.x, me.y);
		
		this.protectLeech();
		
		this.dismissHelp();
		Pather.usePortal(null, me.name);

		return true;
	};
	// cube
	this.cube = function () {
		if (me.diff === 0) {
			Pather.useWaypoint(57);
			Precast.doPrecast(true);

			if (!Pather.moveToExit(60, true) || !Pather.moveToPreset(me.area, 2, 354)) {
				throw new Error("cube failed");
			}

			Pather.makePortal();
			this.callHelp();
			Attack.clear(25);
			
			this.callLeech(true);

			this.protectLeech();

			this.dismissHelp();
			Pather.usePortal(null, me.name);
		}

		return true;
	};
	// amulet
	this.amulet = function () {
		
		Town.doChores();
		Pather.useWaypoint(44);
		Precast.doPrecast(true);
		
		var tpx = 15044; 
		var tpy = 14045;
		if (!Pather.moveToExit([45, 58, 61], true) || !Pather.moveTo(tpx, tpy)) {
			throw new Error("amulet failed");
		}

		Pather.makePortal();
		this.callHelp();

		var altaMonsta = getUnit(1),
			monList = [];

		if (altaMonsta) {
			do {
				if (Attack.checkMonster(altaMonsta) && (!checkCollision(me, altaMonsta, 1) && getDistance(me, altaMonsta) <= 15)) {
					monList.push(copyUnit(altaMonsta));
				}
			} while (altaMonsta.getNext());
		}

		Attack.clearList(monList);
		Attack.clearLevel(0);
		
		this.callLeech();
		
		this.protectLeech();

		this.dismissHelp();
		
		Pather.usePortal(null, me.name);
		say("talk drognan");
		
		delay(3000); // small delay for crushee to talk to drognan
		
		return true;
	};
	// staff
	this.staff = function () {
		
		Town.doChores();
		Pather.useWaypoint(43);
		Precast.doPrecast(true);

		if (!Pather.moveToExit([62, 63, 64], true) || !Pather.moveToPreset(me.area, 2, 356)) {
			throw new Error("staff failed");
		}

		Pather.makePortal();
		this.callHelp();
		Attack.clear(25);
		
		this.callLeech(true, me.x, me.y);
		
		this.protectLeech();

		this.dismissHelp();
		
		Pather.usePortal(null, me.name);
		delay(2000); // small delay for crushee to make staff
		
		return true;
	};
	// summoner
	this.summoner = function () {
		// right up 25449 5081 (25431, 5011)
		// left up 25081 5446 (25011, 5446)
		// right down 25830 5447 (25866, 5431)
		// left down 25447 5822 (25431, 5861)

		
		Town.doChores();
		
		Pather.useWaypoint(74);
		Precast.doPrecast(true);

		var i, journal,
			preset = getPresetUnit(me.area, 2, 357),
			spot = {};

		switch (preset.roomx * 5 + preset.x) {
		case 25011:
			spot = {x: 25081, y: 5446};
			break;
		case 25866:
			spot = {x: 25830, y: 5447};
			break;
		case 25431:
			switch (preset.roomy * 5 + preset.y) {
			case 5011:
				spot = {x: 25449, y: 5081};
				break;
			case 5861:
				spot = {x: 25447, y: 5822};
				break;
			}

			break;
		}

		if (!Pather.moveToUnit(spot)) {
			throw new Error("summoner failed");
		}

		Pather.makePortal();
		this.callHelp();
		Attack.securePosition(me.x, me.y, 25, 3000);
		
		this.callLeech(true, spot.x, spot.y);
		
		Pather.moveToPreset(me.area, 2, 357);
		Attack.clear(15, 0, 250);

		this.protectLeech(true);

		Pather.moveToPreset(me.area, 2, 357);

		journal = getUnit(2, 357);

		for (i = 0; i < 5; i += 1) {
			journal.interact();
			delay(1000);
			me.cancel();

			if (Pather.getPortal(46)) {
				break;
			}
		}

		if (i === 5) {
			throw new Error("summoner failed");
		}
		
		Pather.usePortal(46);
		
		return true;
	};
	
	
	this.diablolevel = function () {
		// Sort function
	this.sort = function (a, b) {
		if (Config.BossPriority) {
			if ((a.spectype & 0x5) && (b.spectype & 0x5)) {
				return getDistance(me, a) - getDistance(me, b);
			}

			if (a.spectype & 0x5) {
				return -1;
			}

			if (b.spectype & 0x5) {
				return 1;
			}
		}

		// Entrance to Star / De Seis
		if (me.y > 5325 || me.y < 5260) {
			if (a.y > b.y) {
				return -1;
			}

			return 1;
		}

		// Vizier
		if (me.x < 7765) {
			if (a.x > b.x) {
				return -1;
			}

			return 1;
		}

		// Infector
		if (me.x > 7825) {
			if (!checkCollision(me, a, 0x1) && a.x < b.x) {
				return -1;
			}

			return 1;
		}

		return getDistance(me, a) - getDistance(me, b);
	};

	// general functions
	this.getLayout = function (seal, value) {
		var sealPreset = getPresetUnit(108, 2, seal);

		if (!seal) {
			throw new Error("Seal preset not found. Can't continue.");
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

	this.openSeal = function (classid) {
		var i, seal, warn;

		switch (classid) {
		case 396:
		case 394:
		case 392:
			warn = true;

			break;
		default:
			warn = false;

			break;
		}

		for (i = 0; i < 5; i += 1) {
			Pather.moveToPreset(me.area, 2, classid, classid === 394 ? 5 : 2, classid === 394 ? 5 : 0);

			seal = getUnit(2, classid);

			if (!seal) {
				return false;
			}

			if (seal.mode) { // for pubbies
				if (warn) {
					say(Config.Diablo.SealWarning);
				}

				return true;
			}

			warn = false;

			seal.interact();
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

		return false;
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

	this.getBoss = function (name) {
		var i, boss,
			glow = getUnit(2, 131);

		for (i = 0; i < 16; i += 1) {
			boss = getUnit(1, name);

			if (boss) {
				this.chaosPreattack(name, 8);

				return Attack.clear(40, 0, name, this.sort);
			}

			delay(250);
		}

		return !!glow;
	};

	this.vizierSeal = function () {
		print("Viz layout " + this.vizLayout);
		this.followPath(this.vizLayout === 1 ? this.starToVizA : this.starToVizB);

		if (!this.openSeal(395) || !this.openSeal(396)) {
			throw new Error("Failed to open Vizier seals.");
		}

		if (this.vizLayout === 1) {
			Pather.moveTo(7691, 5292);
		} else {
			Pather.moveTo(7695, 5316);
		}

		if (!this.getBoss(getLocaleString(2851))) {
			throw new Error("Failed to kill Vizier");
		}

		return true;
	};

	this.seisSeal = function () {
		print("Seis layout " + this.seisLayout);
		this.followPath(this.seisLayout === 1 ? this.starToSeisA : this.starToSeisB);

		if (!this.openSeal(394)) {
			throw new Error("Failed to open de Seis seal.");
		}

		if (this.seisLayout === 1) {
			Pather.moveTo(7771, 5196);
		} else {
			Pather.moveTo(7798, 5186);
		}

		if (!this.getBoss(getLocaleString(2852))) {
			throw new Error("Failed to kill de Seis");
		}

		return true;
	};

	this.infectorSeal = function () {
		print("Inf layout " + this.infLayout);
		this.followPath(this.infLayout === 1 ? this.starToInfA : this.starToInfB);

		if (!this.openSeal(392)) {
			throw new Error("Failed to open Infector seals.");
		}

		if (this.infLayout === 1) {
			delay(1);
		} else {
			Pather.moveTo(7928, 5295); // temp
		}

		if (!this.getBoss(getLocaleString(2853))) {
			throw new Error("Failed to kill Infector");
		}

		if (!this.openSeal(393)) {
			throw new Error("Failed to open Infector seals.");
		}

		return true;
	};

	this.diabloPrep = function () {
		var trapCheck,
			tick = getTickCount();

		while (getTickCount() - tick < 30000) {
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

					break;
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

	this.followPath = function (path) {
		var i;

		for (i = 0; i < path.length; i += 2) {
			if (this.cleared.length) {
				this.clearStrays();
			}

			Pather.moveTo(path[i], path[i + 1], 3, getDistance(me, path[i], path[i + 1]) > 50);
			Attack.clear(30, 0, false, this.sort);

			// Push cleared positions so they can be checked for strays
			this.cleared.push([path[i], path[i + 1]]);

			// After 5 nodes go back 2 nodes to check for monsters
			if (i === 10 && path.length > 16) {
				path = path.slice(6);
				i = 0;
			}
		}
	};

	this.clearStrays = function () {
		/*if (!Config.PublicMode) {
			return false;
		}*/

		var i,
			oldPos = {x: me.x, y: me.y},
			monster = getUnit(1);

		if (monster) {
			do {
				if (Attack.checkMonster(monster)) {
					for (i = 0; i < this.cleared.length; i += 1) {
						if (getDistance(monster, this.cleared[i][0], this.cleared[i][1]) < 30 && Attack.validSpot(monster.x, monster.y)) {
							me.overhead("we got a stray");
							Pather.moveToUnit(monster);
							Attack.clear(15, 0, false, this.sort);

							break;
						}
					}
				}
			} while (monster.getNext());
		}

		if (getDistance(me, oldPos.x, oldPos.y) > 5) {
			Pather.moveTo(oldPos.x, oldPos.y);
		}

		return true;
	};

	this.defendPlayers = function () {
		var player,
			oldPos = {x: me.x, y: me.y},
			monster = getUnit(1);

		if (monster) {
			do {
				if (Attack.checkMonster(monster)) {
					player = getUnit(0);

					if (player) {
						do {
							if (player.name !== me.name && getDistance(monster, player) < 30) {
								me.overhead("defending players");
								Pather.moveToUnit(monster);
								Attack.clear(15, 0, false, this.sort);
							}
						} while (player.getNext());
					}
				}
			} while (monster.getNext());
		}

		if (getDistance(me, oldPos.x, oldPos.y) > 5) {
			Pather.moveTo(oldPos.x, oldPos.y);
		}

		return true;
	};

	this.cleared = [];

	// path coordinates
	this.entranceToStar = [7794, 5517, 7791, 5491, 7768, 5459, 7775, 5424, 7817, 5458, 7777, 5408, 7769, 5379, 7777, 5357, 7809, 5359, 7805, 5330, 7780, 5317, 7791, 5293];
	this.starToVizA = [7759, 5295, 7734, 5295, 7716, 5295, 7718, 5276, 7697, 5292, 7678, 5293, 7665, 5276, 7662, 5314];
	this.starToVizB = [7759, 5295, 7734, 5295, 7716, 5295, 7701, 5315, 7666, 5313, 7653, 5284];
	this.starToSeisA = [7781, 5259, 7805, 5258, 7802, 5237, 7776, 5228, 7775, 5205, 7804, 5193, 7814, 5169, 7788, 5153];
	this.starToSeisB = [7781, 5259, 7805, 5258, 7802, 5237, 7776, 5228, 7811, 5218, 7807, 5194, 7779, 5193, 7774, 5160, 7803, 5154];
	this.starToInfA = [7809, 5268, 7834, 5306, 7852, 5280, 7852, 5310, 7869, 5294, 7895, 5295, 7919, 5290];
	this.starToInfB = [7809, 5268, 7834, 5306, 7852, 5280, 7852, 5310, 7869, 5294, 7895, 5274, 7927, 5275, 7932, 5297, 7923, 5313];

	// start
	Town.doChores();
	Pather.useWaypoint(Config.RandomPrecast ? "random" : 107);
	Precast.doPrecast(true);

	if (me.area !== 107) {
		Pather.useWaypoint(107);
	}

	if (!Pather.moveTo(7790, 5544)) {
		throw new Error("Failed to move to Chaos Sanctuary");
	}

	this.initLayout();

	if (Config.Diablo.Entrance) {
		Attack.clear(30, 0, false, this.sort);
		Pather.moveTo(7790, 5544);

		if (Config.PublicMode) {
			Pather.makePortal();
			say(Config.Diablo.EntranceTP);
		}

		Pather.moveTo(7790, 5544);
		Precast.doPrecast(true);
		Attack.clear(30, 0, false, this.sort);
		this.followPath(this.entranceToStar);
	} else {
		Pather.moveTo(7774, 5305);
		Attack.clear(15, 0, false, this.sort);
	}

	Pather.moveTo(7791, 5293);

	if (Config.PublicMode) {
		Pather.makePortal();
		say(Config.Diablo.StarTP);
	}

	Attack.clear(30, 0, false, this.sort);
	this.vizierSeal();
	this.seisSeal();
	Precast.doPrecast(true);
	this.infectorSeal();

	switch (me.classid) {
	case 1:
		Pather.moveTo(7792, 5294);

		break;
	default:
		Pather.moveTo(7788, 5292);

		break;
	}


	if (Config.PublicMode) {
		say(Config.Diablo.DiabloMsg);
	}

	this.diabloPrep();
	Attack.kill(243); // Diablo
	Pickit.pickItems();

	return true;
	};
	
	// duriel
	this.duriel = function () {
		if (me.inTown) {
			
			Town.doChores();
			Pather.useWaypoint(46);
			delay(250);
		Pather.makePortal();
		say("bo");
		delay(5000);
		}

		Precast.doPrecast(true);

		if (!Pather.moveToExit(getRoom().correcttomb, true) || !Pather.moveToPreset(me.area, 2, 152)) {
			throw new Error("duriel failed");
		}

		Pather.makePortal();
		this.callHelp();
		Attack.securePosition(me.x, me.y, 30, 3000);
		
		this.callLeech(true, me.x, me.y);
		
		Attack.securePosition(me.x, me.y, 30, 6000);
		this.protectLeech();

		while (!getUnit(2, 100)) {
			delay(250);
		}

		Pather.useUnit(2, 100, 73);
		Pather.makePortal();
		this.callHelp();
		Attack.kill(211);
		this.dismissHelp();
		
		// duriel's cave is... awkward. it allows tele only to specific spots
		Pather.moveTo(22629, 15712);
		Pather.moveTo(22612, 15709);
		Pather.moveTo(22579, 15705);
		Pather.moveTo(22577, 15649);
		Pather.moveTo(22577, 15614);
		Pather.makePortal();
		
		this.callLeech(false);
		
		this.protectLeech(true);

		if (!Pather.usePortal(null, me.name)) {
			Town.goToTown();
		}
		
		Pather.useWaypoint(52);
		Pather.moveToExit([51, 50], true);
		Pather.moveTo(10022, 5047);
		say("a3");
		Town.goToTown(3);
		Town.doChores();

		while (!this.playersInAct(3)) {
			delay(250);
		}

		return true;
	};
	// lam Essen
	this.lamEssen = function () {
		if (!Pather.accessToAct(3)  ) {
			return false;
		}
		
		var selfQ = !me.getQuest(17, 0);
		var stand, book, alkor;

		if (!Town.goToTown() || !Pather.useWaypoint(80, true)) {
			throw new Error();
		}

		Precast.doPrecast(true);

		if (!Pather.moveToExit(94, true) || !Pather.moveToPreset(me.area, 2, 193)) {
			throw new Error();
		}

		if (!selfQ) {
			Pather.makePortal();
			this.callHelp();
			Attack.clear(25);
			
			this.callLeech(true, me.x, me.y);
			
			this.protectLeech();
			
			this.dismissHelp();
			
			Pather.usePortal(null, me.name);
		}else {
			stand = getUnit(2, 193);

			Misc.openChest(stand);
			delay(300);

			book = getUnit(4, 548);
			Pickit.pickItem(book);
			
			Town.goToTown();
			Town.move("alkor");

			alkor = getUnit(1, "alkor");

			alkor.openMenu();
			me.cancel();
		}
		
		say("talk alkor");
		
		return true;
	};
	// travincal
	this.travincal = function () { // drop helpers @ durance 1
		
		Town.doChores();

		Pather.useWaypoint(83);
		Precast.doPrecast(true);

		var coords = [me.x, me.y];

		Pather.moveTo(coords[0] + 23, coords[1] - 102);
		Pather.makePortal();
		delay(2000);
		
		this.callLeech(true, coords[0] + 23, coords[1] - 102);
		delay(250);
		Pather.moveTo(coords[0] + 30, coords[1] - 134);
		Pather.moveTo(coords[0] + 86, coords[1] - 130);
		Pather.moveTo(coords[0] + 71, coords[1] - 94);
		Pather.makePortal();
		this.callHelp();
		
		Attack.kill(getLocaleString(2863));
		Attack.kill(getLocaleString(2862));
		Attack.kill(getLocaleString(2860));
		
		this.dismissHelp();
		delay(1000);
		
		Pather.moveTo(coords[0] + 23, coords[1] - 102);
		Pather.makePortal();
		say("travdone");
		while (this.playerIn()){
			delay(3000);
			say("travdone");	
		}
		Pather.usePortal(null, me.name);
		delay(3000);

		say("talk cain");
		return true;
	};
	// mephisto
	this.mephisto = function () {
		
		Town.doChores();

		Pather.useWaypoint(101);
		Pather.makePortal();
		say("bo");
		delay(5000);
		Precast.doPrecast(true);
		Pather.moveToExit(102, true);
		Pather.moveTo(17591, 8070);
		Pather.makePortal();

		var monsta,
			monList = [];

		monsta = getUnit(1);

		if (monsta) {
			do {
				if (Attack.checkMonster(monsta) && getDistance(me, monsta) <= 25) {
					monList.push(copyUnit(monsta));
				}
			} while (monsta.getNext());
		}

		Attack.clearList(monList);
		//this.callHelp();
		
		this.callLeech(false, 17591, 8070);

		var mephypos = getUnit(1, 242);
		Pather.moveTo(mephypos.x, mephypos.y);
		Pather.makePortal();
		this.callHelp();
		Attack.kill(242);
		
		say("a4");
		
		Pather.moveTo(17617, 8067);
		Attack.clear(30);
		Pather.moveTo(17591, 8070);
		
		this.protectLeech();
		
		while (!this.playersInAct(4)) {
			delay(250);
		}
		Pather.usePortal(null);

		return true;
	};
	// izual
	this.killIzual = function () {
		if (!Pather.accessToAct(4)  ) {
			return false;
		}
		var selfQ = !me.getQuest(25, 0);
		var tyrael;

		if (!Town.goToTown() || !Pather.useWaypoint(106, true)) {
			throw new Error();
		}

		Precast.doPrecast(true);

		if (!Pather.moveToPreset(105, 1, 256)) {
			return false;
		}

		if (!selfQ) {
			Pather.makePortal();
			this.callLeech();
		}
		Attack.kill(256); // Izual
		if (!selfQ) {
			this.protectLeech();
			Pather.usePortal(null, me.name);
		}

		Town.goToTown();
		say("talk tyrael");

		return true;
	};
	// diablo
	this.diablo = function () {
		this.getLayout = function (seal, value) {
			var sealPreset = getPresetUnit(108, 2, seal);

			if (!seal) {
				throw new Error("Seal preset not found. Can't continue.");
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

			for (i = 0; i < (name === getLocaleString(2853) ? 14 : 12); i += 1) {
				boss = getUnit(1, name);

				if (boss) {
					if (name === getLocaleString(2852)) {
						this.chaosPreattack(getLocaleString(2852), 8);
					}
					Attack.kill(name);
					Pickit.pickItems();
					Attack.clear(15);
					this.dismissHelp();
					
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

		this.openSeal = function (id) {
			Pather.moveToPreset(108, 2, id, 4);

			var i, tick,
				seal = getUnit(2, id);

			if (seal) {
				for (i = 0; i < 3; i += 1) {
					seal.interact();

					tick = getTickCount();

					while (getTickCount() - tick < 500) {
						if (seal.mode) {
							return true;
						}

						delay(10);
					}
				}
			}

			return false;
		};

		
		Town.doChores();

		Pather.useWaypoint(107);
		Precast.doPrecast(true);
		Pather.moveTo(7790, 5544);
		
		this.initLayout();
		if (this.vizLayout === 1) {
			Pather.moveTo(7691, 5292);
		} else {
			Pather.moveTo(7695, 5316);
		}
		
		Pather.makePortal();
		if (!this.openSeal(395) || !this.openSeal(396)) {
			throw new Error("Failed to open seals");
		}
		this.callHelp();

		if (this.vizLayout === 1) {
			Pather.moveTo(7691, 5292);
		} else {
			Pather.moveTo(7695, 5316);
		}

		if (!this.getBoss(getLocaleString(2851))) {
			throw new Error("Failed to kill Vizier");
		}

		if (this.seisLayout === 1) {
			Pather.moveTo(7771, 5223);
		} else {
			Pather.moveTo(7777, 5181);
		}
		Pather.makePortal();
		if (!this.openSeal(394)) {
			throw new Error("Failed to open seals");
		}
		this.callHelp();

		if (this.seisLayout === 1) {
			Pather.moveTo(7771, 5196);
		} else {
			Pather.moveTo(7798, 5186);
		}

		if (!this.getBoss(getLocaleString(2852))) {
			throw new Error("Failed to kill de Seis");
		}

		if (this.infLayout === 1) {
			Pather.moveToPreset(108, 2, 393, 4);
		} else {
			Pather.moveTo(7928, 5295); // temp
		}
		Pather.makePortal();
		if (!this.openSeal(392) || !this.openSeal(393)) {
			throw new Error("Failed to open seals");
		}
		this.callHelp();

		if (this.infLayout === 1) {
			delay(1);
		} else {
			Pather.moveTo(7928, 5295); // temp
		}

		if (!this.getBoss(getLocaleString(2853))) {
			throw new Error("Failed to kill Infector");
		}

		Pather.moveTo(7763, 5267);
		Pather.makePortal();
		this.callLeech();
		

		Pather.moveTo(7793, 5293);
		while (!getUnit(1, 243)) {
			delay(500);
		}
		Pather.makePortal();
		this.callHelp();

		Attack.kill(243);

		if (!Pather.usePortal(null, me.name)) {
			Town.goToTown();
		}

		delay(1000);
		say("a5");
		
		while (!this.playersInAct(5)) {
			delay(250);
		}
		
		this.dismissHelp();
		
		return true;
	};
	// shenk
	this.killShenk = function () {
		if (!Pather.accessToAct(5)) {
			return false;
		}
		
		if (!Town.goToTown() || !Pather.useWaypoint(111, true)) {
			throw new Error();
		}

		Precast.doPrecast(true);
		Pather.moveTo(3883, 5113);
			Pather.makePortal();
			this.callLeech(false);
			this.callHelp();
			
		Attack.kill(getLocaleString(22435)); // Shenk the Overseer
		this.dismissHelp();
		delay(2000);
		
			Town.goToTown();

		return true;
	};
	// anya
	this.freeAnya = function () {
		if (!Pather.accessToAct(5)  ) {
			return false;
		}

		var selfQ = !me.getQuest(37, 0);

		var anya, malah, scroll;

		if (!Town.goToTown() || !Pather.useWaypoint(113, true)) {
			throw new Error();
		}

		Precast.doPrecast(true);

		if (!Pather.moveToExit(114, true) || !Pather.moveToPreset(me.area, 2, 460)) {
			throw new Error();
		}

		delay(1000);

		anya = getUnit(2, 558);

		Pather.moveToUnit(anya);
		if (!SelfQ) {
			Pather.makePortal();
			this.callHelp();
			Attack.clear(20);
			
			this.callLeech(true, me.x, me.y);
			
			for (var i=0;i<5;i++) // need to confirm these timings
			{ 
				Attack.clear(15);
				delay(750);
			}
			
			this.dismissHelp();
			
			Pather.usePortal(null, me.name);
			
		} else {
			anya.interact();
			delay(300);
			me.cancel();
			Town.goToTown();
			Town.move("malah");

			malah = getUnit(1, "malah");

			malah.openMenu();
			me.cancel();
			Town.move("portalspot");
			Pather.usePortal(114, me.name);
			anya.interact();
			delay(300);
			me.cancel();
			Town.goToTown();
			Town.move("malah");
			malah.openMenu();
			me.cancel();
			delay(500);

			scroll = me.getItem(646);

			if (scroll) {
				clickItem(1, scroll);
			}
		}
		
		say("talk malah");
		
		return true;
	};
	// ancients
	this.ancients = function () {
		var altar;

		Town.doChores();
		Pather.useWaypoint(118);
		Precast.doPrecast(true);

		if (!Pather.moveToExit(120, true)) {
			throw new Error("Failed to go to Ancients way.");
		}
		Pather.moveTo(10085, 12630);
		delay(1000);
		Pather.makePortal();
		delay(200);
		this.callLeech(false);
		delay(200);
		say("ancients");
		delay(5000);
		
		altar = getUnit(2, 546);

		if (altar) {
			while (altar.mode !== 2) {
				Pather.moveToUnit(altar);
				altar.interact();
				delay(1000);
				me.cancel();
			}
		}

		while (!getUnit(1, 542)) {
			delay(250);
		}

		Attack.clear(50);
		Pather.moveTo(10057, 12645);
		
		this.dismissHelp();
		
		
		Precast.doPrecast(true);
		
		Pather.moveToExit(128, true);
		Attack.clearLevel(Config.ClearType);
		Pather.moveToExit(129, true);
		Attack.clearLevel(Config.ClearType);
		Pather.moveToExit(130, true);
		Attack.clearLevel(Config.ClearType);
		Pather.moveToExit(131, true);
	return true;
};
	
	// baal
	this.baal = function () {
		var tick, portal;

		this.preattack = function () {
			var check;

			switch (me.classid) {
			case 1:
				if ([56, 59, 64].indexOf(Config.AttackSkill[1]) > -1) {
					if (me.getState(121)) {
						delay(500);
					} else {
						Skill.cast(Config.AttackSkill[1], 0, 15093, 5024);
					}
				}

				return true;
			case 3: // Paladin
				if (Config.AttackSkill[3] !== 112) {
					return false;
				}

				if (getDistance(me, 15093, 5029) > 3) {
					Pather.moveTo(15093, 5029);
				}

				if (Config.AttackSkill[4] > 0) {
					Skill.setSkill(Config.AttackSkill[4], 0);
				}

				Skill.cast(Config.AttackSkill[3], 1);

				return true;
			case 5: // Druid
				if (Config.AttackSkill[3] === 245) {
					Skill.cast(Config.AttackSkill[3], 0, 15093, 5029);

					return true;
				}

				break;
			case 6:
				if (Config.UseTraps) {
					check = ClassAttack.checkTraps({x: 15093, y: 5029});

					if (check) {
						ClassAttack.placeTraps({x: 15093, y: 5029}, 5);

						return true;
					}
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
				pos = [15097, 5054, 15085, 5053, 15085, 5040, 15098, 5040, 15099, 5022, 15086, 5024];

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
				Attack.clear(30);
			}
		};

		this.checkHydra = function () {
			var monster = getUnit(1, "hydra");

			if (monster) {
				do {
					if (monster.mode !== 12 && monster.getStat(172) !== 2) {
						Pather.moveTo(15118, 5002);

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
		
		Precast.doPrecast(true);

		Attack.clearLevel(Config.ClearType);

		Pather.moveTo(15113, 5040);
		Pather.makePortal();
		this.callHelp();
		Attack.clear(15);
		this.clearThrone();

		tick = getTickCount();
		Pather.moveTo(15093, me.classid === 3 ? 5029 : 5039);

MainLoop:
		while (true) {
			if (getDistance(me, 15093, me.classid === 3 ? 5029 : 5039) > 3) {
				Pather.moveTo(15093, me.classid === 3 ? 5029 : 5039);
			}

			if (!getUnit(1, 543)) {
				break MainLoop;
			}

			switch (this.checkThrone()) {
			case 1:
				say("BaalReady");
				Attack.clear(40);

				tick = getTickCount();

				Precast.doPrecast(true);

				break;
			case 2:
				say("BaalReady");
				Attack.clear(40);

				tick = getTickCount();

				break;
			case 4:
				say("BaalReady");
				Attack.clear(40);
				
				tick = getTickCount();

				break;
			case 3:
				say("BaalReady");
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

			Precast.doPrecast(false);
			delay(10);
		}

		Pather.moveTo(15092, 5011);
		Precast.doPrecast(true);

		while (getUnit(1, 543)) {
			delay(500);
		}

		delay(1000);

		portal = getUnit(2, 563);

		if (portal) {
			Pather.usePortal(null, null, portal);
		} else {
			throw new Error("Couldn't find portal.");
		}

		Pather.makePortal();
		
		
			while (!this.playerIn())
				Attack.clear(15);
		
		Pather.moveTo(15134, 5923);
		Attack.kill(544); // Baal
		Pickit.pickItems();

		return true;
	};
	
	
	addEventListener("chatmsg", this.chatEvent);
	while (!crushee) {
		delay(5000);
		say("I need a rushee");
	}
	say("rusher");
	delay(3000);
	say(crushee + " quest");
	Town.doChores();
	delay(1000);
	while(charlevel == 0){
		say("tell level");
		delay(3000);
		}
	//delay(2000);
	if(me.diff == 2 && (this.playersInAct(4) || this.playersInAct(5)) && charlevel < 60)
	{
		say("leveling");
		this.diablolevel();
	}
	else
	{
	if (this.playersInAct(1)) {
		if(quests)
		this.clearDen();
		this.andariel();
		delay(2000);
	}
	if (this.playersInAct(2)) {
		if(quests)
		this.killRadament();
		this.cube();
		this.amulet();
		this.staff();
		this.summoner();
		this.duriel();
		delay(2000);
	}
	if (this.playersInAct(3)) {
		if ((me.diff != 2 && me.gametype == 0) || me.gametype == 1) {
		if(quests)
		this.lamEssen();
		this.travincal();
			this.mephisto();
		}
	}
	if (this.playersInAct(4)) {
		if ((me.gametype == 0 && me.diff != 2) || me.gametype == 1) {
		if(quests)
			this.killIzual();
			this.diablo();
		}
	}
	if (me.gametype == 1) {
		if (this.playersInAct(5)) {
		if(quests)
			this.killShenk();
		if(quests)
			this.freeAnya();
				this.ancients();
				this.baal();
		}
	}
	}
	delay(1000);
	say("exit");
	delay(5000);
	return true;
}
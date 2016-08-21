/*
* 	leveller needs catacombs lvl 2 and ancients way wps and bRunners need ancients way wp as well.
*	getShrine char waits for leecher to enter and keeps the area clear
*	bRunners other than leader goto ws 2 and precast b4 they go into throne
*	leveller will take very less time to go and take shrine and come back to throne 
*	dRunners should be strictly hdin to not chicken. it is designed for pallys to clear seals with good pre attack positions :)
*	Have fun :D
*/

var getShrine = "Sharpness"; // toon that gets the xp shrine
var tpShrine = "TheQueen"; // toon that loohs for and tps the xp shrine
var Levellers = ["Sharpness"]; // list of toons that are being leveled
var bRunners = ["TheDiablo", "TheQueen","TheStone", "TheEnergy"]; // Baal runners. First one is the command giver and tp'er
var dRunners = ["DonaldDuck", "TheLight"]; // Diablo runners. First one is the command giver and tp'er
var nRunner = "TheKnight"; // sehnk and nilhathak runner
var diabloPercent = 30; // percent to prep diablo to for quick kill when leecher enters portal
var baalPercent = 22; // percent to prep baal to for quick kill when leecher enters portal
var flag=0;
var flag1=0;
var flag2=0;
var flag3=0;

// Do not edit below this comment
var tDone = false;
var tReady = false;
var dDone = false;
var dReady = false;
var nReady = false;
var bDone = false;
var nDone = false;
var bReady = false;
var sDone = false;
var sReady = false;
var shrined = false;
var bitsafe = false;
var baalhelp = true;
var shrineArea = 0;

var Leveller = function () {

	
	addEventListener("chatmsg",
		function (who, msg) {
			if (who === bRunners[0]) {
				if (msg.indexOf("safe") !== -1) {
					tReady = true;
				}

				if (msg.indexOf("throne") !== -1) {
					tDone = true;
				}

				if (msg.indexOf("baal") !== -1) {
					bReady = true;
				}

				if (msg.indexOf("done") !== -1) {
					bDone = true;
				}
				
				if (msg.indexOf("bitafe") !== -1) {
					bitsafe = true;
				}
			}
			
			if(who === Levellers[0]){
				if (msg.indexOf("nih dead") !== -1) {
					nDone = true;
				}
				
				if (msg.indexOf("shenkD") !== -1) {
					sDone = true;
					if(me.name === nRunner)
					say("shenkD");
					}
				
				if (msg.indexOf("baaldone") !== -1) {
					sDone = true;
					if(me.name === bRunners[0])
					say("done");
					}
				
				if (msg.indexOf("down") !== -1) {
					dDone = true;
				}
				/*if (msg.indexOf("leaveit") !== -1) {
					if (me.name === nRunner) {
					Town.goToTown();
					this.nilhathak();
				}}*/
				
				}

			if(who === nRunner){
				if (msg.indexOf("nihl") !== -1) {
					nReady = true;
				}
				if (msg.indexOf("shenkR") !== -1) {
					sReady = true;
				}
				if (msg.indexOf("shenkD") !== -1) {
					sDone = true;
				}
				}

			if (who === dRunners[0]) {
				if (msg.indexOf("diablo") !== -1) {
					dReady = true;
				}

				if (msg.indexOf("down") !== -1) {
					dDone = true;
				}
			}

			if (who === tpShrine) {
				switch (msg) {
					case "1":
						shrineArea = 1;
					break;
					case "2":
						shrineArea = 2;
					break;
					case "3":
						shrineArea = 3;
					break;
					case "4":
						shrineArea = 4;
					break;
					default:
						shrineArea = -1;
					break;
				}

				if (me.name === getShrine) {
					switch (me.area) {
						case 109:
							while(!Pather.usePortal(118, bRunners[2]))
							delay(250);
							Pather.useWaypoint(35, true);
							if(!Pather.usePortal(1, dRunners[1]))
							Pather.useWaypoint(1, true);
							if (Pather.usePortal(shrineArea, tpShrine)) {
								Misc.getShrinesInArea(shrineArea, 15, true);
								Pather.usePortal(1, tpShrine);
								shrined = true;
							} else {
								shrined = true;
							}

							if (tReady && !tDone) {
								if(!Pather.usePortal(35, dRunners[1]))
							Pather.useWaypoint(35, true);
							delay(100);
								Pather.useWaypoint(118);
								Pather.usePortal(109, bRunners[2]);
								Pather.usePortal(131, bRunners[0]);
							}

							if (!tReady) {
								Pather.usePortal(35, dRunners[1]);
								delay(100);
								Pather.useWaypoint(118);
								Pather.usePortal(109, bRunners[2]);
							}
						break;
						case 110:
								Town.goToTown(5);
								while(!Pather.usePortal(118, bRunners[2]))
								delay(250);
								Pather.useWaypoint(35, true);
								if(!Pather.usePortal(1, dRunners[1]))
							Pather.useWaypoint(1, true);
							if (Pather.usePortal(shrineArea, tpShrine)) {
								Misc.getShrinesInArea(shrineArea, 15, true);
								Pather.usePortal(1, tpShrine);
								shrined = true;
							} else {
								shrined = true;
							}
							
							if (tReady && !tDone) {
								if(!Pather.usePortal(35, dRunners[1]))
							Pather.useWaypoint(35, true);
							delay(100);
								Pather.useWaypoint(118);
								Pather.usePortal(109, bRunners[2]);
								Pather.usePortal(131, bRunners[0]);
							}

							if (!tReady) {
								if(!Pather.usePortal(35, dRunners[1]))
							Pather.useWaypoint(35, true);
							delay(100);
								Pather.useWaypoint(118);
								Pather.usePortal(109, bRunners[2]);
							}
							break;
							
						case 131:
							if (Pather.usePortal(109, bRunners[0])) {
							Pather.usePortal(118, bRunners[2]);
							Pather.useWaypoint(35, true);
							if(!Pather.usePortal(1, dRunners[1]))
							Pather.useWaypoint(1, true);

								if (Pather.usePortal(shrineArea, tpShrine)) {
									Misc.getShrinesInArea(shrineArea, 15, true);
									Pather.usePortal(1, tpShrine);
									shrined = true;
								} else {
									shrined = true;
								}
							}

							if (!tDone) {
								if(!Pather.usePortal(35, dRunners[1]))
							Pather.useWaypoint(35, true);
								Pather.useWaypoint(118, true);
								Pather.usePortal(109, bRunners[2]);
								Pather.usePortal(131, bRunners[0]);
							}

							if (tDone) {
								Town.goToTown(4);
								Town.move("portalspot");
							}
						break;
					}
				}
			}
		});

	this.getLevellersIn = function () {
		var party = getParty();

		if (party) {
			do {
				if (Levellers.indexOf(party.name) !== -1 && party.area !== me.area) {
					return false;
				}
			} while (party.getNext());
		}

		return true;
	};

	this.getCorpse = function () {
		if (me.mode === 17) {
			me.revive();
			Town.move("portalspot");
			Pather.usePortal(131, bRunners[0]);
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

	this.leechThrone = function () {
		Town.goToTown(5);
		Town.move("portalspot");
		Pather.usePortal(131, bRunners[0]);
		say("leaveit");
		Pather.moveTo(15118, 5055);
		Precast.doPrecast(true);

		while (!tDone) {
			this.getCorpse();
		Attack.clear(15);
			delay(750);
		Pather.moveTo(15118, 5055);
		}

		Pather.usePortal(109, bRunners[0]);
	};

	this.leechDiablo = function () {
		Pather.usePortal(118, bRunners[2]);
		Pather.useWaypoint(103, true);
		delay(50);
		Town.move("portalspot");
		Pather.usePortal(108, dRunners[0]);
		delay(50);
		//Pather.moveTo(7792, 5294);
		var diablopos = getUnit(1, 243);
		Pather.moveTo(diablopos.x, diablopos.y);
			Attack.kill(243);
			say("down");
		Precast.doPrecast(true);
		Town.goToTown();
				Pather.useWaypoint(118, true);
				Pather.usePortal(109, bRunners[2]);
				Town.move("portalspot");

				while (!bReady) {
					delay(250);
				}

				this.leechBaal();
	};
	
	this.nilhathak = function () {
	Town.doChores();
	Pather.useWaypoint(123,true);
	Precast.doPrecast(true);

	if (!Pather.moveToExit(124, true)) {
		throw new Error("Failed to go to Nihlathak");
	}

	Pather.moveToPreset(me.area, 2, 462, 0, 0, false, true);

	if (Config.Nihlathak.ViperQuit && getUnit(1, 597)) {
		print("Tomb Vipers found.");

		return true;
	}
	//	Pather.moveTo(12683, 5045);
	var jj = me.x;
	var hh = me.y;
	Attack.hurt(526, 55);
	Pather.moveTo(jj, hh);
	Attack.clear(10);
	while(!sDone)
	Attack.clear(10);
	Pather.moveTo(jj, hh);
	Town.goToTown(5);
	say("nihl");
	return true;
	};
	
	this.shenk = function () {
	Town.doChores();
	Pather.useWaypoint(111,true);
	Precast.doPrecast(true);
	Pather.moveTo(3917, 5125);
	//Attack.clear(5);
	//ttack.hurt(getLocaleString(22435),99); 
	Pather.moveTo(3917, 5125);
	say("shenkR");
	Town.goToTown(5);	
	return true;
	};
	
	this.mephisto = function () {
	Town.doChores();
	Pather.useWaypoint(101);
	Precast.doPrecast(true);
	if (!Pather.moveToExit(102, true)) {
		throw new Error("Failed to move to Durance Level 3");
	}
	Pather.moveTo(17566, 8069);
	Attack.kill(242);
	Pickit.pickItems();
	delay(200);
		Pather.moveTo(17590, 8068);
		delay(1800);
		Pather.moveTo(17601, 8070);
		delay(100);
		while(!Pather.usePortal(null))
		delay(200);
	Town.goToTown(4);
	Town.doChores();
	Town.move("portalspot");
	while(!dDone)
	delay(250);
	Pather.usePortal(108, null);
	delay(50);
	Pather.moveTo(7792, 5294);
	Pickit.pickItems();
	delay(300);
	Pather.moveTo(7763, 5267);
	delay(1000);
	Pather.usePortal(103, null);
	Town.goToTown(5);
	Town.doChores();
	Town.move("portalspot");
	while(!bDone)
	delay(250);
	Pather.usePortal(132, Levellers[0]);
	Pickit.pickItems();
	while(!nDone)
	delay(400);
	return true;
	};

	this.searchForShrine = function () {
		var i;

		Town.goToTown(1);
		Pather.useWaypoint(4,true);
		Precast.doPrecast(true);

		for (i = 4; i > 1; i -= 1) {
			if (Misc.getShrinesInArea(i, 15, false)) {
				while(!sDone && flag2 < 40){
				Attack.securePosition(me.x, me.y, 30, 30);
				delay(250);
				flag2=flag2+1;
				}
				while(!bitsafe){
				Attack.securePosition(me.x, me.y, 30, 30);
				delay(100);}
				delay(1000);
				say(me.area);
				Pather.makePortal();
				while (!this.getLevellersIn() && flag1 <40) {
					Attack.securePosition(me.x, me.y, 30, 50);
					delay(250);
					flag1 = flag1 +1;
				}
				Town.goToTown(5);
				return;
			}
			delay(500);
		}
		Town.goToTown();
	};

	this.leechBaal = function () {
		Pather.usePortal(132, bRunners[0]);
		//Pather.moveTo(15193, 5913);
		Pather.moveTo(15134, 5923);
		this.kill(544); // Baal
		if(baalhelp){
		while (!bDone) {
			delay(200);
		}}
		say("baaldone");
	};

	this.kill = function (classId) {
		var i, target, gid,
			attackCount = 0;

		if (typeof classId === "object") {
			target = classId;
		}

		for (i = 0; !target && i < 5; i += 1) {
			target = getUnit(1, classId);

			delay(200);
		}

		if (!target) {
			return false;
		}

		gid = target.gid;

		while (attackCount < 300 && Attack.checkMonster(target) && Attack.skipCheck(target)) {
			Misc.townCheck();

			if (!target || !copyUnit(target).x) { // Check if unit got invalidated, happens if necro raises a skeleton from the boss's corpse.
				target = getUnit(1, -1, -1, gid);

				if (!target) {
					break;
				}
			}

			if (Config.Dodge && me.hp * 100 / me.hpmax <= Config.DodgeHP) {
				Attack.deploy(target, Config.DodgeRange, 5, 9);
			}

			if (attackCount > 0 && attackCount % 15 === 0 && Skill.getRange(Config.AttackSkill[1]) < 4) {
				Packet.flash(me.gid);
			}

			if (!ClassAttack.doAttack(target, attackCount % 15 === 0)) {
				return false;
			}

			attackCount += 1;
		}

		if (attackCount === Config.MaxAttacks) {
			return false;
		}

		ClassAttack.afterAttack();

		if (!target || !copyUnit(target).x) {
			return true;
		}

		if (target.hp > 0 && target.mode !== 0 && target.mode !== 12) {
			return false;
		}

		return true;
	};

	this.diablo = function () {
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
				this.chaosPreattack(name, 8);

				try {
					Attack.kill(name);
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
	if(me.name === dRunners[0]) {
	Pather.useWaypoint(107);}
	else
	{Pather.useWaypoint(35);}
	Precast.doPrecast(true);
	if(me.name === dRunners[1]) {
	Pather.makePortal();
	Pather.useWaypoint(107);}
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

	if (this.infLayout === 1) {
		delay(1);
	} else {
		Pather.moveTo(7928, 5295); // temp
	}

	if (!this.getBoss(getLocaleString(2853))) {
		throw new Error("Failed to kill Infector");
	}

		Pather.moveTo(7763, 5267);

		if (me.name === dRunners[0]) {
			Pather.makePortal();
		}
		
		if (me.name !== dRunners[0]) {
			Pather.usePortal(103, null)
			Town.doChores();
			while (true) {
				delay(1000);
			}
		}

		while (!getUnit(1, 243)) {
			delay(500);
		}

		Attack.hurt(243, diabloPercent);

		if (me.name === dRunners[0]) {
			Pather.moveTo(7763, 5267);
		}



		if (me.name === dRunners[0]) {
			say("diablo");
		}
		Town.goToTown();
		Town.doChores();
			while (true) {
			delay(1000);
		}

		/*while (!this.getLevellersIn()) {
			delay(250);
		}

		Pather.moveTo(7792, 5294);

		if (!this.kill(243)) {
			Pickit.pickItems();
			if (me.name === dRunners[0]) {
				say("down");
				Pather.moveTo(7763, 5267);

				if (!Pather.usePortal(null, null)) {
					Town.goToTown();
				}
			}
		}
		
		say("down");
		Pickit.pickItems();
		Pather.moveTo(7763, 5267);
		if (!Pather.usePortal(null, null)) {
			Town.goToTown();
		}*/
		while (true) {
			delay(1000);
		}
	};

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
				if (i == pos.length - 8)
				if(me.name === bRunners[0])
				say("bitafe");
				Attack.clear(30);
			}
		};

		if (me.inTown) {
			Town.doChores();

			if (me.name === bRunners[0]) {
				Pather.useWaypoint(129, true);
				Precast.doPrecast(true);

				if (!Pather.moveToExit([130, 131], true)) {
					throw new Error("Failed to move to Throne of Destruction.");
				}

				Pather.moveTo(15118, 5003);
				Pather.makePortal();
				Attack.clear(15);
			} else if(me.name !== bRunners[1]) {
				Pather.useWaypoint(118, true);
				Attack.clear(20);
				Precast.doPrecast(true);
				Town.goToTown(5);
			Town.move("portalspot");
			}
			while(!Pather.usePortal(131, null)) {
					delay(250);
				}
		}

		Attack.clear(15);
		this.clearThrone();

		if (me.name === bRunners[0]) {
			Pather.moveTo(15118, 5045);
			Pather.makePortal();
			say("safe");
		}

		
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
				Attack.clear(40);

				tick = getTickCount();
				
 		if ((me.name === bRunners[3]) || (me.name === bRunners[4]))  {
		Town.goToTown(5);
		while(!tDone)
		delay(200);
		Pather.usePortal(131,null);
		Pather.moveTo(15092, 5011);
		Precast.doPrecast(true);
				Pickit.pickItems();

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

		Pather.moveTo(15134, 5923);
		Attack.hurt(544, baalPercent); // Baal

		Pather.moveTo(15213, 5908);
		if (me.name !== bRunners[0]) {
			while(!Pather.usePortal(109,bRunners[0]))
			delay(300);
			while (true) {
				delay(1000);
			}
		}
		} 

				Precast.doPrecast(true);

				break;
			case 2:
				Attack.clear(40);

				tick = getTickCount();
 		if ((me.name === bRunners[2]))  {
		Pather.usePortal(109,null);
		while(!tDone)
		delay(200);
		Pather.usePortal(131,null);
		Pather.moveTo(15092, 5011);
		Precast.doPrecast(true);
				Pickit.pickItems();

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

		Pather.moveTo(15134, 5923);
		Attack.hurt(544, baalPercent); // Baal

		Pather.moveTo(15213, 5908);
		if (me.name !== bRunners[0]) {
			while(!Pather.usePortal(109,bRunners[0]))
			delay(300);
			while (true) {
				delay(1000);
			}
		}
		}
				break;
			case 4:
				Attack.clear(40);

				tick = getTickCount();

				break;
			case 3:
				Attack.clear(40);
				delay(1000);

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

		if (me.name === bRunners[0]) {
			say("throne");
		}

		this.clearThrone();
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

		Pather.moveTo(15134, 5923);
		Attack.hurt(544, baalPercent); // Baal

		Pather.moveTo(15213, 5908);

		if (me.name === bRunners[0]) {
			Pather.makePortal();
		}
		
		if (me.name !== bRunners[0]) {
			while(!Pather.usePortal(109,bRunners[0]))
			delay(300);
			while (true) {
				delay(1000);
			}
		}

		Pather.moveTo(15170, 5950);

		if (me.name === bRunners[0]) {
			say("baal");
		}
		if(baalhelp){
		while (!this.getLevellersIn() && flag <100) {
			delay(250);
			flag = flag +1;
		}

		Pather.moveTo(15134, 5923);
		this.kill(544); // Baal
		say("done");
		Pickit.pickItems();}
		Pather.moveTo(15170, 5950);
		while(!Pather.usePortal(109,bRunners[0]))
			delay(300);
		while(!nDone)
		delay(500);

		return true;
	};

	Town.goToTown(5);
	Town.doChores();

	if (me.name !== getShrine) {
		shrined = true;
	}

	if (me.name === tpShrine) {
		this.searchForShrine();
		Town.goToTown(5);
		Town.move("portalspot");
		this.baal();
	}
	
		if (me.name === nRunner) {
		this.shenk();
		this.nilhathak();
		this.mephisto();
	//Town.doChores();
	}
	

	if (bRunners.indexOf(me.name) !== -1 && me.name !== tpShrine) {
		this.baal();
	}

	if (dRunners.indexOf(me.name) !== -1) {
		this.diablo();
	}

	if (Levellers.indexOf(me.name) !== -1) {
		Town.doChores();
		Pather.useWaypoint(118, true);
		Precast.doPrecast(false);
		Town.goToTown(5);
		while (!bDone) {
			
			if(sReady && !sDone && !tReady){
			Town.goToTown(5);
			Town.move("portalspot");
			delay(50);
			Pather.usePortal(110, null);
			Attack.clear(15,0,getLocaleString(22435)); 
			//Attack.kill(getLocaleString(22435));
			Pickit.pickItems();
			Pather.usePortal(109, null);
			say("shenkD");
			delay(500);
			}
			
			/*if(!sDone && !tReady){
			Pather.useWaypoint(111);
			//Precast.doPrecast(true);
			Pather.moveTo(3876, 5130);
			Attack.clear(15);
			Attack.clear(15, 0, getLocaleString(22435)); 
			Pickit.pickItems();
			Town.goToTown(5);
			say("shenkD");
			delay(500);
			}*/
			
			if (tReady && !tDone) {
				this.leechThrone();
			}

			if (tDone && dReady && !dDone) {
				this.leechDiablo();
			}


			delay(500);
		}
		if(nReady){
			Town.goToTown(5);
			Town.move("portalspot");
			delay(50);
			while(!Pather.usePortal(124, null))
			delay(250);
			delay(100);
			var nihlpos = getUnit(1, 526);
			Pather.moveTo(nihlpos.x, nihlpos.y);
			Attack.kill(526);
			say("nih dead");
			return true;}
			say("nih dead");
			return true;
			delay(50);
	}
	return true;
};
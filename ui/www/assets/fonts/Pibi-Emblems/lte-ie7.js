/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'Pibi-Emblems\'">' + entity + '</span>' + html;
	}
	var icons = {
			'emblem-home' : '&#xe001;',
			'emblem-home-2' : '&#xe002;',
			'emblem-home-3' : '&#xe003;',
			'emblem-car' : '&#xe004;',
			'emblem-shopping' : '&#xe005;',
			'emblem-electronics' : '&#xe006;',
			'emblem-food' : '&#xe007;',
			'emblem-gifts' : '&#xe008;',
			'emblem-gifts-2' : '&#xe009;',
			'emblem-train' : '&#xe00b;',
			'emblem-music' : '&#xe00e;',
			'emblem-music-2' : '&#xe00f;',
			'emblem-gaming' : '&#xe011;',
			'emblem-dice' : '&#xe012;',
			'emblem-pacman' : '&#xe013;',
			'emblem-contact' : '&#xe014;',
			'emblem-phone' : '&#xe015;',
			'emblem-briefcase' : '&#xe018;',
			'emblem-screen' : '&#xe01a;',
			'emblem-tv' : '&#xe01b;',
			'emblem-inject' : '&#xe01c;',
			'emblem-gas-pump' : '&#xe01d;',
			'emblem-heart' : '&#xe01e;',
			'emblem-gift' : '&#xe01f;',
			'emblem-camera' : '&#xe021;',
			'emblem-microphone' : '&#xe00a;',
			'emblem-suitcase' : '&#xe010;',
			'emblem-mug' : '&#xe016;',
			'emblem-coffee' : '&#xe019;',
			'emblem-fun' : '&#xe023;',
			'emblem-luxury' : '&#xe024;',
			'emblem-camera-2' : '&#xe025;',
			'emblem-tv-2' : '&#xe026;',
			'emblem-tablet' : '&#xe028;',
			'emblem-clothes' : '&#xe00c;',
			'emblem-travel' : '&#xe029;',
			'emblem-nightlife' : '&#xe02a;',
			'emblem-headphones' : '&#xe02b;',
			'emblem-school' : '&#xe02c;',
			'emblem-books' : '&#xe02d;',
			'emblem-bills' : '&#xe02e;',
			'emblem-online' : '&#xe02f;',
			'emblem-balloon' : '&#xe030;',
			'emblem-hobbies' : '&#xe031;',
			'emblem-garden' : '&#xe032;',
			'emblem-tree' : '&#xe033;',
			'emblem-paw' : '&#xe034;',
			'emblem-lab' : '&#xe035;',
			'emblem-bomb' : '&#xe036;',
			'emblem-fire' : '&#xe037;',
			'emblem-hammer' : '&#xe038;',
			'emblem-power' : '&#xe039;',
			'emblem-sports' : '&#xe03a;',
			'emblem-android' : '&#xe096;',
			'emblem-bus' : '&#xe00d;',
			'emblem-truck' : '&#xe03b;',
			'emblem-bike' : '&#xe03c;',
			'emblem-target' : '&#xe03d;',
			'emblem-groceries' : '&#xe03e;',
			'emblem-dumbbell' : '&#xe03f;',
			'emblem-airplane' : '&#xe040;',
			'emblem-utility' : '&#xe041;',
			'emblem-palette' : '&#xe061;',
			'emblem-cd' : '&#xe000;',
			'emblem-cinema' : '&#xe017;',
			'emblem-screwdriver' : '&#xe042;',
			'emblem-medicine' : '&#xe043;',
			'emblem-furniture' : '&#xe044;',
			'emblem-salary' : '&#xe048;',
			'emblem-lamp' : '&#xe045;',
			'emblem-skull' : '&#xe046;',
			'emblem-brain' : '&#xe047;',
			'emblem-star' : '&#xe05e;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/emblem-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};
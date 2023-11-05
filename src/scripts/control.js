const control = document.getElementById('control');

const keys = {
	up: false,
	left: false,
	down: false,
	right: false,
};
const keyNames = Object.keys(keys);

function click(key) {
	control.children[key].click();
}

function resetKeys(key) {
	keyNames.forEach((keyName) => {
		if (keyName != key) keys[keyName] = false;
	});
}

control.addEventListener('click', (e) => {
	keys[e.target.id] = true;
	resetKeys(e.target.id);
});

addEventListener('keydown', ({ key }) => {
	switch (key) {
		case 'w':
			click('up');
			break;
		case 'd':
			click('right');
			break;
		case 's':
			click('down');
			break;
		case 'a':
			click('left');
			break;
	}
});

export { keys };

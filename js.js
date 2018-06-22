

const Player = function(name) {
	this.name = name;
	this.id = Math.round(Math.random() * 100);
	return this;
}

const getDefaultState = fieldset => ({
	player : null,
	players: [],
	fieldset : fieldset,
	winner : null,
	time : 0,
	move : 0,
	isActive: false,
})

const constructDefaultFieldset = (nodes) => 
	new Fieldset(Array(...new Array(9)).fill(null), nodes);

const Fieldset = function(fields, nodes) {
	this.fields = fields;
	this.nodes = nodes;

	this.mark = (index, markedBy) => {
		this.fields[index] = markedBy;
		if (markedBy === myGame.state.players[0].id) {
			this.nodes[index].classList.add("crest");
			return;
		}
		this.nodes[index].classList.add("zero");
		
	}

	this.refresh = () => {
		this.fields = this.fields.map((field, i) => {
			this.nodes[i].classList.remove("crest");
			this.nodes[i].classList.remove("zero");
			return null;
		})
	}

	this.getFields = () => {
		return this.fields;
	}
}

const positionWins = (fieldset, id) => {
	if ((fieldset[0] === id && fieldset[1] === id && fieldset[2] === id) ||
	    (fieldset[3] === id && fieldset[4] === id && fieldset[5] === id) ||
	    (fieldset[6] === id && fieldset[7] === id && fieldset[8] === id) ||
	    (fieldset[0] === id && fieldset[4] === id && fieldset[8] === id) ||
	    (fieldset[2] === id && fieldset[4] === id && fieldset[6] === id) ||
	    (fieldset[0] === id && fieldset[3] === id && fieldset[6] === id) ||
	    (fieldset[1] === id && fieldset[4] === id && fieldset[7] === id) ||
	    (fieldset[2] === id && fieldset[5] === id && fieldset[8] === id)) {
	   return true;
	}
	return false;
}

const prepareBoxes = (fieldset, onSetStep) => {
	return fieldset.getFields().map((item, i) => {
		const block = document.createElement("div");
		block.classList.add("field");
		block.addEventListener('click', () => onSetStep(i));
		return block;
	});	
}


const Crest = function (node, buttonPlay) {
	// node-элементы
	this.node = node;
	this.buttonPlay = buttonPlay;

	this.togglePlayer = () => {
		const { 
			player, 
			players 
		} = this.state;

		if (player === players[0].id) {
			this.setState({
				player: players[1].id,
			});
			return;
		}

		this.setState({
			player: players[0].id,
		})
	}


	this.checkWin = () => {
		const { fieldset, player } = this.state;

		if (positionWins(fieldset.getFields(), player)) {
			const span = document.createElement("span");
			let text;

			if (this.state.move % 2 !== 0) {
				text = document.createTextNode('WIN PLAYER CREST');
			} else {
				text = document.createTextNode('WIN PLAYER ZERO');
			}
			span.id = "span";
			span.appendChild(text);
			document.getElementById('head').appendChild(span);

			return true;
		} else {
			return false;
		}
	}
	
	this.step = (i) => {
		const { 
			isActive, 
			fieldset,
			player,
			players,
			move,
		} = this.state;

		if (isActive) {
			if (fieldset.getFields()[i] === null){
				fieldset.mark(i, player);
				this.setState({ move: move + 1 }, () => {
					if (this.shouldStopGame()) {
						this.setState({ isActive: false, })
						this.buttonPlay.style.display = '';		
						return;
					}
					this.togglePlayer();
				});
			} else {
				alert('Oops!!');
				return;
			}
		} else {
			return;
		}
	}

	this.shouldStopGame = () => {
		const { fieldset } = this.state;

		return fieldset.getFields().every(item => !!item) || this.checkWin();
	}

	this.init = () => {
		this.node.style.display = 'none';
		const defaultFieldset = constructDefaultFieldset(node.children);

		const player1 = new Player("CREST");
		const player2 = new Player("ZERO");
		const players = [ player1, player2 ];

		this.setState(Object.assign({}, getDefaultState(defaultFieldset), {
			players: players,
			player: player1.id
		}), (newState) => {
			prepareBoxes(newState.fieldset, this.step).forEach((box) => {
				this.node.appendChild(box);
			});
		})
	}

	this.setState = (data, callback) => {
		this.state = Object.assign({}, this.state, data);
		if (callback && typeof callback === "function") {
			callback(this.state);
		}
	}

	this.start = () => {
		if (document.getElementById('span')){
			const span = document.getElementById('span');
			document.getElementById('head').removeChild(span);
		}

		this.setState({  isActive: true, move : 0, }, (newState) => {
			newState.fieldset.refresh();
		})

		this.buttonPlay.style.display = 'none';
		this.node.style.display = '';
	}
}

const deskNode = document.getElementById("desk");
const buttonPlay = document.getElementById('buttonPlay');
const myGame = new Crest(deskNode, buttonPlay);

document.getElementById('buttonPlay').addEventListener('click', myGame.start);

window.onload = () => {
	myGame.init();
}

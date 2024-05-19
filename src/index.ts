//!native
//!optimize 2
export class Board<N extends typeof Node, node extends Node> {
	length: number;
	width: number;
	private random?: Random;
	readonly nodes: node[];
	constructor(
		length: number,
		width: number,
		fn: new (x: number, y: number, board: Board<N, node>) => node,
		random?: Random,
	) {
		this.nodes = [];
		this.length = length;
		this.width = width;
		if (random) {
			this.random = random;
		} else {
			this.random = new Random();
		}
		for (const y of $range(1, length)) {
			for (const x of $range(1, width)) {
				this.nodes.push(new fn(x, y, this));
			}
		}
	}

	FindNode(x: number, y: number): node | undefined {
		return this.nodes[x - (this.length + 1) + y * this.width];
	}

	RandomNode() {
		if (this.random) {
			return this.nodes[this.random.NextInteger(0, this.nodes.size()) - 1];
		} else {
			return this.nodes[math.random(1, this.nodes.size()) - 1];
		}
	}

	RandomRectangle(length: number, width: number) {
		const neighbors1: Node[] = [];
		const neighbors2: Node[] = [];
		const neighbors3: Node[] = [];
		const neighbors4: Node[] = [];
		while (neighbors1.size() !== length * width) {
			const node = this.RandomNode();
			const search = { 1: true, 2: true, 3: true, 4: true };
			let forceBreak = false;
			for (const x of $range(length - 1, 0, -1)) {
				if (forceBreak) {
					break;
				}
				for (const y of $range(width - 1, 0, -1)) {
					const foundnode1 = node.FindNode(x, y);
					const foundnode2 = node.FindNode(-x, y);
					const foundnode3 = node.FindNode(x, -y);
					const foundnode4 = node.FindNode(-x, -y);
					if (foundnode1 === undefined) {
						search[1] = false;
					}
					if (foundnode2 === undefined) {
						search[2] = false;
					}
					if (foundnode3 === undefined) {
						search[3] = false;
					}
					if (foundnode4 === undefined) {
						search[4] = false;
					}
					if (!search[1] && !search[2] && !search[3] && !search[4]) {
						print("force breakings detected", x, y);
						forceBreak = true;
						break;
					}
					if (search[1]) {
						if (foundnode1) {
							neighbors1.push(foundnode1);
						}
					}
					if (search[2]) {
						if (foundnode2) {
							neighbors2.push(foundnode2);
						}
					}
					if (search[3]) {
						if (foundnode3) {
							neighbors3.push(foundnode3);
						}
					}
					if (search[4]) {
						if (foundnode4) {
							neighbors4.push(foundnode4);
						}
					}
				}
			}
			if (neighbors1.size() === length * width) {
				return neighbors1;
			}
			if (neighbors2.size() === length * width) {
				return neighbors2;
			}
			if (neighbors3.size() === length * width) {
				return neighbors3;
			}
			if (neighbors4.size() === length * width) {
				return neighbors4;
			}
			neighbors1.clear();
			neighbors2.clear();
			neighbors3.clear();
			neighbors4.clear();
		}
	}

	RandomSquare(size: number) {
		return this.RandomRectangle(size, size);
	}
}

export class Node {
	public x: number;
	y: number;
	private board: Board<typeof Node, Node>;
	constructor(x: number, y: number, board: Board<typeof Node, Node>) {
		this.x = x;
		this.y = y;
		this.board = board;
	}
	FindNode(x: number, y: number): Node | undefined {
		//add one because the lua tables start a 1, not 0.
		const pos = this.x - (this.board.length + 1) + this.y * this.board.width;
		return this.board.nodes[pos + x + y * this.board.width];
	}

	FindNeighbors() {
		const Neighbors = [];
		for (const dir of [
			[0, 1],
			[1, 0],
			[-1, 0],
			[0, -1],
		]) {
			Neighbors.push(this.FindNode(dir[0], dir[1]));
		}
		return Neighbors;
	}

	FindSurroundings(depth: number = 1) {
		const surrounding: Node[] = [];
		for (const CurrentDepth of $range(1, depth)) {
			for (const x of $range(-CurrentDepth, CurrentDepth)) {
				for (const y of $range(-CurrentDepth, CurrentDepth)) {
					const result = this.FindNode(x, y);
					if (result) {
						surrounding.push(result);
					}
				}
			}
		}
		surrounding.remove(surrounding.indexOf(this)); //remove self because we don't want to include self.
		return surrounding;
	}
}

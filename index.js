const express = require('express');
const app = express();
const port = 2529;

let handlers = {};
let cache = {};

function convert2DArrayToString(arr) {
  const components = [];
  arr.forEach((e) => {
    let s = e.toString();
    s = ["[", s, "]"].join("");
    components.push(s);
  });

  return components.join(",").replace(/\s/g, "");
}

handlers['Subarray with Maximum Sum'] = (input) => {
	let nums = input.split(',').map(n => Number(n));
	if (nums.find(isNaN)) throw Error('one of the numbers provided is not a number');
	if (nums.length > 40) throw Error('the game can only generate inputs up to 40 numbers, silly');
	if (nums.length < 5) throw Error('the game can only generate inputs with more than 4 numbers, silly');
	
	for (let i = 1; i < nums.length; i++) {
		nums[i] = Math.max(nums[i], nums[i] + nums[i - 1]);
	}
	
	return Math.max(...nums);
}

handlers['Find Largest Prime Factor'] = (input) => {
	let num = Number(input);
	if (isNaN(num)) throw Error('not a number');
	if (num > 1e9) throw Error('the game can only generate inputs up to 1e9, silly');
	if (num < 500) throw Error('the game can only generate inputs from 500, silly');

	let fac = 2;
	let n = num;
	while (n > (fac - 1) * (fac - 1)) {
		while (n % fac === 0) {
			n = Math.round(n / fac);
		}
		++fac;
	}

	return (n === 1 ? fac - 1 : n);
}

handlers['Total Ways to Sum'] = (input) => {
	let num = Number(input);
	if (isNaN(num)) throw Error('not a number');
	if (num > 100) throw Error('the game can only generate inputs up to 100, silly');
	if (num < 8) throw Error('the game can only generate inputs from 8, silly');

	const ways = [1];
	ways.length = num + 1;
	ways.fill(0, 1);
	for (let i = 1; i < num; ++i) {
		for (let j = i; j <= num; ++j) {
			ways[j] += ways[j - i];
		}
	}

	return ways[num];
}

handlers['Spiralize Matrix'] = (input) => {
	let data = JSON.parse(input);

	if (!data[0]) throw new Error('no elems in array');
	if (!data[0][0]) throw new Error('not a 2d array');

	const m = data.length;
	const n = data[0].length;

	for (const row of data) {
		if (row.length !== n) throw new Error('not a rectangle');
	}

	const spiral = [];
	let u = 0;
	let d = m - 1;
	let l = 0;
	let r = n - 1;
	let k = 0;
	while (true) {
		// Up
		for (let col = l; col <= r; col++) {
			spiral[k] = data[u][col];
			++k;
		}
		if (++u > d) {
			break;
		}

		// Right
		for (let row = u; row <= d; row++) {
			spiral[k] = data[row][r];
			++k;
		}
		if (--r < l) {
			break;
		}

		// Down
		for (let col = r; col >= l; col--) {
			spiral[k] = data[d][col];
			++k;
		}
		if (--d < u) {
			break;
		}

		// Left
		for (let row = d; row >= u; row--) {
			spiral[k] = data[row][l];
			++k;
		}
		if (++l > r) {
			break;
		}
	}

	return spiral.join(',');
}

handlers['Array Jumping Game'] = (input) => {
	let data = JSON.parse(input);
	if (data.find(isNaN)) throw Error('one of the numbers provided is not a number');
	const n = data.length;
	let i = 0;
	for (let reach = 0; i < n && i <= reach; ++i) {
		reach = Math.max(i + data[i], reach);
	}
	const solution = i === n;

	return solution ? '1' : '0';
}

handlers['Merge Overlapping Intervals'] = (input) => {
	let data = JSON.parse(input);

	if (!data[0]) throw new Error('no elems in array');
	if (!data[0][0]) throw new Error('not a 2d array');

	const intervals = data.slice();
	intervals.sort((a, b) => {
		return a[0] - b[0];
	});

	const result = [];
	let start = intervals[0][0];
	let end = intervals[0][1];
	for (const interval of intervals) {
		if (interval[0] <= end) {
			end = Math.max(end, interval[1]);
		} else {
			result.push([start, end]);
			start = interval[0];
			end = interval[1];
		}
	}
	result.push([start, end]);

	return convert2DArrayToString(result);
}

handlers['Generate IP Addresses'] = (input) => {
	let data = JSON.parse(input);
	const ret = [];
	for (let a = 1; a <= 3; ++a) {
		for (let b = 1; b <= 3; ++b) {
			for (let c = 1; c <= 3; ++c) {
				for (let d = 1; d <= 3; ++d) {
					if (a + b + c + d === data.length) {
						const A = parseInt(data.substring(0, a), 10);
						const B = parseInt(data.substring(a, a + b), 10);
						const C = parseInt(data.substring(a + b, a + b + c), 10);
						const D = parseInt(data.substring(a + b + c, a + b + c + d), 10);
						if (A <= 255 && B <= 255 && C <= 255 && D <= 255) {
							const ip = [A.toString(), ".", B.toString(), ".", C.toString(), ".", D.toString()].join("");
							if (ip.length === data.length + 3) {
								ret.push(ip);
							}
						}
					}
				}
			}
		}
	}

	return ret.join(',');
}

handlers['Algorithmic Stock Trader I'] = (input) => {
	let data = JSON.parse(input);
	if (data.find(isNaN)) throw Error('one of the numbers provided is not a number');

	let maxCur = 0;
	let maxSoFar = 0;
	for (let i = 1; i < data.length; ++i) {
		maxCur = Math.max(0, (maxCur += data[i] - data[i - 1]));
		maxSoFar = Math.max(maxCur, maxSoFar);
	}

	return maxSoFar.toString();
}

handlers['Algorithmic Stock Trader II'] = (input) => {
	let data = JSON.parse(input);
	if (data.find(isNaN)) throw Error('one of the numbers provided is not a number');

	let profit = 0;
	for (let p = 1; p < data.length; ++p) {
		profit += Math.max(data[p] - data[p - 1], 0);
	}

	return profit.toString();
}

handlers['Algorithmic Stock Trader III'] = (input) => {
	let data = JSON.parse(input);
	if (data.find(isNaN)) throw Error('one of the numbers provided is not a number');

	let hold1 = Number.MIN_SAFE_INTEGER;
	let hold2 = Number.MIN_SAFE_INTEGER;
	let release1 = 0;
	let release2 = 0;
	for (const price of data) {
		release2 = Math.max(release2, hold2 + price);
		hold2 = Math.max(hold2, release1 - price);
		release1 = Math.max(release1, hold1 + price);
		hold1 = Math.max(hold1, price * -1);
	}

	return release2.toString();
}

handlers['Algorithmic Stock Trader IV'] = (input) => {
	let data = JSON.parse(input);
	if (data.length !== 2) throw Error('invalid array length');
	if (isNaN(data[0])) throw Error('one of the numbers provided is not a number');
	if (typeof data[1] !== 'object') throw Error('invalid array format');
	if (data[1].find(isNaN)) throw Error('one of the numbers provided is not a number');

	const k = data[0];
	const prices = data[1];

	const len = prices.length;
	if (len < 2) {
		return parseInt(ans) === 0;
	}
	if (k > len / 2) {
		let res = 0;
		for (let i = 1; i < len; ++i) {
			res += Math.max(prices[i] - prices[i - 1], 0);
		}

		return res.toString();
	}

	const hold = [];
	const rele = [];
	hold.length = k + 1;
	rele.length = k + 1;
	for (let i = 0; i <= k; ++i) {
		hold[i] = Number.MIN_SAFE_INTEGER;
		rele[i] = 0;
	}

	let cur;
	for (let i = 0; i < len; ++i) {
		cur = prices[i];
		for (let j = k; j > 0; --j) {
			rele[j] = Math.max(rele[j], hold[j] + cur);
			hold[j] = Math.max(hold[j], rele[j - 1] - cur);
		}
	}

	return rele[k].toString();
}

handlers['Minimum Path Sum in a Triangle'] = (input) => {
	let data = JSON.parse(input);

	const n = data.length;
	const dp = data[n - 1].slice();
	for (let i = n - 2; i > -1; --i) {
		for (let j = 0; j < data[i].length; ++j) {
			dp[j] = Math.min(dp[j], dp[j + 1]) + data[i][j];
		}
	}

	return dp[0].toString();
}

handlers['Unique Paths in a Grid I'] = (input) => {
	let data = JSON.parse(input);

	const n = data[0]; // Number of rows
	const m = data[1]; // Number of columns
	const currentRow = [];
	currentRow.length = n;

	for (let i = 0; i < n; i++) {
		currentRow[i] = 1;
	}
	for (let row = 1; row < m; row++) {
		for (let i = 1; i < n; i++) {
			currentRow[i] += currentRow[i - 1];
		}
	}

	return currentRow[n - 1].toString();
}

handlers['Unique Paths in a Grid II'] = (input) => {
	let data = JSON.parse(input);

	const obstacleGrid = [];
	obstacleGrid.length = data.length;
	for (let i = 0; i < obstacleGrid.length; ++i) {
		obstacleGrid[i] = data[i].slice();
	}

	for (let i = 0; i < obstacleGrid.length; i++) {
		for (let j = 0; j < obstacleGrid[0].length; j++) {
			if (obstacleGrid[i][j] == 1) {
				obstacleGrid[i][j] = 0;
			} else if (i == 0 && j == 0) {
				obstacleGrid[0][0] = 1;
			} else {
				obstacleGrid[i][j] = (i > 0 ? obstacleGrid[i - 1][j] : 0) + (j > 0 ? obstacleGrid[i][j - 1] : 0);
			}
		}
	}

	return obstacleGrid[obstacleGrid.length - 1][obstacleGrid[0].length - 1].toString();
}

handlers['Sanitize Parentheses in Expression'] = (input) => {
	let data = input;
	if (data.length > 20) throw Error('the game can only generate inputs up to 20, silly');

	let left = 0;
	let right = 0;
	const res = [];

	for (let i = 0; i < data.length; ++i) {
		if (data[i] === "(") {
			++left;
		} else if (data[i] === ")") {
			left > 0 ? --left : ++right;
		}
	}

	function dfs(pair, index, left, right, s, solution, res) {
		if (s.length === index) {
			if (left === 0 && right === 0 && pair === 0) {
				for (let i = 0; i < res.length; i++) {
					if (res[i] === solution) {
						return;
					}
				}
				res.push(solution);
			}
			return;
		}

		if (s[index] === "(") {
			if (left > 0) {
				dfs(pair, index + 1, left - 1, right, s, solution, res);
			}
			dfs(pair + 1, index + 1, left, right, s, solution + s[index], res);
		} else if (s[index] === ")") {
			if (right > 0) dfs(pair, index + 1, left, right - 1, s, solution, res);
			if (pair > 0) dfs(pair - 1, index + 1, left, right, s, solution + s[index], res);
		} else {
			dfs(pair, index + 1, left, right, s, solution + s[index], res);
		}
	}

	dfs(0, 0, left, right, data, "", res);

	return JSON.stringify(res);
}

handlers['Find All Valid Math Expressions'] = (input) => {
	let data = JSON.parse(input);

	const num = data[0];
	const target = data[1];

	function helper(res, path, num, target, pos, evaluated, multed) {
		if (pos === num.length) {
			if (target === evaluated) {
				res.push(path);
			}
			return;
		}

		for (let i = pos; i < num.length; ++i) {
			if (i != pos && num[pos] == "0") {
				break;
			}
			const cur = parseInt(num.substring(pos, i + 1));

			if (pos === 0) {
				helper(res, path + cur, num, target, i + 1, cur, cur);
			} else {
				helper(res, path + "+" + cur, num, target, i + 1, evaluated + cur, cur);
				helper(res, path + "-" + cur, num, target, i + 1, evaluated - cur, -cur);
				helper(res, path + "*" + cur, num, target, i + 1, evaluated - multed + multed * cur, multed * cur);
			}
		}
	}


	const result = [];
	helper(result, "", num, target, 0, 0, 0);

	return JSON.stringify(result);
}

app.use((_, res, next) => {
	res = res.setHeader('Access-Control-Allow-Origin', '*');
	next();
});

app.get('/bitburnercontracts', async (req, res) => {
	let type = decodeURI(req.query.type);
	let input = decodeURI(req.query.input);

	//console.log(type, input);

	if (handlers[type]) {
		let solution;
		if (cache[type] && cache[type][input]) {
			solution = cache[type][input];
		} else {
			cache[type] = cache[type] || {};
			try {
				solution = (cache[type][input] = handlers[type](input));
			} catch(err) {
				//console.error(err);
				return res.send({
					type: type,
					input: input,
					success: false,
					error: err.toString(),
				});
			}
		}

		res.send({
			type: type,
			input: input,
			success: true,
			output: solution,
			error: null,
		});
	} else {
		res.send({
			type: type,
			input: input,
			success: false,
			noHandler: true,
			error: 'no handler for this type of contract',
		});
	}
});


app.listen(port, () => {
	console.log(`listening on ${port}`);
});

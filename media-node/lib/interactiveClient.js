const net = require('net');
const os = require('os');
const path = require('path');

const SOCKET_PATH_UNIX = '/tmp/multiparty-meeting-media-node.sock';
const SOCKET_PATH_WIN = path.join('\\\\?\\pipe', process.cwd(), 'multiparty-meeting-media-node');
const SOCKET_PATH = os.platform() === 'win32'? SOCKET_PATH_WIN : SOCKET_PATH_UNIX;

module.exports = async function()
{
	const socket = net.connect(SOCKET_PATH);

	process.stdin.pipe(socket);
	socket.pipe(process.stdout);

	socket.on('connect', () => process.stdin.setRawMode(true));

	socket.on('close', () => process.exit(0));
	socket.on('exit', () => socket.end());

	if (process.argv && process.argv[2] === '--stats')
	{
		await socket.write('stats\n');

		socket.end();
	}
};
